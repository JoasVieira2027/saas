# DIAGNÓSTICO DE AUDITORIA DE AUTENTICAÇÃO E SCHEMA — GLOWSAAS

**Data:** 28 de Outubro de 2026  
**Ambiente:** Next.js 15 (App Router) + Supabase SSR / PostgreSQL  
**Objetivo:** Identificar vulnerabilidades, inconsistências estruturais no banco de dados remoto e projetar a solução segura para Login com Google, E-mail/Senha e Acesso ao Super Admin.

---

## 1. Resumo Executivo da Auditoria

O GlowSaaS foi projetado com uma arquitetura de isolamento multi-tenant rigorosa, combinando Row Level Security (RLS) no PostgreSQL com sessões assinadas criptograficamente via HMAC-SHA256 (`saas_auth_session`).

No entanto, a instância do Supabase conectada ao projeto remoto foi previamente utilizada em outro sistema (composto por tabelas como `store_members` e uma tabela `profiles` legada). Como a migração inicial `0001_initial_schema.sql` utilizou a cláusula `CREATE TABLE IF NOT EXISTS public.profiles`, o PostgreSQL **não alterou nem substituiu** a tabela existente. Isso gerou uma incompatibilidade estrutural crítica que impede a autenticação real e a concessão de Super Admin.

Além disso, o fluxo de login atual no código-fonte suportava apenas `signInWithPassword`, sem suporte implementado para login social via Google OAuth no frontend e sem o endpoint de callback correspondente (`/auth/callback`).

---

## 2. Incompatibilidade Estrutural Detalhada: `public.profiles`

### 2.1 Comparação de Estruturas

| Atributo | Schema Legado (Existente no Supabase) | Schema GlowSaaS (Esperado pelo Código) | Impacto da Divergência |
|---|---|---|---|
| **Chave Primária (PK)** | `id` (geralmente UUID próprio ou auto-incremento da tabela legada) | `id UUID PRIMARY KEY REFERENCES auth.users(id)` | Se `id != auth.users.id`, `eq("id", userId)` não encontra o perfil do usuário logado. |
| **Referência Auth** | `user_id UUID REFERENCES auth.users(id)` | `id UUID REFERENCES auth.users(id)` | O código consulta `WHERE id = userId`, enquanto o dado real está em `user_id`. |
| **Nome** | `name TEXT` | `full_name TEXT` | O código TypeScript espera `profile.full_name`. Em caso de ausência, resulta em `undefined`. |
| **Contato** | `phone TEXT` | Em `landing_pages.contact_info` | Coluna não utilizada pelo core de auth do GlowSaaS. |
| **E-mail** | Ausente ou não obrigatório | `email TEXT NOT NULL` | Utilizado na sessão e em `admin_audit_logs`. |
| **Papel (Role)** | Ausente em `profiles` (existente na tabela órfã `store_members`) | `role TEXT NOT NULL DEFAULT 'tenant_admin' CHECK (role IN ('superadmin', 'tenant_admin'))` | **CRÍTICO:** Sem a coluna `role`, a função `is_superadmin()` falha com erro SQL, impedindo acesso administrativo. |

### 2.2 Por que apenas adicionar colunas via `ALTER TABLE ADD COLUMN` não é suficiente?
1. **Incompatibilidade da Chave Primária:** Se a tabela legada mantiver um `id` desvinculado de `auth.users.id`, as queries do backend `supabase.from("profiles").select("*").eq("id", authUser.id).single()` retornarão vazio (`PGRST116`).
2. **Constraint de Chave Estrangeira em Tenants:** A tabela `public.tenants` possui `owner_id UUID REFERENCES public.profiles(id)`. Como o código passa o `auth.users.id` como `owner_id`, a foreign key falhará se `profiles.id` não for o UUID do auth.
3. **Falha nas Funções RLS e Trigger:**
   - `public.is_superadmin()` executa `WHERE id = auth.uid() AND role = 'superadmin'`. Se o UUID do auth estiver gravado em `user_id`, a verificação sempre retornará `false`.
   - `handle_new_user()` executa `INSERT INTO public.profiles (id, email, full_name, role) VALUES (new.id, ...)`. Se a tabela tiver uma coluna `user_id NOT NULL`, o cadastro de novos usuários falhará.

---

## 3. Como o GlowSaaS Identifica o Super Admin

O papel de Super Admin **não** reside em tabelas como `store_members`. Ele é determinado estritamente por:

1. **Camada de Banco de Dados:**
   - Existência de um registro em `public.profiles` onde `id = auth.uid()` e `role = 'superadmin'`.
   - Validação via função `public.is_superadmin()`, protegida com `SECURITY DEFINER` e `SET search_path = public, auth`.
2. **Camada de Sessão da Aplicação:**
   - O Server Action de login obtém o `Profile` do banco.
   - O utilitário `setSession(profile)` assina com HMAC-SHA256 os dados `{ userId, email, role, fullName }` no cookie `saas_auth_session`.
   - O `middleware.ts` intercepta requisições para `/admin` e rejeita qualquer sessão que não possua `role === "superadmin"`.
   - As Server Actions de `/admin` executam `requireSuperadmin()`, validando a assinatura criptográfica antes de qualquer operação no banco.

---

## 4. Auditoria dos Métodos de Autenticação

### 4.1 Login com E-mail e Senha
- **Status Atual:** Implementado em `src/app/auth/actions.ts` via `supabase.auth.signInWithPassword`.
- **Pontos Fortes:** Bloqueio fail-closed de mocks em produção, sanitização de e-mail e tratamento de erros.
- **Limitação:** Em caso de credenciais inválidas ou conta não existente, a UI da página de login não oferecia feedback visual com opção de recuperação de senha.

### 4.2 Login com Google (OAuth)
- **Status Atual:** **Não implementado no código local.** Não há botão na tela de login, nem Server Action de disparo do OAuth, nem rota de callback para troca do código PKCE (`exchangeCodeForSession`).
- **Comportamento Esperado:**
  - Início via `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: ... } })`.
  - Redirecionamento para o Google e retorno em `/auth/callback?code=...`.
  - Troca segura do código por sessão SSR via `@supabase/ssr`.
  - Verificação e criação resiliente do perfil em `public.profiles` (garantindo `role = 'tenant_admin'`, sem privilégio administrativo automático).
  - Assinatura da sessão no cookie `saas_auth_session`.

### 4.3 Prevenção de Perfis Duplicados
- O Supabase Auth unifica identidades pelo e-mail caso o usuário utilize o mesmo endereço (`contatojoasvieira@gmail.com`) via senha e via Google OAuth.
- No banco de dados, o `auth.users.id` é único por conta. Portanto, o perfil em `public.profiles` deve sempre referenciar esse mesmo UUID, garantindo que o usuário acesse o mesmo painel e as mesmas permissões independentemente do método de login utilizado.

---

## 5. Matriz de Riscos de Segurança Identificados

| Risco | Nível | Mitigação Obrigatória |
|---|---|---|
| **Elevação de privilégios via metadados do Google** | Crítico | O trigger `handle_new_user()` e a rota `/auth/callback` NUNCA devem confiar em metadados externos para definir `role`. O papel deve ser estritamente `'tenant_admin'`. |
| **Super Admin concedido automaticamente a qualquer e-mail** | Alto | O papel `'superadmin'` só pode ser atribuído mediante comando SQL direto e explícito executado por administrador do banco. |
| **Quebra de RLS por desativação temporária** | Crítico | Proibido executar `DISABLE ROW LEVEL SECURITY`. A compatibilização de schema deve manter RLS ativa em todas as tabelas. |
| **Perda de dados legados em `profiles`** | Médio | A migration de compatibilidade deve realizar migração defensiva (`COALESCE`, cópia de dados de `user_id` para `id`, preservação de colunas extras). |

---

## 6. Plano de Ação para a Fase 2 (Correção Local)

1. **Migration SQL `0005_auth_profiles_compat.sql`:**
   - Adicionar colunas `email`, `full_name` e `role` à tabela `public.profiles` de forma segura.
   - Sincronizar dados existentes: se `user_id` existir e `id` for desvinculado, alinhar os registros para que `id = user_id`.
   - Manter compatibilidade retroativa com triggers e funções RLS (`is_superadmin()` verificando tanto `id = auth.uid()` quanto `user_id = auth.uid()`).
   - Forçar `CHECK (role IN ('superadmin', 'tenant_admin'))`.

2. **Camada de Dados (`src/lib/supabase/data-service.ts`):**
   - No método `getProfile(userId)`: implementar busca resiliente que localiza o perfil tanto por `id` quanto por `user_id` caso a migração ainda não tenha sido aplicada ou haja registros legados.
   - Mapear `name` como fallback de `full_name`.

3. **Fluxo de Autenticação (`src/app/auth/actions.ts` e `/auth/callback`):**
   - Implementar `loginWithGoogleAction` gerando a URL de autorização OAuth.
   - Criar o Route Handler `src/app/auth/callback/route.ts` para processar o callback do Google, validar o perfil e assinar o cookie de sessão.
   - Implementar `resetPasswordAction` para recuperação segura de senha.

4. **Interface do Usuário (`src/app/(auth)/login/page.tsx`):**
   - Incluir o botão oficial "Entrar com Google" com ícone vetorial.
   - Incluir divisor visual "ou entre com seu e-mail".
   - Incluir modal/área de solicitação de redefinição de senha com feedback seguro.


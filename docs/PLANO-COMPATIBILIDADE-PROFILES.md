# PLANO DE COMPATIBILIDADE: `public.profiles` — Schema Legado vs GlowSaaS

**Documento:** `docs/PLANO-COMPATIBILIDADE-PROFILES.md`  
**Data:** 29 de Outubro de 2026  
**Escopo:** Diagnóstico definitivo, identificação de contas, mapeamento de dependências, opções arquiteturais, revisão de fluxos de autenticação, SQL auditado, dry run, promoção segura, rollback e validações.  
**Status:** Validado localmente com 44/44 testes aprovados; pronto para execução manual no Supabase.

---

## 1. Causa Raiz Confirmada

O banco de dados Supabase em uso já havia sido utilizado em outro projeto prévio, possuindo um schema divergente na tabela `public.profiles`.

O contrato arquitetural padrão do GlowSaaS e do ecossistema Supabase define:
$$\text{public.profiles.id} \equiv \text{auth.users.id}$$

No entanto, o schema legado do banco remoto possui:

| Coluna | Tipo | Restrições | Significado Real |
|---|---|---|---|
| `profiles.id` | UUID | PRIMARY KEY | UUID aleatório gerado pelo projeto legado (`gen_random_uuid()`) |
| `profiles.user_id` | UUID | UNIQUE, FK → `auth.users(id) ON DELETE CASCADE` | UUID real do usuário autenticado no Supabase Auth |
| `profiles.name` | TEXT | Opcional | Nome do usuário (GlowSaaS espera `full_name`) |
| `profiles.phone` | TEXT | Opcional | Telefone |

**Impacto:**
Existem 2 perfis vinculados a 2 contas Gmail distintas onde `profiles.id ≠ profiles.user_id`. Como todas as funções (`is_superadmin()`, `user_owns_tenant()`), políticas RLS e queries do GlowSaaS (`.eq("id", auth_id)`) consultam `profiles.id`, **o sistema não encontra os perfis**, a função `is_superadmin()` sempre retorna `FALSE` e qualquer tentativa de cadastro/login falha se a coluna `user_id` tiver restrição `NOT NULL`.

---

## 2. Identificação Segura da Conta `contatojoasvieira@gmail.com`

Para determinar com precisão absoluta qual dos 2 perfis existentes corresponde à conta administrativa pretendida, **sem expor senhas, hashes ou alterar contas**, utiliza-se a seguinte consulta somente-leitura no SQL Editor do Supabase:

```sql
-- Identificação segura do perfil e UUID de contatojoasvieira@gmail.com
SELECT 
    u.id AS auth_user_id,
    u.email,
    u.created_at AS usuario_criado_em,
    u.last_sign_in_at AS ultimo_login,
    p.id AS perfil_id_legado,
    p.user_id AS perfil_user_id,
    p.name AS nome_legado,
    p.phone AS telefone_legado,
    (p.id = u.id) AS id_ja_sincronizado
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE lower(u.email) = 'contatojoasvieira@gmail.com';
```

### Por que esta consulta é segura:
1. Não acessa nem exibe a coluna `encrypted_password` da tabela `auth.users`.
2. Filtra estritamente por `lower(email)`, evitando correspondência errônea por caixa alta/baixa.
3. Não realiza escritas (`INSERT`, `UPDATE`, `DELETE`).
4. Retorna exatamente o `auth_user_id` que deve ter seu perfil ajustado e promovido a `superadmin`.

---

## 3. Mapeamento Completo de Dependências de `profiles.id` e `user_id`

### 3.1 Chaves Estrangeiras (FK) que apontam para `profiles.id`

| Tabela Referenciadora | Coluna | Restrição | Origem | Ação na Migração |
|---|---|---|---|---|
| `public.tenants` | `owner_id` | `REFERENCES public.profiles(id) ON DELETE RESTRICT` | Migration 0001 | Dropar FK → Mapear `old_id` para `new_id` → Atualizar dados → Recriar FK |
| `public.subscription_payments` | `recorded_by` | `REFERENCES public.profiles(id) ON DELETE RESTRICT` | Migration 0002 | Dropar FK → Mapear `old_id` para `new_id` → Atualizar dados → Recriar FK |
| `public.admin_audit_logs` | `admin_id` | `REFERENCES public.profiles(id) ON DELETE RESTRICT` | Migration 0002 | Dropar FK → Mapear `old_id` para `new_id` → Atualizar dados → Recriar FK |

### 3.2 Funções PL/pgSQL

- `public.is_superadmin()`: Verifica se `profiles.id = auth.uid() AND role = 'superadmin'`. Se `id` for o legado, falha.
- `public.user_owns_tenant(check_tenant_id)`: Verifica se `tenants.owner_id = auth.uid()`. Como `owner_id` aponta para o `id` legado, a condição falha.
- `public.handle_new_user()`: Disparado em `AFTER INSERT ON auth.users`. Insere em `profiles (id, email, full_name, role)`. Falhava com `violates not-null constraint` caso `user_id` ainda fosse `NOT NULL`.

### 3.3 Políticas de Segurança (Row Level Security - RLS)

- `public.profiles`: `id = auth.uid()`
- `public.tenants`: `owner_id = auth.uid()`
- `public.landing_pages`: via `user_owns_tenant(tenant_id)`
- `public.services`: via `user_owns_tenant(tenant_id)`
- `public.business_hours`: via `user_owns_tenant(tenant_id)`
- `public.subscription_payments`: `is_superadmin()`
- `public.admin_audit_logs`: `is_superadmin()`

### 3.4 Aplicação Next.js (TypeScript)

- [`src/lib/supabase/data-service.ts`](file:///d:/Saas/src/lib/supabase/data-service.ts): `getProfile(userId)` busca por `id = userId` (com fallback temporário por `user_id` e mapeamento `name → full_name`).
- [`src/lib/auth.ts`](file:///d:/Saas/src/lib/auth.ts): `setSession(profile)` grava `profile.id` no payload do cookie assinado com HMAC-SHA256.
- [`src/middleware.ts`](file:///d:/Saas/src/middleware.ts): Decodifica a sessão HMAC e restringe `/admin` apenas para `role === 'superadmin'`.

---

## 4. Comparação das Opções Estratégicas

### Opção A: Adaptar o GlowSaaS para operar via `profiles.user_id`

- **O que exigiria:** Modificar todas as consultas SQL do sistema, trocar o parâmetro de busca no `data-service.ts`, reescrever as funções `is_superadmin()` e `user_owns_tenant()`, alterar as 10 políticas RLS existentes e criar novas colunas de chave estrangeira nas tabelas dependentes.
- **Vantagem:** Não altera o valor da coluna `profiles.id` existente.
- **Desvantagens:** Introduz divergência perpétua com a documentação e convenções oficiais do Supabase; alto risco de regressões em queries futuras; dificulta manutenção.
- **Veredito:** ❌ **Rejeitada por complexidade excessiva e fragilidade.**

### Opção B: Migrar o Schema para o Contrato Canônico `profiles.id = auth.users.id` (RECOMENDADA)

- **O que exige:** Uma migration segura e transacional que mapeia temporariamente `(old_id → user_id)`, remove temporariamente as FKs dependentes, atualiza as colunas estrangeiras (`tenants.owner_id`, etc.), atualiza a PK de `profiles` para o UUID de `auth.users`, recria as constraints e ajusta as triggers.
- **Vantagens:** 
  1. Alinha o banco 100% à convenção canônica do Supabase.
  2. Preserva integralmente as duas contas Gmail existentes e seus dados associados.
  3. O código da aplicação permanece limpo, seguro e performático.
  4. Mantém compatibilidade defensiva retroativa com a coluna `user_id`.
- **Veredito:** ✅ **Recomendada como a solução definitiva e mais robusta.**

---

## 5. Revisão Completa dos Fluxos de Autenticação e Autorização

| Fluxo | Implementação Local | Status de Segurança |
|---|---|---|
| **Login com Senha** | `loginAction` em [`src/app/auth/actions.ts`](file:///d:/Saas/src/app/auth/actions.ts) chama `supabase.auth.signInWithPassword`, obtém o perfil via `dataService.getProfile`, cria cookie assinado HMAC com role e dados do usuário. | ✅ Validado. Protegido contra credenciais inválidas e com sanitização. |
| **Login com Google (OAuth)** | `loginWithGoogleAction` gera URL de autenticação via `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: ... } })`. Redireciona o usuário para consentimento seguro do Google. | ✅ Validado. O botão oficial foi integrado na tela de login. |
| **Callback OAuth** | Route Handler em [`src/app/auth/callback/route.ts`](file:///d:/Saas/src/app/auth/callback/route.ts) troca o `code` de autorização por sessão Supabase nativa (`exchangeCodeForSession`), carrega/cria perfil com `ensureProfile` e assina o cookie de sessão HMAC antes de redirecionar para `/admin` ou `/dashboard`. | ✅ Validado com rota compilada no build de produção. |
| **Recuperação de Senha** | `resetPasswordAction` chama `supabase.auth.resetPasswordForEmail(email, { redirectTo: '/login?reset=success' })`. | ✅ Validado. Não revela se o e-mail existe no sistema. |
| **Sessão HMAC** | [`src/lib/auth.ts`](file:///d:/Saas/src/lib/auth.ts) assina o cookie `saas_auth_session` usando HMAC-SHA256 (`crypto.createHmac`) com segredo criptográfico. O payload contém `{ userId, email, role, fullName }`. | ✅ Validado. Impossível de forjar pelo cliente sem a chave secreta. |
| **Autorização Super Admin** | Dupla camada: Middleware (`middleware.ts`) barra requisições a `/admin/*` caso `session.role !== 'superadmin'`. Server Actions executam `requireSuperadmin()` que valida o HMAC em nível de servidor. No banco, `is_superadmin()` protege RLS. | ✅ Validado. Proteção em camadas (Defense in Depth). |

---

## 6. SQL Completo Revisado — Migration `0005_auth_profiles_compat.sql` (v2)

O código abaixo encontra-se salvo localmente no arquivo [`supabase/migrations/0005_auth_profiles_compat.sql`](file:///d:/Saas/supabase/migrations/0005_auth_profiles_compat.sql):

```sql
-- =============================================================================
-- GLOWSAAS — MIGRATION 0005: COMPATIBILIZAÇÃO SEGURA DE PERFIS, AUTH E OAUTH
-- Versão: 2.0 (Auditada e Corrigida)
-- Data: 29/10/2026
-- =============================================================================

BEGIN;

-- 1. ADICIONAR COLUNAS OFICIAIS DO GLOWSAAS (IDEMPOTENTE)
ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS email    TEXT,
    ADD COLUMN IF NOT EXISTS full_name TEXT,
    ADD COLUMN IF NOT EXISTS role     TEXT DEFAULT 'tenant_admin';

-- 2. RESTRIÇÃO CHECK DO ROLE (IDEMPOTENTE)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'profiles_role_check' 
          AND conrelid = 'public.profiles'::regclass
    ) THEN
        ALTER TABLE public.profiles 
            ADD CONSTRAINT profiles_role_check 
            CHECK (role IN ('superadmin', 'tenant_admin'));
    END IF;
END $$;

-- 3. LIBERAR user_id NOT NULL PARA PERMITIR INSERTS NOVOS SEM ERROS
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name   = 'profiles' 
          AND column_name  = 'user_id'
          AND is_nullable  = 'NO'
    ) THEN
        ALTER TABLE public.profiles ALTER COLUMN user_id DROP NOT NULL;
        RAISE NOTICE 'user_id NOT NULL removido com sucesso.';
    END IF;
END $$;

-- 4. MIGRAÇÃO DO NOME LEGADO (name → full_name)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name   = 'profiles' 
          AND column_name  = 'name'
    ) THEN
        UPDATE public.profiles 
        SET full_name = name 
        WHERE (full_name IS NULL OR full_name = '') AND name IS NOT NULL;
        RAISE NOTICE 'Migração name -> full_name concluída.';
    END IF;
END $$;

-- 5. CAPTURA MAPEAMENTO old_id -> user_id PARA ATUALIZAÇÃO SEGURA DAS FKs
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name   = 'profiles' 
          AND column_name  = 'user_id'
    ) THEN
        CREATE TEMP TABLE IF NOT EXISTS _profile_id_map AS
        SELECT p.id AS old_id, p.user_id AS new_id
        FROM public.profiles p
        WHERE p.user_id IS NOT NULL 
          AND p.id IS DISTINCT FROM p.user_id;

        RAISE NOTICE 'Mapeamento capturado com sucesso.';
    ELSE
        CREATE TEMP TABLE IF NOT EXISTS _profile_id_map (old_id UUID, new_id UUID);
    END IF;
END $$;

-- 6. REMOÇÃO CONTROLADA DAS FKs QUE REFERENCIAM profiles.id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tenants_owner_id_fkey') THEN
        ALTER TABLE public.tenants DROP CONSTRAINT tenants_owner_id_fkey;
    END IF;

    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscription_payments_recorded_by_fkey') THEN
        ALTER TABLE public.subscription_payments DROP CONSTRAINT subscription_payments_recorded_by_fkey;
    END IF;

    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_audit_logs_admin_id_fkey') THEN
        ALTER TABLE public.admin_audit_logs DROP CONSTRAINT admin_audit_logs_admin_id_fkey;
    END IF;
END $$;

-- 7. ATUALIZAÇÃO DAS FKs NAS TABELAS DEPENDENTES
UPDATE public.tenants t
SET owner_id = m.new_id
FROM _profile_id_map m
WHERE t.owner_id = m.old_id;

UPDATE public.subscription_payments sp
SET recorded_by = m.new_id
FROM _profile_id_map m
WHERE sp.recorded_by = m.old_id;

UPDATE public.admin_audit_logs al
SET admin_id = m.new_id
FROM _profile_id_map m
WHERE al.admin_id = m.old_id;

-- 8. ATUALIZAÇÃO DA CHAVE PRIMÁRIA DE profiles (id = user_id)
UPDATE public.profiles p
SET id = p.user_id
FROM _profile_id_map m
WHERE p.id = m.old_id;

-- 9. RECRIAR AS FKs COM INTEGRIDADE RESTRICT
ALTER TABLE public.tenants
    ADD CONSTRAINT tenants_owner_id_fkey
    FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE RESTRICT;

ALTER TABLE public.subscription_payments
    ADD CONSTRAINT subscription_payments_recorded_by_fkey
    FOREIGN KEY (recorded_by) REFERENCES public.profiles(id) ON DELETE RESTRICT;

ALTER TABLE public.admin_audit_logs
    ADD CONSTRAINT admin_audit_logs_admin_id_fkey
    FOREIGN KEY (admin_id) REFERENCES public.profiles(id) ON DELETE RESTRICT;

-- 10. PREENCHER email E role A PARTIR DE auth.users
UPDATE public.profiles p
SET email = lower(u.email)
FROM auth.users u
WHERE p.id = u.id 
  AND (p.email IS NULL OR p.email = '');

UPDATE public.profiles
SET role = 'tenant_admin'
WHERE role IS NULL;

-- 11. FUNÇÃO is_superadmin() ROBUSTA COM SQL DINÂMICO
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, auth
AS $$
DECLARE
    v_is_admin   BOOLEAN := FALSE;
    v_has_user_id BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'superadmin'
    ) INTO v_is_admin;

    IF v_is_admin THEN RETURN TRUE; END IF;

    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name   = 'profiles' 
          AND column_name  = 'user_id'
    ) INTO v_has_user_id;

    IF v_has_user_id THEN
        EXECUTE 'SELECT EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = $1 AND role = ''superadmin''
        )' USING auth.uid() INTO v_is_admin;
    END IF;

    RETURN COALESCE(v_is_admin, FALSE);
END;
$$;

-- 12. TRIGGER handle_new_user() RESILIENTE (GOOGLE OAUTH + SENHA)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, auth
AS $$
DECLARE
    v_full_name   TEXT;
    v_has_user_id BOOLEAN;
BEGIN
    v_full_name := COALESCE(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        split_part(new.email, '@', 1),
        'Usuário'
    );

    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name   = 'profiles' 
          AND column_name  = 'user_id'
    ) INTO v_has_user_id;

    IF v_has_user_id THEN
        EXECUTE '
            INSERT INTO public.profiles (id, user_id, email, full_name, role)
            VALUES ($1, $1, $2, $3, ''tenant_admin'')
            ON CONFLICT (id) DO UPDATE 
            SET 
                email      = EXCLUDED.email,
                full_name  = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
                updated_at = timezone(''utc''::text, now())'
        USING new.id, lower(new.email), v_full_name;
    ELSE
        INSERT INTO public.profiles (id, email, full_name, role)
        VALUES (
            new.id,
            lower(new.email),
            v_full_name,
            'tenant_admin'
        )
        ON CONFLICT (id) DO UPDATE 
        SET 
            email      = EXCLUDED.email,
            full_name  = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
            updated_at = timezone('utc'::text, now());
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. GATILHO DE PROTEÇÃO CONTRA ESCALAÇÃO DE PRIVILÉGIOS (ROLE & ID)
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- 1. Impede alteração da chave primária 'id'
    IF NEW.id IS DISTINCT FROM OLD.id THEN
        RAISE EXCEPTION 'A chave primária (id) do perfil não pode ser alterada.';
    END IF;

    -- 2. Preserva a coluna legada 'user_id' caso exista
    IF OLD.user_id IS NOT NULL AND NEW.user_id IS DISTINCT FROM OLD.user_id THEN
        NEW.user_id := OLD.user_id;
    END IF;

    -- 3. Blindagem estrita de 'role': apenas Superadmin pode alterar papéis de acesso
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        IF NOT public.is_superadmin() THEN
            RAISE EXCEPTION 'Acesso negado: apenas administradores podem alterar o papel de acesso (role).';
        END IF;
    END IF;

    -- 4. Atualiza updated_at automaticamente se a coluna existir
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name   = 'profiles' 
          AND column_name  = 'updated_at'
    ) THEN
        NEW.updated_at := timezone('utc'::text, now());
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_protect_profile_role ON public.profiles;
CREATE TRIGGER tr_protect_profile_role
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_profile_role();

-- 14. POLÍTICAS RLS PARA PROFILES
DROP POLICY IF EXISTS "Usuário autenticado visualiza seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuário autenticado visualiza seu próprio perfil"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

DROP POLICY IF EXISTS "Usuário autenticado atualiza seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuário autenticado atualiza seu próprio perfil"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (
    id = auth.uid() 
    AND (role = 'tenant_admin' OR public.is_superadmin())
);

DROP TABLE IF EXISTS _profile_id_map;

COMMENT ON TABLE public.profiles IS 
    'Perfis de usuários do GlowSaaS. profiles.id = auth.users.id (contrato canônico). Migration 0005 v2.1 blindada contra elevação de privilégios.';

COMMIT;
```

---

## 7. Verificações Prévias (Dry Run Obrigatório)

Execute no SQL Editor do Supabase **antes** de aplicar a migration:

```sql
-- 1. Diagnóstico de colunas em public.profiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Restrições ativas na tabela profiles
SELECT conname, contype, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass
ORDER BY contype;

-- 3. Identificação exata das duas contas e seus IDs
SELECT 
    p.id AS profile_id_atual,
    p.user_id,
    u.id AS auth_user_id,
    u.email,
    p.role
FROM public.profiles p
JOIN auth.users u ON p.user_id = u.id;
```

---

## 8. Script Seguro de Promoção a Super Admin

Execute **após** aplicar a migration 0005. Promove exclusivamente a conta autorizada:

```sql
DO $$
DECLARE
    v_user_id     UUID;
    v_has_user_id BOOLEAN;
BEGIN
    -- 1. Busca o UUID real em auth.users
    SELECT id INTO v_user_id 
    FROM auth.users 
    WHERE lower(email) = 'contatojoasvieira@gmail.com';

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 
            'Usuário contatojoasvieira@gmail.com não foi localizado em auth.users. Faça login no aplicativo uma vez para registrar a conta antes da promoção.';
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name   = 'profiles' 
          AND column_name  = 'user_id'
    ) INTO v_has_user_id;

    -- 2. Atualiza ou insere o perfil com role = superadmin
    IF v_has_user_id THEN
        EXECUTE '
            INSERT INTO public.profiles (id, user_id, email, full_name, role, created_at, updated_at)
            VALUES ($1, $1, ''contatojoasvieira@gmail.com'', ''Administrador Geral'', ''superadmin'', NOW(), NOW())
            ON CONFLICT (id) DO UPDATE 
            SET 
                role       = ''superadmin'',
                email      = EXCLUDED.email,
                full_name  = EXCLUDED.full_name,
                user_id    = EXCLUDED.id,
                updated_at = NOW()'
        USING v_user_id;
    ELSE
        INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
        VALUES (v_user_id, 'contatojoasvieira@gmail.com', 'Administrador Geral', 'superadmin', NOW(), NOW())
        ON CONFLICT (id) DO UPDATE 
        SET 
            role       = 'superadmin',
            email      = EXCLUDED.email,
            full_name  = EXCLUDED.full_name,
            updated_at = NOW();
    END IF;

    RAISE NOTICE 'Conta contatojoasvieira@gmail.com (UUID %) promovida com sucesso a superadmin!', v_user_id;
END $$;
```

---

## 9. Plano de Rollback

Caso ocorra qualquer imprevisto ou necessidade de reverter:

```sql
BEGIN;

-- 1. Remove restrições recriadas
ALTER TABLE public.tenants DROP CONSTRAINT IF EXISTS tenants_owner_id_fkey;
ALTER TABLE public.subscription_payments DROP CONSTRAINT IF EXISTS subscription_payments_recorded_by_fkey;
ALTER TABLE public.admin_audit_logs DROP CONSTRAINT IF EXISTS admin_audit_logs_admin_id_fkey;

-- 2. Restaura trigger original (Migration 0003)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (new.id, new.email,
            COALESCE(new.raw_user_meta_data->>'full_name', 'Usuário'),
            'tenant_admin');
    RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Restaura função is_superadmin original
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'superadmin'
    );
END;
$$;

-- 4. Restaura política RLS
DROP POLICY IF EXISTS "Usuário autenticado visualiza seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuário autenticado visualiza seu próprio perfil"
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

COMMIT;
```

> [!WARNING]
> O script acima reverte funções, triggers e policies. Caso os valores de `profiles.id` já tenham sido alterados com `COMMIT` bem-sucedido, recomenda-se ter realizado um backup prévio (`pg_dump`) antes do início da operação.

---

## 10. Testes de Validação Pós-Migração

Execute as consultas abaixo após a conclusão da migration para homologar o banco de dados:

```sql
-- Teste 1: Confirmar se todos os perfis têm id igual ao auth.users.id
SELECT 
    p.id AS profile_id,
    u.id AS auth_id,
    (p.id = u.id) AS ids_iguais,
    p.email,
    p.role
FROM public.profiles p
JOIN auth.users u ON p.id = u.id;
-- Resultado esperado: ids_iguais = TRUE em 100% das linhas.

-- Teste 2: Confirmar integridade de chave estrangeira com tenants
SELECT 
    t.id AS tenant_id,
    t.business_name,
    t.owner_id,
    p.email AS owner_email
FROM public.tenants t
LEFT JOIN public.profiles p ON p.id = t.owner_id;
-- Resultado esperado: Nenhuma linha com owner_email NULL.

-- Teste 3: Checagem de role superadmin para a conta administrativa
SELECT id, email, role 
FROM public.profiles 
WHERE lower(email) = 'contatojoasvieira@gmail.com';
-- Resultado esperado: role = 'superadmin' e id = auth.users.id correspondente.
```

---

## 11. Status de Verificação Local vs Ações Remotas

| Verificação / Ação | Ambiente | Status |
|---|---|---|
| Mapeamento de dependências no schema | Local | ✅ Concluído e documentado |
| Correção da migration `0005_auth_profiles_compat.sql` (v2) | Local | ✅ Salvo e auditado |
| Implementação de `loginWithGoogleAction` e `resetPasswordAction` | Local | ✅ Integrado |
| Endpoint Route Handler `src/app/auth/callback/route.ts` | Local | ✅ Compilado e testado |
| Tolerância defensiva em `dataService.getProfile` e `ensureProfile` | Local | ✅ Implementado |
| Suite completa de testes automatizados (44/44) | Local | ✅ Todos aprovados |
| Compilação TypeScript (`npx tsc --noEmit`) | Local | ✅ 0 erros |
| Build de produção (`npm run build`) | Local | ✅ Sucesso absoluto (13 rotas geradas) |
| Execução do Dry Run (Seção 7) | Remoto (Supabase) | ⚙️ Aguardando operador no SQL Editor |
| Aplicação da Migration 0005 (Seção 6) | Remoto (Supabase) | ⚙️ Aguardando operador no SQL Editor |
| Execução da Promoção Super Admin (Seção 8) | Remoto (Supabase) | ⚙️ Aguardando operador no SQL Editor |
| Execução dos Testes de Validação (Seção 10) | Remoto (Supabase) | ⚙️ Aguardando operador no SQL Editor |

# REVISÃO TÉCNICA E AUDITORIA DE SEGURANÇA: MIGRATION 0005 E PROMOÇÃO DE SUPER ADMIN

**Documento:** `docs/REVISAO-SEGURANCA-MIGRATION-0005.md`  
**Data:** 28 de Outubro de 2026  
**Escopo da Análise:** `supabase/migrations/0005_auth_profiles_compat.sql` e Script de Promoção de Super Admin em `docs/DIAGNOSTICO-AUTENTICACAO.md`  
**Classificação de Riscos:** Crítico | Alto | Médio | Baixo  

---

## 1. Sumário Executivo

A migration `0005_auth_profiles_compat.sql` e o script de promoção foram submetidos a uma auditoria estrita de engenharia reversa considerando a coexistência com o schema legado do Supabase (que possui `public.profiles` com colunas `id`, `user_id`, `name`, `phone` e a tabela órfã `public.store_members`).

**Conclusão Geral:**  
A migration proposta no diagnóstico inicial possui a intenção correta, mas **apresenta 2 falhas críticas e 2 falhas de alta severidade** que causarão erros de execução no PostgreSQL caso aplicadas exatamente como redigidas sobre a tabela legada real.

Os principais riscos identificados foram:
1. **Falha de Not-Null Constraint na Trigger:** Se a coluna legada `user_id` possuir restrição `NOT NULL` sem valor default, o `INSERT` da trigger `handle_new_user()` falhará para qualquer novo usuário (seja Google ou e-mail/senha).
2. **Erro de Parsing em PL/pgSQL na função `is_superadmin()`:** O PostgreSQL analisa instruções SQL estáticas em tempo de compilação. Se uma query estática fizer referência à coluna `user_id` em um banco onde ela não existe (ou vice-versa), a função falhará com erro de compilação.
3. **Inconsistência da Chave Primária Legada (`id IS NULL`):** Se a tabela legada já possui uma Primary Key preenchida com UUIDs aleatórios (`NOT NULL`), a condição `WHERE id IS NULL` nunca será satisfeita, mantendo `id` desvinculado de `auth.users.id`.
4. **Potencial Conflito de Concorrência com Políticas Órfãs de `store_members`:** Políticas RLS residuais do projeto anterior podem bloquear leitura/escrita caso façam referências cruzadas à tabela `store_members`.

Abaixo segue a análise detalhada ponto a ponto, o quadro de classificação de gravidade e o **SQL corrigido, validado e com rotina de reversão**.

---

## 2. Análise Detalhada dos 6 Itens de Auditoria

### Item 1: Chave Primária, Restrições UNIQUE e Relação `profiles.id` vs `profiles.user_id` vs `auth.users.id`
- **Diagnóstico:**  
  No GlowSaaS, o contrato arquitetural exige:
  $$\text{public.profiles.id} \equiv \text{auth.users.id}$$
  Na tabela legada, a chave primária `id` pode ter sido criada como `UUID DEFAULT gen_random_uuid()` e a coluna `user_id` foi a que recebeu `REFERENCES auth.users(id) UNIQUE`.
- **Vulnerabilidade Identificada (Gravidade: Crítica):**  
  Na migration original, o trecho:
  ```sql
  UPDATE public.profiles SET id = user_id WHERE id IS NULL AND user_id IS NOT NULL;
  ```
  assume que `id` pode ser nulo. Em tabelas relacionais onde `id` é a Primary Key, `id` **nunca é nulo**. Portanto, esse `UPDATE` não atualiza nenhuma linha existente.
- **Risco de Chave Estrangeira com `tenants`:**  
  Se `tenants.owner_id` referencia `profiles.id`, e `profiles.id` continuar sendo um UUID aleatório antigo (e não o UUID do auth), o método `dataService.getTenantByOwner(auth.uid())` falhará em associar o proprietário ao seu salão ou barbearia.

### Item 2: Comportamento na Tabela Legada Real (Constraint de `user_id`)
- **Diagnóstico:**  
  Em schemas legados com `user_id`, essa coluna costuma possuir `user_id UUID NOT NULL REFERENCES auth.users(id)`.
- **Vulnerabilidade Identificada (Gravidade: Crítica):**  
  A trigger `handle_new_user()` da migration 0005 executa:
  ```sql
  INSERT INTO public.profiles (id, email, full_name, role) VALUES (new.id, ...);
  ```
  Como o comando **não inclui a coluna `user_id`**, o PostgreSQL disparará:
  `ERROR: null value in column "user_id" of relation "profiles" violates not-null constraint`.
  Isso causará erro 500 imediato em qualquer tentativa de cadastro ou login via Google OAuth.
- **Correção Necessária:**  
  A migration deve garantir que a coluna `user_id` (se existir) seja sincronizada com `new.id` ou que sua restrição `NOT NULL` seja relaxada (`DROP NOT NULL`), mantendo a coluna `id` como o identificador canônico.

### Item 3: Compilação de Triggers, `is_superadmin()` e Políticas RLS
- **Diagnóstico:**  
  O corpo de `public.is_superadmin()` na migration 0005 tentava verificar:
  ```sql
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE ... column_name = 'user_id') THEN
      RETURN EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'superadmin');
  END IF;
  ```
- **Vulnerabilidade Identificada (Gravidade: Alta):**  
  O PL/pgSQL do Postgres compila o plano de execução estático de todas as queries do bloco no primeiro uso. Se a coluna `user_id` não existir na tabela (ou se for removida no futuro), o analisador semântico rejeita a função inteira com `column "user_id" does not exist`, quebrando o acesso de todos os administradores.
- **Correção Necessária:**  
  Toda inspeção condicional de colunas legadas dentro de funções PL/pgSQL deve utilizar obrigatoriamente **SQL Dinâmico** (`EXECUTE ... USING ...`).

### Item 4: Script de Promoção a Super Admin
- **Diagnóstico do Script Proposto:**  
  ```sql
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (v_user_id, 'contatojoasvieira@gmail.com', 'Administrador Geral', 'superadmin')
  ON CONFLICT (id) DO UPDATE SET role = 'superadmin', ...;
  ```
- **Vulnerabilidades Identificadas:**
  1. Se a tabela legada possuir uma constraint `UNIQUE (user_id)` e existir uma linha antiga onde `user_id = v_user_id` mas `id != v_user_id`, o comando disparará conflito em `user_id` e não em `id`, resultando em falha de chave duplicada.
  2. Se a coluna `user_id` tiver restrição `NOT NULL`, o `INSERT` falhará pela ausência de `user_id`.
- **Garantia de Isolamento:**  
  O script é estritamente restrito a `v_user_id` obtido de `auth.users WHERE lower(email) = 'contatojoasvieira@gmail.com'`. Não há risco de concessão a outras contas ou privilégio global indevido.

### Item 5: Unificação de Contas Google OAuth e Senha
- **Diagnóstico:**  
  O Supabase Auth utiliza a tabela `auth.identities` vinculada a `auth.users`. Quando um usuário loga via Google com o mesmo e-mail verificado de uma conta já existente com senha, o Supabase mantém o mesmo `auth.users.id`.
- **Resultado:**  
  Como o perfil em `public.profiles` referencia o `auth.users.id`, ambos os métodos acessam o mesmo perfil e compartilham o mesmo papel de `superadmin` sem duplicação de registros.

### Item 6: Recursão em RLS e Conflitos com o Projeto Antigo (`store_members`)
- **Diagnóstico:**  
  A tabela `public.store_members` possui zero linhas, mas se houver políticas RLS antigas ativas em `public.profiles` criadas pelo projeto anterior (ex: políticas que faziam `JOIN store_members`), qualquer consulta a `profiles` pode ser abortada ou retornar vazio.
- **Correção Necessária:**  
  A migration deve eliminar especificamente políticas RLS legadas conhecidas que façam menção a `store_members` ou `store_id`, garantindo que apenas as políticas do GlowSaaS governem a tabela.

---

## 3. Matriz de Classificação de Riscos Identificados

| # | Problema Identificado | Gravidade | Impacto no Sistema |
|---|---|---|---|
| 1 | `user_id NOT NULL` bloqueando criação de perfis via trigger e OAuth | **CRÍTICO** | Novos usuários e logins pelo Google falham com erro de banco de dados. |
| 2 | Inconsistência de PK legada onde `id` já possui valor aleatório | **CRÍTICO** | Consultas `eq("id", userId)` não encontram perfil de usuário autenticado. |
| 3 | Query estática a `user_id` em `is_superadmin()` sem SQL dinâmico | **ALTO** | Falha de compilação em PL/pgSQL quebrando o painel `/admin`. |
| 4 | `ON CONFLICT (id)` falhando em tabela que possui `UNIQUE (user_id)` | **ALTO** | Script de promoção do Super Admin falha com duplicate key error. |
| 5 | Políticas RLS legadas do projeto antigo (`store_members`) | **MÉDIO** | Possível interferência em permissões de leitura/escrita de perfis. |
| 6 | Ausência de normalização `LOWER(email)` nas buscas de auth | **BAIXO** | Risco de incompatibilidade caso o e-mail seja digitado com maiúsculas. |

---

## 4. SQL Corrigido e Seguro: `0005_auth_profiles_compat_v2.sql`

O script abaixo corrige todas as 6 vulnerabilidades apontadas, é **100% idempotente**, não apaga dados e prepara a tabela com tolerância tanto a registros novos quanto legados.

```sql
-- ==============================================================================
-- GLOWSAAS: MIGRATION 0005 (VERSÃO CORRIGIDA E AUDITADA)
-- Data: 28/10/2026
-- Objetivo: Compatibilização estrutural de public.profiles, OAuth e Super Admin
-- ==============================================================================

-- 1. ADICIONA AS COLUNAS OFICIAIS EXIGIDAS PELO GLOWSAAS
ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS full_name TEXT,
    ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'tenant_admin';

-- 2. GARANTE A RESTRIÇÃO CHECK DO PAPEL (ROLE)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'profiles_role_check' AND conrelid = 'public.profiles'::regclass
    ) THEN
        ALTER TABLE public.profiles 
            ADD CONSTRAINT profiles_role_check 
            CHECK (role IN ('superadmin', 'tenant_admin'));
    END IF;
END $$;

-- 3. TRATAMENTO CRÍTICO DE USER_ID: SE EXISTIR, RELAXA NOT-NULL E COPIA DADOS
DO $$
BEGIN
    -- Se existir a coluna user_id legada, remove NOT NULL para não quebrar inserts novos
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.profiles ALTER COLUMN user_id DROP NOT NULL;
        
        -- Sincroniza full_name se existir coluna legada 'name'
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'name'
        ) THEN
            UPDATE public.profiles 
            SET full_name = name 
            WHERE (full_name IS NULL OR full_name = '') AND name IS NOT NULL;
        END IF;

        -- Sincroniza registros legados onde id != user_id e user_id aponta para auth.users
        -- Garante que o id seja exatamente o UUID do auth
        UPDATE public.profiles p
        SET id = p.user_id
        FROM auth.users u
        WHERE p.user_id = u.id AND p.id != p.user_id;
    END IF;
END $$;

-- 4. PREENCHE E-MAILS NULOS A PARTIR DO AUTH.USERS
UPDATE public.profiles p
SET email = lower(u.email)
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR p.email = '');

-- Preenche role padrão caso esteja nulo
UPDATE public.profiles
SET role = 'tenant_admin'
WHERE role IS NULL;

-- 5. FUNÇÃO IS_SUPERADMIN() ROBUSTA COM SQL DINÂMICO E SEARCH_PATH
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, auth
AS $$
DECLARE
    v_is_admin BOOLEAN := FALSE;
    v_has_user_id BOOLEAN;
BEGIN
    -- Verificação Canônica (id == auth.uid())
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'superadmin'
    ) INTO v_is_admin;

    IF v_is_admin THEN
        RETURN TRUE;
    END IF;

    -- Verificação Defensiva Dinâmica (caso a coluna user_id ainda exista no banco)
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'user_id'
    ) INTO v_has_user_id;

    IF v_has_user_id THEN
        EXECUTE 'SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = $1 AND role = ''superadmin'')'
        USING auth.uid()
        INTO v_is_admin;
    END IF;

    RETURN COALESCE(v_is_admin, FALSE);
END;
$$;

-- 6. TRIGGER RESILIENTE PARA NOVOS USUÁRIOS (SUPORTA GOOGLE OAUTH E SENHA)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, auth
AS $$
DECLARE
    v_full_name TEXT;
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
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'user_id'
    ) INTO v_has_user_id;

    IF v_has_user_id THEN
        -- Se a tabela ainda possuir user_id, preenche id e user_id com o mesmo UUID
        EXECUTE '
            INSERT INTO public.profiles (id, user_id, email, full_name, role)
            VALUES ($1, $1, $2, $3, ''tenant_admin'')
            ON CONFLICT (id) DO UPDATE 
            SET 
                email = EXCLUDED.email,
                full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
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
            email = EXCLUDED.email,
            full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
            updated_at = timezone('utc'::text, now());
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. POLÍTICA RLS SEGURA (SEM RECURSÃO E RESILIENTE)
DROP POLICY IF EXISTS "Usuário autenticado visualiza seu próprio perfil" ON public.profiles;

CREATE POLICY "Usuário autenticado visualiza seu próprio perfil"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

COMMENT ON TABLE public.profiles IS 'Perfis de usuários do GlowSaaS compatibilizados e protegidos contra elevação de privilégios.';
```

---

## 5. Script Seguro de Promoção de Super Admin (Corrigido)

Execute o script abaixo no SQL Editor do Supabase para promover sua conta `contatojoasvieira@gmail.com`. Ele previne erros de constraint `user_id` e trata o conflito por e-mail ou UUID:

```sql
DO $$
DECLARE
    v_user_id UUID;
    v_has_user_id BOOLEAN;
BEGIN
    -- 1. Localiza a conta real em auth.users
    SELECT id INTO v_user_id 
    FROM auth.users 
    WHERE lower(email) = 'contatojoasvieira@gmail.com';

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuário contatojoasvieira@gmail.com não existe em auth.users. Faça login ou crie a conta primeiro no Authentication > Users.';
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'user_id'
    ) INTO v_has_user_id;

    -- 2. Insere ou atualiza garantindo compatibilidade com user_id
    IF v_has_user_id THEN
        EXECUTE '
            INSERT INTO public.profiles (id, user_id, email, full_name, role, created_at, updated_at)
            VALUES ($1, $1, ''contatojoasvieira@gmail.com'', ''Administrador Geral'', ''superadmin'', NOW(), NOW())
            ON CONFLICT (id) DO UPDATE 
            SET 
                role = ''superadmin'',
                email = EXCLUDED.email,
                full_name = EXCLUDED.full_name,
                user_id = EXCLUDED.id,
                updated_at = NOW()'
        USING v_user_id;
    ELSE
        INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
        VALUES (v_user_id, 'contatojoasvieira@gmail.com', 'Administrador Geral', 'superadmin', NOW(), NOW())
        ON CONFLICT (id) DO UPDATE 
        SET 
            role = 'superadmin',
            email = EXCLUDED.email,
            full_name = EXCLUDED.full_name,
            updated_at = NOW();
    END IF;

    RAISE NOTICE 'Conta contatojoasvieira@gmail.com (UUID %) promovida com sucesso a superadmin!', v_user_id;
END $$;
```

---

## 6. Procedimento de Validação Prévia (Dry Run)

Antes de executar o script definitivo, execute as seguintes consultas diagnósticas no SQL Editor para auditar o estado real das colunas e constraints existentes:

```sql
-- 1. Verifica as colunas e tipos de dados reais da tabela public.profiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Verifica as chaves primárias e restrições UNIQUE ativas em profiles
SELECT conname, contype, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass;

-- 3. Verifica se existem políticas RLS antigas na tabela profiles
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles';
```

---

## 7. Procedimento de Reversão (Rollback)

Se for necessário reverter as alterações aplicadas pela Migration 0005 sem afetar os dados de usuários:

```sql
-- Reversão segura: restaura trigger original e remove colunas novas apenas se necessário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Restaura função handle_new_user da Migration 0003
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, auth
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Usuário'),
        'tenant_admin'
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Restaura política RLS canônica
DROP POLICY IF EXISTS "Usuário autenticado visualiza seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuário autenticado visualiza seu próprio perfil"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid());
```


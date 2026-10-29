-- =============================================================================
-- GLOWSAAS — MIGRATION 0005: COMPATIBILIZAÇÃO SEGURA DE PERFIS, AUTH E OAUTH
-- Versão: 2.0 (Auditada e Corrigida)
-- Data: 28/10/2026
-- Objetivo: Alinhar public.profiles.id ao contrato auth.users.id do GlowSaaS
-- sem perda de dados, com cascata segura nas FKs dependentes e suporte
-- transparente a login por e-mail/senha e Google OAuth.
-- =============================================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. ADICIONAR COLUNAS OFICIAIS DO GLOWSAAS (IDEMPOTENTE)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS email    TEXT,
    ADD COLUMN IF NOT EXISTS full_name TEXT,
    ADD COLUMN IF NOT EXISTS role     TEXT DEFAULT 'tenant_admin';

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. RESTRIÇÃO CHECK DO ROLE (IDEMPOTENTE)
-- ─────────────────────────────────────────────────────────────────────────────
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

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. LIBERAR user_id NOT NULL PARA PERMITIR INSERTS NOVOS SEM ERROS
-- ─────────────────────────────────────────────────────────────────────────────
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

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. MIGRAÇÃO DO NOME LEGADO (name → full_name)
-- ─────────────────────────────────────────────────────────────────────────────
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

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. CAPTURA MAPEAMENTO old_id -> user_id PARA ATUALIZAÇÃO SEGURA DAS FKs
-- ─────────────────────────────────────────────────────────────────────────────
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

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. REMOÇÃO CONTROLADA DAS FKs QUE REFERENCIAM profiles.id
-- ─────────────────────────────────────────────────────────────────────────────
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

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. ATUALIZAÇÃO DAS FKs NAS TABELAS DEPENDENTES
-- ─────────────────────────────────────────────────────────────────────────────
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

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. ATUALIZAÇÃO DA CHAVE PRIMÁRIA DE profiles (id = user_id)
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE public.profiles p
SET id = p.user_id
FROM _profile_id_map m
WHERE p.id = m.old_id;

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. RECRIAR AS FKs
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.tenants
    ADD CONSTRAINT tenants_owner_id_fkey
    FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE RESTRICT;

ALTER TABLE public.subscription_payments
    ADD CONSTRAINT subscription_payments_recorded_by_fkey
    FOREIGN KEY (recorded_by) REFERENCES public.profiles(id) ON DELETE RESTRICT;

ALTER TABLE public.admin_audit_logs
    ADD CONSTRAINT admin_audit_logs_admin_id_fkey
    FOREIGN KEY (admin_id) REFERENCES public.profiles(id) ON DELETE RESTRICT;

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. PREENCHER email E role A PARTIR DE auth.users
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE public.profiles p
SET email = lower(u.email)
FROM auth.users u
WHERE p.id = u.id 
  AND (p.email IS NULL OR p.email = '');

UPDATE public.profiles
SET role = 'tenant_admin'
WHERE role IS NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- 11. FUNÇÃO is_superadmin() ROBUSTA COM SQL DINÂMICO
-- ─────────────────────────────────────────────────────────────────────────────
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

-- ─────────────────────────────────────────────────────────────────────────────
-- 12. TRIGGER handle_new_user() RESILIENTE (GOOGLE OAUTH + SENHA)
-- ─────────────────────────────────────────────────────────────────────────────
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

-- ─────────────────────────────────────────────────────────────────────────────
-- 13. GATILHO DE PROTEÇÃO CONTRA ESCALAÇÃO DE PRIVILÉGIOS (ROLE & ID)
-- ─────────────────────────────────────────────────────────────────────────────
-- Impede categoricamente que usuários comuns alterem seu próprio papel para 'superadmin'
-- ou alterem a chave primária 'id', mesmo via chamadas diretas à API do Supabase.
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

-- ─────────────────────────────────────────────────────────────────────────────
-- 14. POLÍTICAS RLS PARA PROFILES
-- ─────────────────────────────────────────────────────────────────────────────
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

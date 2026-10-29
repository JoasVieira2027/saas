-- =============================================================================
-- GLOWSAAS — MIGRATION 0006: HARDENING DE PRIVILÉGIOS EM PUBLIC.PROFILES
-- Data: 29/10/2026
-- Objetivo: Blindar a tabela public.profiles contra escalação de privilégios,
-- adulteração de chaves (id, user_id) e políticas permissivas residuais (OR).
-- Contexto: Supabase remoto já possui a Migration 0005 aplicada.
-- =============================================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. LIMPEZA TOTAL DE POLÍTICAS RLS ANTIGAS, RESIDUAIS OU PERMISSIVAS
-- ─────────────────────────────────────────────────────────────────────────────
-- Remove políticas oficiais existentes para recriação estrita
DROP POLICY IF EXISTS "Usuário autenticado visualiza seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuário autenticado atualiza seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Superadmin tem acesso total a perfis" ON public.profiles;

-- Remove políticas legadas em inglês comuns em templates ou projetos anteriores
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by users who created them." ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by users who created them" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.profiles;
DROP POLICY IF EXISTS "Allow individual read" ON public.profiles;
DROP POLICY IF EXISTS "Allow individual update" ON public.profiles;
DROP POLICY IF EXISTS "Allow individual insert" ON public.profiles;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. GATILHO NO MOTOR DO BANCO (BEFORE INSERT OR UPDATE)
-- ─────────────────────────────────────────────────────────────────────────────
-- Defesa em profundidade: intercepta escritas diretamente no PostgreSQL,
-- garantindo que nenhuma política RLS permissiva ou chamada direta à API
-- consiga alterar 'role', 'id' ou 'user_id'.
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Regras para INSERT
    IF TG_OP = 'INSERT' THEN
        -- Se não for superadmin, impede inserção com role 'superadmin'
        IF NEW.role = 'superadmin' AND NOT public.is_superadmin() THEN
            NEW.role := 'tenant_admin';
        END IF;

        -- Força role padrão se vier nulo ou inválido
        IF NEW.role IS NULL OR NEW.role NOT IN ('superadmin', 'tenant_admin') THEN
            NEW.role := 'tenant_admin';
        END IF;

        RETURN NEW;
    END IF;

    -- Regras para UPDATE
    IF TG_OP = 'UPDATE' THEN
        -- 1. Impede alteração da chave primária 'id'
        IF NEW.id IS DISTINCT FROM OLD.id THEN
            RAISE EXCEPTION 'A chave primária (id) do perfil é imutável.';
        END IF;

        -- 2. Impede alteração da coluna legada 'user_id' caso exista
        IF OLD.user_id IS NOT NULL AND NEW.user_id IS DISTINCT FROM OLD.user_id THEN
            NEW.user_id := OLD.user_id;
        END IF;

        -- 3. Blindagem estrita de 'role': apenas Superadmin pode alterar
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
    END IF;

    RETURN NEW;
END;
$$;

-- Revoga permissão de execução direta por anon/authenticated
REVOKE ALL ON FUNCTION public.protect_profile_role() FROM PUBLIC, anon;

-- Vincula o gatilho para INSERT e UPDATE
DROP TRIGGER IF EXISTS tr_protect_profile_role ON public.profiles;
CREATE TRIGGER tr_protect_profile_role
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_profile_role();

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. POLÍTICAS RLS REESTABELECIDAS COM BLINDAGEM ESTRITA
-- ─────────────────────────────────────────────────────────────────────────────

-- A. LEITURA (SELECT):
-- Usuário visualiza seu próprio perfil; Superadmin tem visibilidade total.
CREATE POLICY "profiles_select_policy"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid() OR public.is_superadmin());

-- B. ATUALIZAÇÃO (UPDATE):
-- Usuário comum só pode atualizar seu próprio perfil e NÃO pode alterar role para superadmin.
-- Superadmin pode atualizar qualquer perfil e qualquer role.
CREATE POLICY "profiles_update_policy"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid() OR public.is_superadmin())
WITH CHECK (
    (id = auth.uid() AND (role = 'tenant_admin' OR public.is_superadmin()))
    OR public.is_superadmin()
);

-- C. INSERÇÃO (INSERT):
-- Bloqueado para usuários comuns via API direta.
-- Novos usuários entram exclusivamente pelo trigger on_auth_user_created (SECURITY DEFINER).
-- Apenas Superadmin pode inserir perfis diretamente.
CREATE POLICY "profiles_insert_superadmin_only"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (public.is_superadmin());

-- D. EXCLUSÃO (DELETE):
-- Apenas Superadmin pode excluir perfis.
CREATE POLICY "profiles_delete_superadmin_only"
ON public.profiles FOR DELETE
TO authenticated
USING (public.is_superadmin());

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. REFORÇO DA CONSTRAINT DE CHECAGEM DO ROLE
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

COMMENT ON TABLE public.profiles IS 
    'Perfis de usuários do GlowSaaS com proteção estrita contra escalação de privilégios (Migration 0006).';

COMMIT;


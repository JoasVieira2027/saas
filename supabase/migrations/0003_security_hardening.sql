-- Migração 0003: Hardening de Segurança, Prevenção de Elevação de Privilégios e Isolamento Estrito
-- Data: 2026-10-28
-- Fase 8: Auditoria de Segurança e Integridade

-- 1. CORREÇÃO CRÍTICA DE ELEVAÇÃO DE PRIVILÉGIOS NO TRIGGER DE NOVOS USUÁRIOS
-- Anteriormente: COALESCE(new.raw_user_meta_data->>'role', 'tenant_admin')
-- Vulnerabilidade: Qualquer usuário ao se cadastrar via supabase.auth.signUp() podia enviar role: 'superadmin' nos metadados
-- Correção: Força estritamente 'tenant_admin'. O papel 'superadmin' NUNCA pode ser autoatribuído.
-- Adicionado: SET search_path = public, auth para mitigar ataques de search_path em SECURITY DEFINER.

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
        'tenant_admin' -- 🔒 FORÇADO: Superadmin só pode ser concedido manualmente por administrador autorizado no banco
    );
    RETURN NEW;
END;
$$;

-- 2. HARDENING DAS FUNÇÕES DE CHECAGEM DE AUTORIZAÇÃO (SEARCH_PATH PROTECTION)
-- Mitiga possíveis ataques de manipulação de search_path em funções SECURITY DEFINER

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, auth
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'superadmin'
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.user_owns_tenant(check_tenant_id UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, auth
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.tenants
        WHERE id = check_tenant_id AND owner_id = auth.uid()
    );
END;
$$;

-- 3. ISOLAMENTO PÚBLICO ESTRITO DE SERVIÇOS E HORÁRIOS PARA TENANTS SUSPENSOS/CANCELADOS
-- Garante que requisições anon/authenticated não consigam consultar serviços nem horários de clientes suspensos ou inadimplentes cancelados

DROP POLICY IF EXISTS "Visitantes públicos visualizam serviços ativos de tenants ativos" ON public.services;
CREATE POLICY "Visitantes públicos visualizam serviços ativos de tenants ativos"
ON public.services FOR SELECT
TO anon, authenticated
USING (
    is_active = true AND
    EXISTS (
        SELECT 1 FROM public.tenants
        WHERE tenants.id = services.tenant_id 
          AND tenants.status = 'active'
          AND tenants.subscription_status NOT IN ('suspended', 'cancelled')
    )
);

DROP POLICY IF EXISTS "Visitantes públicos visualizam horários de tenants ativos" ON public.business_hours;
CREATE POLICY "Visitantes públicos visualizam horários de tenants ativos"
ON public.business_hours FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.tenants
        WHERE tenants.id = business_hours.tenant_id 
          AND tenants.status = 'active'
          AND tenants.subscription_status NOT IN ('suspended', 'cancelled')
    )
);

-- 4. COMENTÁRIOS DE SEGURANÇA E CONFORMIDADE
COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger seguro para sincronização de perfil auth.users -> profiles. Força role=tenant_admin.';
COMMENT ON FUNCTION public.is_superadmin() IS 'Verifica de forma segura com search_path fixo se o usuário logado possui role=superadmin.';
COMMENT ON FUNCTION public.user_owns_tenant(UUID) IS 'Verifica com search_path fixo se o tenant pertence ao usuário autenticado.';


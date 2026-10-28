-- Migração 0001: Schema Inicial do SaaS de Beleza
-- Habilita extensão de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE PERFIS DE USUÁRIOS (vinculada ao auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'tenant_admin' CHECK (role IN ('superadmin', 'tenant_admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. TABELA DE TENANTS (Clientes do SaaS: Salões, Barbearias, Unhas)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    business_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    segment TEXT NOT NULL CHECK (segment IN ('salon', 'barber', 'nails')),
    custom_domain TEXT UNIQUE,
    plan_type TEXT NOT NULL DEFAULT 'starter' CHECK (plan_type IN ('starter', 'pro')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Índice para busca rápida de subdomínio/slug público
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON public.tenants (slug);
CREATE INDEX IF NOT EXISTS idx_tenants_owner ON public.tenants (owner_id);

-- 3. TABELA DE CONFIGURAÇÃO DA LANDING PAGE
CREATE TABLE IF NOT EXISTS public.landing_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL UNIQUE REFERENCES public.tenants(id) ON DELETE CASCADE,
    template_id TEXT NOT NULL DEFAULT 'salon' CHECK (template_id IN ('salon', 'barber', 'nails')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    theme_config JSONB NOT NULL DEFAULT '{
        "primary_color": "#A9855E",
        "accent_color": "#C2A37E",
        "font_preset": "classic",
        "dark_mode": false
    }'::jsonb,
    hero_section JSONB NOT NULL DEFAULT '{
        "badge": "Especialistas em Beleza & Bem-estar",
        "headline": "Realce sua beleza natural com atendimento exclusivo",
        "subheadline": "Técnicas modernas, produtos premium e profissionais dedicados à sua autoestima.",
        "cta_text": "Agendar pelo WhatsApp",
        "hero_image_url": "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"
    }'::jsonb,
    about_section JSONB NOT NULL DEFAULT '{
        "title": "Nossa História & Dedicação",
        "description": "Criamos um espaço acolhedor e sofisticado onde cada detalhe é planejado para proporcionar uma experiência única de cuidado pessoal.",
        "years_experience": 8,
        "highlight_image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
    }'::jsonb,
    contact_info JSONB NOT NULL DEFAULT '{
        "whatsapp_number": "11999999999",
        "whatsapp_default_message": "Olá! Gostaria de agendar um horário.",
        "address_street": "Avenida Principal, 1200",
        "address_neighborhood": "Centro",
        "address_city": "São Paulo",
        "address_state": "SP",
        "google_maps_url": "https://maps.google.com",
        "instagram_handle": "@studiobeleza"
    }'::jsonb,
    seo_title TEXT NOT NULL DEFAULT 'Studio de Beleza | Atendimento Exclusivo',
    seo_description TEXT NOT NULL DEFAULT 'Agende seu horário online no melhor espaço de beleza da região.',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_landing_pages_tenant ON public.landing_pages (tenant_id);

-- 4. TABELA DE SERVIÇOS
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    category TEXT NOT NULL DEFAULT 'Geral',
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    image_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_services_tenant ON public.services (tenant_id);

-- 5. TABELA DE HORÁRIOS DE ATENDIMENTO
CREATE TABLE IF NOT EXISTS public.business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    open_time TEXT NOT NULL DEFAULT '09:00',
    close_time TEXT NOT NULL DEFAULT '19:00',
    is_closed BOOLEAN NOT NULL DEFAULT false,
    UNIQUE(tenant_id, day_of_week)
);

CREATE INDEX IF NOT EXISTS idx_business_hours_tenant ON public.business_hours (tenant_id);

-- 6. FUNÇÕES AUXILIARES DE AUTORIZAÇÃO (RLS)
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'superadmin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.user_owns_tenant(check_tenant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.tenants
        WHERE id = check_tenant_id AND owner_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. ATIVAÇÃO DE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;

-- 8. POLÍTICAS RLS PARA PROFILES
CREATE POLICY "Superadmin tem acesso total a perfis"
ON public.profiles FOR ALL
TO authenticated
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

CREATE POLICY "Usuário autenticado visualiza seu próprio perfil"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Usuário autenticado atualiza seu próprio perfil"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- 9. POLÍTICAS RLS PARA TENANTS
CREATE POLICY "Superadmin tem acesso total a tenants"
ON public.tenants FOR ALL
TO authenticated
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

CREATE POLICY "Proprietário visualiza seu próprio tenant"
ON public.tenants FOR SELECT
TO authenticated
USING (owner_id = auth.uid());

CREATE POLICY "Proprietário atualiza seu próprio tenant"
ON public.tenants FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Leitura pública do tenant (para carregar o site público se ativo)
CREATE POLICY "Visitantes públicos leem tenants ativos"
ON public.tenants FOR SELECT
TO anon
USING (status = 'active');

-- 10. POLÍTICAS RLS PARA LANDING_PAGES
CREATE POLICY "Superadmin tem acesso total a landing_pages"
ON public.landing_pages FOR ALL
TO authenticated
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

CREATE POLICY "Proprietário gerencia sua landing page"
ON public.landing_pages FOR ALL
TO authenticated
USING (public.user_owns_tenant(tenant_id))
WITH CHECK (public.user_owns_tenant(tenant_id));

CREATE POLICY "Visitantes públicos visualizam landing pages publicadas de tenants ativos"
ON public.landing_pages FOR SELECT
TO anon, authenticated
USING (
    status = 'published' AND
    EXISTS (
        SELECT 1 FROM public.tenants
        WHERE tenants.id = landing_pages.tenant_id AND tenants.status = 'active'
    )
);

-- 11. POLÍTICAS RLS PARA SERVICES
CREATE POLICY "Superadmin tem acesso total a serviços"
ON public.services FOR ALL
TO authenticated
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

CREATE POLICY "Proprietário gerencia seus serviços"
ON public.services FOR ALL
TO authenticated
USING (public.user_owns_tenant(tenant_id))
WITH CHECK (public.user_owns_tenant(tenant_id));

CREATE POLICY "Visitantes públicos visualizam serviços ativos de tenants ativos"
ON public.services FOR SELECT
TO anon, authenticated
USING (
    is_active = true AND
    EXISTS (
        SELECT 1 FROM public.tenants
        WHERE tenants.id = services.tenant_id AND tenants.status = 'active'
    )
);

-- 12. POLÍTICAS RLS PARA BUSINESS_HOURS
CREATE POLICY "Superadmin tem acesso total a horários"
ON public.business_hours FOR ALL
TO authenticated
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

CREATE POLICY "Proprietário gerencia seus horários"
ON public.business_hours FOR ALL
TO authenticated
USING (public.user_owns_tenant(tenant_id))
WITH CHECK (public.user_owns_tenant(tenant_id));

CREATE POLICY "Visitantes públicos visualizam horários de tenants ativos"
ON public.business_hours FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.tenants
        WHERE tenants.id = business_hours.tenant_id AND tenants.status = 'active'
    )
);

-- 13. TRIGGER PARA SINCRONIZAR NOVOS USUÁRIOS DO AUTH COM A TABELA PROFILES
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Usuário'),
        COALESCE(new.raw_user_meta_data->>'role', 'tenant_admin')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Migração 0002: Super Admin, Controle de Assinaturas, Pagamentos Manuais e Auditoria
-- Preserva todo o schema existente e adiciona controle financeiro e governança administrativa

-- 1. ADIÇÃO DE CAMPOS DE ASSINATURA E CONTROLE FINANCEIRO NA TABELA TENANTS
ALTER TABLE public.tenants 
    ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'active' 
    CHECK (subscription_status IN ('active', 'pending', 'overdue', 'suspended', 'cancelled'));

ALTER TABLE public.tenants 
    ADD COLUMN IF NOT EXISTS monthly_price_cents INTEGER NOT NULL DEFAULT 9700;

ALTER TABLE public.tenants 
    ADD COLUMN IF NOT EXISTS due_day INTEGER NOT NULL DEFAULT 10 
    CHECK (due_day BETWEEN 1 AND 31);

ALTER TABLE public.tenants 
    ADD COLUMN IF NOT EXISTS next_due_date DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days');

ALTER TABLE public.tenants 
    ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMPTZ;

ALTER TABLE public.tenants 
    ADD COLUMN IF NOT EXISTS internal_notes TEXT DEFAULT '';

-- Índices para consultas rápidas no painel de administração
CREATE INDEX IF NOT EXISTS idx_tenants_subscription_status ON public.tenants (subscription_status);
CREATE INDEX IF NOT EXISTS idx_tenants_next_due_date ON public.tenants (next_due_date);

-- 2. TABELA DE REGISTROS DE PAGAMENTOS MANUAIS
CREATE TABLE IF NOT EXISTS public.subscription_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    amount_cents INTEGER NOT NULL,
    paid_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    due_date DATE NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'boleto', 'credit_card', 'cash', 'bank_transfer')),
    billing_period TEXT NOT NULL,
    notes TEXT DEFAULT '',
    recorded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_subscription_payments_tenant ON public.subscription_payments (tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_paid_at ON public.subscription_payments (paid_at DESC);

-- 3. TABELA DE AUDITORIA ADMINISTRATIVA (LOGS DE SEGURANÇA)
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    target_tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    target_tenant_name TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_tenant ON public.admin_audit_logs (target_tenant_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created ON public.admin_audit_logs (created_at DESC);

-- 4. HABILITAÇÃO DE ROW LEVEL SECURITY
ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 5. POLÍTICAS RLS ESTRITAS PARA PAGAMENTOS
-- Apenas Super Admin tem permissão para visualizar, inserir e gerenciar pagamentos
CREATE POLICY "Superadmin tem acesso total aos pagamentos"
ON public.subscription_payments FOR ALL
TO authenticated
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

-- 6. POLÍTICAS RLS ESTRITAS PARA LOGS DE AUDITORIA
-- Apenas Super Admin tem permissão para visualizar e inserir logs
CREATE POLICY "Superadmin tem acesso total aos logs de auditoria"
ON public.admin_audit_logs FOR ALL
TO authenticated
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

-- 7. ATUALIZAÇÃO DA POLÍTICA DE LEITURA PÚBLICA DE TENANTS E LANDING PAGES
-- Garante que páginas de tenants suspensos ou com assinatura cancelada/suspensa não sejam servidas publicamente
DROP POLICY IF EXISTS "Visitantes públicos leem tenants ativos" ON public.tenants;
CREATE POLICY "Visitantes públicos leem tenants ativos"
ON public.tenants FOR SELECT
TO anon
USING (status = 'active' AND subscription_status NOT IN ('suspended', 'cancelled'));

DROP POLICY IF EXISTS "Visitantes públicos visualizam landing pages publicadas de tenants ativos" ON public.landing_pages;
CREATE POLICY "Visitantes públicos visualizam landing pages publicadas de tenants ativos"
ON public.landing_pages FOR SELECT
TO anon, authenticated
USING (
    status = 'published' AND
    EXISTS (
        SELECT 1 FROM public.tenants
        WHERE tenants.id = landing_pages.tenant_id 
          AND tenants.status = 'active'
          AND tenants.subscription_status NOT IN ('suspended', 'cancelled')
    )
);


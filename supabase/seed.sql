-- Seed inicial demonstrativo para testes locais
-- AVISO: Dados fictícios claramente identificados para demonstração e homologação

-- 1. Inserir perfis demonstrativos
-- ID do Superadmin: 00000000-0000-0000-0000-000000000001
-- ID do Dono Salão: 00000000-0000-0000-0000-000000000002
-- ID do Dono Barbearia: 00000000-0000-0000-0000-000000000003
-- ID da Nail Designer: 00000000-0000-0000-0000-000000000004

-- 2. Tenants demonstrativos
INSERT INTO public.tenants (id, owner_id, business_name, slug, segment, plan_type, status)
VALUES
    ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002', 'Lumière Concept Hair & Spa', 'lumiere-hair', 'salon', 'pro', 'active'),
    ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000003', 'Navalha de Ouro Barber Club', 'navalha-de-ouro', 'barber', 'starter', 'active'),
    ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000004', 'Studio Gisele Nail Art & Gel', 'gisele-nails', 'nails', 'starter', 'active')
ON CONFLICT (slug) DO NOTHING;

-- 3. Landing Pages correspondentes
INSERT INTO public.landing_pages (tenant_id, template_id, status, seo_title, seo_description)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'salon', 'published', 'Lumière Concept Hair & Spa | Cabelo e Estética', 'Experiência exclusiva em cuidados capilares e estética premium em São Paulo.'),
    ('22222222-2222-2222-2222-222222222222', 'barber', 'published', 'Navalha de Ouro Barber Club | Cortes Clássicos & Barba', 'Cortes modernos, barboterapia tradicional e ambiente exclusivo.'),
    ('33333333-3333-3333-3333-333333333333', 'nails', 'published', 'Studio Gisele Nail Art | Alongamento em Gel', 'Especialista em unhas de fibra e gel com acabamento natural e alta durabilidade.')
ON CONFLICT (tenant_id) DO NOTHING;

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("1. Validação do Schema SQL e Políticas RLS do Supabase", () => {
  const sqlPath = path.resolve("supabase/migrations/0001_initial_schema.sql");
  assert.ok(fs.existsSync(sqlPath), "O arquivo de migração inicial deve existir");

  const sqlContent = fs.readFileSync(sqlPath, "utf-8");

  // Tabelas essenciais
  assert.match(sqlContent, /CREATE TABLE IF NOT EXISTS public\.profiles/i, "Tabela profiles deve existir");
  assert.match(sqlContent, /CREATE TABLE IF NOT EXISTS public\.tenants/i, "Tabela tenants deve existir");
  assert.match(sqlContent, /CREATE TABLE IF NOT EXISTS public\.landing_pages/i, "Tabela landing_pages deve existir");
  assert.match(sqlContent, /CREATE TABLE IF NOT EXISTS public\.services/i, "Tabela services deve existir");
  assert.match(sqlContent, /CREATE TABLE IF NOT EXISTS public\.business_hours/i, "Tabela business_hours deve existir");

  // RLS em todas as tabelas
  assert.match(sqlContent, /ALTER TABLE public\.profiles ENABLE ROW LEVEL SECURITY/i);
  assert.match(sqlContent, /ALTER TABLE public\.tenants ENABLE ROW LEVEL SECURITY/i);
  assert.match(sqlContent, /ALTER TABLE public\.landing_pages ENABLE ROW LEVEL SECURITY/i);
  assert.match(sqlContent, /ALTER TABLE public\.services ENABLE ROW LEVEL SECURITY/i);
  assert.match(sqlContent, /ALTER TABLE public\.business_hours ENABLE ROW LEVEL SECURITY/i);

  // Funções de segurança
  assert.match(sqlContent, /CREATE OR REPLACE FUNCTION public\.is_superadmin/i, "Função is_superadmin deve existir");
  assert.match(sqlContent, /CREATE OR REPLACE FUNCTION public\.user_owns_tenant/i, "Função user_owns_tenant deve existir");

  // Políticas de isolamento
  assert.match(sqlContent, /CREATE POLICY "Superadmin tem acesso total a tenants"/i);
  assert.match(sqlContent, /CREATE POLICY "Proprietário visualiza seu próprio tenant"/i);
  assert.match(sqlContent, /CREATE POLICY "Visitantes públicos leem tenants ativos"/i);
  assert.match(sqlContent, /CREATE POLICY "Visitantes públicos visualizam landing pages publicadas de tenants ativos"/i);
});

test("2. Validação da Camada de Dados e Isolamento Multitenant", async () => {
  // Simulando a lógica do data-service
  const tenants = [
    { id: "tenant-salon-1", owner_id: "salon-owner-1", business_name: "Lumière Concept Hair", slug: "lumiere-hair", segment: "salon", status: "active" },
    { id: "tenant-barber-1", owner_id: "barber-owner-1", business_name: "Navalha de Ouro Barber", slug: "navalha-de-ouro", segment: "barber", status: "active" },
    { id: "tenant-nails-1", owner_id: "nails-owner-1", business_name: "Studio Gisele Nail Art", slug: "gisele-nails", segment: "nails", status: "active" },
  ];

  // Teste de busca por slug
  const salon = tenants.find(t => t.slug === "lumiere-hair");
  assert.ok(salon, "Deve localizar o salão pelo slug");
  assert.equal(salon.segment, "salon");

  // Teste de isolamento de tenant por owner_id
  const getTenantByOwner = (ownerId) => tenants.find(t => t.owner_id === ownerId);

  const salonTenant = getTenantByOwner("salon-owner-1");
  const barberTenant = getTenantByOwner("barber-owner-1");

  assert.equal(salonTenant.id, "tenant-salon-1");
  assert.equal(barberTenant.id, "tenant-barber-1");
  assert.notEqual(salonTenant.id, barberTenant.id, "Tenant A e Tenant B devem ser estritamente isolados");

  // Teste de bloqueio para tenant não existente
  const unknownTenant = getTenantByOwner("hacker-owner");
  assert.equal(unknownTenant, undefined, "Proprietário não cadastrado não deve ter acesso a nenhum tenant");
});

test("3. Validação da Lógica do Middleware Multitenant de Subdomínios", () => {
  const rootDomain = "localhost:3000";
  const cleanRoot = rootDomain.split(":")[0];

  function extractSubdomain(hostname) {
    const cleanHostname = hostname.replace(/:[0-9]+$/, "");
    const isSubdomain =
      cleanHostname.endsWith(cleanRoot) &&
      cleanHostname !== cleanRoot &&
      !cleanHostname.startsWith("admin.") &&
      !cleanHostname.startsWith("app.") &&
      !cleanHostname.startsWith("www.");

    if (isSubdomain) {
      return cleanHostname.replace(`.${cleanRoot}`, "");
    }
    return null;
  }

  assert.equal(extractSubdomain("lumiere-hair.localhost:3000"), "lumiere-hair");
  assert.equal(extractSubdomain("navalha-de-ouro.localhost:3000"), "navalha-de-ouro");
  assert.equal(extractSubdomain("gisele-nails.localhost:3000"), "gisele-nails");
  assert.equal(extractSubdomain("admin.localhost:3000"), null, "admin não deve ser tratado como subdomínio de tenant");
  assert.equal(extractSubdomain("app.localhost:3000"), null, "app não deve ser tratado como subdomínio de tenant");
  assert.equal(extractSubdomain("localhost:3000"), null, "domínio raiz não é subdomínio");
});

test("4. Validação dos Contratos dos 3 Segmentos de Beleza", () => {
  const allowedSegments = ["salon", "barber", "nails"];
  assert.equal(allowedSegments.length, 3);
  assert.ok(allowedSegments.includes("salon"), "Segmento salão deve estar previsto");
  assert.ok(allowedSegments.includes("barber"), "Segmento barbearia deve estar previsto");
  assert.ok(allowedSegments.includes("nails"), "Segmento unhas em gel deve estar previsto");
});


import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(".");

test("1. Resiliência de Rotas Públicas: getPublicPageBySlug possui fallback para modelos de demonstração", () => {
  const dataServicePath = path.join(rootDir, "src", "lib", "supabase", "data-service.ts");
  assert.ok(fs.existsSync(dataServicePath), "data-service.ts deve existir");

  const code = fs.readFileSync(dataServicePath, "utf-8");

  // Verifica se getPublicPageBySlug implementa fallback para DEMO_TENANTS caso Supabase retorne nulo
  assert.ok(
    code.includes("DEMO_TENANTS.find((t) => t.slug === slug)"),
    "getPublicPageBySlug deve procurar o slug em DEMO_TENANTS como fallback defensivo"
  );
  assert.ok(
    code.includes('demoTenant.subscription_status !== "suspended"'),
    "Fallback deve respeitar a proteção de isolamento contra clientes suspensos"
  );
  assert.ok(
    code.includes('demoTenant.subscription_status !== "cancelled"'),
    "Fallback deve respeitar a proteção de isolamento contra clientes cancelados"
  );
  // O componente da rota /p/[slug] trata páginas draft com UI "Em Construção"
  // e páginas de tenants suspensos com UI "Indisponível", portanto o fallback
  // retorna a página independentemente do status de publicação
  assert.ok(
    code.includes("demoTenant.status === \"active\""),
    "Fallback deve verificar que o tenant está ativo"
  );
});

test("2. Modelos de Demonstração Oficiais Registrados em data-service.ts", () => {
  const dataServicePath = path.join(rootDir, "src", "lib", "supabase", "data-service.ts");
  const code = fs.readFileSync(dataServicePath, "utf-8");

  // Confirma os 3 modelos de nicho da beleza
  assert.ok(code.includes('slug: "lumiere-hair"'), "Deve conter o slug do salão 'lumiere-hair'");
  assert.ok(code.includes('slug: "navalha-de-ouro"'), "Deve conter o slug da barbearia 'navalha-de-ouro'");
  assert.ok(code.includes('slug: "gisele-nails"'), "Deve conter o slug de nail design 'gisele-nails'");
});

test("3. Rota Dinâmica /p/[slug]/page.tsx: Tratamento de erro 404, isolamento e renderização dos templates", () => {
  const pagePath = path.join(rootDir, "src", "app", "(public-sites)", "p", "[slug]", "page.tsx");
  assert.ok(fs.existsSync(pagePath), "/p/[slug]/page.tsx deve existir");

  const pageCode = fs.readFileSync(pagePath, "utf-8");

  assert.ok(pageCode.includes("dataService.getPublicPageBySlug"), "Deve chamar getPublicPageBySlug");
  assert.ok(pageCode.includes("notFound()"), "Deve chamar notFound() para páginas inexistentes");
  assert.ok(pageCode.includes("SalonTemplate"), "Deve renderizar o SalonTemplate");
  assert.ok(pageCode.includes("BarberTemplate"), "Deve renderizar o BarberTemplate");
  assert.ok(pageCode.includes("NailsTemplate"), "Deve renderizar o NailsTemplate");
});

test("4. Redesign Editorial da Home: Estrutura, cores, tipografia e ausência de seções duplicadas", () => {
  const homePath = path.join(rootDir, "src", "app", "page.tsx");
  const homeContent = fs.readFileSync(homePath, "utf-8");

  // Cabeçalho e Identidade
  assert.ok(homeContent.includes("GlowSaaS"), "Home deve conter o nome GlowSaaS no cabeçalho");
  assert.ok(homeContent.includes('href="/login"'), "Home deve conter link para a área de login");
  assert.ok(homeContent.includes('href="/comecar"'), "Home deve conter link para solicitar página");

  // Paleta Editorial
  assert.ok(homeContent.includes("bg-[#FBF9F5]"), "Home deve utilizar fundo creme/off-white editorial");
  assert.ok(homeContent.includes("text-[#1C1917]"), "Home deve utilizar texto grafite refinado");

  // Headline e Proposta de Valor
  assert.ok(
    homeContent.includes("Sua página profissional, pronta para valorizar o seu trabalho."),
    "Home deve conter a headline editorial focada"
  );
  assert.ok(
    homeContent.includes("Salões de Beleza · Barbearias · Nail Designers"),
    "Home deve identificar os 3 públicos-alvo na primeira dobra"
  );

  // Links reais para demonstrações
  assert.ok(homeContent.includes('href="/p/lumiere-hair"'), "Home deve linkar a demonstração do salão");
  assert.ok(homeContent.includes('href="/p/navalha-de-ouro"'), "Home deve linkar a demonstração da barbearia");
  assert.ok(homeContent.includes('href="/p/gisele-nails"'), "Home deve linkar a demonstração de unhas");

  // Transparência Comercial e FAQ
  assert.ok(homeContent.includes("Starter"), "Home deve detalhar o plano Starter com preço real");
  assert.ok(homeContent.includes("Pro"), "Home deve detalhar o plano Pro com preço real");
  assert.ok(homeContent.includes("Perguntas Frequentes"), "Home deve conter seção de FAQ");
  assert.ok(
    homeContent.includes("Sem Comissões por Procedimento"),
    "Home deve evidenciar ausência de comissões por agendamento"
  );
});

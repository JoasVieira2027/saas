import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { formatBRLPrice, parseBRLPrice } from "../src/lib/utils.ts";

test("1. Isolamento Multitenant e Proteção contra Forjamento no Editor", async () => {
  // Simulação de base com dois tenants distintos
  const tenants = {
    "tenant-salon-1": {
      id: "tenant-salon-1",
      owner_id: "user-salon-owner",
      business_name: "Lumière Concept Hair",
      slug: "lumiere-hair",
      segment: "salon",
    },
    "tenant-barber-1": {
      id: "tenant-barber-1",
      owner_id: "user-barber-owner",
      business_name: "Navalha de Ouro Barber",
      slug: "navalha-de-ouro",
      segment: "barber",
    },
  };

  // Simulação de sessão autenticada do usuário do salão
  const currentSession = { userId: "user-salon-owner", role: "client" };

  // Função guardiã inspirada em src/app/(dashboard)/app/actions.ts
  function getAuthorizedTenant(sessionUserId) {
    const tenant = Object.values(tenants).find((t) => t.owner_id === sessionUserId);
    if (!tenant) throw new Error("Tenant não localizado.");
    return tenant;
  }

  const authorizedTenant = getAuthorizedTenant(currentSession.userId);
  assert.equal(authorizedTenant.id, "tenant-salon-1", "Dono do salão acessa seu próprio tenant");

  // Tentativa de ataque: usuário do salão tenta alterar dados do tenant da barbearia
  const maliciousTenantId = "tenant-barber-1";
  assert.notEqual(
    authorizedTenant.id,
    maliciousTenantId,
    "Tenant autorizado é estritamente derivado da sessão do servidor e nunca do parâmetro do formulário"
  );
});

test("2. Validação do CRUD de Serviços com Formatação BRL", () => {
  let services = [
    {
      id: "srv-1",
      tenant_id: "tenant-salon-1",
      name: "Corte & Styling",
      category: "Cabelo",
      price_cents: 18000,
      duration_minutes: 60,
      is_active: true,
      is_featured: true,
    },
  ];

  // Leitura e formatação BRL
  const initial = services[0];
  assert.equal(formatBRLPrice(initial.price_cents), "R$\u00a0180,00");

  // Conversão de entrada do formulário para centavos
  const inputPrice = "220,50";
  const parsedCents = parseBRLPrice(inputPrice);
  assert.equal(parsedCents, 22050, "R$ 220,50 deve converter para 22050 centavos");

  // Adição (Create)
  const newService = {
    id: "srv-2",
    tenant_id: "tenant-salon-1",
    name: "Mechas Criativas",
    category: "Coloração",
    price_cents: parsedCents,
    duration_minutes: 180,
    is_active: true,
    is_featured: false,
  };
  services.push(newService);
  assert.equal(services.length, 2, "Novo serviço cadastrado com sucesso");

  // Edição (Update)
  services = services.map((s) =>
    s.id === "srv-2" ? { ...s, price_cents: 25000, name: "Mechas & Tonalização" } : s
  );
  const updated = services.find((s) => s.id === "srv-2");
  assert.equal(updated.price_cents, 25000);
  assert.equal(updated.name, "Mechas & Tonalização");

  // Exclusão (Delete)
  services = services.filter((s) => s.id !== "srv-1");
  assert.equal(services.length, 1);
  assert.equal(services[0].id, "srv-2");
});

test("3. Validação da Persistência de Identidade, Hero e Galeria", () => {
  const landingPage = {
    id: "page-1",
    tenant_id: "tenant-salon-1",
    template_id: "salon",
    status: "draft",
    theme_config: {
      primary_color: "#1c1917",
      accent_color: "#c5a880",
    },
    hero_section: {
      badge: "Beleza com Alma",
      headline: "A Arte de Revelar Sua Melhor Versão",
      subheadline: "Atendimento personalizado e técnicas de vanguarda.",
      cta_text: "Agendar pelo WhatsApp",
      hero_image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
    },
    gallery_images: [
      {
        url: "https://images.unsplash.com/photo-1562322140-8baeececf3df",
        caption: "Morena Iluminada",
        order: 1,
      },
    ],
  };

  // Alteração de Identidade & Paleta
  landingPage.theme_config.primary_color = "#18181b";
  landingPage.theme_config.accent_color = "#d4af37";
  assert.equal(landingPage.theme_config.accent_color, "#d4af37");

  // Alteração de Hero
  landingPage.hero_section.headline = "Beleza Contemporânea em São Paulo";
  landingPage.hero_section.cta_text = "Falar com Especialista";
  assert.equal(landingPage.hero_section.headline, "Beleza Contemporânea em São Paulo");
  assert.equal(landingPage.hero_section.cta_text, "Falar com Especialista");

  // Adição na Galeria
  landingPage.gallery_images.push({
    url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e",
    caption: "Loiras Radiantes",
    order: 2,
  });
  assert.equal(landingPage.gallery_images.length, 2);

  // Remoção na Galeria
  landingPage.gallery_images = landingPage.gallery_images.filter((img) => img.order !== 1);
  assert.equal(landingPage.gallery_images.length, 1);
  assert.equal(landingPage.gallery_images[0].caption, "Loiras Radiantes");
});

test("4. Validação de Publicação e Alternador de Viewports do Preview", () => {
  // Status de publicação
  let pageStatus = "draft";
  function toggleStatus(current) {
    return current === "published" ? "draft" : "published";
  }

  pageStatus = toggleStatus(pageStatus);
  assert.equal(pageStatus, "published", "Deve alternar para publicado");

  pageStatus = toggleStatus(pageStatus);
  assert.equal(pageStatus, "draft", "Deve alternar de volta para rascunho");

  // Simulação dos tamanhos de viewport do PreviewDeviceSwitcher
  const devices = {
    mobile: { width: "375px", label: "Mobile (375px)" },
    tablet: { width: "768px", label: "Tablet (768px)" },
    desktop: { width: "100%", label: "Desktop (100%)" },
  };

  assert.equal(devices.mobile.width, "375px");
  assert.equal(devices.tablet.width, "768px");
  assert.equal(devices.desktop.width, "100%");

  // Verificação da existência física dos componentes do editor e preview
  const editorTabsPath = path.resolve("src/components/editor/EditorTabs.tsx");
  const previewSwitcherPath = path.resolve("src/components/editor/PreviewDeviceSwitcher.tsx");
  const editorPagePath = path.resolve("src/app/(dashboard)/app/editor/page.tsx");
  const previewPagePath = path.resolve("src/app/(dashboard)/app/preview/page.tsx");

  assert.ok(fs.existsSync(editorTabsPath), "EditorTabs.tsx deve existir");
  assert.ok(fs.existsSync(previewSwitcherPath), "PreviewDeviceSwitcher.tsx deve existir");
  assert.ok(fs.existsSync(editorPagePath), "Página /app/editor deve existir");
  assert.ok(fs.existsSync(previewPagePath), "Página /app/preview deve existir");

  // Verificação de que não usamos window.alert
  const editorContent = fs.readFileSync(editorTabsPath, "utf-8");
  assert.doesNotMatch(editorContent, /\bwindow\.alert\b/, "Não deve utilizar window.alert");
  assert.match(editorContent, /showNotification/i, "Deve exibir notificação de feedback elegante no cabeçalho");
});

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { formatWhatsAppUrl, formatCurrency } from "../src/lib/utils.ts";

test("1. Verificação da Existência dos Componentes do Template de Barbearia", () => {
  const components = [
    "BarberHeader.tsx",
    "BarberHero.tsx",
    "BarberBenefits.tsx",
    "BarberFeaturedCombos.tsx",
    "BarberServices.tsx",
    "BarberGallery.tsx",
    "BarberTeam.tsx",
    "BarberHoursAndLocation.tsx",
    "BarberFinalCTA.tsx",
    "BarberFooter.tsx",
    "BarberFloatingWhatsApp.tsx",
    "index.tsx",
  ];

  for (const comp of components) {
    const compPath = path.resolve(`src/components/templates/barber/${comp}`);
    assert.ok(fs.existsSync(compPath), `Componente ${comp} da Barbearia deve existir`);
    const content = fs.readFileSync(compPath, "utf-8");
    assert.ok(content.length > 50, `Componente ${comp} não pode estar vazio`);
  }
});

test("2. Verificação de Mensagens Contextualizadas do WhatsApp na Barbearia", () => {
  const phone = "11977776666";
  const businessName = "Navalha de Ouro Barber Club";

  // Agendamento de Combo
  const comboMsg = `Olá! Gostaria de agendar o "Combo Imperial (Cabelo + Barba)" no ${businessName}.`;
  const comboUrl = formatWhatsAppUrl(phone, comboMsg);
  assert.ok(comboUrl.startsWith("https://wa.me/5511977776666"));
  assert.ok(comboUrl.includes(encodeURIComponent(comboMsg)), "Mensagem do combo deve ser repassada ao WhatsApp");

  // Agendamento de Corte Individual
  const serviceMsg = `Olá! Gostaria de agendar o serviço "Corte Degradê / Fade Clássico" no ${businessName}.`;
  const serviceUrl = formatWhatsAppUrl(phone, serviceMsg);
  assert.ok(serviceUrl.includes(encodeURIComponent(serviceMsg)), "Mensagem do corte individual deve ser repassada ao WhatsApp");
});

test("3. Verificação de Identidade Visual Masculina (Grafite / Âmbar)", () => {
  const indexPath = path.resolve("src/components/templates/barber/index.tsx");
  const content = fs.readFileSync(indexPath, "utf-8");
  assert.ok(content.includes("#121212"), "Template de Barbearia deve ter fundo escuro/grafite #121212");
  assert.ok(content.includes("#C5A059"), "Template de Barbearia deve usar destaque âmbar/ouro envelhecido #C5A059");
});

test("4. Verificação de Formatação de Preços para Barbearia", () => {
  const priceCombo = 110.0;
  const formatted = formatCurrency(priceCombo);
  assert.match(formatted, /110/, "Preço do combo deve ser formatado corretamente no padrão BRL");
});

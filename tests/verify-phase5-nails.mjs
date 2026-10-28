import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { formatWhatsAppUrl, formatCurrency } from "../src/lib/utils.ts";

test("1. Verificação da Existência dos Componentes do Template de Unhas em Gel", () => {
  const components = [
    "NailsHeader.tsx",
    "NailsHero.tsx",
    "NailsServices.tsx",
    "NailsGallery.tsx",
    "NailsBenefits.tsx",
    "NailsAbout.tsx",
    "NailsHoursAndLocation.tsx",
    "NailsFinalCTA.tsx",
    "NailsFooter.tsx",
    "NailsFloatingWhatsApp.tsx",
    "index.tsx",
  ];

  for (const comp of components) {
    const compPath = path.resolve(`src/components/templates/nails/${comp}`);
    assert.ok(fs.existsSync(compPath), `Componente ${comp} de Unhas em Gel deve existir`);
    const content = fs.readFileSync(compPath, "utf-8");
    assert.ok(content.length > 50, `Componente ${comp} não pode estar vazio`);
  }
});

test("2. Verificação de Mensagens Contextualizadas do WhatsApp para Unhas em Gel", () => {
  const phone = "11966665555";
  const businessName = "Studio Gisele Nail Art & Gel";

  // Agendamento Geral
  const generalMsg = `Oi! Gostaria de agendar aplicação de unhas em gel no ${businessName}.`;
  const generalUrl = formatWhatsAppUrl(phone, generalMsg);
  assert.ok(generalUrl.startsWith("https://wa.me/5511966665555"));
  assert.ok(generalUrl.includes(encodeURIComponent(generalMsg)), "Mensagem geral deve estar codificada na URL");

  // Agendamento de Procedimento Específico
  const serviceMsg = `Olá! Gostaria de agendar o procedimento "Alongamento em Gel Moldado" no ${businessName}.`;
  const serviceUrl = formatWhatsAppUrl(phone, serviceMsg);
  assert.ok(serviceUrl.includes(encodeURIComponent(serviceMsg)), "Mensagem do procedimento deve estar codificada na URL");
});

test("3. Verificação da Identidade Visual Delicada e Feminina (Rosé / Off-White)", () => {
  const indexPath = path.resolve("src/components/templates/nails/index.tsx");
  const content = fs.readFileSync(indexPath, "utf-8");
  assert.ok(content.includes("#FCFAF9"), "Template de Unhas deve utilizar fundo off-white minimalista #FCFAF9");
  assert.ok(content.includes("#F5DDD7"), "Template de Unhas deve utilizar seleção suave nude/rosé #F5DDD7");
});

test("4. Verificação de Formatação de Preços para Procedimentos de Unhas", () => {
  const price = 190.0;
  const formatted = formatCurrency(price);
  assert.match(formatted, /190/, "Preço de alongamento deve ser formatado corretamente no padrão BRL");
});

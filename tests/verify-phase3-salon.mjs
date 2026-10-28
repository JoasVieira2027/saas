import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { formatWhatsAppUrl, formatCurrency } from "../src/lib/utils.ts";

test("1. Verificação da Existência dos Componentes do Template de Salão", () => {
  const components = [
    "SalonHeader.tsx",
    "SalonHero.tsx",
    "SalonBenefits.tsx",
    "SalonServices.tsx",
    "SalonGallery.tsx",
    "SalonAbout.tsx",
    "SalonHoursAndLocation.tsx",
    "SalonFinalCTA.tsx",
    "SalonFooter.tsx",
    "SalonFloatingWhatsApp.tsx",
    "index.tsx",
  ];

  for (const comp of components) {
    const compPath = path.resolve(`src/components/templates/salon/${comp}`);
    assert.ok(fs.existsSync(compPath), `Componente ${comp} deve existir`);
    const content = fs.readFileSync(compPath, "utf-8");
    assert.ok(content.length > 50, `Componente ${comp} não pode estar vazio`);
  }
});

test("2. Verificação de Mensagens Contextualizadas do WhatsApp", () => {
  const phone = "11988887777";
  const generalMsg = "Olá! Gostaria de agendar um horário no Lumière Concept Hair.";
  const url1 = formatWhatsAppUrl(phone, generalMsg);

  assert.ok(url1.startsWith("https://wa.me/5511988887777"), "URL deve conter código do país 55 e telefone correto");
  assert.ok(url1.includes(encodeURIComponent(generalMsg)), "Mensagem geral deve estar codificada na URL");

  const serviceMsg = 'Olá! Gostaria de agendar o procedimento "Mechas Criativas & Iluminação" no Lumière Concept Hair.';
  const url2 = formatWhatsAppUrl(phone, serviceMsg);
  assert.ok(url2.includes(encodeURIComponent(serviceMsg)), "Mensagem específica do procedimento deve estar codificada");
});

test("3. Formatação Monetária e Dados de Exibição", () => {
  const price = 480.0;
  const formatted = formatCurrency(price);
  assert.match(formatted, /480/, "Preço deve ser formatado corretamente no padrão BRL");
});

test("4. Prevenção de Zoom no iPhone / Safari iOS", () => {
  const cssPath = path.resolve("src/app/globals.css");
  const css = fs.readFileSync(cssPath, "utf-8");
  assert.match(css, /16px !important/, "Inputs devem ter font-size de 16px no mobile para prevenir zoom no iOS");
});


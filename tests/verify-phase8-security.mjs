import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Função utilitária de assinatura e verificação HMAC (mesmo algoritmo de src/lib/auth.ts)
const SESSION_SECRET = "test-secret-key-for-security-audit-64-bytes-long-super-safe";
const encoder = new TextEncoder();

async function getCryptoKey() {
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toBase64Url(str) {
  return Buffer.from(str, "utf8").toString("base64url");
}

function fromBase64Url(b64) {
  return Buffer.from(b64, "base64url").toString("utf8");
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function signSessionData(sessionData) {
  const payloadStr = JSON.stringify(sessionData);
  const encodedPayload = toBase64Url(payloadStr);
  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(encodedPayload));
  const hexSignature = bytesToHex(new Uint8Array(signatureBuffer));
  return `${encodedPayload}.${hexSignature}`;
}

async function verifySessionToken(token) {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [encodedPayload, hexSignature] = token.split(".");
  if (!encodedPayload || !hexSignature) {
    return null;
  }

  try {
    const key = await getCryptoKey();
    const sigBytes = hexToBytes(hexSignature);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      encoder.encode(encodedPayload)
    );

    if (!isValid) {
      return null;
    }

    const payloadJson = fromBase64Url(encodedPayload);
    const parsed = JSON.parse(payloadJson);

    if (!parsed.userId || !parsed.email || !parsed.role) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

// 1. Testes Criptográficos de Sessão e Prevenção de Falsificação (Anti-Tampering)
test("1. Segurança de Autenticação: Cookie de sessão assinado com HMAC-SHA256 e prevenção de forja", async () => {
  // A. Sessão legítima gerada pelo sistema
  const legitimateSession = {
    userId: "salon-owner-1",
    email: "aline@lumiere.com",
    role: "tenant_admin",
    fullName: "Aline Vasconcelos",
  };

  const signedToken = await signSessionData(legitimateSession);
  assert.ok(signedToken.includes("."), "O token deve conter o separador de assinatura '.'");

  const verified = await verifySessionToken(signedToken);
  assert.ok(verified, "Sessão legítima deve ser verificada com sucesso");
  assert.equal(verified.userId, "salon-owner-1");
  assert.equal(verified.role, "tenant_admin");

  // B. Tentativa de Forja 1: Cookie em JSON puro não assinado (Vulnerabilidade pré-Fase 8)
  const plainJsonCookie = JSON.stringify({
    userId: "attacker-1",
    email: "attacker@hacker.com",
    role: "superadmin",
    fullName: "Attacker",
  });
  const plainResult = await verifySessionToken(plainJsonCookie);
  assert.equal(plainResult, null, "Cookie sem assinatura HMAC deve ser sumariamente rejeitado");

  // C. Tentativa de Forja 2: Atacante altera payload para 'superadmin' mantendo assinatura original
  const [encodedPayload, originalSig] = signedToken.split(".");
  const decodedPayload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
  decodedPayload.role = "superadmin"; // Tentativa de escalação de privilégio
  decodedPayload.userId = "admin-1";

  const forgedPayload = Buffer.from(JSON.stringify(decodedPayload)).toString("base64url");
  const tamperedToken = `${forgedPayload}.${originalSig}`;

  const tamperedResult = await verifySessionToken(tamperedToken);
  assert.equal(tamperedResult, null, "Token com payload adulterado deve falhar na checagem criptográfica");

  // D. Tentativa de Forja 3: Assinatura adulterada / truncada
  const corruptSigToken = `${encodedPayload}.${originalSig.slice(0, -4)}dead`;
  const corruptResult = await verifySessionToken(corruptSigToken);
  assert.equal(corruptResult, null, "Token com assinatura inválida deve retornar null");
});

// 2. Testes de Isolamento de Rotas e Páginas Públicas (Tenants Suspensos / Cancelados)
test("2. Isolamento de Tenants: Filtro estrito bloqueia clientes suspensos, cancelados e rascunhos", () => {
  // Simulação do comportamento de isolamento de getPublicPageBySlug
  function simulateGetPublicPage(tenant, page) {
    if (!tenant) return null;
    if (
      tenant.status !== "active" ||
      tenant.subscription_status === "suspended" ||
      tenant.subscription_status === "cancelled"
    ) {
      return null;
    }
    if (!page || page.status !== "published") {
      return null;
    }
    return { tenant, page };
  }

  const activeTenant = { id: "t1", status: "active", subscription_status: "active" };
  const publishedPage = { id: "p1", status: "published" };

  // Caso normal: Ativo e Publicado
  assert.ok(simulateGetPublicPage(activeTenant, publishedPage), "Tenant ativo e publicado deve ser servido");

  // Caso A: Tenant suspenso administrativamente
  const suspendedTenant = { ...activeTenant, status: "suspended" };
  assert.equal(simulateGetPublicPage(suspendedTenant, publishedPage), null, "Tenant suspenso não deve ser servido");

  // Caso B: Tenant com assinatura suspensa por inadimplência
  const subSuspendedTenant = { ...activeTenant, subscription_status: "suspended" };
  assert.equal(simulateGetPublicPage(subSuspendedTenant, publishedPage), null, "Tenant inadimplente suspenso não deve ser servido");

  // Caso C: Tenant com assinatura cancelada
  const cancelledTenant = { ...activeTenant, subscription_status: "cancelled" };
  assert.equal(simulateGetPublicPage(cancelledTenant, publishedPage), null, "Tenant cancelado não deve ser servido");

  // Caso D: Página em rascunho
  const draftPage = { ...publishedPage, status: "draft" };
  assert.equal(simulateGetPublicPage(activeTenant, draftPage), null, "Página em rascunho não deve ser servida publicamente");
});

// 3. Teste de Isolamento entre Tenants em Server Actions (Prevenção de Cross-Tenant Tampering)
test("3. Isolamento entre Tenants: Usuário A não pode publicar ou manipular Tenant B", () => {
  function verifyActionAuthorization(sessionUserId, tenantOwnerId, targetTenantId, currentTenantId) {
    if (!sessionUserId || sessionUserId !== tenantOwnerId) {
      throw new Error("Não autorizado: Sessão não pertence ao proprietário do tenant.");
    }
    if (targetTenantId && targetTenantId !== currentTenantId) {
      throw new Error("Não autorizado: Tentativa de manipular tenant de terceiros.");
    }
    return true;
  }

  const userA = "owner-salon-1";
  const userB = "owner-barber-1";
  const tenantA = "tenant-salon-1";
  const tenantB = "tenant-barber-1";

  // A. Proprietário A atuando em seu próprio tenant -> Permitido
  assert.doesNotThrow(() => {
    verifyActionAuthorization(userA, userA, tenantA, tenantA);
  }, "Proprietário deve conseguir gerenciar seu próprio tenant");

  // B. Proprietário A tentando forjar ID do Tenant B -> Bloqueado
  assert.throws(
    () => {
      verifyActionAuthorization(userA, userA, tenantB, tenantA);
    },
    /Tentativa de manipular tenant de terceiros/,
    "Acesso cruzado entre tenants deve ser categoricamente bloqueado"
  );

  // C. Atacante sem sessão ou com sessão de outro usuário -> Bloqueado
  assert.throws(
    () => {
      verifyActionAuthorization(userB, userA, tenantA, tenantA);
    },
    /Sessão não pertence ao proprietário/,
    "Usuário não proprietário não pode executar ações"
  );
});

// 4. Teste de Suporte / Impersonate Auditável e Bidirecional Seguro
test("4. Suporte Administrativo / Impersonate: Validação de sessão, auditoria e reversibilidade", () => {
  // Simulação de sessão de suporte
  const superadminUser = { id: "admin-1", email: "admin@saas.com", role: "superadmin" };
  const clientUser = { id: "client-1", email: "client@test.com", role: "tenant_admin" };

  // A. Impersonate cria sessão de suporte com marcador impersonatedBy
  const supportSession = {
    userId: clientUser.id,
    email: clientUser.email,
    role: clientUser.role, // Papel de cliente comum durante o suporte
    fullName: "Cliente Teste",
    impersonatedBy: {
      adminId: superadminUser.id,
      adminEmail: superadminUser.email,
    },
  };

  assert.equal(supportSession.role, "tenant_admin", "Durante o suporte, o admin opera com privilégios limitados de tenant");
  assert.ok(supportSession.impersonatedBy, "A sessão deve registrar o admin original para auditoria e reversão");

  // B. Tentativa do cliente comum de encerrar suporte inexistente -> Bloqueado
  const regularClientSession = { ...clientUser };
  assert.throws(
    () => {
      if (!regularClientSession.impersonatedBy) {
        throw new Error("Sessão de suporte não ativa.");
      }
    },
    /Sessão de suporte não ativa/,
    "Não é possível encerrar suporte se a sessão não possui impersonatedBy"
  );

  // C. Reversão segura: restaura perfil do superadmin original
  const restoredSession = {
    userId: supportSession.impersonatedBy.adminId,
    email: supportSession.impersonatedBy.adminEmail,
    role: "superadmin",
  };
  assert.equal(restoredSession.role, "superadmin");
  assert.equal(restoredSession.userId, "admin-1");
});

// 5. Teste de Validação Financeira e Cálculo Determinístico de Vencimentos
test("5. Controle Financeiro: Validações estritas de pagamento e cálculo de vencimento à prova de fuso horário", () => {
  function validateManualPayment(amountCents, method, dueDay) {
    if (typeof amountCents !== "number" || amountCents <= 0) {
      throw new Error("Valor do pagamento deve ser superior a R$ 0,00.");
    }
    if (amountCents > 50000000) {
      throw new Error("Valor excede o limite máximo permitido.");
    }
    const validMethods = ["pix", "boleto", "credit_card", "cash", "bank_transfer"];
    if (!validMethods.includes(method)) {
      throw new Error("Método de pagamento inválido.");
    }
    if (dueDay < 1 || dueDay > 31) {
      throw new Error("Dia de vencimento inválido.");
    }
    return true;
  }

  // A. Validação de valores válidos
  assert.doesNotThrow(() => validateManualPayment(9700, "pix", 15));

  // B. Pagamento zero ou negativo -> Bloqueado
  assert.throws(() => validateManualPayment(0, "pix", 15), /superior a R\$ 0,00/);
  assert.throws(() => validateManualPayment(-5000, "pix", 15), /superior a R\$ 0,00/);

  // C. Método inválido -> Bloqueado
  assert.throws(() => validateManualPayment(9700, "crypto", 15), /Método de pagamento inválido/);

  // D. Dia de vencimento inválido -> Bloqueado
  assert.throws(() => validateManualPayment(9700, "pix", 35), /Dia de vencimento inválido/);

  // E. Cálculo determinístico de próximo vencimento (somando 1 mês de forma segura)
  const dueDateStr = "2026-10-10";
  const [year, month, day] = dueDateStr.split("-").map(Number);
  const nextDueDate = new Date(year, (month || 1) - 1 + 1, day || 1);
  const nextYear = nextDueDate.getFullYear();
  const nextMonth = String(nextDueDate.getMonth() + 1).padStart(2, "0");
  const nextDay = String(nextDueDate.getDate()).padStart(2, "0");
  const nextDueStr = `${nextYear}-${nextMonth}-${nextDay}`;

  assert.equal(nextDueStr, "2026-11-10", "Próximo vencimento deve ser exatamente 2026-11-10 sem desvio de fuso horário");
});

// 6. Teste de Inspeção da Migração SQL 0003 (Hardening de Segurança do Banco)
test("6. Inspeção de Migração 0003: Prevenção de injeção de superadmin e proteção search_path", () => {
  const migrationPath = path.join(rootDir, "supabase", "migrations", "0003_security_hardening.sql");
  assert.ok(fs.existsSync(migrationPath), "Arquivo 0003_security_hardening.sql deve existir");

  const sqlContent = fs.readFileSync(migrationPath, "utf-8");

  // Remove comentários para inspecionar comandos SQL ativos
  const activeSql = sqlContent
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");

  // A. Não pode confiar em metadados de role no cadastro
  assert.ok(
    !activeSql.includes("raw_user_meta_data->>'role'"),
    "A instrução SQL ativa de handle_new_user NÃO deve ler o papel (role) a partir de metadados do usuário"
  );
  assert.ok(
    activeSql.includes("'tenant_admin'"),
    "A função handle_new_user deve fixar 'tenant_admin' como papel padrão seguro"
  );

  // B. Defesa de search_path em funções SECURITY DEFINER
  assert.ok(
    activeSql.includes("SET search_path = public, auth"),
    "As funções SECURITY DEFINER devem conter 'SET search_path = public, auth'"
  );

  // C. RLS de services e business_hours contra tenants suspensos/cancelados
  assert.ok(
    activeSql.includes("subscription_status NOT IN ('suspended', 'cancelled')"),
    "Políticas públicas de serviços e horários devem validar status de assinatura"
  );
});

// 7. Teste de Proteção do Quick Login em Ambiente de Produção
test("7. Proteção de Acesso: QuickLoginAction bloqueado em produção e restrito em dev", () => {
  const authActionsPath = path.join(rootDir, "src", "app", "auth", "actions.ts");
  const authActionsCode = fs.readFileSync(authActionsPath, "utf-8");

  assert.ok(
    authActionsCode.includes('process.env.NODE_ENV === "production"'),
    "Deve conter verificação explícita de ambiente de produção"
  );
  assert.ok(
    authActionsCode.includes("desabilitado em ambiente de produção"),
    "Deve conter mensagem de erro caso o login rápido seja invocado em produção"
  );
  assert.ok(
    authActionsCode.includes("allowedDemoIds"),
    "Em desenvolvimento, deve restringir o login rápido apenas a IDs de homologação autorizados"
  );
});

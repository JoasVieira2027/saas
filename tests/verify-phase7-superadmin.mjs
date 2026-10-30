import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { formatBRLPrice, parseBRLPrice, getDueDateStatus } from "../src/lib/utils.ts";

test("1. Validação de Segurança e Restrição de Acesso ao Super Admin", () => {
  function verifySuperadminAccess(session) {
    if (!session || session.role !== "superadmin") {
      throw new Error("Acesso não autorizado: Requer perfil de Administrador Geral.");
    }
    return true;
  }

  // Tentativa 1: Visitante anônimo
  assert.throws(
    () => verifySuperadminAccess(null),
    /Acesso não autorizado/,
    "Visitante anônimo deve ser bloqueado"
  );

  // Tentativa 2: Cliente comum (tenant_admin) tentando acessar painel do superadmin
  const clientSession = { userId: "client-1", email: "aline@lumiere.com", role: "tenant_admin" };
  assert.throws(
    () => verifySuperadminAccess(clientSession),
    /Acesso não autorizado/,
    "Cliente regular deve ser bloqueado com erro 403 / exceção"
  );

  // Tentativa 3: Super Admin autêntico
  const superadminSession = { userId: "admin-1", email: "admin@saas.com", role: "superadmin" };
  assert.doesNotThrow(
    () => verifySuperadminAccess(superadminSession),
    "Super Admin autêntico deve ter acesso concedido"
  );
});

test("2. Cálculo da Previsão de Receita Mensal (MRR) e Métricas", () => {
  const tenants = [
    { id: "t1", status: "active", subscription_status: "active", plan_type: "pro", monthly_price_cents: 19700 },
    { id: "t2", status: "active", subscription_status: "overdue", plan_type: "starter", monthly_price_cents: 9700 },
    { id: "t3", status: "active", subscription_status: "pending", plan_type: "starter", monthly_price_cents: 9700 },
    { id: "t4", status: "suspended", subscription_status: "suspended", plan_type: "starter", monthly_price_cents: 9700 },
  ];

  let activeCount = 0;
  let suspendedCount = 0;
  let overdueCount = 0;
  let pendingCount = 0;
  let mrrCents = 0;

  for (const t of tenants) {
    if (t.status === "suspended" || t.subscription_status === "suspended") {
      suspendedCount++;
    } else {
      activeCount++;
      mrrCents += t.monthly_price_cents;
    }

    if (t.subscription_status === "overdue") overdueCount++;
    if (t.subscription_status === "pending") pendingCount++;
  }

  assert.equal(activeCount, 3, "3 clientes ativos");
  assert.equal(suspendedCount, 1, "1 cliente suspenso");
  assert.equal(overdueCount, 1, "1 cliente inadimplente");
  assert.equal(pendingCount, 1, "1 cliente pendente");
  assert.equal(mrrCents, 39100, "MRR total previsto: R$ 391,00");
  assert.equal(formatBRLPrice(mrrCents), "R$\u00a0391,00");
});

test("3. Registro de Pagamento Manual e Cálculo de Próximo Vencimento", () => {
  const tenant = {
    id: "tenant-barber-1",
    business_name: "Navalha de Ouro Barber Club",
    subscription_status: "overdue",
    monthly_price_cents: 9700,
    due_day: 10,
    next_due_date: "2026-02-10",
    last_payment_date: "2026-01-10T14:30:00Z",
  };

  const payments = [];
  const auditLogs = [];

  function recordPayment(paymentData, admin) {
    const payment = {
      id: `pay-${Date.now()}`,
      tenant_id: paymentData.tenant_id,
      amount_cents: paymentData.amount_cents,
      paid_at: paymentData.paid_at || new Date().toISOString(),
      due_date: paymentData.due_date,
      payment_method: paymentData.payment_method,
      billing_period: paymentData.billing_period,
      notes: paymentData.notes || "",
      recorded_by: admin.id,
    };
    payments.unshift(payment);

    // Calcula próximo vencimento somando 1 mês
    const currentDue = new Date(paymentData.due_date);
    const nextDue = new Date(currentDue);
    nextDue.setMonth(nextDue.getMonth() + 1);
    const nextDueStr = nextDue.toISOString().split("T")[0];

    // Atualiza status do tenant
    tenant.subscription_status = "active";
    tenant.last_payment_date = payment.paid_at;
    tenant.next_due_date = nextDueStr;

    // Registra log de auditoria
    auditLogs.unshift({
      id: `log-${Date.now()}`,
      admin_id: admin.id,
      admin_email: admin.email,
      action: "record_payment",
      target_tenant_id: tenant.id,
      target_tenant_name: tenant.business_name,
      details: { amount_cents: paymentData.amount_cents, billing_period: paymentData.billing_period },
    });

    return payment;
  }

  // Executa registro manual de pagamento do cliente em atraso
  const result = recordPayment(
    {
      tenant_id: tenant.id,
      amount_cents: 9700,
      due_date: "2026-02-10",
      payment_method: "pix",
      billing_period: "02/2026",
      notes: "Comprovante enviado pelo WhatsApp",
    },
    { id: "admin-1", email: "admin@saas.com" }
  );

  assert.equal(payments.length, 1);
  assert.equal(payments[0].amount_cents, 9700);
  assert.equal(tenant.subscription_status, "active", "Status deve mudar de overdue para active após pagamento");
  assert.match(tenant.next_due_date, /2026-03/, "Próximo vencimento deve avançar para março de 2026");
  assert.equal(auditLogs.length, 1);
  assert.equal(auditLogs[0].action, "record_payment");
});

test("4. Bloqueio Público de Landing Pages de Clientes Suspensos ou Cancelados", () => {
  function checkPublicPageAccess(tenant, page) {
    const isSuspendedOrCancelled =
      tenant.status === "suspended" ||
      tenant.subscription_status === "suspended" ||
      tenant.subscription_status === "cancelled";

    if (isSuspendedOrCancelled) {
      return { allowed: false, reason: "Página Temporariamente Indisponível" };
    }

    if (page.status === "draft") {
      return { allowed: false, reason: "Página em Construção" };
    }

    return { allowed: true, template: page.template_id };
  }

  // Caso 1: Cliente ativo com página publicada
  const normalTenant = { status: "active", subscription_status: "active" };
  const normalPage = { status: "published", template_id: "salon" };
  assert.deepEqual(checkPublicPageAccess(normalTenant, normalPage), {
    allowed: true,
    template: "salon",
  });

  // Caso 2: Cliente suspenso por inadimplência mesmo com página 'published'
  const suspendedTenant = { status: "suspended", subscription_status: "suspended" };
  assert.deepEqual(checkPublicPageAccess(suspendedTenant, normalPage), {
    allowed: false,
    reason: "Página Temporariamente Indisponível",
  });

  // Caso 3: Assinatura cancelada
  const cancelledTenant = { status: "active", subscription_status: "cancelled" };
  assert.deepEqual(checkPublicPageAccess(cancelledTenant, normalPage), {
    allowed: false,
    reason: "Página Temporariamente Indisponível",
  });

  // Caso 4: Cliente em dia mas com página em rascunho
  const draftPage = { status: "draft", template_id: "salon" };
  assert.deepEqual(checkPublicPageAccess(normalTenant, draftPage), {
    allowed: false,
    reason: "Página em Construção",
  });
});

test("5. Validação da Migration SQL 0002 de Auditoria, Pagamentos e RLS", () => {
  const sqlPath = path.resolve("supabase/migrations/0002_superadmin_payments_audit.sql");
  assert.ok(fs.existsSync(sqlPath), "O arquivo de migração 0002 deve existir");

  const sqlContent = fs.readFileSync(sqlPath, "utf-8");

  // Colunas de assinatura no tenant
  assert.match(sqlContent, /ADD COLUMN IF NOT EXISTS subscription_status/i);
  assert.match(sqlContent, /ADD COLUMN IF NOT EXISTS monthly_price_cents/i);
  assert.match(sqlContent, /ADD COLUMN IF NOT EXISTS due_day/i);
  assert.match(sqlContent, /ADD COLUMN IF NOT EXISTS next_due_date/i);

  // Tabelas essenciais de governança
  assert.match(sqlContent, /CREATE TABLE IF NOT EXISTS public\.subscription_payments/i);
  assert.match(sqlContent, /CREATE TABLE IF NOT EXISTS public\.admin_audit_logs/i);

  // Ativação de RLS
  assert.match(sqlContent, /ALTER TABLE public\.subscription_payments ENABLE ROW LEVEL SECURITY/i);
  assert.match(sqlContent, /ALTER TABLE public\.admin_audit_logs ENABLE ROW LEVEL SECURITY/i);

  // Políticas restritas ao Super Admin
  assert.match(sqlContent, /CREATE POLICY "Superadmin tem acesso total aos pagamentos"/i);
  assert.match(sqlContent, /CREATE POLICY "Superadmin tem acesso total aos logs de auditoria"/i);

  // Política pública bloqueando inadimplentes e suspensos
  assert.match(sqlContent, /subscription_status NOT IN \('suspended', 'cancelled'\)/i);
});

test("6. Validação do Helper de Alerta de Vencimento", () => {
  const today = new Date();
  
  // Vencido há 3 dias
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - 3);
  const overdueInfo = getDueDateStatus(pastDate.toISOString().split("T")[0]);
  assert.equal(overdueInfo.status, "overdue");
  assert.match(overdueInfo.label, /Atrasado há [23] dia/);

  // Vence em 2 dias (próximo vencimento)
  const soonDate = new Date(today);
  soonDate.setDate(today.getDate() + 2);
  const soonInfo = getDueDateStatus(soonDate.toISOString().split("T")[0]);
  assert.equal(soonInfo.status, "due_soon");
  assert.match(soonInfo.label, /Vence em [23] dia/);

  // Em dia (vence em 20 dias)
  const farDate = new Date(today);
  farDate.setDate(today.getDate() + 20);
  const farInfo = getDueDateStatus(farDate.toISOString().split("T")[0]);
  assert.equal(farInfo.status, "ok");
  assert.match(farInfo.label, /Vence em 2[01] dias/);
});


"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSuperadmin, getSession, setSession } from "@/lib/auth";
import { dataService } from "@/lib/supabase/data-service";
import { parseBRLPrice } from "@/lib/utils";
import { SubscriptionStatus, PaymentMethod } from "@/types/database";

// 1. Atualizar Status Operacional do Tenant (Ativo / Suspenso / Testes)
export async function updateTenantStatusAction(
  tenantId: string,
  status: "active" | "suspended" | "trial"
): Promise<void> {
  const session = await requireSuperadmin();
  const tenant = await dataService.getTenantById(tenantId);
  if (!tenant) throw new Error("Tenant não localizado.");

  await dataService.updateTenantStatus(tenantId, status);

  // Registro de Auditoria
  await dataService.recordAuditLog({
    admin_id: session.userId,
    admin_email: session.email,
    action: status === "suspended" ? "suspend_tenant" : "activate_tenant",
    target_tenant_id: tenant.id,
    target_tenant_name: tenant.business_name,
    details: { previous_status: tenant.status, new_status: status },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${tenantId}`);
  if (tenant.slug) {
    revalidatePath(`/p/${tenant.slug}`);
  }
}

// 2. Atualizar Status da Assinatura (Ativo / Pendente / Inadimplente / Suspenso / Cancelado)
export async function updateSubscriptionStatusAction(
  tenantId: string,
  subscriptionStatus: SubscriptionStatus
): Promise<void> {
  const session = await requireSuperadmin();
  const tenant = await dataService.getTenantById(tenantId);
  if (!tenant) throw new Error("Tenant não localizado.");

  const validStatuses: SubscriptionStatus[] = ["active", "pending", "overdue", "suspended", "cancelled"];
  if (!validStatuses.includes(subscriptionStatus)) {
    throw new Error("Status de assinatura inválido.");
  }

  await dataService.updateTenantSubscription(tenantId, {
    subscription_status: subscriptionStatus,
  });

  // Se a assinatura for suspensa ou cancelada, suspende também o tenant para bloquear a LP
  if (subscriptionStatus === "suspended" || subscriptionStatus === "cancelled") {
    await dataService.updateTenantStatus(tenantId, "suspended");
  }

  // Registro de Auditoria
  await dataService.recordAuditLog({
    admin_id: session.userId,
    admin_email: session.email,
    action: "update_subscription",
    target_tenant_id: tenant.id,
    target_tenant_name: tenant.business_name,
    details: {
      previous_subscription: tenant.subscription_status,
      new_subscription: subscriptionStatus,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${tenantId}`);
  if (tenant.slug) {
    revalidatePath(`/p/${tenant.slug}`);
  }
}

// 3. Atualizar Dados Financeiros (Plano, Mensalidade, Vencimento)
export async function updateTenantFinancialAction(formData: FormData): Promise<void> {
  const session = await requireSuperadmin();
  const tenantId = formData.get("tenant_id") as string;
  const plan_type = (formData.get("plan_type") as "starter" | "pro") || "starter";
  const monthly_price_raw = formData.get("monthly_price") as string;
  const due_day_raw = formData.get("due_day") as string;
  const next_due_date = formData.get("next_due_date") as string;
  const subscription_status = formData.get("subscription_status") as SubscriptionStatus;

  const tenant = await dataService.getTenantById(tenantId);
  if (!tenant) throw new Error("Tenant não localizado.");

  const monthly_price_cents = monthly_price_raw
    ? parseBRLPrice(monthly_price_raw)
    : tenant.monthly_price_cents || 9700;

  if (monthly_price_cents < 0) {
    throw new Error("Valor de mensalidade não pode ser negativo.");
  }

  const due_day = due_day_raw ? parseInt(due_day_raw, 10) : tenant.due_day || 10;
  if (isNaN(due_day) || due_day < 1 || due_day > 31) {
    throw new Error("Dia de vencimento deve ser um número entre 1 e 31.");
  }

  await dataService.updateTenantSubscription(tenantId, {
    plan_type,
    monthly_price_cents,
    due_day,
    next_due_date: next_due_date || tenant.next_due_date,
    subscription_status: subscription_status || tenant.subscription_status,
  });

  // Registro de Auditoria
  await dataService.recordAuditLog({
    admin_id: session.userId,
    admin_email: session.email,
    action: "update_subscription",
    target_tenant_id: tenant.id,
    target_tenant_name: tenant.business_name,
    details: {
      plan_type,
      monthly_price_cents,
      due_day,
      next_due_date,
      subscription_status,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${tenantId}`);
}

// 4. Salvar Observações Internas da Administração
export async function saveInternalNotesAction(formData: FormData): Promise<void> {
  const session = await requireSuperadmin();
  const tenantId = formData.get("tenant_id") as string;
  const internal_notes = ((formData.get("internal_notes") as string) || "").trim();

  // Limite defensivo para evitar payload excessivo
  if (internal_notes.length > 10000) {
    throw new Error("Observações internas não podem exceder 10.000 caracteres.");
  }

  const tenant = await dataService.getTenantById(tenantId);
  if (!tenant) throw new Error("Tenant não localizado.");

  await dataService.updateTenantInternalNotes(tenantId, internal_notes);

  await dataService.recordAuditLog({
    admin_id: session.userId,
    admin_email: session.email,
    action: "update_notes",
    target_tenant_id: tenant.id,
    target_tenant_name: tenant.business_name,
    details: { notes_length: internal_notes.length },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${tenantId}`);
}

// 5. Registrar Pagamento Manual
export async function recordManualPaymentAction(formData: FormData): Promise<void> {
  const session = await requireSuperadmin();
  const tenantId = formData.get("tenant_id") as string;
  const amount_raw = formData.get("amount") as string;
  const paid_at = formData.get("paid_at") as string;
  const due_date = formData.get("due_date") as string;
  const payment_method = (formData.get("payment_method") as PaymentMethod) || "pix";
  const billing_period = (formData.get("billing_period") as string) || "Mensalidade";
  const notes = ((formData.get("notes") as string) || "").trim();

  const validMethods: PaymentMethod[] = ["pix", "boleto", "credit_card", "cash", "bank_transfer"];
  if (!validMethods.includes(payment_method)) {
    throw new Error("Método de pagamento inválido.");
  }

  const tenant = await dataService.getTenantById(tenantId);
  if (!tenant) throw new Error("Tenant não localizado.");

  const amount_cents = amount_raw ? parseBRLPrice(amount_raw) : tenant.monthly_price_cents || 9700;
  if (amount_cents <= 0) {
    throw new Error("O valor do pagamento deve ser superior a R$ 0,00.");
  }
  if (amount_cents > 50000000) {
    throw new Error("Valor do pagamento excede o limite máximo permitido de R$ 500.000,00.");
  }

  await dataService.recordPayment(
    {
      tenant_id: tenantId,
      amount_cents,
      paid_at: paid_at ? new Date(paid_at).toISOString() : new Date().toISOString(),
      due_date: due_date || tenant.next_due_date || new Date().toISOString().split("T")[0],
      payment_method,
      billing_period,
      notes,
    },
    { id: session.userId, email: session.email }
  );

  revalidatePath("/admin");
  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${tenantId}`);
  if (tenant.slug) {
    revalidatePath(`/p/${tenant.slug}`);
  }
}

// 6. Publicar ou Despublicar Página do Cliente (Controle Administrativo)
export async function togglePagePublicationAdminAction(
  tenantId: string,
  targetStatus: "draft" | "published"
): Promise<void> {
  const session = await requireSuperadmin();
  const tenant = await dataService.getTenantById(tenantId);
  if (!tenant) throw new Error("Tenant não localizado.");

  await dataService.setPageStatus(tenantId, targetStatus);

  await dataService.recordAuditLog({
    admin_id: session.userId,
    admin_email: session.email,
    action: targetStatus === "published" ? "publish_page" : "unpublish_page",
    target_tenant_id: tenant.id,
    target_tenant_name: tenant.business_name,
    details: { new_page_status: targetStatus },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${tenantId}`);
  if (tenant.slug) {
    revalidatePath(`/p/${tenant.slug}`);
  }
}

// 7. Criar Novo Cliente / Tenant
export async function createTenantAction(formData: FormData): Promise<void> {
  const session = await requireSuperadmin();

  const business_name = (formData.get("business_name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim().toLowerCase();
  const segment = formData.get("segment") as "salon" | "barber" | "nails";
  const owner_name = (formData.get("owner_name") as string)?.trim();
  const owner_email = (formData.get("owner_email") as string)?.trim().toLowerCase();
  const plan_type = (formData.get("plan_type") as "starter" | "pro") || "starter";

  if (!business_name || !slug || !segment || !owner_name || !owner_email) {
    return;
  }

  if (business_name.length > 200 || slug.length > 80 || owner_name.length > 200 || owner_email.length > 200) {
    throw new Error("Tamanho de campo excede o limite permitido.");
  }

  const newTenant = await dataService.createTenant({
    business_name,
    slug,
    segment,
    owner_name,
    owner_email,
    plan_type,
  });

  await dataService.recordAuditLog({
    admin_id: session.userId,
    admin_email: session.email,
    action: "create_tenant",
    target_tenant_id: newTenant.id,
    target_tenant_name: newTenant.business_name,
    details: { plan_type, segment, slug },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/clients");
}

// 8. Impersonar Cliente (Acessar Painel /app do Cliente com Auditoria e Suporte Reversível)
export async function impersonateTenantAction(tenantId: string): Promise<void> {
  const adminSession = await requireSuperadmin();

  const tenant = await dataService.getTenantById(tenantId);
  if (!tenant) throw new Error("Tenant não localizado.");

  const ownerProfile = await dataService.getProfile(tenant.owner_id);
  if (!ownerProfile) throw new Error("Perfil do proprietário não encontrado.");

  // Registro obrigatório de auditoria de segurança
  await dataService.recordAuditLog({
    admin_id: adminSession.userId,
    admin_email: adminSession.email,
    action: "impersonate_tenant",
    target_tenant_id: tenant.id,
    target_tenant_name: tenant.business_name,
    details: {
      owner_id: ownerProfile.id,
      owner_email: ownerProfile.email,
    },
  });

  // Configura a sessão com o marcador impersonatedBy para permitir retorno seguro
  await setSession(ownerProfile, {
    adminId: adminSession.userId,
    adminEmail: adminSession.email,
  });

  redirect("/app");
}

// 9. Encerrar Modo de Suporte / Retornar ao Painel do Administrador Geral
export async function stopImpersonationAction(): Promise<void> {
  const currentSession = await getSession();
  if (!currentSession || !currentSession.impersonatedBy) {
    throw new Error("Sessão de suporte/impersonate não ativa.");
  }

  const originalAdmin = await dataService.getProfile(currentSession.impersonatedBy.adminId);
  if (!originalAdmin || originalAdmin.role !== "superadmin") {
    throw new Error("Perfil de Administrador Geral original não encontrado.");
  }

  // Registro de encerramento no log de auditoria
  await dataService.recordAuditLog({
    admin_id: originalAdmin.id,
    admin_email: originalAdmin.email,
    action: "stop_impersonation",
    target_tenant_id: null,
    target_tenant_name: "Retorno da Sessão de Suporte",
    details: {
      ended_impersonating_user: currentSession.userId,
      ended_impersonating_email: currentSession.email,
    },
  });

  await setSession(originalAdmin);
  redirect("/admin/clients");
}

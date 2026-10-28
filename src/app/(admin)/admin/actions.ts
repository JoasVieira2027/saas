"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSuperadmin, setSession } from "@/lib/auth";
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

  const due_day = due_day_raw ? parseInt(due_day_raw, 10) : tenant.due_day || 10;

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

  const tenant = await dataService.getTenantById(tenantId);
  if (!tenant) throw new Error("Tenant não localizado.");

  const amount_cents = amount_raw ? parseBRLPrice(amount_raw) : tenant.monthly_price_cents || 9700;

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

// 8. Impersonar Cliente (Acessar Painel /app do Cliente)
export async function impersonateTenantAction(tenantId: string): Promise<void> {
  await requireSuperadmin();

  const tenant = await dataService.getTenantById(tenantId);
  if (!tenant) throw new Error("Tenant não localizado.");

  const ownerProfile = await dataService.getProfile(tenant.owner_id);
  if (!ownerProfile) throw new Error("Perfil do proprietário não encontrado.");

  await setSession(ownerProfile);
  redirect("/app");
}

import { notFound } from "next/navigation";
import { requireSuperadmin } from "@/lib/auth";
import { dataService } from "@/lib/supabase/data-service";
import { ClientDetailsTabs } from "@/components/admin/ClientDetailsTabs";

export default async function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSuperadmin();
  const { id } = await params;

  const tenant = await dataService.getTenantById(id);
  if (!tenant) {
    notFound();
  }

  const owner = await dataService.getProfile(tenant.owner_id);
  const page = await dataService.getLandingPageByTenantId(tenant.id);
  const payments = await dataService.getPaymentsByTenant(tenant.id);
  const auditLogs = await dataService.getAuditLogs(tenant.id);

  return (
    <ClientDetailsTabs
      tenant={tenant}
      owner={owner}
      page={page}
      payments={payments}
      auditLogs={auditLogs}
    />
  );
}

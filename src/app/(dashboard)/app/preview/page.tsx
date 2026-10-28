import { notFound } from "next/navigation";
import { requireTenant } from "@/lib/auth";
import { dataService } from "@/lib/supabase/data-service";
import { PreviewDeviceSwitcher } from "@/components/editor/PreviewDeviceSwitcher";

export default async function PreviewPage() {
  const session = await requireTenant();
  const tenant = await dataService.getTenantByOwner(session.userId);

  if (!tenant) {
    notFound();
  }

  const page = await dataService.getLandingPageByTenantId(tenant.id);
  const services = await dataService.getServices(tenant.id);
  const businessHours = await dataService.getBusinessHours(tenant.id);

  if (!page) {
    notFound();
  }

  const data = {
    tenant,
    page,
    services,
    business_hours: businessHours,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
          Visualização Prévia (Preview)
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Veja como sua landing page é exibida em smartphones, tablets e computadores antes de publicar.
        </p>
      </div>

      <PreviewDeviceSwitcher data={data} />
    </div>
  );
}

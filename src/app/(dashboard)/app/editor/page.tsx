import { requireTenant } from "@/lib/auth";
import { dataService } from "@/lib/supabase/data-service";
import { EditorTabs } from "@/components/editor/EditorTabs";

export default async function EditorPage() {
  const session = await requireTenant();
  const tenant = await dataService.getTenantByOwner(session.userId);

  if (!tenant) {
    return (
      <div className="p-8 text-center text-white">
        Nenhum negócio associado a este perfil.
      </div>
    );
  }

  const page = await dataService.getLandingPageByTenantId(tenant.id);
  const services = await dataService.getServices(tenant.id);
  const businessHours = await dataService.getBusinessHours(tenant.id);

  if (!page) {
    return (
      <div className="p-8 text-center text-white">
        Configuração da página não encontrada.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
          Editor Visual da Página
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Personalize as cores, textos, catálogo de serviços, fotos e horários de {tenant.business_name}.
        </p>
      </div>

      <EditorTabs
        tenant={tenant}
        page={page}
        services={services}
        businessHours={businessHours}
      />
    </div>
  );
}


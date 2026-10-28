import { requireTenant } from "@/lib/auth";
import { dataService } from "@/lib/supabase/data-service";
import { updateBasicInfoAction } from "../actions";
import { Save, MessageCircle, MapPin, Type, Instagram } from "lucide-react";

export default async function TenantSettingsPage() {
  const session = await requireTenant();
  const tenant = await dataService.getTenantByOwner(session.userId);

  if (!tenant) {
    return null;
  }

  const page = await dataService.getLandingPageByTenantId(tenant.id);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
          Dados do Negócio & Contato
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Atualize as informações que aparecem no cabeçalho e nos botões de WhatsApp da sua página.
        </p>
      </div>

      <form action={updateBasicInfoAction} className="space-y-6">
        {/* Bloco 1: Textos do Topo (Hero) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Type className="w-4 h-4 text-amber-400" />
            <span>Textos de Destaque (Topo)</span>
          </h2>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Título Principal da Página (Headline)
            </label>
            <input
              type="text"
              name="headline"
              defaultValue={page?.hero_section.headline || ""}
              required
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Subtítulo Descritivo
            </label>
            <textarea
              name="subheadline"
              rows={3}
              defaultValue={page?.hero_section.subheadline || ""}
              required
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Bloco 2: WhatsApp e Agendamento */}
        <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp e Conversão</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Número do WhatsApp (DDD + Número)
              </label>
              <input
                type="text"
                name="whatsapp_number"
                defaultValue={page?.contact_info.whatsapp_number || ""}
                required
                placeholder="Ex: 11988887777"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Instagram (@seuperfil)
              </label>
              <input
                type="text"
                name="instagram_handle"
                defaultValue={page?.contact_info.instagram_handle || ""}
                placeholder="@studioexemplo"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Mensagem Pré-configurada ao Clicar no WhatsApp
            </label>
            <input
              type="text"
              name="whatsapp_default_message"
              defaultValue={page?.contact_info.whatsapp_default_message || ""}
              placeholder="Ex: Olá! Gostaria de agendar um atendimento."
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Bloco 3: Endereço */}
        <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Endereço e Atendimento Presencial</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Rua e Número
              </label>
              <input
                type="text"
                name="address_street"
                defaultValue={page?.contact_info.address_street || ""}
                required
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Cidade
              </label>
              <input
                type="text"
                name="address_city"
                defaultValue={page?.contact_info.address_city || ""}
                required
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-neutral-950 font-semibold text-sm hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/10 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </form>
    </div>
  );
}


import Link from "next/link";
import { requireTenant } from "@/lib/auth";
import { dataService } from "@/lib/supabase/data-service";
import { togglePublishAction } from "./actions";
import { SEGMENT_LABELS } from "@/lib/utils";
import { Globe, CheckCircle2, AlertCircle, ExternalLink, ArrowRight, Sparkles, MessageCircle, MapPin } from "lucide-react";

export default async function TenantDashboardPage() {
  const session = await requireTenant();
  const tenant = await dataService.getTenantByOwner(session.userId);

  if (!tenant) {
    return (
      <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
        <h1 className="text-lg font-bold text-white">Nenhum negócio associado a esta conta.</h1>
        <p className="text-sm text-neutral-400 mt-2">
          Entre em contato com o administrador para vincular seu perfil a um salão, barbearia ou nail designer.
        </p>
      </div>
    );
  }

  const page = await dataService.getLandingPageByTenantId(tenant.id);
  const isPublished = page?.status === "published";

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
            {tenant.business_name}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Gerencie o status de publicação da sua landing page e informações para seus clientes.
          </p>
        </div>

        {/* Botão de Publicação Instantânea */}
        <form action={togglePublishAction.bind(null, tenant.id)}>
          <button
            type="submit"
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md ${
              isPublished
                ? "bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20"
                : "bg-emerald-500 text-neutral-950 hover:bg-emerald-400 shadow-emerald-500/20"
            }`}
          >
            {isPublished ? (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Despublicar Página (Rascunho)</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Publicar Minha Página no Ar</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Status da Página */}
        <div className="p-4 sm:p-5 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Status da Página
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isPublished ? "bg-emerald-400 animate-pulse" : "bg-neutral-500"
              }`}
            />
            <span className="text-lg font-bold text-white">
              {isPublished ? "Publicada e Acessível" : "Em Rascunho"}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {isPublished
              ? "Clientes já conseguem visualizar e agendar."
              : "Visível apenas para você durante edição."}
          </p>
        </div>

        {/* Template do Segmento */}
        <div className="p-4 sm:p-5 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Template Especializado
          </div>
          <div className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{SEGMENT_LABELS[tenant.segment]}</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Arquitetura preparada para o nicho de {SEGMENT_LABELS[tenant.segment]}.
          </p>
        </div>

        {/* Link Público */}
        <div className="p-4 sm:p-5 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Endereço da Página
          </div>
          <div className="text-sm font-mono text-amber-400 truncate">
            /p/{tenant.slug}
          </div>
          <div className="mt-2">
            <Link
              href={`/p/${tenant.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-xs text-neutral-300 hover:text-white font-medium"
            >
              <span>Abrir em nova aba</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Detalhes Atuais da Landing Page */}
      {page && (
        <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Conteúdo Principal da Página</h2>
              <p className="text-xs text-neutral-400">
                Resumo dos dados visíveis para os visitantes.
              </p>
            </div>
            <Link
              href="/app/settings"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-900 text-xs text-neutral-200 hover:text-white transition-colors"
            >
              <span>Editar Informações</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-xs text-neutral-500 font-medium">Título Principal (Headline)</div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  {page.hero_section.headline}
                </div>
              </div>

              <div>
                <div className="text-xs text-neutral-500 font-medium">Subtítulo Explicativo</div>
                <div className="text-xs text-neutral-300 mt-0.5">
                  {page.hero_section.subheadline}
                </div>
              </div>

              <div>
                <div className="text-xs text-neutral-500 font-medium">Texto do Botão CTA</div>
                <div className="inline-block px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 text-xs font-semibold mt-1">
                  {page.hero_section.cta_text}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-neutral-500 font-medium">WhatsApp de Agendamento</div>
                  <div className="text-sm font-mono text-white mt-0.5">
                    {page.contact_info.whatsapp_number}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-neutral-500 font-medium">Localização</div>
                  <div className="text-xs text-neutral-300 mt-0.5">
                    {page.contact_info.address_street}, {page.contact_info.address_neighborhood} - {page.contact_info.address_city}/{page.contact_info.address_state}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


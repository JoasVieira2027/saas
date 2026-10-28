import { notFound } from "next/navigation";
import Link from "next/link";
import { dataService } from "@/lib/supabase/data-service";
import { formatCurrency, formatWhatsAppUrl, SEGMENT_LABELS } from "@/lib/utils";
import { SalonTemplate } from "@/components/templates/salon";
import { Sparkles, Scissors, Crown, MessageCircle, MapPin, Clock, ShieldAlert, ArrowLeft } from "lucide-react";

export default async function PublicLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await dataService.getPublicPageBySlug(slug);

  if (!data) {
    notFound();
  }

  const { tenant, page, services, business_hours } = data;

  // 1. Verificação de isolamento: Tenant suspenso não deve ser servido
  if (tenant.status === "suspended") {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-neutral-900 border border-neutral-800 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white font-serif">Página Temporariamente Indisponível</h1>
          <p className="mt-2 text-sm text-neutral-400">
            O acesso a esta página está suspenso. Se você é o responsável por {tenant.business_name}, regularize o acesso no painel de controle.
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Acessar Painel do Cliente</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Verificação de status da página: Rascunho
  if (page.status === "draft") {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-neutral-900 border border-neutral-800 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white font-serif">Página em Construção</h1>
          <p className="mt-2 text-sm text-neutral-400">
            A página de {tenant.business_name} está sendo personalizada e estará no ar em breve!
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Entrar no Painel do Cliente para Publicar</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Renderização Especializada: Template de Salão de Beleza (Fase 3)
  if (page.template_id === "salon" || tenant.segment === "salon") {
    return <SalonTemplate data={data} />;
  }

  // 4. Renderização Base para os demais templates (serão detalhados nas próximas fases)
  const whatsappUrl = formatWhatsAppUrl(
    page.contact_info.whatsapp_number,
    page.contact_info.whatsapp_default_message
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-amber-500 selection:text-neutral-950">
      <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-2 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
        <span>Página Oficial de {tenant.business_name}</span>
        <span className="text-neutral-600">•</span>
        <span className="text-amber-400">Nicho: {SEGMENT_LABELS[tenant.segment]}</span>
      </div>

      <header className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-amber-400 font-medium mb-6">
          {tenant.segment === "barber" && <Scissors className="w-3.5 h-3.5" />}
          {tenant.segment === "nails" && <Crown className="w-3.5 h-3.5" />}
          <span>{page.hero_section.badge}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif max-w-3xl mx-auto">
          {page.hero_section.headline}
        </h1>

        <p className="mt-5 text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {page.hero_section.subheadline}
        </p>

        <div className="mt-8 flex justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <MessageCircle className="w-5 h-5 fill-neutral-950" />
            <span>{page.hero_section.cta_text}</span>
          </a>
        </div>
      </header>

      {services.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">Serviços & Procedimentos</h2>
            <p className="text-xs text-neutral-400 mt-1">Valores e estimativas de atendimento</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-4 sm:p-5 rounded-xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-white text-sm sm:text-base">{service.name}</h3>
                    <span className="font-bold text-amber-400 text-sm sm:text-base shrink-0">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{service.duration_minutes} min</span>
                  </div>
                  <a
                    href={formatWhatsAppUrl(
                      page.contact_info.whatsapp_number,
                      `Olá! Gostaria de agendar o serviço: ${service.name}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    Agendar este &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-500">
        <p>{tenant.business_name} • Página desenvolvida na GlowSaaS</p>
      </footer>
    </div>
  );
}

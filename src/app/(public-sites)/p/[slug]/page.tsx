import { notFound } from "next/navigation";
import Link from "next/link";
import { dataService } from "@/lib/supabase/data-service";
import { SalonTemplate } from "@/components/templates/salon";
import { BarberTemplate } from "@/components/templates/barber";
import { NailsTemplate } from "@/components/templates/nails";
import { Clock, ShieldAlert, ArrowLeft } from "lucide-react";

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

  const { tenant, page } = data;

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

  // 4. Renderização Especializada: Template de Barbearia (Fase 4)
  if (page.template_id === "barber" || tenant.segment === "barber") {
    return <BarberTemplate data={data} />;
  }

  // 5. Renderização Especializada: Template de Unhas em Gel / Nail Designer (Fase 5)
  if (page.template_id === "nails" || tenant.segment === "nails") {
    return <NailsTemplate data={data} />;
  }

  return notFound();
}

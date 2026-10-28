import Link from "next/link";
import { requireTenant } from "@/lib/auth";
import { dataService } from "@/lib/supabase/data-service";
import { togglePublishAction } from "./actions";
import { SEGMENT_LABELS } from "@/lib/utils";
import {
  Edit3,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Scissors,
  Crown,
  Layers,
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

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
  const services = await dataService.getServices(tenant.id);
  const isPublished = page?.status === "published";

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-800 text-amber-400 font-bold border border-neutral-700">
              {SEGMENT_LABELS[tenant.segment]}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                isPublished
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-300 border-amber-500/30"
              }`}
            >
              {isPublished ? "Página Publicada" : "Modo Rascunho"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
            {tenant.business_name}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Personalize seu site, gerencie procedimentos e visualize as mudanças antes de publicar.
          </p>
        </div>

        {/* Botão de Publicação Instantânea */}
        <form action={togglePublishAction.bind(null, tenant.id)}>
          <button
            type="submit"
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md ${
              isPublished
                ? "bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20"
                : "bg-emerald-500 text-neutral-950 hover:bg-emerald-400 shadow-emerald-500/20 active:scale-95 font-bold"
            }`}
          >
            {isPublished ? (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Despublicar Página</span>
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

      {/* Ações Principais de Destaque */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link
          href="/app/editor"
          className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/60 transition-all group flex flex-col justify-between shadow-xl"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Edit3 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
              Abrir Editor Visual
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
              Altere o nome comercial, cores, foto de capa, textos de destaque, adicione procedimentos e fotos à sua galeria.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-1.5 text-xs text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
            <span>Começar Edição</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/app/preview"
          className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/60 transition-all group flex flex-col justify-between shadow-xl"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Smartphone className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
              Visualizar Preview Responsivo
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
              Teste exatamente como sua landing page é exibida em telas de celulares (iPhone/Android), iPads e computadores.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-1.5 text-xs text-neutral-300 font-semibold group-hover:translate-x-1 transition-transform">
            <span>Abrir Simulador de Dispositivos</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* Cards de Métricas & Conteúdo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Procedimentos</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {services.length}
          </div>
          <p className="text-xs text-neutral-500 mt-1">Serviços ativos no cardápio</p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Galeria de Fotos</span>
            <ImageIcon className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {page?.gallery?.length || 0}
          </div>
          <p className="text-xs text-neutral-500 mt-1">Trabalhos no portfólio</p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Endereço Público</span>
            <ExternalLink className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-mono text-amber-400 truncate mt-1">
            /p/{tenant.slug}
          </div>
          <div className="mt-2">
            <Link
              href={`/p/${tenant.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-xs text-neutral-300 hover:text-white font-medium"
            >
              <span>Abrir página pública</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

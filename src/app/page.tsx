import Link from "next/link";
import { Sparkles, Scissors, Crown, ShieldCheck, ArrowRight, LayoutDashboard, Globe } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-neutral-900 text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center text-neutral-950 font-bold shadow-md shadow-amber-500/20">
              G
            </div>
            <div>
              <span className="font-bold tracking-tight text-lg text-white">GlowSaaS</span>
              <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Fase 2: Base Funcional
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-neutral-300 hover:text-white transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-amber-500 text-neutral-950 hover:bg-amber-400 transition-colors shadow-sm"
            >
              Painel Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700/80 text-amber-400 text-xs sm:text-sm font-medium mb-6">
          <ShieldCheck className="w-4 h-4" />
          <span>Arquitetura Multi-Tenant com Isolamento RLS e Supabase</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl font-serif text-neutral-100">
          Plataforma de Landing Pages para{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
            Negócios de Beleza
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-neutral-400 max-w-2xl leading-relaxed">
          Estrutura completa com isolamento de dados por cliente, painel do proprietário, painel individual e motor preparado para os 3 segmentos de alta demanda.
        </p>

        {/* Quick Access Grid */}
        <div className="mt-12 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {/* Card 1: Salão */}
          <Link
            href="/p/lumiere-hair"
            className="group p-6 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 hover:border-amber-500/50 hover:bg-neutral-800 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase tracking-wider font-semibold text-amber-400 mb-1">
              Segmento 1
            </div>
            <h2 className="text-lg font-semibold text-white">Salões de Beleza</h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400">
              Identidade visual sofisticada para mechas, cortes, estética e cuidados capilares.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-400 font-medium group-hover:translate-x-1 transition-transform">
              <span>Ver página modelo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 2: Barbearia */}
          <Link
            href="/p/navalha-de-ouro"
            className="group p-6 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 hover:border-amber-500/50 hover:bg-neutral-800 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-700/50 border border-neutral-600 text-neutral-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-1">
              Segmento 2
            </div>
            <h2 className="text-lg font-semibold text-white">Barbearias</h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400">
              Visual sóbrio, direto e marcante para cortes, barba e agendamentos pelo WhatsApp.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-300 font-medium group-hover:translate-x-1 transition-transform">
              <span>Ver página modelo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 3: Unhas em Gel */}
          <Link
            href="/p/gisele-nails"
            className="group p-6 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 hover:border-amber-500/50 hover:bg-neutral-800 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Crown className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase tracking-wider font-semibold text-rose-300 mb-1">
              Segmento 3
            </div>
            <h2 className="text-lg font-semibold text-white">Unhas em Gel</h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400">
              Estética refinada em tons nude e rosé para alongamento, fibra e nail art.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-rose-300 font-medium group-hover:translate-x-1 transition-transform">
              <span>Ver página modelo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>

        {/* Access shortcuts */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 text-neutral-950 font-semibold text-sm hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/10"
          >
            <LayoutDashboard className="w-4 h-4" />
            Acessar Painel do Administrador
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold text-sm hover:bg-neutral-700 transition-colors"
          >
            <Globe className="w-4 h-4" />
            Acessar Painel do Cliente (Tenant)
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
        <p>GlowSaaS • Plataforma Multi-Tenant • Isolamento com Row Level Security (RLS)</p>
      </footer>
    </div>
  );
}

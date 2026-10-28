import Link from "next/link";
import { dataService } from "@/lib/supabase/data-service";
import { Users, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, Scissors, Crown, ArrowRight } from "lucide-react";
import { SEGMENT_LABELS, STATUS_LABELS } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const tenants = await dataService.getAllTenants();

  const totalClients = tenants.length;
  const activeClients = tenants.filter((t) => t.status === "active").length;
  const suspendedClients = tenants.filter((t) => t.status === "suspended").length;
  const proPlans = tenants.filter((t) => t.plan_type === "pro").length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
          Painel do Proprietário do SaaS
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Controle geral de tenants, isolamento de dados e templates do ecossistema de beleza.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total de Clientes</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">{totalClients}</div>
          <div className="text-xs text-neutral-500 mt-1">Negócios cadastrados</div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Ativos</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">{activeClients}</div>
          <div className="text-xs text-emerald-400/80 mt-1">Páginas no ar</div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Suspensos</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">{suspendedClients}</div>
          <div className="text-xs text-neutral-500 mt-1">Acesso bloqueado</div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Planos Pro</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">{proPlans}</div>
          <div className="text-xs text-amber-400/80 mt-1">Recursos avançados</div>
        </div>
      </div>

      {/* System Status Banner */}
      <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Segurança e Isolamento RLS Ativos</h2>
            <p className="text-xs text-neutral-400">
              Cada cliente possui isolamento rigoroso por <code className="text-amber-400">tenant_id</code> e visitantes só leem páginas com status ativo.
            </p>
          </div>
        </div>
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-neutral-950 text-xs font-semibold hover:bg-amber-400 transition-colors shrink-0"
        >
          <span>Gerenciar Clientes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Templates Overview */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white font-serif">Segmentos e Templates Preparados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center gap-2.5 text-amber-400 mb-3">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold text-sm text-neutral-200">Salão de Beleza</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Paleta nude/dourada suave, foco em mechas, visagismo e catálogo de tratamentos capilares.
            </p>
            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
              <span className="text-neutral-500">ID: salon</span>
              <span className="text-emerald-400 font-medium">Pronto para Fase 3</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center gap-2.5 text-neutral-200 mb-3">
              <Scissors className="w-5 h-5" />
              <span className="font-semibold text-sm text-neutral-200">Barbearia</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Design escuro/madeira, foco em cortes modernos, barboterapia e agendamento instantâneo.
            </p>
            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
              <span className="text-neutral-500">ID: barber</span>
              <span className="text-emerald-400 font-medium">Pronto para Fase 3</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center gap-2.5 text-rose-300 mb-3">
              <Crown className="w-5 h-5" />
              <span className="font-semibold text-sm text-neutral-200">Unhas em Gel</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Estética clean e delicada, galeria de fibra/gel, tabela de procedimentos e biossegurança.
            </p>
            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
              <span className="text-neutral-500">ID: nails</span>
              <span className="text-emerald-400 font-medium">Pronto para Fase 3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

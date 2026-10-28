import Link from "next/link";
import { requireSuperadmin } from "@/lib/auth";
import { dataService } from "@/lib/supabase/data-service";
import { AdminClientsTable } from "@/components/admin/AdminClientsTable";
import { formatCurrency, PAYMENT_METHOD_LABELS } from "@/lib/utils";
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowRight,
  ShieldAlert,
  History,
  Sparkles,
} from "lucide-react";

export default async function AdminDashboardPage() {
  await requireSuperadmin();

  const summary = await dataService.getFinancialSummary();
  const rawTenants = await dataService.getAllTenants();
  const recentPayments = (await dataService.getAllPayments()).slice(0, 5);
  const recentAuditLogs = (await dataService.getAuditLogs()).slice(0, 5);

  const tenantsWithDetails = await Promise.all(
    rawTenants.map(async (t) => {
      const owner = await dataService.getProfile(t.owner_id);
      const page = await dataService.getLandingPageByTenantId(t.id);
      return {
        ...t,
        owner: owner || undefined,
        page,
      };
    })
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
            Painel Executivo do Super Admin
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-400">
            Governança financeira, controle de assinaturas, inadimplência e gerenciamento multitenant.
          </p>
        </div>
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-colors shadow-md shadow-amber-500/10 shrink-0 self-start sm:self-auto"
        >
          <span>Cadastrar Novo Cliente</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Cards de Métricas Financeiras e Operacionais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: MRR Previsto */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-neutral-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Receita Mensal Prevista
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {formatCurrency(summary.mrrCents / 100)}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1 flex items-center gap-1">
            <span>MRR de clientes ativos</span>
          </div>
        </div>

        {/* Card 2: Clientes Ativos vs Total */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Clientes & Assinaturas
            </span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {summary.activeClients}
            <span className="text-sm font-normal text-neutral-500"> / {summary.totalClients}</span>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {summary.pendingCount} pendente(s) de ativação
          </div>
        </div>

        {/* Card 3: Inadimplentes e Suspensos */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-neutral-800">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Atrasados / Suspensos
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-rose-400">
            {summary.overdueCount + summary.suspendedClients}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {summary.overdueCount} inadimplente(s), {summary.suspendedClients} suspenso(s)
          </div>
        </div>

        {/* Card 4: Páginas no Ar vs Rascunho */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-neutral-800">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Páginas Publicadas
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {summary.publishedPages}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            Landing pages ativas e servidas
          </div>
        </div>
      </div>

      {/* Tabela Interativa de Clientes com Filtros e Busca */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-serif">
            Clientes do SaaS (Tenants)
          </h2>
          <span className="text-xs text-neutral-400">
            {tenantsWithDetails.length} cadastrado(s)
          </span>
        </div>
        <AdminClientsTable tenants={tenantsWithDetails} />
      </div>

      {/* Grid Duplo: Últimos Pagamentos e Últimas Ações Administrativas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feed de Pagamentos Recentes */}
        <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Últimos Pagamentos Registrados</span>
            </div>
            <span className="text-xs text-neutral-500">Manual</span>
          </div>

          {recentPayments.length === 0 ? (
            <div className="py-6 text-center text-xs text-neutral-500">
              Nenhum pagamento registrado ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((p) => {
                const tenant = rawTenants.find((t) => t.id === p.tenant_id);
                return (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">
                        {tenant?.business_name || "Cliente"}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {p.billing_period} • {PAYMENT_METHOD_LABELS[p.payment_method] || p.payment_method}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">
                        {formatCurrency(p.amount_cents / 100)}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        {new Date(p.paid_at).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Feed de Auditoria Recente */}
        <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <History className="w-4 h-4 text-amber-400" />
              <span>Ações Administrativas Recentes</span>
            </div>
            <span className="text-xs text-neutral-500">Auditoria</span>
          </div>

          {recentAuditLogs.length === 0 ? (
            <div className="py-6 text-center text-xs text-neutral-500">
              Nenhuma ação administrativa registrada ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {recentAuditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-amber-400 text-[10px] font-mono">
                        {log.action}
                      </span>
                      <span>{log.target_tenant_name}</span>
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      Por: {log.admin_email}
                    </div>
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    {new Date(log.created_at).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

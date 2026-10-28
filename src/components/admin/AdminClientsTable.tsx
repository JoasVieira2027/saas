"use client";

import { useState } from "react";
import Link from "next/link";
import { Tenant, LandingPage } from "@/types/database";
import {
  formatCurrency,
  SEGMENT_LABELS,
  SUBSCRIPTION_STATUS_LABELS,
  getDueDateStatus,
} from "@/lib/utils";
import {
  updateTenantStatusAction,
  updateSubscriptionStatusAction,
  togglePagePublicationAdminAction,
  impersonateTenantAction,
} from "@/app/(admin)/admin/actions";
import {
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  ArrowRight,
  UserCheck,
  Calendar,
  Sparkles,
  Scissors,
  Eye,
  CheckCircle2,
} from "lucide-react";

interface AdminClientsTableProps {
  tenants: (Tenant & {
    owner?: { full_name: string; email: string };
    page?: LandingPage | null;
  })[];
}

export function AdminClientsTable({ tenants }: AdminClientsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dueFilter, setDueFilter] = useState<string>("all");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const filteredTenants = tenants.filter((tenant) => {
    // 1. Busca por nome, email ou negócio
    const query = searchTerm.toLowerCase().trim();
    const matchesQuery =
      !query ||
      tenant.business_name.toLowerCase().includes(query) ||
      tenant.slug.toLowerCase().includes(query) ||
      tenant.owner?.full_name?.toLowerCase().includes(query) ||
      tenant.owner?.email?.toLowerCase().includes(query);

    // 2. Filtro por status de assinatura
    const subStatus = tenant.subscription_status || "active";
    const matchesStatus = statusFilter === "all" || subStatus === statusFilter;

    // 3. Filtro por vencimento
    const dueInfo = getDueDateStatus(tenant.next_due_date);
    let matchesDue = true;
    if (dueFilter === "overdue") {
      matchesDue = dueInfo.status === "overdue";
    } else if (dueFilter === "due_soon") {
      matchesDue = dueInfo.status === "due_soon";
    } else if (dueFilter === "ok") {
      matchesDue = dueInfo.status === "ok";
    }

    return matchesQuery && matchesStatus && matchesDue;
  });

  return (
    <div className="space-y-4">
      {/* Toast de Feedback */}
      {actionFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Barra de Filtros e Busca */}
      <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Campo de Busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, e-mail ou nome do negócio..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filtros Dropdown */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-neutral-900 text-white">Todos os Status</option>
              <option value="active" className="bg-neutral-900 text-white">Em Dia (Ativo)</option>
              <option value="pending" className="bg-neutral-900 text-white">Pendente</option>
              <option value="overdue" className="bg-neutral-900 text-white">Inadimplente (Atrasado)</option>
              <option value="suspended" className="bg-neutral-900 text-white">Suspenso</option>
              <option value="cancelled" className="bg-neutral-900 text-white">Cancelado</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={dueFilter}
              onChange={(e) => setDueFilter(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-neutral-900 text-white">Todos os Vencimentos</option>
              <option value="overdue" className="bg-neutral-900 text-white">Apenas Atrasados</option>
              <option value="due_soon" className="bg-neutral-900 text-white">Vence em até 5 dias</option>
              <option value="ok" className="bg-neutral-900 text-white">Em Dia</option>
            </select>
          </div>

          {(searchTerm || statusFilter !== "all" || dueFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDueFilter("all");
              }}
              className="px-2.5 py-1.5 text-xs text-neutral-400 hover:text-white underline underline-offset-2"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabela de Clientes */}
      <div className="rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-neutral-900/80 text-neutral-400 border-b border-neutral-800 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Negócio & Slug</th>
                <th className="py-3 px-4">Responsável</th>
                <th className="py-3 px-4">Template</th>
                <th className="py-3 px-4">Plano & Valor</th>
                <th className="py-3 px-4">Assinatura</th>
                <th className="py-3 px-4">Página</th>
                <th className="py-3 px-4">Próx. Vencimento</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500 text-xs">
                    Nenhum cliente encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => {
                  const subStatus = tenant.subscription_status || "active";
                  const subBadge = SUBSCRIPTION_STATUS_LABELS[subStatus] || SUBSCRIPTION_STATUS_LABELS.active;
                  const isSuspended = tenant.status === "suspended" || subStatus === "suspended" || subStatus === "cancelled";
                  const dueInfo = getDueDateStatus(tenant.next_due_date);
                  const monthlyCents = tenant.monthly_price_cents || (tenant.plan_type === "pro" ? 19700 : 9700);
                  const isPagePublished = tenant.page?.status === "published";

                  return (
                    <tr key={tenant.id} className="hover:bg-neutral-900/40 transition-colors">
                      {/* Negócio & Slug */}
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/clients/${tenant.id}`}
                            className="font-bold hover:text-amber-400 transition-colors"
                          >
                            {tenant.business_name}
                          </Link>
                          {tenant.slug && (
                            <Link
                              href={`/p/${tenant.slug}`}
                              target="_blank"
                              title="Abrir landing page pública"
                              className="text-neutral-500 hover:text-amber-400"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-500 font-mono">
                          /{tenant.slug}
                        </div>
                      </td>

                      {/* Responsável */}
                      <td className="py-3.5 px-4">
                        <div className="text-neutral-200">{tenant.owner?.full_name || "—"}</div>
                        <div className="text-[11px] text-neutral-500 truncate max-w-[140px]">
                          {tenant.owner?.email || "—"}
                        </div>
                      </td>

                      {/* Template */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800 text-[11px]">
                          {tenant.segment === "salon" && <Sparkles className="w-3 h-3 text-amber-400" />}
                          {tenant.segment === "barber" && <Scissors className="w-3 h-3 text-amber-600" />}
                          {tenant.segment === "nails" && <Sparkles className="w-3 h-3 text-rose-400" />}
                          <span>{SEGMENT_LABELS[tenant.segment] || tenant.segment}</span>
                        </span>
                      </td>

                      {/* Plano & Valor Mensal */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">
                          {formatCurrency(monthlyCents / 100)}
                          <span className="text-[10px] text-neutral-500 font-normal">/mês</span>
                        </div>
                        <div className="text-[10px] text-amber-400 font-medium uppercase tracking-wider">
                          Plano {tenant.plan_type}
                        </div>
                      </td>

                      {/* Status da Assinatura */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${subBadge.bg} ${subBadge.text} ${subBadge.border}`}
                        >
                          {subStatus === "active" && <CheckCircle2 className="w-3 h-3" />}
                          {subStatus === "overdue" && <AlertTriangle className="w-3 h-3" />}
                          {subStatus === "pending" && <Clock className="w-3 h-3" />}
                          {subStatus === "suspended" && <ShieldAlert className="w-3 h-3" />}
                          <span>{subBadge.label}</span>
                        </span>
                      </td>

                      {/* Status da Página */}
                      <td className="py-3.5 px-4">
                        {isSuspended ? (
                          <span className="text-[11px] text-rose-400 font-medium flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" />
                            <span>Bloqueada</span>
                          </span>
                        ) : isPagePublished ? (
                          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>No Ar</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Rascunho</span>
                          </span>
                        )}
                      </td>

                      {/* Próximo Vencimento */}
                      <td className="py-3.5 px-4">
                        <div className="text-neutral-300 font-mono text-[11px]">
                          {tenant.next_due_date || "—"}
                        </div>
                        {tenant.next_due_date && (
                          <div
                            className={`text-[10px] font-medium ${
                              dueInfo.status === "overdue"
                                ? "text-rose-400 font-bold"
                                : dueInfo.status === "due_soon"
                                ? "text-amber-400 font-semibold"
                                : "text-neutral-500"
                            }`}
                          >
                            {dueInfo.label}
                          </div>
                        )}
                      </td>

                      {/* Ações */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Botão Acessar Painel do Cliente (Impersonate) */}
                          <form
                            action={async () => {
                              await impersonateTenantAction(tenant.id);
                            }}
                          >
                            <button
                              type="submit"
                              title="Acessar painel como este cliente"
                              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-amber-500/50 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </form>

                          {/* Link para Ficha Completa */}
                          <Link
                            href={`/admin/clients/${tenant.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 transition-colors"
                          >
                            <span>Gerenciar</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Tenant, LandingPage, SubscriptionPayment, AdminAuditLog } from "@/types/database";
import {
  formatCurrency,
  formatBRLPrice,
  SEGMENT_LABELS,
  SUBSCRIPTION_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  getDueDateStatus,
} from "@/lib/utils";
import {
  updateTenantFinancialAction,
  updateSubscriptionStatusAction,
  updateTenantStatusAction,
  recordManualPaymentAction,
  saveInternalNotesAction,
  togglePagePublicationAdminAction,
  impersonateTenantAction,
} from "@/app/(admin)/admin/actions";
import {
  Sparkles,
  CreditCard,
  DollarSign,
  Calendar,
  FileText,
  History,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Eye,
  ArrowLeft,
  Save,
  Plus,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface ClientDetailsTabsProps {
  tenant: Tenant;
  owner: { id: string; full_name: string; email: string } | null;
  page: LandingPage | null;
  payments: SubscriptionPayment[];
  auditLogs: AdminAuditLog[];
}

export function ClientDetailsTabs({
  tenant,
  owner,
  page,
  payments,
  auditLogs,
}: ClientDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<
    "financial" | "payments" | "page_control" | "notes" | "audit"
  >("financial");

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const subStatus = tenant.subscription_status || "active";
  const subBadge = SUBSCRIPTION_STATUS_LABELS[subStatus] || SUBSCRIPTION_STATUS_LABELS.active;
  const isSuspended = tenant.status === "suspended" || subStatus === "suspended" || subStatus === "cancelled";
  const isPagePublished = page?.status === "published";
  const dueInfo = getDueDateStatus(tenant.next_due_date);
  const monthlyCents = tenant.monthly_price_cents || (tenant.plan_type === "pro" ? 19700 : 9700);

  const tabs = [
    { id: "financial", label: "1. Assinatura & Plano", icon: CreditCard },
    { id: "payments", label: "2. Pagamentos Manuais", icon: DollarSign, badge: payments.length },
    { id: "page_control", label: "3. Controle da Página & Acesso", icon: Sparkles },
    { id: "notes", label: "4. Observações Internas", icon: FileText },
    { id: "audit", label: "5. Auditoria de Ações", icon: History, badge: auditLogs.length },
  ] as const;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Botão Voltar e Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/clients"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para Lista de Clientes</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
              {tenant.business_name}
            </h1>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${subBadge.bg} ${subBadge.text} ${subBadge.border}`}
            >
              {subBadge.label}
            </span>
          </div>
          <div className="text-xs text-neutral-400 mt-1 flex flex-wrap items-center gap-2">
            <span>Slug: <code className="text-amber-400">/{tenant.slug}</code></span>
            <span>•</span>
            <span>Responsável: <strong className="text-neutral-200">{owner?.full_name}</strong> ({owner?.email})</span>
            <span>•</span>
            <span>Segmento: <strong>{SEGMENT_LABELS[tenant.segment]}</strong></span>
          </div>
        </div>

        {/* Ações Rápidas no Topo */}
        <div className="flex items-center gap-2">
          {tenant.slug && (
            <Link
              href={`/p/${tenant.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-white border border-neutral-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Ver Site Público</span>
            </Link>
          )}

          <form
            action={async () => {
              await impersonateTenantAction(tenant.id);
            }}
          >
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors shadow-md shadow-amber-500/10"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Entrar no Painel do Cliente</span>
            </button>
          </form>
        </div>
      </div>

      {/* Alerta de Feedback */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Resumo Rápido em Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="text-[11px] text-neutral-400 uppercase font-semibold">Valor Mensal</div>
          <div className="text-lg sm:text-xl font-bold text-white mt-1">
            {formatCurrency(monthlyCents / 100)}
          </div>
          <div className="text-[10px] text-amber-400 mt-0.5">Plano {tenant.plan_type}</div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="text-[11px] text-neutral-400 uppercase font-semibold">Vencimento</div>
          <div className="text-lg sm:text-xl font-bold text-white mt-1">
            Dia {tenant.due_day || 10}
          </div>
          <div
            className={`text-[10px] font-medium mt-0.5 ${
              dueInfo.status === "overdue"
                ? "text-rose-400 font-bold"
                : dueInfo.status === "due_soon"
                ? "text-amber-400"
                : "text-neutral-500"
            }`}
          >
            {dueInfo.label}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="text-[11px] text-neutral-400 uppercase font-semibold">Status Página</div>
          <div className="text-base sm:text-lg font-bold text-white mt-1 flex items-center gap-1.5">
            {isSuspended ? (
              <span className="text-rose-400 flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" /> Suspensa
              </span>
            ) : isPagePublished ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Publicada
              </span>
            ) : (
              <span className="text-neutral-400 flex items-center gap-1">
                <Clock className="w-4 h-4" /> Rascunho
              </span>
            )}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">
            {isSuspended ? "Acesso bloqueado" : isPagePublished ? "Acessível na web" : "Em edição"}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
          <div className="text-[11px] text-neutral-400 uppercase font-semibold">Último Pagamento</div>
          <div className="text-sm sm:text-base font-bold text-white mt-1 truncate">
            {tenant.last_payment_date
              ? new Date(tenant.last_payment_date).toLocaleDateString("pt-BR")
              : "Nenhum registro"}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">{payments.length} pagamento(s)</div>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-neutral-800 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                isActive
                  ? "bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/10"
                  : "bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-800/80 border border-neutral-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {"badge" in tab && tab.badge > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? "bg-neutral-950 text-amber-400"
                      : "bg-neutral-800 text-neutral-300"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ABA 1: ASSINATURA & PLANO */}
      {activeTab === "financial" && (
        <form
          action={async (formData) => {
            await updateTenantFinancialAction(formData);
            showNotification("Dados financeiros e de assinatura atualizados com sucesso!");
          }}
          className="p-5 sm:p-7 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6"
        >
          <input type="hidden" name="tenant_id" value={tenant.id} />

          <div className="border-b border-neutral-800 pb-4">
            <h2 className="text-base font-bold text-white">Configuração da Assinatura</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Defina o plano comercial, valor da mensalidade e datas de vencimento do cliente.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Plano do Cliente
              </label>
              <select
                name="plan_type"
                defaultValue={tenant.plan_type}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="starter">Plano Starter (Essencial)</option>
                <option value="pro">Plano Pro (Completo / Destaque)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Valor Mensal (R$)
              </label>
              <input
                type="text"
                name="monthly_price"
                defaultValue={(monthlyCents / 100).toFixed(2).replace(".", ",")}
                required
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">Ex: 97,00 ou 197,00</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Status da Assinatura
              </label>
              <select
                name="subscription_status"
                defaultValue={subStatus}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="active">Ativa / Em Dia</option>
                <option value="pending">Pendente (Aguardando primeiro pagamento)</option>
                <option value="overdue">Inadimplente (Atrasada)</option>
                <option value="suspended">Suspensa por Inadimplência</option>
                <option value="cancelled">Cancelada Definitivamente</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Dia Fixo de Vencimento
              </label>
              <input
                type="number"
                name="due_day"
                min={1}
                max={31}
                defaultValue={tenant.due_day || 10}
                required
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">Dia do mês (ex: 5, 10, 15, 20)</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Próxima Data de Vencimento
              </label>
              <input
                type="date"
                name="next_due_date"
                defaultValue={tenant.next_due_date || ""}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-neutral-800">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm transition-colors shadow-md shadow-amber-500/10"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações Financeiras</span>
            </button>
          </div>
        </form>
      )}

      {/* ABA 2: REGISTRO DE PAGAMENTOS MANUAIS & HISTÓRICO */}
      {activeTab === "payments" && (
        <div className="space-y-6">
          {/* Formulário de Registro Manual */}
          <form
            action={async (formData) => {
              await recordManualPaymentAction(formData);
              showNotification("Pagamento manual registrado com sucesso e próximo vencimento atualizado!");
            }}
            className="p-5 sm:p-7 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5"
          >
            <input type="hidden" name="tenant_id" value={tenant.id} />

            <div className="border-b border-neutral-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Registrar Pagamento Manual</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Ao registrar um pagamento, o status do cliente é reativado para &quot;Em Dia&quot; e a data de vencimento é avançada em 1 mês.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Valor Recebido (R$)
                </label>
                <input
                  type="text"
                  name="amount"
                  defaultValue={(monthlyCents / 100).toFixed(2).replace(".", ",")}
                  required
                  placeholder="97,00"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Método de Pagamento
                </label>
                <select
                  name="payment_method"
                  defaultValue="pix"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="pix">PIX</option>
                  <option value="boleto">Boleto Bancário</option>
                  <option value="credit_card">Cartão de Crédito</option>
                  <option value="bank_transfer">Transferência Bancária</option>
                  <option value="cash">Dinheiro em Espécie</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Período / Competência
                </label>
                <input
                  type="text"
                  name="billing_period"
                  defaultValue={`Mensalidade ${new Date().toLocaleDateString("pt-BR", { month: "2-digit", year: "numeric" })}`}
                  required
                  placeholder="Ex: 03/2026"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Data de Pagamento
                </label>
                <input
                  type="date"
                  name="paid_at"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Observação / Identificador do Comprovante (Opcional)
                </label>
                <input
                  type="text"
                  name="notes"
                  placeholder="Ex: Comprovante enviado via WhatsApp pelo titular Aline"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm transition-colors shadow-md shadow-amber-500/10"
              >
                <Plus className="w-4 h-4" />
                <span>Confirmar Registro de Pagamento</span>
              </button>
            </div>
          </form>

          {/* Histórico de Pagamentos */}
          <div className="p-5 sm:p-7 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
            <h2 className="text-base font-bold text-white">Histórico de Pagamentos Recebidos</h2>

            {payments.length === 0 ? (
              <div className="py-8 text-center text-neutral-500 text-xs">
                Nenhum pagamento registrado até o momento para este cliente.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-neutral-900/80 text-neutral-400 border-b border-neutral-800 uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Data</th>
                      <th className="py-2.5 px-3">Competência</th>
                      <th className="py-2.5 px-3">Método</th>
                      <th className="py-2.5 px-3">Valor</th>
                      <th className="py-2.5 px-3">Observação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-900/40">
                        <td className="py-3 px-3 font-mono text-neutral-200">
                          {new Date(p.paid_at).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="py-3 px-3 font-medium text-white">{p.billing_period}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800 text-[11px]">
                            {PAYMENT_METHOD_LABELS[p.payment_method] || p.payment_method}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-400">
                          {formatCurrency(p.amount_cents / 100)}
                        </td>
                        <td className="py-3 px-3 text-neutral-400 text-xs truncate max-w-xs">
                          {p.notes || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 3: CONTROLE DA PÁGINA & ACESSO */}
      {activeTab === "page_control" && (
        <div className="p-5 sm:p-7 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h2 className="text-base font-bold text-white">Controle de Publicação & Bloqueio</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Controle individual da disponibilidade do site público sem apagar os dados do cliente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bloco 1: Publicação da Landing Page */}
            <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Status de Edição da Página</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Define se o conteúdo editado pelo cliente está publicado.
                  </p>
                </div>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    isPagePublished
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {isPagePublished ? "Publicada" : "Rascunho"}
                </span>
              </div>

              <div className="pt-2">
                <form
                  action={async () => {
                    const newStatus = isPagePublished ? "draft" : "published";
                    await togglePagePublicationAdminAction(tenant.id, newStatus);
                    showNotification(
                      newStatus === "published"
                        ? "Página marcada como Publicada pelo Super Admin!"
                        : "Página revertida para Rascunho pelo Super Admin!"
                    );
                  }}
                >
                  <button
                    type="submit"
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors ${
                      isPagePublished
                        ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                        : "bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/10"
                    }`}
                  >
                    {isPagePublished ? "Reverter para Modo Rascunho" : "Publicar Página Imediatamente"}
                  </button>
                </form>
              </div>
            </div>

            {/* Bloco 2: Bloqueio / Suspensão Geral do Tenant */}
            <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Status Operacional do Tenant</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Bloqueia o acesso público e exibe tela de suspensão.
                  </p>
                </div>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    isSuspended
                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {isSuspended ? "Suspenso" : "Ativo"}
                </span>
              </div>

              <div className="pt-2">
                <form
                  action={async () => {
                    const targetStatus = isSuspended ? "active" : "suspended";
                    await updateTenantStatusAction(tenant.id, targetStatus);
                    showNotification(
                      targetStatus === "suspended"
                        ? "Tenant suspenso com sucesso! O acesso público foi bloqueado."
                        : "Tenant reativado com sucesso!"
                    );
                  }}
                >
                  <button
                    type="submit"
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors ${
                      isSuspended
                        ? "bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/10"
                        : "bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40"
                    }`}
                  >
                    {isSuspended ? "Reativar Tenant e Liberar Página" : "Suspender Tenant por Inadimplência"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: OBSERVAÇÕES INTERNAS */}
      {activeTab === "notes" && (
        <form
          action={async (formData) => {
            await saveInternalNotesAction(formData);
            showNotification("Observações internas salvas com sucesso!");
          }}
          className="p-5 sm:p-7 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5"
        >
          <input type="hidden" name="tenant_id" value={tenant.id} />

          <div className="border-b border-neutral-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Anotações Internas da Administração</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Estas notas são estritamente privadas e visíveis apenas pelo Super Admin. Registre acordos, suporte ou avisos.
            </p>
          </div>

          <div>
            <textarea
              name="internal_notes"
              rows={6}
              defaultValue={tenant.internal_notes || ""}
              placeholder="Ex: Cliente solicitou alteração de cores via WhatsApp. Mensalidade de março combinada para dia 15."
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 p-4 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm transition-colors shadow-md shadow-amber-500/10"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Observações</span>
            </button>
          </div>
        </form>
      )}

      {/* ABA 5: AUDITORIA DE AÇÕES */}
      {activeTab === "audit" && (
        <div className="p-5 sm:p-7 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div className="border-b border-neutral-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              <span>Trilha de Auditoria (Logs deste Cliente)</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Registro cronológico de todas as intervenções administrativas e financeiras realizadas.
            </p>
          </div>

          {auditLogs.length === 0 ? (
            <div className="py-8 text-center text-neutral-500 text-xs">
              Nenhum log de auditoria registrado ainda para este cliente.
            </div>
          ) : (
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-amber-400 font-mono text-[10px]">
                        {log.action}
                      </span>
                      <span>Por: {log.admin_email}</span>
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1 font-mono">
                      {JSON.stringify(log.details)}
                    </div>
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono shrink-0">
                    {new Date(log.created_at).toLocaleString("pt-BR")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

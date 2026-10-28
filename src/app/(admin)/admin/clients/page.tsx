import Link from "next/link";
import { dataService } from "@/lib/supabase/data-service";
import { createTenantAction, updateTenantStatusAction } from "../actions";
import { SEGMENT_LABELS, STATUS_LABELS } from "@/lib/utils";
import { Plus, ExternalLink, ShieldAlert, CheckCircle, Ban, Sparkles, Scissors, Crown } from "lucide-react";

export default async function AdminClientsPage() {
  const tenants = await dataService.getAllTenants();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
            Gestão de Clientes (Tenants)
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Cadastre novos clientes, defina o nicho de beleza e gerencie o status de publicação.
          </p>
        </div>
      </div>

      {/* Formulário de Criação Rápida */}
      <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-800">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Cadastrar Novo Cliente</span>
        </h2>

        <form action={createTenantAction} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Nome do Negócio</label>
            <input
              type="text"
              name="business_name"
              required
              placeholder="Ex: Studio Bella Donna"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Identificador / Slug</label>
            <input
              type="text"
              name="slug"
              required
              placeholder="Ex: bella-donna"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Segmento / Template</label>
            <select
              name="segment"
              required
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="salon">Salão de Beleza</option>
              <option value="barber">Barbearia</option>
              <option value="nails">Unhas em Gel</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Nome do Responsável</label>
            <input
              type="text"
              name="owner_name"
              required
              placeholder="Ex: Juliana Silva"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">E-mail de Acesso</label>
            <input
              type="email"
              name="owner_email"
              required
              placeholder="Ex: juliana@belladonna.com"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Plano Inicial</label>
            <select
              name="plan_type"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="starter">Plano Starter</option>
              <option value="pro">Plano Pro</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-amber-500 text-neutral-950 font-semibold text-xs sm:text-sm hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/10 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Cliente e Liberar Acesso</span>
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Tenants */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Clientes Atuais ({tenants.length})</h2>

        <div className="grid grid-cols-1 gap-3">
          {tenants.map((tenant) => {
            const isSuspended = tenant.status === "suspended";

            return (
              <div
                key={tenant.id}
                className="p-4 sm:p-5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    {tenant.segment === "salon" && <Sparkles className="w-5 h-5" />}
                    {tenant.segment === "barber" && <Scissors className="w-5 h-5 text-neutral-300" />}
                    {tenant.segment === "nails" && <Crown className="w-5 h-5 text-rose-300" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white text-base">{tenant.business_name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300">
                        {SEGMENT_LABELS[tenant.segment]}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                          tenant.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        }`}
                      >
                        {tenant.status === "active" ? "Ativo" : "Suspenso"}
                      </span>
                      <span className="text-xs uppercase px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                        Plano {tenant.plan_type}
                      </span>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                      <span>Slug: <code className="text-amber-400">/p/{tenant.slug}</code></span>
                      <span>•</span>
                      <span>Subdomínio: <code className="text-neutral-300">{tenant.slug}.glowsaas.com</code></span>
                    </div>
                  </div>
                </div>

                {/* Ações de Controle */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <Link
                    href={`/p/${tenant.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-900 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ver Página</span>
                  </Link>

                  <form
                    action={updateTenantStatusAction.bind(
                      null,
                      tenant.id,
                      isSuspended ? "active" : "suspended"
                    )}
                  >
                    <button
                      type="submit"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                        isSuspended
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20"
                          : "bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20"
                      }`}
                    >
                      {isSuspended ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Reativar</span>
                        </>
                      ) : (
                        <>
                          <Ban className="w-3.5 h-3.5" />
                          <span>Suspender</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

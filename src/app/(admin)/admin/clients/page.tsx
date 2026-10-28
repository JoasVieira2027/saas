import { requireSuperadmin } from "@/lib/auth";
import { dataService } from "@/lib/supabase/data-service";
import { createTenantAction } from "../actions";
import { AdminClientsTable } from "@/components/admin/AdminClientsTable";
import { Plus, Users } from "lucide-react";

export default async function AdminClientsPage() {
  await requireSuperadmin();

  const rawTenants = await dataService.getAllTenants();
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
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
          Gestão de Clientes e Assinaturas
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Cadastre novos clientes, defina planos comerciais, registre pagamentos e monitore vencimentos.
        </p>
      </div>

      {/* Formulário de Criação de Novo Cliente */}
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
              <option value="starter">Plano Starter (R$ 97/mês)</option>
              <option value="pro">Plano Pro (R$ 197/mês)</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs sm:text-sm hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/10 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Cliente e Liberar Acesso</span>
            </button>
          </div>
        </form>
      </div>

      {/* Tabela Interativa de Clientes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Todos os Clientes Cadastrados ({tenantsWithDetails.length})</span>
          </h2>
        </div>

        <AdminClientsTable tenants={tenantsWithDetails} />
      </div>
    </div>
  );
}

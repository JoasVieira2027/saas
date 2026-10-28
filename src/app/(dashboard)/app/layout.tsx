import Link from "next/link";
import { requireTenant } from "@/lib/auth";
import { dataService } from "@/lib/supabase/data-service";
import { logoutAction } from "@/app/auth/actions";
import { SEGMENT_LABELS } from "@/lib/utils";
import { LayoutDashboard, Edit3, Smartphone, ExternalLink, LogOut, Sparkles, Scissors, Crown } from "lucide-react";

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireTenant();
  const tenant = await dataService.getTenantByOwner(session.userId);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-neutral-950 border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Business Info Header */}
          <div className="p-4 sm:p-6 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center text-neutral-950 font-bold shrink-0 shadow">
                {tenant?.segment === "barber" ? (
                  <Scissors className="w-5 h-5 text-neutral-900" />
                ) : tenant?.segment === "nails" ? (
                  <Crown className="w-5 h-5 text-neutral-900" />
                ) : (
                  <Sparkles className="w-5 h-5 text-neutral-900" />
                )}
              </div>
              <div className="overflow-hidden">
                <div className="font-bold tracking-tight text-white truncate text-sm">
                  {tenant ? tenant.business_name : "Meu Negócio"}
                </div>
                <div className="text-[11px] text-amber-400 font-medium">
                  {tenant ? SEGMENT_LABELS[tenant.segment] : "Painel do Cliente"}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 sm:p-4 space-y-1">
            <Link
              href="/app"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>Visão Geral</span>
            </Link>

            <Link
              href="/app/editor"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors"
            >
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>Editor do Site</span>
            </Link>

            <Link
              href="/app/preview"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Visualizar Preview</span>
            </Link>

            {tenant && (
              <Link
                href={`/p/${tenant.slug}`}
                target="_blank"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors border border-amber-500/20 mt-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Página no Ar</span>
              </Link>
            )}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="p-3 sm:p-4 border-t border-neutral-800">
          <div className="px-3 py-2 mb-2 bg-neutral-900 rounded-lg border border-neutral-800">
            <div className="text-xs font-semibold text-neutral-200 truncate">{session.fullName}</div>
            <div className="text-[11px] text-neutral-500 truncate">{session.email}</div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors border border-rose-500/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair da Conta</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-neutral-900/60 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

import Link from "next/link";
import { requireSuperadmin } from "@/lib/auth";
import { logoutAction } from "@/app/auth/actions";
import { LayoutDashboard, Users, Sparkles, LogOut, ExternalLink, Shield } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSuperadmin();

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col md:flex-row">
      {/* Sidebar Desktop / Navbar Mobile */}
      <aside className="w-full md:w-64 bg-neutral-950 border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Header */}
          <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center text-neutral-950 font-bold text-sm shadow">
                G
              </div>
              <div>
                <div className="font-bold tracking-tight text-white font-serif">GlowSaaS</div>
                <div className="text-[10px] text-amber-400 font-medium uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" />
                  Painel Owner
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 sm:p-4 space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>Visão Geral</span>
            </Link>

            <Link
              href="/admin/clients"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>Gestão de Clientes</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ver Site Inicial</span>
            </Link>
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
              <span>Encerrar Sessão</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-neutral-900/60 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}


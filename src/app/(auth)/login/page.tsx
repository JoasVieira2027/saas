import Link from "next/link";
import { loginAction, quickLoginAction } from "@/app/auth/actions";
import { Lock, Mail, ArrowRight, Shield, Sparkles, Scissors, Crown } from "lucide-react";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center text-neutral-950 font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            G
          </div>
          <span className="text-2xl font-bold tracking-tight text-white font-serif">GlowSaaS</span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 tracking-tight">
          Acesse sua conta
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-neutral-400">
          Entre como Administrador do SaaS ou como Cliente (Salão, Barbearia, Unhas)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900 border border-neutral-800 py-8 px-5 sm:px-10 shadow-2xl rounded-2xl">
          {/* Formulário Padrão */}
          <form action={loginAction} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                E-mail
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="seu@email.com"
                  className="block w-full rounded-lg border border-neutral-700 bg-neutral-800/80 py-2.5 pl-10 pr-3 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Senha
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  defaultValue="123456"
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-neutral-700 bg-neutral-800/80 py-2.5 pl-10 pr-3 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg bg-amber-500 text-neutral-950 font-semibold text-sm hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-colors shadow-md shadow-amber-500/20"
            >
              <span>Acessar Painel</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Divisor */}
          <div className="mt-8 pt-6 border-t border-neutral-800">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider text-center mb-3">
              Acesso Rápido para Demonstração e Testes
            </p>
            <div className="space-y-2">
              <form action={quickLoginAction.bind(null, "admin-1")}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-left transition-colors text-amber-200 text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-amber-300">Administrador Geral (Owner)</div>
                      <div className="text-xs text-neutral-400">admin@saas.com</div>
                    </div>
                  </div>
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    Superadmin
                  </span>
                </button>
              </form>

              <form action={quickLoginAction.bind(null, "salon-owner-1")}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-neutral-800 bg-neutral-800/60 hover:bg-neutral-800 text-left transition-colors text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-neutral-200">Lumière Concept Hair</div>
                      <div className="text-xs text-neutral-400">aline@lumiere.com (Salão)</div>
                    </div>
                  </div>
                  <span className="text-xs bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded">
                    Cliente
                  </span>
                </button>
              </form>

              <form action={quickLoginAction.bind(null, "barber-owner-1")}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-neutral-800 bg-neutral-800/60 hover:bg-neutral-800 text-left transition-colors text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <Scissors className="w-4 h-4 text-neutral-300 shrink-0" />
                    <div>
                      <div className="font-semibold text-neutral-200">Navalha de Ouro Barber</div>
                      <div className="text-xs text-neutral-400">marcos@navalha.com (Barbearia)</div>
                    </div>
                  </div>
                  <span className="text-xs bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded">
                    Cliente
                  </span>
                </button>
              </form>

              <form action={quickLoginAction.bind(null, "nails-owner-1")}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-neutral-800 bg-neutral-800/60 hover:bg-neutral-800 text-left transition-colors text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <Crown className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-neutral-200">Studio Gisele Nail Art</div>
                      <div className="text-xs text-neutral-400">gisele@nails.com (Unhas em Gel)</div>
                    </div>
                  </div>
                  <span className="text-xs bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded">
                    Cliente
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


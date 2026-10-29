import Link from "next/link";
import { loginAction, quickLoginAction, loginWithGoogleAction, resetPasswordAction } from "@/app/auth/actions";
import { Lock, Mail, ArrowRight, Shield, Sparkles, Scissors, Crown, AlertCircle, CheckCircle2 } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; status?: string }>;
}) {
  const params = await searchParams;
  const isDev = process.env.NODE_ENV !== "production";

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
          Entre como Administrador do SaaS ou Cliente
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900 border border-neutral-800 py-8 px-5 sm:px-10 shadow-2xl rounded-2xl">
          {/* Mensagem de Status de Sucesso */}
          {params?.status === "reset_email_sent" && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>
                Se o e-mail estiver cadastrado, você receberá em instantes as instruções e o link seguro para redefinir sua senha.
              </span>
            </div>
          )}

          {/* Mensagem de Erro de Autenticação */}
          {params?.error && (
            <div className="mb-5 flex items-start gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>
                {params.error === "invalid_credentials" && "E-mail ou senha incorretos."}
                {params.error === "missing_email" && "Por favor, informe seu e-mail."}
                {params.error === "missing_password" && "Por favor, informe sua senha."}
                {params.error === "profile_not_found" && "Perfil de usuário não encontrado."}
                {params.error === "invite_required" && "Acesso exclusivo por convite. Esta conta não possui autorização de acesso ao GlowSaaS."}
                {params.error === "auth_required" && "Faça login para acessar o painel."}
                {params.error === "unauthorized" && "Você não possui permissão para acessar esta área."}
                {params.error === "not_found" && "Usuário não localizado."}
                {params.error === "oauth_not_configured_local" && "Login com Google indisponível em ambiente local offline."}
                {params.error === "oauth_failed" && "Falha na autenticação via Google. Tente novamente."}
                {params.error === "oauth_missing_code" && "Código de autorização não retornado pelo provedor."}
                {params.error === "oauth_error" && "Erro durante a troca de credenciais do Google."}
                {!["invalid_credentials", "missing_email", "missing_password", "profile_not_found", "invite_required", "auth_required", "unauthorized", "not_found", "oauth_not_configured_local", "oauth_failed", "oauth_missing_code", "oauth_error"].includes(params.error) &&
                  "Falha na autenticação. Verifique os dados e tente novamente."}
              </span>
            </div>
          )}

          {/* 1. Botão Oficial de Login com Google OAuth */}
          <form action={loginWithGoogleAction} className="mb-5">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-750 hover:border-neutral-600 text-white font-medium text-xs sm:text-sm transition-all shadow-sm"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar com o Google</span>
            </button>
          </form>

          {/* Divisor Visual */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-neutral-900 px-3 text-neutral-400 font-medium tracking-wider">
                ou acesse com e-mail e senha
              </span>
            </div>
          </div>

          {/* 2. Formulário Padrão de E-mail e Senha */}
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Senha
                </label>
              </div>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  defaultValue={isDev ? "123456" : undefined}
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

          {/* 3. Área de Recuperação de Senha */}
          <details className="mt-4 pt-4 border-t border-neutral-800/80 group">
            <summary className="text-xs text-neutral-400 hover:text-amber-300 cursor-pointer text-center list-none select-none transition-colors">
              Esqueceu sua senha? Clique aqui
            </summary>
            <form action={resetPasswordAction} className="mt-3 space-y-2.5">
              <p className="text-[11px] text-neutral-400 text-center leading-relaxed">
                Digite seu e-mail cadastrado para receber o link de redefinição:
              </p>
              <input
                type="email"
                name="email"
                required
                placeholder="seu@email.com"
                className="block w-full rounded-lg border border-neutral-700 bg-neutral-800/80 py-2 px-3 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs border border-neutral-700 transition-colors"
              >
                Enviar link de recuperação
              </button>
            </form>
          </details>

          {/* 4. Atalhos Rápidos: Renderizados EXCLUSIVAMENTE em ambiente de desenvolvimento */}
          {isDev && (
            <div className="mt-8 pt-6 border-t border-neutral-800">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider text-center mb-3">
                Acesso Rápido para Demonstração e Testes (Dev)
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
          )}
        </div>
      </div>
    </div>
  );
}


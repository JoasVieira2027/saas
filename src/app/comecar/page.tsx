import Link from "next/link";
import { ArrowLeft, Sparkles, Scissors, Crown, MessageCircle, CheckCircle2, Shield } from "lucide-react";

export const metadata = {
  title: "Comece sua Página Profissional | GlowSaaS",
  description: "Solicite a criação da sua página comercial personalizada para salão de beleza, barbearia ou nail designer.",
};

export default function ComecarPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between">
      {/* Header simples de retorno */}
      <header className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center text-neutral-950 font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              G
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-serif">GlowSaaS</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para a página inicial</span>
          </Link>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ativação da Sua Página</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-serif">
            Quero criar minha página profissional
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            Preencha as informações do seu negócio para iniciarmos a configuração da sua página exclusiva e liberar seu acesso ao painel.
          </p>
        </div>

        {/* Card do Formulário de Solicitação */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
          <form
            action="https://wa.me/5511999999999"
            target="_blank"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Seu Nome Completo
                </label>
                <input
                  type="text"
                  name="nome"
                  required
                  placeholder="Ex: Maria Clara Silva"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Nome do Negócio ou Marca
                </label>
                <input
                  type="text"
                  name="negocio"
                  required
                  placeholder="Ex: Espaço Clara Hair & Spa"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Segmento de Atuação
                </label>
                <select
                  name="segmento"
                  required
                  defaultValue="salao"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="salao">Salão de Beleza / Estética Capilar</option>
                  <option value="barbearia">Barbearia / Corte Masculino</option>
                  <option value="unhas">Nail Designer / Unhas em Gel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  WhatsApp com DDD
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  placeholder="(11) 99999-9999"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Modelo de Interesse
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 cursor-pointer text-xs transition-colors">
                  <input
                    type="radio"
                    name="modelo"
                    value="lumiere"
                    defaultChecked
                    className="text-amber-500 focus:ring-amber-500 bg-neutral-700 border-neutral-600"
                  />
                  <span className="flex items-center gap-1.5 text-neutral-200 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    Salão Lumière
                  </span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 cursor-pointer text-xs transition-colors">
                  <input
                    type="radio"
                    name="modelo"
                    value="barbearia"
                    className="text-amber-500 focus:ring-amber-500 bg-neutral-700 border-neutral-600"
                  />
                  <span className="flex items-center gap-1.5 text-neutral-200 font-medium">
                    <Scissors className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                    Barbearia Navalha
                  </span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 cursor-pointer text-xs transition-colors">
                  <input
                    type="radio"
                    name="modelo"
                    value="unhas"
                    className="text-amber-500 focus:ring-amber-500 bg-neutral-700 border-neutral-600"
                  />
                  <span className="flex items-center gap-1.5 text-neutral-200 font-medium">
                    <Crown className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    Unhas em Gel
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Dúvidas ou Observações (Opcional)
              </label>
              <textarea
                name="observacoes"
                rows={3}
                placeholder="Conte-nos brevemente o que seu negócio oferece ou tire dúvidas sobre a configuração."
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-sm transition-all shadow-lg shadow-amber-500/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Solicitar Demonstração e Ativação</span>
              </button>
              <p className="mt-3 text-center text-xs text-neutral-500">
                Atendimento direto para esclarecer dúvidas e apresentar as condições do seu negócio.
              </p>
            </div>
          </form>

          {/* Garantias do processo */}
          <div className="mt-8 pt-6 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Sem cobrança antecipada</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Dados protegidos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Painel próprio incluso</span>
            </div>
          </div>
        </div>

        {/* Rodapé interno com link para quem já tem conta */}
        <div className="mt-8 text-center text-xs text-neutral-400">
          <span>Já possui cadastro ativo? </span>
          <Link href="/login" className="text-amber-400 hover:underline font-medium">
            Entrar no Painel do Cliente
          </Link>
        </div>
      </main>

      <footer className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
        <p>GlowSaaS • Plataforma Especializada para Salões de Beleza, Barbearias e Nail Designers</p>
      </footer>
    </div>
  );
}


import Link from "next/link";
import {
  Sparkles,
  Scissors,
  Crown,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Smartphone,
  Sliders,
  Calendar,
  MessageCircle,
  HelpCircle,
  Eye,
  Globe,
} from "lucide-react";

export const metadata = {
  title: "GlowSaaS | Sua Página Profissional de Beleza Pronta para Converter",
  description:
    "Crie uma landing page profissional para seu salão de beleza, barbearia ou espaço de nail design. Apresente serviços, preços, fotos e receba agendamentos pelo WhatsApp.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Header / Navegação */}
      <header className="border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center text-neutral-950 font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              G
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold tracking-tight text-xl text-white font-serif">GlowSaaS</span>
              <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                Páginas Profissionais
              </span>
            </div>
          </Link>

          {/* Links de ancoragem de navegação */}
          <nav className="hidden md:flex items-center gap-6 text-xs lg:text-sm text-neutral-400 font-medium">
            <a href="#modelos" className="hover:text-amber-300 transition-colors">
              Modelos
            </a>
            <a href="#beneficios" className="hover:text-amber-300 transition-colors">
              Benefícios
            </a>
            <a href="#como-funciona" className="hover:text-amber-300 transition-colors">
              Como Funciona
            </a>
            <a href="#planos" className="hover:text-amber-300 transition-colors">
              Planos
            </a>
            <a href="#duvidas" className="hover:text-amber-300 transition-colors">
              Dúvidas
            </a>
          </nav>

          {/* Ações do Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium text-neutral-300 hover:text-white px-3 py-1.5 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/comecar"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg bg-amber-500 text-neutral-950 font-semibold text-xs sm:text-sm hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
            >
              <span>Quero criar minha página</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 2. Hero Section — Primeira Dobra */}
        <section className="relative overflow-hidden pt-16 sm:pt-24 pb-20 border-b border-neutral-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            {/* Tag institucional */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs sm:text-sm font-medium mb-8 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Para Salões de Beleza, Barbearias e Nail Designers</span>
            </div>

            {/* Headline Principal */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl font-serif text-white leading-tight">
              Sua página profissional, pronta para{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
                destacar seu negócio.
              </span>
            </h1>

            {/* Subtítulo Comercial */}
            <p className="mt-6 text-base sm:text-lg text-neutral-400 max-w-2xl leading-relaxed">
              Apresente seus serviços, tabela de preços, fotos dos seus melhores trabalhos, informações completas de atendimento e receba agendamentos diretos pelo WhatsApp com praticidade.
            </p>

            {/* CTAs Principais */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
              <Link
                href="/comecar"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 text-neutral-950 font-semibold text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <span>Quero criar minha página</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#modelos"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 font-medium text-sm hover:bg-neutral-800/80 hover:text-white transition-colors"
              >
                <Eye className="w-4 h-4 text-neutral-400" />
                <span>Ver modelos</span>
              </a>
            </div>

            {/* Demonstração Visual Rápida dos 3 Modelos Reais */}
            <div className="mt-16 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
              {/* Card Resumo 1: Salão */}
              <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                      Salão de Beleza
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <h2 className="text-base font-semibold text-white">Modelo Lumière Concept</h2>
                  <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">
                    Visual elegante para cabeleireiros, tratamentos capilares e spas. Catálogo detalhado e galeria de transformações.
                  </p>
                </div>
                <Link
                  href="/p/lumiere-hair"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-amber-400 font-medium hover:text-amber-300 transition-colors"
                >
                  <span>Prévia do modelo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Card Resumo 2: Barbearia */}
              <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300 bg-neutral-800 px-2.5 py-0.5 rounded border border-neutral-700">
                      Barbearia
                    </span>
                    <Scissors className="w-4 h-4 text-neutral-400" />
                  </div>
                  <h2 className="text-base font-semibold text-white">Modelo Navalha de Ouro</h2>
                  <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">
                    Identidade clássica em grafite e âmbar para cortes e barba. Combos em destaque e contato rápido no WhatsApp.
                  </p>
                </div>
                <Link
                  href="/p/navalha-de-ouro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-amber-400 font-medium hover:text-amber-300 transition-colors"
                >
                  <span>Prévia do modelo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Card Resumo 3: Unhas */}
              <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-300 bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/20">
                      Unhas em Gel
                    </span>
                    <Crown className="w-4 h-4 text-rose-400" />
                  </div>
                  <h2 className="text-base font-semibold text-white">Modelo Gisele Nail Art</h2>
                  <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">
                    Estética refinada em rosé e nude suave. Fotografias de alta resolução, biossegurança e tabela de procedimentos.
                  </p>
                </div>
                <Link
                  href="/p/gisele-nails"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-rose-300 font-medium hover:text-rose-200 transition-colors"
                >
                  <span>Prévia do modelo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Seção de Modelos Disponíveis */}
        <section id="modelos" className="py-20 border-b border-neutral-800/60 bg-neutral-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                Templates Reais
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-serif mt-2">
                Modelos desenvolvidos para o seu segmento
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-400">
                Cada modelo foi planejado considerando a rotina de atendimento e as preferências do público de cada nicho da beleza.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Modelo 1: Salão */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition-colors">
                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-2 text-amber-400 mb-3">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs uppercase tracking-wider font-bold">Salão de Beleza</span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-serif">Modelo Lumière Concept</h3>
                  <p className="mt-1 text-xs text-neutral-400">
                    <strong className="text-neutral-300">Indicado para:</strong> Cabeleireiros, coloristas, tratamentos capilares e spas urbanos.
                  </p>

                  <div className="mt-6 pt-5 border-t border-neutral-800/80 space-y-2.5 text-xs text-neutral-300">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Catálogo de mechas, cortes e procedimentos com duração e valor.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Galeria de transformações e fotos de alta resolução.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Botões diretos com mensagem personalizada no WhatsApp.</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7 pt-0">
                  <Link
                    href="/p/lumiere-hair"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700/80 text-white font-semibold text-xs sm:text-sm border border-neutral-700 transition-colors"
                  >
                    <span>Ver modelo</span>
                    <ExternalLink className="w-4 h-4 text-neutral-400" />
                  </Link>
                </div>
              </div>

              {/* Modelo 2: Barbearia */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition-colors">
                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-2 text-neutral-300 mb-3">
                    <Scissors className="w-5 h-5 text-amber-400" />
                    <span className="text-xs uppercase tracking-wider font-bold">Barbearia</span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-serif">Modelo Navalha de Ouro</h3>
                  <p className="mt-1 text-xs text-neutral-400">
                    <strong className="text-neutral-300">Indicado para:</strong> Barbearias tradicionais, estúdios masculinos e barbeiros autônomos.
                  </p>

                  <div className="mt-6 pt-5 border-t border-neutral-800/80 space-y-2.5 text-xs text-neutral-300">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Combos especiais de corte e barba com preço e tempo estimado.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Apresentação dos barbeiros e ambiente do estabelecimento.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Agendamento ágil para evitar tempo de espera e filas.</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7 pt-0">
                  <Link
                    href="/p/navalha-de-ouro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700/80 text-white font-semibold text-xs sm:text-sm border border-neutral-700 transition-colors"
                  >
                    <span>Ver modelo</span>
                    <ExternalLink className="w-4 h-4 text-neutral-400" />
                  </Link>
                </div>
              </div>

              {/* Modelo 3: Unhas */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-rose-500/40 transition-colors">
                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-2 text-rose-300 mb-3">
                    <Crown className="w-5 h-5 text-rose-400" />
                    <span className="text-xs uppercase tracking-wider font-bold">Unhas em Gel</span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-serif">Modelo Gisele Nail Art</h3>
                  <p className="mt-1 text-xs text-neutral-400">
                    <strong className="text-neutral-300">Indicado para:</strong> Nail designers, manicures especializadas e estúdios de alongamento.
                  </p>

                  <div className="mt-6 pt-5 border-t border-neutral-800/80 space-y-2.5 text-xs text-neutral-300">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>Fotografias amplas destacando acabamento, formatos e arte.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>Procedimentos de aplicação, manutenção e biossegurança.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>Estética sofisticada em tons neutros, rosé e off-white.</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7 pt-0">
                  <Link
                    href="/p/gisele-nails"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700/80 text-white font-semibold text-xs sm:text-sm border border-neutral-700 transition-colors"
                  >
                    <span>Ver modelo</span>
                    <ExternalLink className="w-4 h-4 text-neutral-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Seção de Benefícios */}
        <section id="beneficios" className="py-20 border-b border-neutral-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                Vantagens Reais
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-serif mt-2">
                Tudo o que seu negócio precisa para transmitir confiança
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-400">
                Recursos planejados para valorizar seu trabalho e facilitar o primeiro contato com novos clientes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Benefício 1 */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white">Apresentação Profissional do Negócio</h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Tenha um link próprio para a bio do seu Instagram, organizando sua presença digital com elegância e passando credibilidade imediata.
                </p>
              </div>

              {/* Benefício 2 */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white">Serviços, Preços e Galeria</h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Deixe claro o que você oferece, o tempo estimado de cada atendimento e os valores exatos, acompanhados de fotos dos seus trabalhos.
                </p>
              </div>

              {/* Benefício 3 */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white">Acesso Direto ao WhatsApp</h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Os clientes clicam no serviço desejado e já abrem uma conversa no seu WhatsApp com a mensagem pré-preenchida, agilizando seu atendimento.
                </p>
              </div>

              {/* Benefício 4 */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white">Personalização Visual pelo Painel</h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Altere nome do negócio, logo, cores de destaque, horários, fotos da galeria e endereço sem depender de suporte e sem tocar em código.
                </p>
              </div>

              {/* Benefício 5 */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 md:col-span-2 lg:col-span-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white">Layout Adaptado para Celular, Tablet e Computador</h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Desenvolvido com foco no celular (mobile-first), o site abre rapidamente, sem travar e sem quebrar o layout no Safari do iPhone ou no Google Chrome do Android.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Seção Como Funciona */}
        <section id="como-funciona" className="py-20 border-b border-neutral-800/60 bg-neutral-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                Passo a Passo
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-serif mt-2">
                Como ter sua página pronta em 3 etapas
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-400">
                Sem complexidade técnica: do cadastro das informações até o link no ar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Etapa 1 */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 relative">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 font-bold text-sm flex items-center justify-center mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold text-white font-serif">Escolha o modelo do seu segmento</h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Defina o modelo estruturado para Salão, Barbearia ou Unhas em Gel que melhor expressa o estilo do seu atendimento.
                </p>
              </div>

              {/* Etapa 2 */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 relative">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 font-bold text-sm flex items-center justify-center mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold text-white font-serif">Personalize informações e fotos</h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  No painel do cliente, cadastre seus procedimentos, valores, horários de atendimento, endereço e envie as fotos da sua galeria.
                </p>
              </div>

              {/* Etapa 3 */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 relative">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 font-bold text-sm flex items-center justify-center mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold text-white font-serif">Configure e publique sua página</h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Visualize o resultado no preview do painel e publique sua página com um clique para divulgar o link aos seus clientes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Seção de Planos e Condições */}
        <section id="planos" className="py-20 border-b border-neutral-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                Condições Comerciais
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-serif mt-2">
                Planos transparentes e suporte dedicado
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-400">
                Estrutura completa com hospedagem veloz, certificado de segurança e painel administrativo inclusos.
              </p>
            </div>

            <div className="max-w-2xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-7 sm:p-10 shadow-xl">
              <div className="text-center pb-6 border-b border-neutral-800">
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Estrutura Completa Inclusa
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-serif mt-4">
                  Página Profissional com Painel do Cliente
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-400">
                  Condições sob medida para o tamanho e a necessidade do seu estabelecimento.
                </p>
              </div>

              <div className="py-6 space-y-3 text-xs sm:text-sm text-neutral-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Modelo especializado (Salão, Barbearia ou Unhas em Gel)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Painel do cliente para editar serviços, preços, fotos e horários</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Integração de agendamento direto com seu WhatsApp</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Hospedagem em nuvem de alta velocidade e certificado SSL</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Orientação inicial na configuração do seu conteúdo</span>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-800">
                <Link
                  href="/comecar"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-sm transition-all shadow-md shadow-amber-500/20"
                >
                  <span>Solicitar Informações e Demonstração</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="mt-3 text-center text-xs text-neutral-500">
                  Entre em contato com a equipe comercial para consultar valores e disponibilidade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Seção de Perguntas Frequentes (FAQ) */}
        <section id="duvidas" className="py-20 border-b border-neutral-800/60 bg-neutral-900/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                Dúvidas Comuns
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-serif mt-2">
                Perguntas Frequentes
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-400">
                Respostas objetivas sobre o funcionamento do painel e das páginas.
              </p>
            </div>

            <div className="space-y-4">
              {/* FAQ 1 */}
              <div className="p-5 sm:p-6 rounded-xl bg-neutral-900 border border-neutral-800">
                <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Preciso de conhecimento técnico para personalizar minha página?</span>
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-neutral-400 leading-relaxed pl-6">
                  Não. O GlowSaaS possui um painel simples e intuitivo onde você altera textos, preços, horários e fotos de forma visual, sem digitar uma linha de código.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className="p-5 sm:p-6 rounded-xl bg-neutral-900 border border-neutral-800">
                <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Como os clientes realizam o agendamento?</span>
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-neutral-400 leading-relaxed pl-6">
                  Cada serviço e seção da página conta com botões integrados ao WhatsApp. Ao clicar, o cliente é direcionado diretamente para uma conversa no seu número com a mensagem do serviço que ele deseja pré-preenchida.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className="p-5 sm:p-6 rounded-xl bg-neutral-900 border border-neutral-800">
                <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Posso colocar fotos reais dos meus procedimentos?</span>
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-neutral-400 leading-relaxed pl-6">
                  Sim. O painel inclui uma área de galeria onde você pode adicionar, ordenar e remover imagens dos seus trabalhos reais para que seus visitantes conheçam a qualidade do seu atendimento.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className="p-5 sm:p-6 rounded-xl bg-neutral-900 border border-neutral-800">
                <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>A página funciona bem no celular?</span>
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-neutral-400 leading-relaxed pl-6">
                  Sim. Todos os modelos foram desenvolvidos com foco prioritário em dispositivos móveis (mobile-first), garantindo navegação rápida, tipografia confortável e botões de toque adequados para telas de celular.
                </p>
              </div>

              {/* FAQ 5 */}
              <div className="p-5 sm:p-6 rounded-xl bg-neutral-900 border border-neutral-800">
                <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>O que acontece se eu precisar alterar o preço de um serviço?</span>
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-neutral-400 leading-relaxed pl-6">
                  Você entra no seu painel pelo celular ou computador, edita o valor no catálogo de serviços e salva. A alteração passa a valer imediatamente na sua página pública.
                </p>
              </div>

              {/* FAQ 6 */}
              <div className="p-5 sm:p-6 rounded-xl bg-neutral-900 border border-neutral-800">
                <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Como posso começar a usar a plataforma?</span>
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-neutral-400 leading-relaxed pl-6">
                  Basta clicar em 'Quero criar minha página' para solicitar seu espaço. Nossa equipe prestará as orientações iniciais para liberar seu acesso ao painel e publicar seu modelo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. CTA Final */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-serif max-w-2xl mx-auto">
              Pronto para ter uma página profissional para o seu negócio?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">
              Destaque seu espaço, organize seus serviços e facilite o agendamento dos seus clientes.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/comecar"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 text-neutral-950 font-semibold text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <span>Quero criar minha página</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#modelos"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 font-medium text-sm hover:bg-neutral-800/80 hover:text-white transition-colors"
              >
                <Eye className="w-4 h-4 text-neutral-400" />
                <span>Ver modelos disponíveis</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Footer */}
      <footer className="border-t border-neutral-800/80 py-12 bg-neutral-950 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-800/60">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-neutral-950 font-bold text-xs">
                G
              </div>
              <span className="font-bold tracking-tight text-sm text-white font-serif">GlowSaaS</span>
              <span className="text-[11px] text-neutral-500 ml-2">
                Páginas profissionais para negócios de beleza
              </span>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
              <a href="#modelos" className="hover:text-amber-300 transition-colors">
                Modelos
              </a>
              <a href="#beneficios" className="hover:text-amber-300 transition-colors">
                Benefícios
              </a>
              <a href="#como-funciona" className="hover:text-amber-300 transition-colors">
                Como Funciona
              </a>
              <a href="#planos" className="hover:text-amber-300 transition-colors">
                Planos
              </a>
              <a href="#duvidas" className="hover:text-amber-300 transition-colors">
                Dúvidas
              </a>
              <Link href="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                Entrar no Painel
              </Link>
            </nav>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
            <p>GlowSaaS • Todos os direitos reservados. Modelos para Salões de Beleza, Barbearias e Nail Designers.</p>
            <p>Plataforma de alta conversão integrada ao WhatsApp.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

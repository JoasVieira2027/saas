import Link from "next/link";
import Image from "next/image";
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
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export const metadata = {
  title: "GlowSaaS — Páginas Profissionais para Especialistas da Beleza",
  description:
    "Páginas elegantes, rápidas e orientadas à conversão para salões de beleza, barbearias e nail designers. Apresente serviços, fotos e receba agendamentos no WhatsApp.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917] selection:bg-[#EAE0D5] selection:text-[#1C1917] font-sans antialiased">
      {/* ─────────────────────────────────────────────────────────────
          1. CABEÇALHO (Compacto, elegante, editorial)
         ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#EAE4DC] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo e Nome */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-lg bg-[#1C1917] text-[#FAF8F5] flex items-center justify-center font-serif font-bold text-base shadow-sm group-hover:bg-[#2D2825] transition-colors">
              G
            </span>
            <span className="font-serif font-bold text-lg tracking-tight text-[#1C1917]">
              GlowSaaS
            </span>
          </Link>

          {/* Navegação Curta */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#57534E]">
            <a href="#modelos" className="hover:text-[#1C1917] transition-colors">
              Modelos
            </a>
            <a href="#beneficios" className="hover:text-[#1C1917] transition-colors">
              Recursos
            </a>
            <a href="#como-funciona" className="hover:text-[#1C1917] transition-colors">
              Como Funciona
            </a>
            <a href="#condicoes" className="hover:text-[#1C1917] transition-colors">
              Assinatura
            </a>
            <a href="#duvidas" className="hover:text-[#1C1917] transition-colors">
              Dúvidas
            </a>
          </nav>

          {/* Ações */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium text-[#57534E] hover:text-[#1C1917] px-3 py-1.5 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/comecar"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg bg-[#1C1917] text-[#FAF8F5] text-xs sm:text-sm font-semibold hover:bg-[#2D2825] active:scale-[0.98] transition-all shadow-sm"
            >
              <span>Criar minha página</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D7C4B2]" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ─────────────────────────────────────────────────────────────
            2. HERO PRINCIPAL (Editorial, objetivo e com preview real)
           ───────────────────────────────────────────────────────────── */}
        <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden border-b border-[#EAE4DC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Tag de Segmento */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFECE6] border border-[#E2DDD5] text-[#57534E] text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C5E32]" />
              <span>Salões de Beleza · Barbearias · Nail Designers</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1C1917] max-w-3xl mx-auto leading-[1.15]">
              Sua página profissional, pronta para valorizar o seu trabalho.
            </h1>

            {/* Subtítulo */}
            <p className="mt-5 text-sm sm:text-base lg:text-lg text-[#57534E] max-w-2xl mx-auto leading-relaxed">
              Apresente serviços com valores e tempo de atendimento, mostre fotos reais do seu espaço e receba pedidos de agendamento diretamente no WhatsApp — sem cobrança de comissões.
            </p>

            {/* Chamadas de Ação */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              <Link
                href="/comecar"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1C1917] text-[#FAF8F5] text-sm font-semibold hover:bg-[#2D2825] transition-all shadow-md active:scale-[0.98]"
              >
                <span>Solicitar criação da página</span>
                <ArrowRight className="w-4 h-4 text-[#D7C4B2]" />
              </Link>
              <a
                href="#modelos"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-[#DDD7CD] text-[#1C1917] text-sm font-medium hover:bg-[#F5F2ED] transition-colors"
              >
                <span>Explorar demonstrações</span>
                <ChevronRight className="w-4 h-4 text-[#78716C]" />
              </a>
            </div>

            {/* Demonstração Visual Real: Mockup de Navegador com a Página Lumière Concept */}
            <div className="mt-14 sm:mt-16 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl border border-[#DDD7CD] shadow-xl overflow-hidden text-left">
                {/* Barra do Navegador */}
                <div className="bg-[#F5F2ED] px-4 py-3 border-b border-[#EAE4DC] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#E5DCD0]" />
                    <span className="w-3 h-3 rounded-full bg-[#E5DCD0]" />
                    <span className="w-3 h-3 rounded-full bg-[#E5DCD0]" />
                  </div>
                  <div className="bg-white px-4 py-1 rounded-md text-[11px] text-[#78716C] font-mono border border-[#EAE4DC] flex items-center gap-2 max-w-xs truncate">
                    <span className="text-[#8C5E32]">https://</span>
                    <span>glowsaas.com/p/lumiere-hair</span>
                  </div>
                  <div className="text-[11px] font-medium text-[#78716C] hidden sm:block">
                    Modelo Salão
                  </div>
                </div>

                {/* Conteúdo Real do Preview */}
                <div className="p-6 sm:p-10 bg-[#FAF8F5]">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7 space-y-4">
                      <span className="inline-block text-[11px] font-semibold tracking-wider uppercase text-[#8C5E32] bg-[#F1E8DF] px-2.5 py-1 rounded">
                        Lumière Concept Hair & Spa
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1C1917] leading-tight">
                        Elegância e cuidado em cada detalhe do seu cabelo.
                      </h2>
                      <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                        Mechas personalizadas, tratamentos capilares profundos e visagismo em um ambiente acolhedor no bairro Jardins, São Paulo.
                      </p>

                      {/* Tabela de Serviços Resumida */}
                      <div className="pt-2 border-t border-[#EAE4DC] space-y-2">
                        <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#EAE4DC]/60">
                          <span className="font-medium text-[#1C1917]">Mechas Criativas & Iluminação</span>
                          <span className="font-semibold text-[#8C5E32]">R$ 480,00</span>
                        </div>
                        <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#EAE4DC]/60">
                          <span className="font-medium text-[#1C1917]">Tratamento Reconstrutor Fusion</span>
                          <span className="font-semibold text-[#8C5E32]">R$ 220,00</span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-3">
                        <Link
                          href="/p/lumiere-hair"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#8C5E32] text-white text-xs font-semibold hover:bg-[#784F29] transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Agendar Atendimento VIP</span>
                        </Link>
                        <span className="text-[11px] text-[#78716C] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Terça a Sábado das 09h às 19h</span>
                        </span>
                      </div>
                    </div>

                    {/* Imagem Real do Modelo */}
                    <div className="lg:col-span-5">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#EAE4DC] shadow-sm bg-[#EFECE6]">
                        <Image
                          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
                          alt="Ambiente profissional do salão Lumière Concept"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 400px"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            3. MODELOS DISPONÍVEIS (Seção ÚNICA com 3 modelos reais)
           ───────────────────────────────────────────────────────────── */}
        <section id="modelos" className="py-16 sm:py-24 border-b border-[#EAE4DC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C5E32]">
                Modelos Especializados
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#1C1917] mt-2">
                Projetados para a realidade de cada profissional
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#57534E]">
                Cada segmento possui necessidades específicas de atendimento. Nossos modelos organizam os serviços e fotos da forma como seus clientes esperam encontrar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Modelo 1: Salão de Beleza */}
              <div className="bg-white rounded-2xl border border-[#DDD7CD] overflow-hidden flex flex-col justify-between shadow-sm hover:border-[#8C5E32]/60 transition-colors">
                <div>
                  <div className="relative aspect-[16/10] bg-[#EFECE6] border-b border-[#EAE4DC]">
                    <Image
                      src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
                      alt="Modelo para Salão de Beleza"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 350px"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#EAE4DC] text-[11px] font-semibold text-[#8C5E32] flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>Salão de Beleza</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif text-xl text-[#1C1917]">Lumière Concept</h3>
                    <p className="mt-2 text-xs text-[#57534E] leading-relaxed">
                      Voltado para cabeleireiros, visagistas e clínicas de estética capilar. Destaque para catálogo de mechas, cortes e fotos de transformações.
                    </p>

                    <div className="mt-5 pt-4 border-t border-[#EAE4DC] space-y-2 text-xs text-[#57534E]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5E32]" />
                        <span>Preço e duração de cada procedimento</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5E32]" />
                        <span>Galeria de fotos em alta resolução</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5E32]" />
                        <span>Mensagem automática no WhatsApp</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href="/p/lumiere-hair"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-[#FAF8F5] border border-[#DDD7CD] hover:bg-[#F3EFE9] text-xs font-semibold text-[#1C1917] transition-colors"
                  >
                    <span>Ver página ao vivo</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#78716C]" />
                  </Link>
                </div>
              </div>

              {/* Modelo 2: Barbearia */}
              <div className="bg-white rounded-2xl border border-[#DDD7CD] overflow-hidden flex flex-col justify-between shadow-sm hover:border-[#8C5E32]/60 transition-colors">
                <div>
                  <div className="relative aspect-[16/10] bg-[#EFECE6] border-b border-[#EAE4DC]">
                    <Image
                      src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80"
                      alt="Modelo para Barbearia"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 350px"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#EAE4DC] text-[11px] font-semibold text-[#1C1917] flex items-center gap-1.5">
                      <Scissors className="w-3 h-3" />
                      <span>Barbearia</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif text-xl text-[#1C1917]">Navalha de Ouro</h3>
                    <p className="mt-2 text-xs text-[#57534E] leading-relaxed">
                      Identidade moderna e masculina em tons sóbrios. Apresentação clara de cortes tradicionais, degradê, barba na toalha quente e combos.
                    </p>

                    <div className="mt-5 pt-4 border-t border-[#EAE4DC] space-y-2 text-xs text-[#57534E]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5E32]" />
                        <span>Menu de cortes individuais e combos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5E32]" />
                        <span>Horários de atendimento e dias abertos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5E32]" />
                        <span>Botão de agendamento ágil</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href="/p/navalha-de-ouro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-[#FAF8F5] border border-[#DDD7CD] hover:bg-[#F3EFE9] text-xs font-semibold text-[#1C1917] transition-colors"
                  >
                    <span>Ver página ao vivo</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#78716C]" />
                  </Link>
                </div>
              </div>

              {/* Modelo 3: Nail Designer */}
              <div className="bg-white rounded-2xl border border-[#DDD7CD] overflow-hidden flex flex-col justify-between shadow-sm hover:border-[#8C5E32]/60 transition-colors">
                <div>
                  <div className="relative aspect-[16/10] bg-[#EFECE6] border-b border-[#EAE4DC]">
                    <Image
                      src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80"
                      alt="Modelo para Nail Designer"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 350px"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#EAE4DC] text-[11px] font-semibold text-[#9C5A48] flex items-center gap-1.5">
                      <Crown className="w-3 h-3" />
                      <span>Unhas em Gel</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif text-xl text-[#1C1917]">Studio Gisele Nails</h3>
                    <p className="mt-2 text-xs text-[#57534E] leading-relaxed">
                      Estética delicada e refinada. Destaque para alongamento em gel moldado, blindagem diamantada, protocolos de biossegurança e fotos de detalhes.
                    </p>

                    <div className="mt-5 pt-4 border-t border-[#EAE4DC] space-y-2 text-xs text-[#57534E]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5E32]" />
                        <span>Tabela de alongamentos e manutenções</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5E32]" />
                        <span>Seção de biossegurança e materiais</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5E32]" />
                        <span>Canal de agendamento direto</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href="/p/gisele-nails"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-[#FAF8F5] border border-[#DDD7CD] hover:bg-[#F3EFE9] text-xs font-semibold text-[#1C1917] transition-colors"
                  >
                    <span>Ver página ao vivo</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#78716C]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            4. BENEFÍCIOS CONCRETOS (Recursos reais do sistema)
           ───────────────────────────────────────────────────────────── */}
        <section id="beneficios" className="py-16 sm:py-24 border-b border-[#EAE4DC] bg-[#FAF8F5]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C5E32]">
                Recursos Concretos
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#1C1917] mt-2">
                O que sua página realmente oferece
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#57534E]">
                Funcionalidades desenvolvidas especificamente para o fluxo de quem atende clientes por hora marcada.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-white border border-[#DDD7CD]">
                <div className="w-9 h-9 rounded-lg bg-[#F5F2ED] text-[#8C5E32] flex items-center justify-center mb-4">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-[#1C1917]">Visual Impecável no Celular</h3>
                <p className="mt-1.5 text-xs text-[#57534E] leading-relaxed">
                  Mais de 90% dos seus clientes abrem o link pelo Instagram. A página é leve, rápida e calibrada para qualquer tamanho de tela.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[#DDD7CD]">
                <div className="w-9 h-9 rounded-lg bg-[#F5F2ED] text-[#8C5E32] flex items-center justify-center mb-4">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-[#1C1917]">Catálogo com Preço e Duração</h3>
                <p className="mt-1.5 text-xs text-[#57534E] leading-relaxed">
                  Evite responder repetidamente sobre valores. O cliente escolhe o procedimento já sabendo quanto custa e o tempo necessário.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[#DDD7CD]">
                <div className="w-9 h-9 rounded-lg bg-[#F5F2ED] text-[#8C5E32] flex items-center justify-center mb-4">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-[#1C1917]">Agendamento Direto no WhatsApp</h3>
                <p className="mt-1.5 text-xs text-[#57534E] leading-relaxed">
                  Ao clicar em agendar, o cliente é direcionado para sua conversa com uma mensagem pré-preenchida contendo o serviço escolhido.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[#DDD7CD]">
                <div className="w-9 h-9 rounded-lg bg-[#F5F2ED] text-[#8C5E32] flex items-center justify-center mb-4">
                  <Sliders className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-[#1C1917]">Painel de Edição Autônomo</h3>
                <p className="mt-1.5 text-xs text-[#57534E] leading-relaxed">
                  Acesse sua área restrita a qualquer momento para atualizar preços, adicionar novos tratamentos ou alterar horários de funcionamento.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[#DDD7CD]">
                <div className="w-9 h-9 rounded-lg bg-[#F5F2ED] text-[#8C5E32] flex items-center justify-center mb-4">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-[#1C1917]">Localização e Horários Claros</h3>
                <p className="mt-1.5 text-xs text-[#57534E] leading-relaxed">
                  Endereço completo com link para o Google Maps e tabela semanal de expediente para o cliente saber exatamente quando encontrar você.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[#DDD7CD]">
                <div className="w-9 h-9 rounded-lg bg-[#F5F2ED] text-[#8C5E32] flex items-center justify-center mb-4">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-[#1C1917]">Sem Comissões por Procedimento</h3>
                <p className="mt-1.5 text-xs text-[#57534E] leading-relaxed">
                  O valor de cada atendimento fica 100% com você. Você paga apenas a mensalidade fixa da sua página, sem descontos por cliente agendado.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            5. COMO FUNCIONA (Processo em 3 etapas reais)
           ───────────────────────────────────────────────────────────── */}
        <section id="como-funciona" className="py-16 sm:py-24 border-b border-[#EAE4DC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C5E32]">
                Passo a Passo
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#1C1917] mt-2">
                Como ter sua página profissional
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#57534E]">
                Um processo simples, sem necessidade de conhecimento técnico.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="space-y-3">
                <span className="font-serif text-3xl text-[#8C5E32] block">01</span>
                <h3 className="font-semibold text-base text-[#1C1917]">Escolha o Modelo</h3>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  Selecione o modelo que melhor representa o seu segmento: salão de beleza, barbearia tradicional ou espaço de nail design.
                </p>
              </div>

              <div className="space-y-3">
                <span className="font-serif text-3xl text-[#8C5E32] block">02</span>
                <h3 className="font-semibold text-base text-[#1C1917]">Envie as Informações</h3>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  Informe o nome do seu espaço, tabela de serviços com valores, horário de funcionamento e o número do seu WhatsApp de atendimento.
                </p>
              </div>

              <div className="space-y-3">
                <span className="font-serif text-3xl text-[#8C5E32] block">03</span>
                <h3 className="font-semibold text-base text-[#1C1917]">Página Publicada</h3>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  Sua página é ativada no seu endereço exclusivo para você divulgar na bio do Instagram e receber acessos ao painel de gerenciamento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            6. CONDIÇÕES COMERCIAIS (Transparência real de planos)
           ───────────────────────────────────────────────────────────── */}
        <section id="condicoes" className="py-16 sm:py-24 border-b border-[#EAE4DC] bg-[#FAF8F5]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C5E32]">
                Condições Comerciais
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#1C1917] mt-2">
                Planos simples, sem taxas ocultas
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#57534E]">
                A ativação da sua página é acompanhada por nossa equipe para garantir que suas informações fiquem perfeitamente configuradas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
              {/* Plano Starter */}
              <div className="bg-white rounded-2xl border border-[#DDD7CD] p-6 sm:p-8 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#78716C]">
                    Plano Essencial
                  </span>
                  <h3 className="font-serif text-2xl text-[#1C1917] mt-1">Starter</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-xs font-medium text-[#78716C]">R$</span>
                    <span className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">97</span>
                    <span className="text-xs text-[#78716C]">/mês</span>
                  </div>
                  <p className="mt-3 text-xs text-[#57534E] leading-relaxed">
                    Ideal para profissionais autônomos, barbeiros e nail designers que querem uma presença online elegante e eficiente.
                  </p>

                  <div className="mt-6 pt-5 border-t border-[#EAE4DC] space-y-2.5 text-xs text-[#57534E]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5E32]" />
                      <span>Página completa no seu segmento</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5E32]" />
                      <span>Até 12 serviços cadastrados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5E32]" />
                      <span>Link direto para seu WhatsApp</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5E32]" />
                      <span>Painel para atualização de preços</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5E32]" />
                      <span>Hospedagem segura inclusa</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/comecar"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-[#FAF8F5] border border-[#DDD7CD] hover:bg-[#F3EFE9] text-xs font-semibold text-[#1C1917] transition-colors"
                  >
                    <span>Solicitar ativação</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#78716C]" />
                  </Link>
                </div>
              </div>

              {/* Plano Pro */}
              <div className="bg-white rounded-2xl border-2 border-[#1C1917] p-6 sm:p-8 flex flex-col justify-between shadow-md relative">
                <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#1C1917] text-[#FAF8F5] text-[10px] font-semibold uppercase tracking-wider">
                  Recomendado para Salões
                </span>

                <div>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8C5E32]">
                    Plano Avançado
                  </span>
                  <h3 className="font-serif text-2xl text-[#1C1917] mt-1">Pro</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-xs font-medium text-[#78716C]">R$</span>
                    <span className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">197</span>
                    <span className="text-xs text-[#78716C]">/mês</span>
                  </div>
                  <p className="mt-3 text-xs text-[#57534E] leading-relaxed">
                    Para salões maiores e estúdios com equipes, catálogo extenso de procedimentos e galeria completa de transformações.
                  </p>

                  <div className="mt-6 pt-5 border-t border-[#EAE4DC] space-y-2.5 text-xs text-[#57534E]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5E32]" />
                      <span>Todos os recursos do plano Starter</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5E32]" />
                      <span>Serviços e categorias ilimitadas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5E32]" />
                      <span>Galeria de imagens expandida</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5E32]" />
                      <span>Suporte prioritário na configuração</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8C5E32]" />
                      <span>Subdomínio exclusivo personalizado</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/comecar"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-[#1C1917] hover:bg-[#2D2825] text-xs font-semibold text-[#FAF8F5] transition-colors"
                  >
                    <span>Solicitar ativação Pro</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D7C4B2]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            7. PERGUNTAS FREQUENTES (FAQ objetivo e verdadeiro)
           ───────────────────────────────────────────────────────────── */}
        <section id="duvidas" className="py-16 sm:py-24 border-b border-[#EAE4DC]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C5E32]">
                Dúvidas Comuns
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#1C1917] mt-2">
                Perguntas Frequentes
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-white border border-[#DDD7CD]">
                <h3 className="font-semibold text-sm text-[#1C1917]">
                  Para quais profissionais a plataforma é indicada?
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  O GlowSaaS foi planejado especificamente para quem trabalha com beleza e estética: salões de beleza, cabeleireiros, barbearias tradicionais, nail designers e profissionais de unhas em gel.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[#DDD7CD]">
                <h3 className="font-semibold text-sm text-[#1C1917]">
                  Eu mesmo consigo alterar meus serviços e preços depois da publicação?
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  Sim. Cada cliente recebe acesso ao seu próprio painel de controle. Lá você pode editar valores, criar novos serviços, alterar descrições e atualizar os horários de funcionamento sempre que precisar.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[#DDD7CD]">
                <h3 className="font-semibold text-sm text-[#1C1917]">
                  Como meus clientes agendam horário pela página?
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  A página conta com botões estratégicos que direcionam o cliente diretamente para o seu WhatsApp oficial, com a mensagem formatada contendo o nome do serviço escolhido. Você mantém o controle total da sua agenda.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[#DDD7CD]">
                <h3 className="font-semibold text-sm text-[#1C1917]">
                  Preciso pagar comissão por cada atendimento realizado?
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  Não. Não cobramos nenhuma taxa ou porcentagem sobre seus atendimentos. O valor pago pelos seus clientes é 100% seu. Você paga apenas a assinatura mensal para manter a página no ar e ter acesso ao painel.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[#DDD7CD]">
                <h3 className="font-semibold text-sm text-[#1C1917]">
                  Como faço para contratar e ativar minha página?
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  Basta clicar no botão &ldquo;Criar minha página&rdquo; e preencher as informações básicas do seu negócio. Nossa equipe entrará em contato para organizar seus dados, montar a página no modelo escolhido e liberar seu acesso ao painel.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            8. CHAMADA FINAL
           ───────────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 bg-[#FAF8F5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-2xl sm:text-4xl text-[#1C1917] max-w-xl mx-auto">
              Pronto para transformar a apresentação do seu espaço?
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-[#57534E] max-w-md mx-auto leading-relaxed">
              Destaque seus melhores trabalhos e proporcione aos seus clientes a experiência que seu negócio merece.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/comecar"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1C1917] text-[#FAF8F5] text-sm font-semibold hover:bg-[#2D2825] transition-all shadow-md active:scale-[0.98]"
              >
                <span>Criar minha página agora</span>
                <ArrowRight className="w-4 h-4 text-[#D7C4B2]" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-[#DDD7CD] text-[#1C1917] text-sm font-medium hover:bg-[#F5F2ED] transition-colors"
              >
                <span>Acessar painel do cliente</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          9. RODAPÉ (Sóbrio, organizado e sem links falsos)
         ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#EAE4DC] bg-white py-12 text-[#78716C] text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded bg-[#1C1917] text-[#FAF8F5] flex items-center justify-center font-serif font-bold text-xs">
              G
            </span>
            <span className="font-serif font-semibold text-[#1C1917]">GlowSaaS</span>
            <span className="text-[#A8A29E]">· Plataforma de Páginas para a Beleza</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#modelos" className="hover:text-[#1C1917] transition-colors">
              Modelos
            </a>
            <a href="#beneficios" className="hover:text-[#1C1917] transition-colors">
              Recursos
            </a>
            <a href="#condicoes" className="hover:text-[#1C1917] transition-colors">
              Assinatura
            </a>
            <Link href="/login" className="hover:text-[#1C1917] transition-colors">
              Painel
            </Link>
          </div>

          <div>
            <span>&copy; {new Date().getFullYear()} GlowSaaS. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

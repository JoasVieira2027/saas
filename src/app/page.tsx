import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
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
  ChevronDown,
} from "lucide-react";

export const metadata = {
  title: "GlowSaaS — Páginas Profissionais para Especialistas da Beleza",
  description:
    "Páginas elegantes, rápidas e orientadas à conversão para salões de beleza, barbearias e nail designers. Apresente serviços, fotos e receba agendamentos no WhatsApp.",
};

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ code?: string; error?: string; [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  if (params?.code) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) query.set(key, value);
    }
    redirect(`/auth/callback?${query.toString()}`);
  }

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
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57534E]">
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
              A página profissional que valoriza seus serviços e organiza seus agendamentos no WhatsApp.
            </h1>

            {/* Subtítulo */}
            <p className="mt-5 text-base sm:text-lg text-[#57534E] max-w-2xl mx-auto leading-relaxed">
              Tenha um endereço próprio com tabela de procedimentos, fotos dos seus trabalhos e horários de atendimento. Sem taxas por agendamento e com controle total pelo celular.
            </p>

            {/* Chamadas de Ação */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              <Link
                href="/comecar"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1C1917] text-[#FAF8F5] text-sm font-semibold hover:bg-[#2D2825] transition-all shadow-md active:scale-[0.98]"
              >
                <span>Criar minha página</span>
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
                      <p className="text-sm text-[#57534E] leading-relaxed">
                        Mechas personalizadas, tratamentos capilares profundos e visagismo em um ambiente acolhedor no bairro Jardins, São Paulo.
                      </p>

                      {/* Tabela de Serviços Resumida */}
                      <div className="pt-2 border-t border-[#EAE4DC] space-y-2">
                        <div className="flex items-center justify-between text-sm py-1.5 border-b border-[#EAE4DC]/60">
                          <span className="font-medium text-[#1C1917]">Mechas Criativas & Iluminação</span>
                          <span className="font-semibold text-[#8C5E32]">R$ 480,00</span>
                        </div>
                        <div className="flex items-center justify-between text-sm py-1.5 border-b border-[#EAE4DC]/60">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Modelo 1: Salão de Beleza */}
              <div className="bg-white rounded-2xl border border-[#DDD7CD] hover:border-[#8C5E32]/70 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all group">
                <div>
                  {/* Mockup Fiel ao Template Salão */}
                  <div className="bg-[#F7F4EE] border-b border-[#EAE4DC] p-3 sm:p-4">
                    {/* Barra do Navegador */}
                    <div className="bg-white rounded-lg border border-[#EAE4DC] shadow-sm overflow-hidden">
                      <div className="bg-[#FAF8F5] px-3 py-2 border-b border-[#EAE4DC] flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#E5DCD0]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#E5DCD0]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#E5DCD0]" />
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-[#78716C] font-mono truncate max-w-[170px] sm:max-w-xs">
                          <span className="text-[#8C5E32]">https://</span>glowsaas.com/p/lumiere-hair
                        </div>
                        <span className="text-[10px] font-semibold text-[#8C5E32] bg-[#F1E8DF] px-2 py-0.5 rounded">
                          Ao Vivo
                        </span>
                      </div>

                      {/* Mini Preview Autêntico do Lumière */}
                      <div className="relative h-44 sm:h-52 overflow-hidden bg-[#FAF7F2]">
                        <Image
                          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
                          alt="Preview do Template Salão de Beleza Lumière Concept"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 360px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/90 via-[#1C1917]/40 to-transparent flex flex-col justify-between p-3.5 sm:p-4 text-white">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold text-white border border-white/20">
                              <Sparkles className="w-3 h-3 text-[#D7C4B2]" />
                              <span>Salão de Beleza & Estética</span>
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#D7C4B2]">
                              Lumière Concept Hair
                            </span>
                            <p className="font-serif text-sm sm:text-base font-normal leading-snug line-clamp-2">
                              &ldquo;Elegância e cuidado em cada detalhe do seu cabelo.&rdquo;
                            </p>
                            <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-200">
                              <span className="bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded font-medium">
                                Mechas • Cortes • Spa
                              </span>
                              <span className="font-semibold text-white bg-[#8C5E32]/90 px-2 py-0.5 rounded">
                                WhatsApp Integrado
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-6">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-serif text-2xl text-[#1C1917]">Lumière Concept</h3>
                      <span className="text-[11px] font-semibold text-[#8C5E32] uppercase tracking-wider">
                        Premium
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#57534E] leading-relaxed">
                      Apresentação de alto padrão para cabeleireiros, visagistas e clínicas de estética capilar que desejam valorizar transformações e mechas exclusivas.
                    </p>

                    <div className="mt-5 pt-4 border-t border-[#EAE4DC] space-y-2.5 text-sm text-[#57534E]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#8C5E32] shrink-0" />
                        <span>Catálogo de procedimentos com valores e duração</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#8C5E32] shrink-0" />
                        <span>Galeria expandida para fotos de mechas e cortes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#8C5E32] shrink-0" />
                        <span>Botão com mensagem formatada para o WhatsApp</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#8C5E32] shrink-0" />
                        <span>Tabela de expediente e localização nos Jardins</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ações do Card */}
                <div className="p-6 pt-0 flex flex-col sm:flex-row gap-2.5">
                  <Link
                    href="/p/lumiere-hair"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#FAF8F5] border border-[#DDD7CD] hover:bg-[#F3EFE9] text-sm font-semibold text-[#1C1917] transition-colors"
                  >
                    <span>Ver demonstração</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#78716C]" />
                  </Link>
                  <Link
                    href="/comecar"
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-[#1C1917] hover:bg-[#2D2825] text-sm font-semibold text-[#FAF8F5] transition-colors shadow-sm"
                  >
                    <span>Escolher este modelo</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D7C4B2]" />
                  </Link>
                </div>
              </div>

              {/* Modelo 2: Barbearia */}
              <div className="bg-[#171717] rounded-2xl border border-[#2E2E2E] hover:border-[#C5A059]/70 overflow-hidden flex flex-col justify-between shadow-md hover:shadow-lg transition-all group text-white">
                <div>
                  {/* Mockup Fiel ao Template Barbearia (Tema Escuro Oficial) */}
                  <div className="bg-[#0F0F0F] border-b border-[#2A2A2A] p-3 sm:p-4">
                    {/* Barra do Navegador */}
                    <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] shadow-sm overflow-hidden">
                      <div className="bg-[#141414] px-3 py-2 border-b border-[#262626] flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#3F3F46]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#3F3F46]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#3F3F46]" />
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-[#A1A1AA] font-mono truncate max-w-[170px] sm:max-w-xs">
                          <span className="text-[#C5A059]">https://</span>glowsaas.com/p/navalha-de-ouro
                        </div>
                        <span className="text-[10px] font-semibold text-[#C5A059] bg-[#C5A059]/15 px-2 py-0.5 rounded border border-[#C5A059]/30">
                          Dark Mode
                        </span>
                      </div>

                      {/* Mini Preview Autêntico da Navalha de Ouro */}
                      <div className="relative h-44 sm:h-52 overflow-hidden bg-[#111111]">
                        <Image
                          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80"
                          alt="Preview do Template Barbearia Navalha de Ouro"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 360px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent flex flex-col justify-between p-3.5 sm:p-4 text-white">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-[#C5A059] border border-[#C5A059]/30">
                              <Scissors className="w-3 h-3" />
                              <span>Barbearia & Cortes</span>
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#C5A059]">
                              Navalha de Ouro Barber Club
                            </span>
                            <p className="font-serif text-sm sm:text-base font-normal leading-snug line-clamp-2 text-neutral-100">
                              &ldquo;Estilo com tradição e precisão na navalha.&rdquo;
                            </p>
                            <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-300">
                              <span className="bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded font-medium border border-neutral-800">
                                Combos • Chopp • Barba
                              </span>
                              <span className="font-semibold text-neutral-950 bg-[#C5A059] px-2 py-0.5 rounded">
                                Sem Fila
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-6">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-serif text-2xl text-white">Navalha de Ouro</h3>
                      <span className="text-[11px] font-semibold text-[#C5A059] uppercase tracking-wider">
                        Masculino
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#A1A1AA] leading-relaxed">
                      Estética masculina em tema escuro sóbrio. Ideal para barbearias tradicionais e modernas com foco em combos, agendamentos rápidos e ambiente exclusivo.
                    </p>

                    <div className="mt-5 pt-4 border-t border-[#2A2A2A] space-y-2.5 text-sm text-[#D4D4D8]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                        <span>Menu de cortes individuais, barboterapia e combos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                        <span>Tabela de expediente e horários de funcionamento</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                        <span>Apresentação dos barbeiros da equipe</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                        <span>Botão de agendamento ágil no WhatsApp</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ações do Card */}
                <div className="p-6 pt-0 flex flex-col sm:flex-row gap-2.5">
                  <Link
                    href="/p/navalha-de-ouro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#242424] border border-[#3A3A3A] hover:bg-[#2E2E2E] text-sm font-semibold text-neutral-100 transition-colors"
                  >
                    <span>Ver demonstração</span>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  </Link>
                  <Link
                    href="/comecar"
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-[#C5A059] hover:bg-[#B38F48] text-sm font-semibold text-neutral-950 transition-colors shadow-sm"
                  >
                    <span>Escolher este modelo</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-950" />
                  </Link>
                </div>
              </div>

              {/* Modelo 3: Nail Designer */}
              <div className="bg-white rounded-2xl border border-[#E8D5CE] hover:border-[#E0A395]/80 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all group">
                <div>
                  {/* Mockup Fiel ao Template Nails (Tema Delicado Rosé) */}
                  <div className="bg-[#FAF2EF] border-b border-[#F0DFD8] p-3 sm:p-4">
                    {/* Barra do Navegador */}
                    <div className="bg-white rounded-lg border border-[#F0DFD8] shadow-sm overflow-hidden">
                      <div className="bg-[#FCF7F5] px-3 py-2 border-b border-[#F0DFD8] flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#E8D5CE]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#E8D5CE]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#E8D5CE]" />
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-[#78716C] font-mono truncate max-w-[170px] sm:max-w-xs">
                          <span className="text-[#C27361]">https://</span>glowsaas.com/p/gisele-nails
                        </div>
                        <span className="text-[10px] font-semibold text-[#B75B4A] bg-[#FDF0ED] px-2 py-0.5 rounded border border-[#ECC3B9]">
                          Delicado
                        </span>
                      </div>

                      {/* Mini Preview Autêntico do Studio Gisele Nails */}
                      <div className="relative h-44 sm:h-52 overflow-hidden bg-[#FDF8F7]">
                        <Image
                          src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80"
                          alt="Preview do Template Nail Designer Studio Gisele Nails"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 360px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2B1B18]/90 via-[#2B1B18]/45 to-transparent flex flex-col justify-between p-3.5 sm:p-4 text-white">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold text-white border border-white/20">
                              <Crown className="w-3 h-3 text-[#F5DDD7]" />
                              <span>Nail Designer & Alongamentos</span>
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#F5DDD7]">
                              Studio Gisele Nails
                            </span>
                            <p className="font-serif text-sm sm:text-base font-normal leading-snug line-clamp-2">
                              &ldquo;Unhas perfeitas, resistentes e com acabamento natural.&rdquo;
                            </p>
                            <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-200">
                              <span className="bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded font-medium">
                                Gel • Fibra • Blindagem
                              </span>
                              <span className="font-semibold text-white bg-[#B75B4A]/90 px-2 py-0.5 rounded">
                                Biossegurança
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-6">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-serif text-2xl text-[#1C1917]">Studio Gisele Nails</h3>
                      <span className="text-[11px] font-semibold text-[#B75B4A] uppercase tracking-wider">
                        Especialista
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#57534E] leading-relaxed">
                      Estética delicada e refinada para nail designers e manicures que querem evidenciar a curvatura perfeita, fotos de detalhes e protocolos cirúrgicos de esterilização.
                    </p>

                    <div className="mt-5 pt-4 border-t border-[#EAE4DC] space-y-2.5 text-sm text-[#57534E]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#B75B4A] shrink-0" />
                        <span>Tabela de alongamentos, manutenções e blindagem</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#B75B4A] shrink-0" />
                        <span>Destaque para biossegurança e autoclave cirúrgica</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#B75B4A] shrink-0" />
                        <span>Galeria com alta nitidez para detalhes de nail art</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#B75B4A] shrink-0" />
                        <span>Agendamento prático sem burocracia no WhatsApp</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ações do Card */}
                <div className="p-6 pt-0 flex flex-col sm:flex-row gap-2.5">
                  <Link
                    href="/p/gisele-nails"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#FAF8F5] border border-[#DDD7CD] hover:bg-[#F3EFE9] text-sm font-semibold text-[#1C1917] transition-colors"
                  >
                    <span>Ver demonstração</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#78716C]" />
                  </Link>
                  <Link
                    href="/comecar"
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-[#B75B4A] hover:bg-[#9E4D3E] text-sm font-semibold text-white transition-colors shadow-sm"
                  >
                    <span>Escolher este modelo</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/90" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            4. BENEFÍCIOS CONCRETOS (Hierarquia: 3 Principais + 3 Complementares)
           ───────────────────────────────────────────────────────────── */}
        <section id="beneficios" className="py-16 sm:py-24 border-b border-[#EAE4DC] bg-[#FAF8F5]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C5E32]">
                Vantagens Comerciais
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#1C1917] mt-2">
                Mais agendamentos, menos tempo perdido no Direct
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#57534E]">
                Três pilares estratégicos para acelerar a decisão dos seus clientes, somados a recursos essenciais para sua rotina diária.
              </p>
            </div>

            {/* 3 Benefícios Principais com Maior Destaque Visual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Principal 1: WhatsApp */}
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#DDD7CD] hover:border-[#8C5E32]/50 shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F2ED] text-[#8C5E32] border border-[#EAE4DC] flex items-center justify-center">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#8C5E32] bg-[#F1E8DF] px-2.5 py-0.5 rounded-full">
                      Conversão Direta
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-normal text-[#1C1917]">
                    Agendamento Pronto no WhatsApp
                  </h3>
                  <p className="mt-2.5 text-sm text-[#57534E] leading-relaxed">
                    O cliente escolhe o procedimento e a conversa já abre com nome do serviço e mensagem formatada. Sem intermediários, sem cadastros burocráticos e sem aplicativos adicionais.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-[#EAE4DC] text-xs font-medium text-[#8C5E32]">
                  → Agilidade no primeiro contato
                </div>
              </div>

              {/* Principal 2: Tabela sem atrito */}
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#DDD7CD] hover:border-[#8C5E32]/50 shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F2ED] text-[#8C5E32] border border-[#EAE4DC] flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#8C5E32] bg-[#F1E8DF] px-2.5 py-0.5 rounded-full">
                      Filtro de Dúvidas
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-normal text-[#1C1917]">
                    Fim do &ldquo;Qual o valor?&rdquo; no Direct
                  </h3>
                  <p className="mt-2.5 text-sm text-[#57534E] leading-relaxed">
                    Valores, tempo de atendimento e detalhes de cada procedimento visíveis antes do contato. Você para de responder repetidamente e só atende quem já está decidido a marcar.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-[#EAE4DC] text-xs font-medium text-[#8C5E32]">
                  → Economia de horas de atendimento
                </div>
              </div>

              {/* Principal 3: Sem Comissões */}
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#DDD7CD] hover:border-[#8C5E32]/50 shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F2ED] text-[#8C5E32] border border-[#EAE4DC] flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#8C5E32] bg-[#F1E8DF] px-2.5 py-0.5 rounded-full">
                      Rentabilidade 100%
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-normal text-[#1C1917]">
                    Sem Comissões por Procedimento
                  </h3>
                  <p className="mt-2.5 text-sm text-[#57534E] leading-relaxed">
                    Todo o faturamento dos seus atendimentos permanece 100% com você. Não retemos nenhuma taxa percentual por agendamento — você paga apenas a assinatura fixa da sua página.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-[#EAE4DC] text-xs font-medium text-[#8C5E32]">
                  → Lucro total do seu trabalho
                </div>
              </div>
            </div>

            {/* 3 Recursos Complementares com Menor Peso Visual */}
            <div className="mt-10 pt-8 border-t border-[#EAE4DC]">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C5E32]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                  Recursos complementares inclusos em todos os planos
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-4 rounded-xl bg-white/70 border border-[#EAE4DC] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] text-[#8C5E32] flex items-center justify-center shrink-0 border border-[#EAE4DC]">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#1C1917]">Experiência Ágil no Celular</h4>
                    <p className="mt-1 text-xs sm:text-sm text-[#57534E] leading-relaxed">
                      Carregamento instantâneo para quem chega pela bio do Instagram, sem travamentos.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/70 border border-[#EAE4DC] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] text-[#8C5E32] flex items-center justify-center shrink-0 border border-[#EAE4DC]">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#1C1917]">Autonomia Total de Edição</h4>
                    <p className="mt-1 text-xs sm:text-sm text-[#57534E] leading-relaxed">
                      Altere valores, fotos e horários pelo seu próprio painel, sem depender de suporte.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/70 border border-[#EAE4DC] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] text-[#8C5E32] flex items-center justify-center shrink-0 border border-[#EAE4DC]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#1C1917]">Localização e Expediente Claros</h4>
                    <p className="mt-1 text-xs sm:text-sm text-[#57534E] leading-relaxed">
                      Endereço com rota no Google Maps e horários organizados para reduzir faltas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            5. COMO FUNCIONA (Processo em 3 etapas com sequência visual)
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
                Um processo simples em três etapas, sem necessidade de conhecimento técnico.
              </p>
            </div>

            {/* Grade de Passos com Linha Conectora Discreta */}
            <div className="relative">
              {/* Linha conectora em telas médias e grandes */}
              <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-[1px] bg-[#DDD7CD] -z-0" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {/* Passo 01 */}
                <div className="bg-[#FAF8F5] md:bg-transparent p-5 md:p-0 rounded-2xl border border-[#EAE4DC] md:border-0 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#DDD7CD] flex items-center justify-center font-serif text-lg font-bold text-[#8C5E32] shadow-sm">
                    01
                  </div>
                  <h3 className="font-semibold text-base text-[#1C1917]">
                    Escolha o modelo adequado ao negócio
                  </h3>
                  <p className="text-sm text-[#57534E] leading-relaxed">
                    Selecione o modelo planejado para o seu segmento: salão de beleza e spa capilar, barbearia clássica ou studio de nail design.
                  </p>
                </div>

                {/* Passo 02 */}
                <div className="bg-[#FAF8F5] md:bg-transparent p-5 md:p-0 rounded-2xl border border-[#EAE4DC] md:border-0 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#DDD7CD] flex items-center justify-center font-serif text-lg font-bold text-[#8C5E32] shadow-sm">
                    02
                  </div>
                  <h3 className="font-semibold text-base text-[#1C1917]">
                    Personalize informações, serviços e imagens
                  </h3>
                  <p className="text-sm text-[#57534E] leading-relaxed">
                    Defina o nome do seu espaço, os procedimentos com valores e duração, dias de funcionamento e as fotos reais dos seus trabalhos.
                  </p>
                </div>

                {/* Passo 03 */}
                <div className="bg-[#FAF8F5] md:bg-transparent p-5 md:p-0 rounded-2xl border border-[#EAE4DC] md:border-0 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#DDD7CD] flex items-center justify-center font-serif text-lg font-bold text-[#8C5E32] shadow-sm">
                    03
                  </div>
                  <h3 className="font-semibold text-base text-[#1C1917]">
                    Publique e compartilhe o link com seus clientes
                  </h3>
                  <p className="text-sm text-[#57534E] leading-relaxed">
                    Com sua página ativada no endereço exclusivo, coloque o link na bio do Instagram e no WhatsApp para receber contatos com decisões já tomadas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            6. CONDIÇÕES COMERCIAIS (Comparação Clara entre Starter e Pro)
           ───────────────────────────────────────────────────────────── */}
        <section id="condicoes" className="py-16 sm:py-24 border-b border-[#EAE4DC] bg-[#FAF8F5]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C5E32]">
                Planos & Investimento
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#1C1917] mt-2">
                Planos transparentes para o momento do seu negócio
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#57534E]">
                Mensalidade fixa, sem cobrança de comissões por agendamento e sem taxas ocultas. Escolha a opção ideal para a sua estrutura.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
              {/* Plano Starter */}
              <div className="bg-white rounded-3xl border border-[#DDD7CD] hover:border-[#1C1917]/30 p-7 sm:p-9 flex flex-col justify-between shadow-sm transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-[#78716C] bg-[#F5F2ED] px-3 py-1 rounded-full">
                      Indicado para Autônomos
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl text-[#1C1917] mt-3">Starter</h3>
                  <p className="mt-2 text-sm text-[#57534E] leading-relaxed">
                    Perfeito para profissionais solo, barbeiros e nail designers que atendem de forma autônoma e buscam uma vitrine limpa, elegante e ágil.
                  </p>

                  {/* Bloco de Preço */}
                  <div className="my-6 pb-6 border-b border-[#EAE4DC]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-semibold text-[#78716C]">R$</span>
                      <span className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1917] tracking-tight">97</span>
                      <span className="text-sm text-[#78716C]">/mês</span>
                    </div>
                    <p className="mt-1 text-xs text-[#78716C]">Mensalidade fixa paga via Pix • 100% livre de comissões</p>
                  </div>

                  {/* Lista de Recursos */}
                  <div className="space-y-3 text-sm text-[#57534E]">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1C1917] mb-2">
                      O que está incluído:
                    </p>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#8C5E32] shrink-0" />
                      <span>Página completa no seu segmento (Salão, Barbearia ou Nails)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#8C5E32] shrink-0" />
                      <span>Até 12 procedimentos cadastrados com valores e duração</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#8C5E32] shrink-0" />
                      <span>Botão com mensagem formatada para o seu WhatsApp</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#8C5E32] shrink-0" />
                      <span>Galeria para fotos de trabalhos e transformações</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#8C5E32] shrink-0" />
                      <span>Painel autônomo para alterar preços e horários</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#8C5E32] shrink-0" />
                      <span>Endereço web exclusivo e hospedagem rápida inclusa</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href="/comecar"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#FAF8F5] border-2 border-[#1C1917] hover:bg-[#1C1917] hover:text-[#FAF8F5] text-sm font-semibold text-[#1C1917] transition-all shadow-sm active:scale-[0.98]"
                  >
                    <span>Escolher Plano Starter</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Plano Pro */}
              <div className="bg-white rounded-3xl border-2 border-[#1C1917] p-7 sm:p-9 flex flex-col justify-between shadow-lg relative">
                {/* Badge Superior Destacado */}
                <span className="absolute -top-3.5 right-6 sm:right-8 px-3.5 py-1 rounded-full bg-[#1C1917] text-[#FAF8F5] text-[11px] font-semibold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#C5A059]" />
                  <span>Recomendado para Equipes</span>
                </span>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8C5E32] bg-[#F1E8DF] px-3 py-1 rounded-full">
                      Mais Completo
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl text-[#1C1917] mt-3">Pro</h3>
                  <p className="mt-2 text-sm text-[#57534E] leading-relaxed">
                    Ideal para salões maiores, barbearias com múltiplos profissionais e estúdios com equipe e cardápio extenso de procedimentos.
                  </p>

                  {/* Bloco de Preço */}
                  <div className="my-6 pb-6 border-b border-[#EAE4DC]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-semibold text-[#78716C]">R$</span>
                      <span className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1917] tracking-tight">197</span>
                      <span className="text-sm text-[#78716C]">/mês</span>
                    </div>
                    <p className="mt-1 text-xs text-[#78716C]">Mensalidade fixa paga via Pix • 100% livre de comissões</p>
                  </div>

                  {/* Lista de Recursos */}
                  <div className="space-y-3 text-sm text-[#57534E]">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1C1917] mb-2">
                      Tudo do Plano Starter, mais:
                    </p>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#8C5E32] shrink-0" />
                      <span>Procedimentos e categorias ilimitadas no catálogo</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#8C5E32] shrink-0" />
                      <span>Galeria de imagens expandida para portfólio completo</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#8C5E32] shrink-0" />
                      <span>Apresentação da equipe de profissionais e especialistas</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#8C5E32] shrink-0" />
                      <span>Subdomínio exclusivo personalizado</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#8C5E32] shrink-0" />
                      <span>Acompanhamento prioritário na montagem inicial</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#8C5E32] shrink-0" />
                      <span>Suporte preferencial para dúvidas e ajustes</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href="/comecar"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#1C1917] hover:bg-[#2D2825] text-sm font-semibold text-[#FAF8F5] transition-all shadow-md active:scale-[0.98]"
                  >
                    <span>Escolher Plano Pro</span>
                    <ArrowRight className="w-4 h-4 text-[#D7C4B2]" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Régua de Síntese Comparativa */}
            <div className="mt-10 max-w-2xl mx-auto text-center p-4 rounded-2xl bg-white border border-[#EAE4DC] text-xs sm:text-sm text-[#57534E]">
              <span className="font-semibold text-[#1C1917]">Qual a diferença prática?</span> Se você atende sozinho, o <strong className="text-[#1C1917]">Starter</strong> tem tudo o que você precisa. Se o seu espaço conta com equipe, múltiplos profissionais ou catálogo extenso de serviços, o <strong className="text-[#1C1917]">Pro</strong> oferece liberdade total.
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            7. PERGUNTAS FREQUENTES (FAQ Accordion Acessível e Objetivo)
           ───────────────────────────────────────────────────────────── */}
        <section id="duvidas" className="py-16 sm:py-24 border-b border-[#EAE4DC]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C5E32]">
                Dúvidas Frequentes
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#1C1917] mt-2">
                Perguntas Frequentes
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#57534E]">
                Respostas diretas sobre como funciona a sua página, edição e agendamentos.
              </p>
            </div>

            <div className="space-y-3.5">
              {/* Item 1 */}
              <details
                name="faq-accordion"
                className="group rounded-2xl bg-white border border-[#DDD7CD] transition-all hover:border-[#1C1917]/30 open:border-[#8C5E32]/50 open:shadow-sm"
              >
                <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer list-none select-none text-left font-semibold text-base text-[#1C1917] hover:text-[#8C5E32] transition-colors focus:outline-none [&::-webkit-details-marker]:hidden">
                  <span className="pr-4 leading-snug">Como funciona a criação da minha página?</span>
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#DDD7CD] flex items-center justify-center text-[#78716C] group-open:rotate-180 group-open:bg-[#1C1917] group-open:text-white group-open:border-[#1C1917] transition-all duration-200">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-sm text-[#57534E] leading-relaxed border-t border-[#EAE4DC]/60">
                  <p>
                    O processo é simples e rápido: você escolhe o modelo ideal para o seu segmento e envia as informações básicas do seu negócio pelo formulário. Nossa equipe organiza a estrutura inicial no modelo escolhido e libera seu acesso exclusivo ao painel administrativo para você gerenciar seus dados com total autonomia.
                  </p>
                </div>
              </details>

              {/* Item 2 */}
              <details
                name="faq-accordion"
                className="group rounded-2xl bg-white border border-[#DDD7CD] transition-all hover:border-[#1C1917]/30 open:border-[#8C5E32]/50 open:shadow-sm"
              >
                <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer list-none select-none text-left font-semibold text-base text-[#1C1917] hover:text-[#8C5E32] transition-colors focus:outline-none [&::-webkit-details-marker]:hidden">
                  <span className="pr-4 leading-snug">Preciso saber programar?</span>
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#DDD7CD] flex items-center justify-center text-[#78716C] group-open:rotate-180 group-open:bg-[#1C1917] group-open:text-white group-open:border-[#1C1917] transition-all duration-200">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-sm text-[#57534E] leading-relaxed border-t border-[#EAE4DC]/60">
                  <p>
                    Não. Toda a estrutura visual, velocidade, hospedagem e segurança já vêm completamente prontas e configuradas. No seu painel de cliente, você edita serviços, fotos, valores e horários de forma tão fácil quanto atualizar um perfil nas redes sociais.
                  </p>
                </div>
              </details>

              {/* Item 3 */}
              <details
                name="faq-accordion"
                className="group rounded-2xl bg-white border border-[#DDD7CD] transition-all hover:border-[#1C1917]/30 open:border-[#8C5E32]/50 open:shadow-sm"
              >
                <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer list-none select-none text-left font-semibold text-base text-[#1C1917] hover:text-[#8C5E32] transition-colors focus:outline-none [&::-webkit-details-marker]:hidden">
                  <span className="pr-4 leading-snug">Como meus clientes fazem agendamentos?</span>
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#DDD7CD] flex items-center justify-center text-[#78716C] group-open:rotate-180 group-open:bg-[#1C1917] group-open:text-white group-open:border-[#1C1917] transition-all duration-200">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-sm text-[#57534E] leading-relaxed border-t border-[#EAE4DC]/60">
                  <p>
                    Ao acessar a página, o cliente consulta fotos, descrição detalhada, duração e valor de cada serviço. Ao clicar no botão de agendamento, uma conversa abre automaticamente no seu WhatsApp com a mensagem formatada contendo o procedimento escolhido. Você combina o melhor dia e horário diretamente, sem atritos e sem intermediários.
                  </p>
                </div>
              </details>

              {/* Item 4 */}
              <details
                name="faq-accordion"
                className="group rounded-2xl bg-white border border-[#DDD7CD] transition-all hover:border-[#1C1917]/30 open:border-[#8C5E32]/50 open:shadow-sm"
              >
                <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer list-none select-none text-left font-semibold text-base text-[#1C1917] hover:text-[#8C5E32] transition-colors focus:outline-none [&::-webkit-details-marker]:hidden">
                  <span className="pr-4 leading-snug">Posso editar fotos, serviços e preços?</span>
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#DDD7CD] flex items-center justify-center text-[#78716C] group-open:rotate-180 group-open:bg-[#1C1917] group-open:text-white group-open:border-[#1C1917] transition-all duration-200">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-sm text-[#57534E] leading-relaxed border-t border-[#EAE4DC]/60">
                  <p>
                    Sim. Você tem autonomia total através do painel do cliente. É possível alterar valores, cadastrar novos procedimentos, desativar serviços que não oferece mais, atualizar as imagens da galeria e ajustar dias e horários de atendimento em tempo real.
                  </p>
                </div>
              </details>

              {/* Item 5 */}
              <details
                name="faq-accordion"
                className="group rounded-2xl bg-white border border-[#DDD7CD] transition-all hover:border-[#1C1917]/30 open:border-[#8C5E32]/50 open:shadow-sm"
              >
                <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer list-none select-none text-left font-semibold text-base text-[#1C1917] hover:text-[#8C5E32] transition-colors focus:outline-none [&::-webkit-details-marker]:hidden">
                  <span className="pr-4 leading-snug">Qual a diferença entre Starter e Pro?</span>
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#DDD7CD] flex items-center justify-center text-[#78716C] group-open:rotate-180 group-open:bg-[#1C1917] group-open:text-white group-open:border-[#1C1917] transition-all duration-200">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-sm text-[#57534E] leading-relaxed border-t border-[#EAE4DC]/60">
                  <p>
                    O <strong>Plano Starter</strong> (R$ 97/mês) é ideal para profissionais autônomos que atendem sozinhos e precisam de uma apresentação rápida, elegante e objetiva. O <strong>Plano Pro</strong> (R$ 197/mês) foi desenvolvido para espaços com múltiplos profissionais, equipe, catálogo ampliado de procedimentos e suporte prioritário.
                  </p>
                </div>
              </details>

              {/* Item 6 */}
              <details
                name="faq-accordion"
                className="group rounded-2xl bg-white border border-[#DDD7CD] transition-all hover:border-[#1C1917]/30 open:border-[#8C5E32]/50 open:shadow-sm"
              >
                <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer list-none select-none text-left font-semibold text-base text-[#1C1917] hover:text-[#8C5E32] transition-colors focus:outline-none [&::-webkit-details-marker]:hidden">
                  <span className="pr-4 leading-snug">Existe cobrança por agendamento ou comissão?</span>
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#DDD7CD] flex items-center justify-center text-[#78716C] group-open:rotate-180 group-open:bg-[#1C1917] group-open:text-white group-open:border-[#1C1917] transition-all duration-200">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-sm text-[#57534E] leading-relaxed border-t border-[#EAE4DC]/60">
                  <p>
                    Não. Não cobramos comissões nem taxas percentuais sobre os serviços realizados no seu espaço. 100% do valor pago pelos seus clientes é seu. Você investe apenas na mensalidade fixa do seu plano para manter a página no ar e ter acesso ao painel.
                  </p>
                </div>
              </details>

              {/* Item 7 */}
              <details
                name="faq-accordion"
                className="group rounded-2xl bg-white border border-[#DDD7CD] transition-all hover:border-[#1C1917]/30 open:border-[#8C5E32]/50 open:shadow-sm"
              >
                <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer list-none select-none text-left font-semibold text-base text-[#1C1917] hover:text-[#8C5E32] transition-colors focus:outline-none [&::-webkit-details-marker]:hidden">
                  <span className="pr-4 leading-snug">Como funciona a mensalidade?</span>
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#DDD7CD] flex items-center justify-center text-[#78716C] group-open:rotate-180 group-open:bg-[#1C1917] group-open:text-white group-open:border-[#1C1917] transition-all duration-200">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-sm text-[#57534E] leading-relaxed border-t border-[#EAE4DC]/60">
                  <p>
                    A mensalidade é um valor fixo pago via Pix para manter sua página hospedada em servidores velozes e seguros, com disponibilidade contínua e acesso ao seu painel de edição. Não cobramos comissões sobre seus atendimentos nem taxas ocultas.
                  </p>
                </div>
              </details>

              {/* Item 8 */}
              <details
                name="faq-accordion"
                className="group rounded-2xl bg-white border border-[#DDD7CD] transition-all hover:border-[#1C1917]/30 open:border-[#8C5E32]/50 open:shadow-sm"
              >
                <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer list-none select-none text-left font-semibold text-base text-[#1C1917] hover:text-[#8C5E32] transition-colors focus:outline-none [&::-webkit-details-marker]:hidden">
                  <span className="pr-4 leading-snug">Posso usar o link no Instagram e WhatsApp?</span>
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#DDD7CD] flex items-center justify-center text-[#78716C] group-open:rotate-180 group-open:bg-[#1C1917] group-open:text-white group-open:border-[#1C1917] transition-all duration-200">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-sm text-[#57534E] leading-relaxed border-t border-[#EAE4DC]/60">
                  <p>
                    Sim. Sua página recebe um endereço web exclusivo e amigável (por exemplo, <code className="text-xs bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#EAE4DC] font-mono text-[#8C5E32]">glowsaas.com/p/seunome</code>), ideal para colocar no link da bio do Instagram, cadastrar no perfil comercial do WhatsApp Business ou compartilhar diretamente em mensagens.
                  </p>
                </div>
              </details>
            </div>

            {/* Bloco Comercial: Dúvidas no WhatsApp */}
            <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-white border border-[#DDD7CD] text-center max-w-2xl mx-auto shadow-sm">
              <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917]">
                Ainda tem dúvidas?
              </h3>
              <p className="mt-2 text-sm text-[#57534E] leading-relaxed max-w-lg mx-auto">
                Fale diretamente conosco pelo WhatsApp e tire suas dúvidas sobre os planos e a criação da sua página.
              </p>
              <div className="mt-5 flex justify-center">
                <a
                  href="https://wa.me/5581973119512"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FAF8F5] border border-[#DDD7CD] hover:bg-[#F3EFE9] text-sm font-semibold text-[#1C1917] transition-colors shadow-sm active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4 text-[#8C5E32]" />
                  <span>Falar pelo WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            8. CHAMADA FINAL (Clara, Convincente e Sem Promessas Falsas)
           ───────────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-[#FAF8F5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1C1917] max-w-2xl mx-auto leading-tight">
              Dê ao seu espaço a presença digital que seus serviços merecem
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#57534E] max-w-xl mx-auto leading-relaxed">
              Tenha uma página profissional com seus procedimentos, valores claros e agendamento direto no WhatsApp em poucos passos.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/comecar"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#1C1917] text-[#FAF8F5] text-sm sm:text-base font-semibold hover:bg-[#2D2825] transition-all shadow-md active:scale-[0.98]"
              >
                <span>Criar minha página</span>
                <ArrowRight className="w-4 h-4 text-[#D7C4B2]" />
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

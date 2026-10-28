import Image from "next/image";
import { formatWhatsAppUrl } from "@/lib/utils";
import { HeroSection, ContactInfo } from "@/types/database";
import { MessageCircle, ArrowDown, Scissors, ShieldCheck, Coffee } from "lucide-react";

interface BarberHeroProps {
  hero: HeroSection;
  contact: ContactInfo;
  businessName: string;
}

export function BarberHero({ hero, contact, businessName }: BarberHeroProps) {
  const whatsappUrl = formatWhatsAppUrl(
    contact.whatsapp_number,
    contact.whatsapp_default_message || `Olá! Gostaria de marcar corte e barba no ${businessName}.`
  );

  return (
    <section id="topo" className="relative bg-[#121212] pt-12 pb-16 sm:pt-20 sm:pb-28 overflow-hidden text-white border-b border-stone-850">
      {/* Luz âmbar difusa de fundo */}
      <div className="absolute top-0 right-1/4 -mt-32 w-96 h-96 rounded-full bg-[#C5A059]/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Coluna de Texto (7 colunas no Desktop) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            {/* Badge de Tradição */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-stone-900 border border-stone-800 text-[#C5A059] text-xs font-semibold tracking-wide uppercase">
              <Scissors className="w-3.5 h-3.5 -rotate-45" />
              <span>{hero.badge || "Tradição, Precisão & Estilo"}</span>
            </div>

            {/* Headline Principal */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.6rem] text-stone-100 font-bold leading-[1.12] tracking-tight">
              {hero.headline}
            </h1>

            {/* Subheadline Descritiva */}
            <p className="text-stone-400 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              {hero.subheadline}
            </p>

            {/* Ações (CTA Principal + Botão Secundário) */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-lg bg-[#C5A059] text-stone-950 text-xs sm:text-sm uppercase tracking-wider font-bold hover:bg-[#b59049] transition-all shadow-lg shadow-amber-950/20 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-stone-950" />
                <span>{hero.cta_text || "Agendar pelo WhatsApp"}</span>
              </a>

              <a
                href="#servicos"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg border border-stone-750 bg-stone-900/60 text-stone-300 text-xs sm:text-sm uppercase tracking-wider font-semibold hover:bg-stone-800 hover:text-white transition-all border-neutral-700"
              >
                <span>Tabela de Cortes</span>
                <ArrowDown className="w-3.5 h-3.5 text-stone-400" />
              </a>
            </div>

            {/* Selos de Credibilidade */}
            <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center gap-6 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Navalhetes 100% descartáveis</span>
              </div>

              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-[#C5A059]" />
                <span>Café expresso & cerveja cortesia</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Atendimento pontual sem fila</span>
              </div>
            </div>
          </div>

          {/* Coluna Visual (5 colunas no Desktop) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Moldura masculina em ângulo sutil */}
              <div className="absolute -inset-3 rounded-2xl border border-stone-800 pointer-events-none" />

              {/* Imagem Principal */}
              <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden shadow-2xl bg-stone-900 border border-stone-800">
                <Image
                  src={hero.hero_image_url}
                  alt={businessName}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover object-center transform hover:scale-105 transition-transform duration-700 brightness-95"
                />
              </div>

              {/* Card Flutuante de Ritual */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-stone-900/95 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-stone-800 shadow-xl max-w-[250px]">
                <div className="text-[10px] uppercase tracking-wider text-[#C5A059] font-bold mb-1">
                  Ritual de Barba & Toalha
                </div>
                <div className="text-xs sm:text-sm font-medium text-stone-200 leading-snug">
                  Cuidado completo com massagem facial e navalha afiada.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

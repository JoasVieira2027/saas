import Image from "next/image";
import { formatWhatsAppUrl } from "@/lib/utils";
import { HeroSection, ContactInfo } from "@/types/database";
import { MessageCircle, ArrowDown, Sparkles, ShieldCheck, Check } from "lucide-react";

interface NailsHeroProps {
  hero: HeroSection;
  contact: ContactInfo;
  businessName: string;
}

export function NailsHero({ hero, contact, businessName }: NailsHeroProps) {
  const whatsappUrl = formatWhatsAppUrl(
    contact.whatsapp_number,
    contact.whatsapp_default_message || `Oi! Gostaria de agendar aplicação de unhas em gel no ${businessName}.`
  );

  return (
    <section id="topo" className="relative bg-[#FCFAF9] pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden text-stone-900 border-b border-[#F2EAE7]">
      {/* Detalhe de fundo suave em tom rosé nude */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#FAF0ED]/80 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Coluna de Texto (7 colunas no Desktop) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            {/* Badge de Nicho */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0ED] border border-[#F5DDD7] text-[#B75B4A] text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{hero.badge || "Alongamento em Gel & Nail Art"}</span>
            </div>

            {/* Headline Principal */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] text-stone-900 font-normal leading-[1.14] tracking-tight">
              {hero.headline}
            </h1>

            {/* Subheadline Descritiva */}
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              {hero.subheadline}
            </p>

            {/* Ações (CTA Principal + Botão Secundário) */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#B75B4A] text-white text-xs sm:text-sm uppercase tracking-wider font-semibold hover:bg-[#944436] transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{hero.cta_text || "Agendar Minha Sessão"}</span>
              </a>

              <a
                href="#servicos"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-[#ECC3B9] text-stone-800 text-xs sm:text-sm uppercase tracking-wider font-semibold hover:bg-[#FAF0ED] transition-all"
              >
                <span>Ver Procedimentos</span>
                <ArrowDown className="w-3.5 h-3.5 text-stone-500" />
              </a>
            </div>

            {/* Selos de Confiança */}
            <div className="pt-4 border-t border-[#F2EAE7] flex flex-wrap items-center gap-6 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#F5DDD7] flex items-center justify-center text-[#944436]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Materiais esterilizados em autoclave</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#F5DDD7] flex items-center justify-center text-[#944436]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Curvatura C natural e fina</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#F5DDD7] flex items-center justify-center text-[#944436]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Durabilidade de até 30 dias</span>
              </div>
            </div>
          </div>

          {/* Coluna Visual (5 colunas no Desktop) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-3 rounded-[2rem] border border-[#ECC3B9]/40 pointer-events-none" />

              {/* Imagem Principal */}
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-xl bg-[#FAF0ED] border border-[#F2EAE7]">
                <Image
                  src={hero.hero_image_url}
                  alt={businessName}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Card Flutuante de Biossegurança */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#F2EAE7] shadow-lg max-w-[250px]">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#B75B4A] font-bold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Protocolo de Saúde</span>
                </div>
                <div className="text-xs sm:text-sm font-medium text-stone-900 leading-snug">
                  Kits descartáveis e proteção da integridade da unha natural.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


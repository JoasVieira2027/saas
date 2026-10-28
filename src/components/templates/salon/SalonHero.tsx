import Image from "next/image";
import { formatWhatsAppUrl } from "@/lib/utils";
import { HeroSection, ContactInfo } from "@/types/database";
import { MessageCircle, ArrowDown, Sparkles, Check } from "lucide-react";

interface SalonHeroProps {
  hero: HeroSection;
  contact: ContactInfo;
  businessName: string;
}

export function SalonHero({ hero, contact, businessName }: SalonHeroProps) {
  const whatsappUrl = formatWhatsAppUrl(
    contact.whatsapp_number,
    hero.cta_text ? `${contact.whatsapp_default_message}` : `Olá! Gostaria de agendar um horário no ${businessName}.`
  );

  return (
    <section id="topo" className="relative bg-[#FAF8F5] pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
      {/* Detalhe de fundo suave */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#F4ECE2]/60 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Coluna de Texto (7 colunas no Desktop) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            {/* Badge de Nicho */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2ECE3] border border-[#E7DFD5] text-[#8C6A47] text-xs font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#A9855E]" />
              <span>{hero.badge || "Especialistas em Beleza & Bem-Estar"}</span>
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
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#A9855E] text-white text-xs sm:text-sm uppercase tracking-wider font-semibold hover:bg-[#8C6A47] transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{hero.cta_text || "Agendar pelo WhatsApp"}</span>
              </a>

              <a
                href="#servicos"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-[#D6BEA0] text-stone-800 text-xs sm:text-sm uppercase tracking-wider font-semibold hover:bg-[#F2ECE3] transition-all"
              >
                <span>Ver Procedimentos</span>
                <ArrowDown className="w-3.5 h-3.5 text-stone-500" />
              </a>
            </div>

            {/* Destaques Rápidos de Credibilidade */}
            <div className="pt-4 border-t border-[#EAE3D9] flex flex-wrap items-center gap-6 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#E8D8C4] flex items-center justify-center text-[#6E5034]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Atendimento com hora marcada</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#E8D8C4] flex items-center justify-center text-[#6E5034]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Cosméticos profissionais nobres</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#E8D8C4] flex items-center justify-center text-[#6E5034]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Teste de mecha obrigatório</span>
              </div>
            </div>
          </div>

          {/* Coluna Visual (5 colunas no Desktop) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Borda decorativa sutil */}
              <div className="absolute -inset-3 rounded-[2rem] border border-[#D6BEA0]/40 -rotate-1 pointer-events-none" />

              {/* Imagem Principal */}
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-2xl bg-[#E8D8C4]">
                <Image
                  src={hero.hero_image_url}
                  alt={businessName}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Card Flutuante de Destaque */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-[#E7DFD5] shadow-lg max-w-[240px]">
                <div className="text-[10px] uppercase tracking-wider text-[#A9855E] font-semibold mb-1">
                  Espaço & Conforto
                </div>
                <div className="text-xs sm:text-sm font-medium text-stone-900 leading-snug">
                  Experiência personalizada para realçar sua autenticidade.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

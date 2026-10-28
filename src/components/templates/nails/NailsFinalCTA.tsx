import { formatWhatsAppUrl } from "@/lib/utils";
import { MessageCircle, Sparkles } from "lucide-react";

interface NailsFinalCTAProps {
  businessName: string;
  whatsappNumber: string;
  defaultMessage: string;
}

export function NailsFinalCTA({
  businessName,
  whatsappNumber,
  defaultMessage,
}: NailsFinalCTAProps) {
  const whatsappUrl = formatWhatsAppUrl(
    whatsappNumber,
    defaultMessage || `Oi! Gostaria de agendar meu horário de unhas em gel no ${businessName}.`
  );

  return (
    <section className="py-20 sm:py-28 bg-[#FAF4F2] text-stone-900 relative overflow-hidden border-b border-[#F2EAE7]">
      {/* Detalhe difuso suave */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#F5DDD7]/70 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#F5DDD7] text-[#B75B4A] text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vagas Limitadas por Semana</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl text-stone-900 font-normal leading-[1.15] tracking-tight">
          Pronta para transformar suas unhas com acabamento impecável?
        </h2>

        <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-normal">
          Reserve seu atendimento pelo WhatsApp em poucos segundos. Venha viver uma experiência exclusiva de cuidado e autoestima.
        </p>

        <div className="pt-4 flex justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#B75B4A] text-white text-xs sm:text-sm uppercase tracking-wider font-semibold hover:bg-[#944436] transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Falar com a Nail Designer no WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}


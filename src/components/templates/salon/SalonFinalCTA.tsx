import { formatWhatsAppUrl } from "@/lib/utils";
import { MessageCircle, Sparkles } from "lucide-react";

interface SalonFinalCTAProps {
  businessName: string;
  whatsappNumber: string;
  defaultMessage: string;
}

export function SalonFinalCTA({
  businessName,
  whatsappNumber,
  defaultMessage,
}: SalonFinalCTAProps) {
  const whatsappUrl = formatWhatsAppUrl(
    whatsappNumber,
    defaultMessage || `Olá! Gostaria de agendar meu horário no ${businessName}.`
  );

  return (
    <section className="py-20 sm:py-28 bg-[#231F1C] text-white relative overflow-hidden">
      {/* Detalhe de luz suave de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#A9855E]/15 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#D6BEA0] text-xs font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#C2A37E]" />
          <span>Agendamento Rápido & Sem Fila</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl text-neutral-100 font-normal leading-[1.15] tracking-tight">
          Pronta para viver uma experiência exclusiva de beleza?
        </h2>

        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
          Entre em contato direto pelo WhatsApp. Teremos o prazer de entender suas preferências e agendar o melhor dia e horário para seu atendimento.
        </p>

        <div className="pt-4 flex justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#A9855E] text-white text-xs sm:text-sm uppercase tracking-wider font-semibold hover:bg-[#8C6A47] transition-all shadow-xl hover:shadow-2xl active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Falar com Nossa Recepção no WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}

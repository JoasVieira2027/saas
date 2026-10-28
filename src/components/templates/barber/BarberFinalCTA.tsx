import { formatWhatsAppUrl } from "@/lib/utils";
import { MessageCircle, Scissors } from "lucide-react";

interface BarberFinalCTAProps {
  businessName: string;
  whatsappNumber: string;
  defaultMessage: string;
}

export function BarberFinalCTA({
  businessName,
  whatsappNumber,
  defaultMessage,
}: BarberFinalCTAProps) {
  const whatsappUrl = formatWhatsAppUrl(
    whatsappNumber,
    defaultMessage || `Olá! Gostaria de agendar meu horário no ${businessName}.`
  );

  return (
    <section className="py-20 sm:py-28 bg-[#0D0D0D] text-white relative overflow-hidden border-b border-stone-850">
      {/* Luz âmbar difusa central */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#C5A059]/10 blur-[130px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-stone-900 border border-stone-800 text-[#C5A059] text-xs font-bold tracking-wider uppercase">
          <Scissors className="w-3.5 h-3.5 -rotate-45" />
          <span>Atendimento com Hora Marcada</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl text-white font-bold leading-[1.15] tracking-tight">
          Pronto para alinhar o corte e a barba com quem domina a navalha?
        </h2>

        <p className="text-stone-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
          Reserve seu horário no WhatsApp em menos de 1 minuto. Garanta sua cadeira sem fila e venha relaxar com café ou cerveja gelada.
        </p>

        <div className="pt-4 flex justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-lg bg-[#C5A059] text-stone-950 text-xs sm:text-sm uppercase tracking-wider font-bold hover:bg-[#b59049] transition-all shadow-xl hover:shadow-2xl active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-stone-950" />
            <span>Falar com o Barbeiro no WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}

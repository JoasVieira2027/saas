import { formatWhatsAppUrl } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

interface BarberFloatingWhatsAppProps {
  whatsappNumber: string;
  defaultMessage: string;
}

export function BarberFloatingWhatsApp({
  whatsappNumber,
  defaultMessage,
}: BarberFloatingWhatsAppProps) {
  const whatsappUrl = formatWhatsAppUrl(whatsappNumber, defaultMessage);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar corte ou barba pelo WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-2xl shadow-black/60 transition-transform hover:scale-110 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] focus:ring-offset-black"
      >
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
        <span className="sr-only">Agendar corte ou barba pelo WhatsApp</span>
      </a>
    </div>
  );
}

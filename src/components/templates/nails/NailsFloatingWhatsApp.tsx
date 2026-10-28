import { formatWhatsAppUrl } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

interface NailsFloatingWhatsAppProps {
  whatsappNumber: string;
  defaultMessage: string;
}

export function NailsFloatingWhatsApp({
  whatsappNumber,
  defaultMessage,
}: NailsFloatingWhatsAppProps) {
  const whatsappUrl = formatWhatsAppUrl(whatsappNumber, defaultMessage);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar unhas em gel pelo WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-xl shadow-stone-900/20 transition-transform hover:scale-110 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
      >
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
        <span className="sr-only">Agendar unhas em gel pelo WhatsApp</span>
      </a>
    </div>
  );
}


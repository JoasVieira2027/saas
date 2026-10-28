import { BusinessHour, ContactInfo } from "@/types/database";
import { formatPhone, formatWhatsAppUrl } from "@/lib/utils";
import { Clock, MapPin, Instagram, ExternalLink, MessageCircle } from "lucide-react";

interface SalonHoursAndLocationProps {
  businessHours: BusinessHour[];
  contact: ContactInfo;
  businessName: string;
}

export function SalonHoursAndLocation({
  businessHours,
  contact,
  businessName,
}: SalonHoursAndLocationProps) {
  const dayNames = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  const sortedHours = [...businessHours].sort((a, b) => {
    // Ordena de Segunda (1) a Sábado (6) e depois Domingo (0)
    const orderA = a.day_of_week === 0 ? 7 : a.day_of_week;
    const orderB = b.day_of_week === 0 ? 7 : b.day_of_week;
    return orderA - orderB;
  });

  const mapsUrl =
    contact.google_maps_url ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${contact.address_street}, ${contact.address_neighborhood}, ${contact.address_city} - ${contact.address_state}`
    )}`;

  const instagramUrl = contact.instagram_handle
    ? `https://instagram.com/${contact.instagram_handle.replace("@", "")}`
    : null;

  return (
    <section id="localizacao" className="py-16 sm:py-24 bg-white border-t border-[#EAE3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Horários de Funcionamento (6 colunas) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#A9855E] font-semibold">
                Atendimento
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal tracking-tight mt-1">
                Horários de Funcionamento
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Atendimento exclusivamente com hora marcada para garantir sua comodidade e privacidade.
              </p>
            </div>

            <div className="bg-[#FAF8F5] rounded-2xl border border-[#EFE8DE] divide-y divide-[#EAE3D9] overflow-hidden">
              {sortedHours.map((hour) => (
                <div
                  key={hour.id || hour.day_of_week}
                  className="px-5 py-3.5 flex items-center justify-between text-xs sm:text-sm"
                >
                  <span className="font-medium text-stone-800">
                    {dayNames[hour.day_of_week]}
                  </span>
                  <span
                    className={
                      hour.is_closed
                        ? "text-stone-400 font-normal"
                        : "text-stone-900 font-semibold"
                    }
                  >
                    {hour.is_closed
                      ? "Fechado"
                      : `${hour.open_time} às ${hour.close_time}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Localização e Contato Direto (6 colunas) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#A9855E] font-semibold">
                Onde Estamos
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal tracking-tight mt-1">
                Localização & Fácil Acesso
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Localizado em região nobre e de fácil acesso, com estacionamento conveniado próximo.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-6 sm:p-7 rounded-2xl border border-[#EFE8DE] space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E7DFD5] text-[#8C6A47] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-[#A9855E] font-semibold">
                    Endereço
                  </div>
                  <div className="text-sm font-medium text-stone-900 mt-0.5">
                    {contact.address_street}
                  </div>
                  <div className="text-xs text-stone-500">
                    {contact.address_neighborhood} • {contact.address_city} - {contact.address_state}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-[#D6BEA0] text-stone-800 text-xs font-semibold hover:bg-[#F2ECE3] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#A9855E]" />
                  <span>Traçar Rota no Google Maps</span>
                </a>

                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-[#D6BEA0] text-stone-800 text-xs font-semibold hover:bg-[#F2ECE3] transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5 text-[#A9855E]" />
                    <span>{contact.instagram_handle}</span>
                  </a>
                )}
              </div>

              <div className="pt-4 border-t border-[#EAE3D9] flex items-center justify-between text-xs">
                <span className="text-stone-500">Contato por WhatsApp:</span>
                <span className="font-mono font-medium text-stone-900">
                  {formatPhone(contact.whatsapp_number)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { BusinessHour, ContactInfo } from "@/types/database";
import { formatPhone } from "@/lib/utils";
import { MapPin, Instagram, ExternalLink, Clock } from "lucide-react";

interface NailsHoursAndLocationProps {
  businessHours: BusinessHour[];
  contact: ContactInfo;
  businessName: string;
}

export function NailsHoursAndLocation({
  businessHours,
  contact,
  businessName,
}: NailsHoursAndLocationProps) {
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
    <section id="localizacao" className="py-16 sm:py-24 bg-[#FCFAF9] border-b border-[#F2EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Horários (6 colunas) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#B75B4A] font-semibold">
                Agendamento
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal tracking-tight mt-1">
                Horários de Atendimento
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Atendimento exclusivamente com horário reservado para garantir total dedicação à sua sessão.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#F2EAE7] divide-y divide-[#F2EAE7] overflow-hidden shadow-sm">
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

          {/* Localização (6 colunas) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#B75B4A] font-semibold">
                Localização
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal tracking-tight mt-1">
                Nosso Studio
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Ambiente aconchegante, climatizado e de fácil acesso para sua total comodidade.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#F2EAE7] space-y-5 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF0ED] border border-[#F5DDD7] text-[#B75B4A] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-[#B75B4A] font-semibold">
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
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FAF0ED] border border-[#F5DDD7] text-stone-800 text-xs font-semibold hover:bg-[#F5DDD7] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#B75B4A]" />
                  <span>Abrir no Google Maps</span>
                </a>

                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FAF0ED] border border-[#F5DDD7] text-stone-800 text-xs font-semibold hover:bg-[#F5DDD7] transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5 text-[#B75B4A]" />
                    <span>{contact.instagram_handle}</span>
                  </a>
                )}
              </div>

              <div className="pt-4 border-t border-[#F2EAE7] flex items-center justify-between text-xs">
                <span className="text-stone-500">WhatsApp do Studio:</span>
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


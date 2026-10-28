import { BusinessHour, ContactInfo } from "@/types/database";
import { formatPhone } from "@/lib/utils";
import { MapPin, Instagram, ExternalLink, Clock } from "lucide-react";

interface BarberHoursAndLocationProps {
  businessHours: BusinessHour[];
  contact: ContactInfo;
  businessName: string;
}

export function BarberHoursAndLocation({
  businessHours,
  contact,
  businessName,
}: BarberHoursAndLocationProps) {
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
    <section id="localizacao" className="py-16 sm:py-24 bg-[#111111] text-white border-b border-stone-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Horários (6 colunas) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                Agenda de Cortes
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-100 font-bold tracking-tight mt-1">
                Horários de Atendimento
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Horários estendidos durante a semana para quem precisa alinhar o visual após o expediente.
              </p>
            </div>

            <div className="bg-stone-900 rounded-xl border border-stone-800 divide-y divide-stone-800 overflow-hidden">
              {sortedHours.map((hour) => (
                <div
                  key={hour.id || hour.day_of_week}
                  className="px-5 py-3.5 flex items-center justify-between text-xs sm:text-sm"
                >
                  <span className="font-medium text-stone-300">
                    {dayNames[hour.day_of_week]}
                  </span>
                  <span
                    className={
                      hour.is_closed
                        ? "text-stone-600 font-normal"
                        : "text-white font-semibold"
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
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                Onde Fica a Barbearia
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-100 font-bold tracking-tight mt-1">
                Localização & Estacionamento
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Fácil localização com acesso rápido e vaga para clientes em frente ao clube.
              </p>
            </div>

            <div className="bg-stone-900 p-6 sm:p-7 rounded-xl border border-stone-800 space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-stone-950 border border-stone-800 text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-[#C5A059] font-bold">
                    Endereço
                  </div>
                  <div className="text-sm font-medium text-white mt-0.5">
                    {contact.address_street}
                  </div>
                  <div className="text-xs text-stone-400">
                    {contact.address_neighborhood} • {contact.address_city} - {contact.address_state}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-stone-800 border border-stone-700 text-stone-200 text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] hover:text-stone-950 hover:border-[#C5A059] transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir no Google Maps</span>
                </a>

                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-stone-800 border border-stone-700 text-stone-200 text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] hover:text-stone-950 hover:border-[#C5A059] transition-all"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>{contact.instagram_handle}</span>
                  </a>
                )}
              </div>

              <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-400">Agendamentos WhatsApp:</span>
                <span className="font-mono font-medium text-white">
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


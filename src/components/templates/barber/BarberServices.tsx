"use client";

import { useState } from "react";
import { ServiceItem } from "@/types/database";
import { formatCurrency, formatWhatsAppUrl } from "@/lib/utils";
import { Clock, ArrowRight } from "lucide-react";

interface BarberServicesProps {
  services: ServiceItem[];
  whatsappNumber: string;
  businessName: string;
}

export function BarberServices({
  services,
  whatsappNumber,
  businessName,
}: BarberServicesProps) {
  const categories = ["Todos", ...Array.from(new Set(services.map((s) => s.category)))];
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filteredServices =
    activeCategory === "Todos"
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <section id="servicos" className="py-16 sm:py-24 bg-[#141414] text-white border-b border-stone-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-10 sm:mb-14">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
            Menu de Barbeiro
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-stone-100 font-bold tracking-tight">
            Tabela de Cortes & Barba
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            Consulte os procedimentos individuais com duração estimada e valor transparente.
          </p>
        </div>

        {/* Filtros */}
        {categories.length > 2 && (
          <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-[#C5A059] text-stone-950 shadow-md"
                    : "bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid de Serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const bookingText = `Olá! Gostaria de agendar o serviço "${service.name}" no ${businessName}.`;
            const serviceWhatsAppUrl = formatWhatsAppUrl(whatsappNumber, bookingText);

            return (
              <div
                key={service.id}
                className="bg-stone-900/90 p-6 sm:p-7 rounded-xl border border-stone-800 hover:border-stone-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-stone-950 text-[#C5A059] border border-stone-800 font-semibold">
                      {service.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-stone-400 font-medium">
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      <span>{service.duration_minutes} min</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-lg text-stone-100 font-bold mb-2">
                    {service.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block font-semibold">
                      Valor
                    </span>
                    <span className="font-serif text-xl sm:text-2xl font-bold text-white">
                      {formatCurrency(service.price)}
                    </span>
                  </div>

                  <a
                    href={serviceWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-800 hover:bg-[#C5A059] text-stone-300 hover:text-stone-950 border border-stone-700 hover:border-[#C5A059] text-xs font-bold uppercase tracking-wider transition-all active:scale-95"
                  >
                    <span>Agendar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Nota */}
        <div className="mt-12 text-center text-xs text-stone-500">
          * Todos os serviços incluem lavagem refrescante e finalização com cosméticos de alta fixação.
        </div>
      </div>
    </section>
  );
}

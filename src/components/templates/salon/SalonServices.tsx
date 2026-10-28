"use client";

import { useState } from "react";
import { ServiceItem } from "@/types/database";
import { formatCurrency, formatWhatsAppUrl } from "@/lib/utils";
import { Clock, MessageCircle, ArrowRight } from "lucide-react";

interface SalonServicesProps {
  services: ServiceItem[];
  whatsappNumber: string;
  businessName: string;
}

export function SalonServices({
  services,
  whatsappNumber,
  businessName,
}: SalonServicesProps) {
  // Extrai as categorias únicas dos serviços ativos
  const categories = ["Todos", ...Array.from(new Set(services.map((s) => s.category)))];
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filteredServices =
    activeCategory === "Todos"
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <section id="servicos" className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-10 sm:mb-14">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#A9855E] font-semibold">
            Tabela de Cuidados
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-stone-900 font-normal tracking-tight">
            Menu de Procedimentos & Serviços
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Consulte nossos procedimentos especializados. Todos os valores incluem lavagem terapêutica e finalização.
          </p>
        </div>

        {/* Filtro de Categorias */}
        {categories.length > 2 && (
          <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-[#A9855E] text-white shadow-sm"
                    : "bg-[#F2ECE3] text-stone-700 hover:bg-[#E8D8C4] border border-[#E7DFD5]"
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
            const bookingText = `Olá! Gostaria de agendar o procedimento "${service.name}" no ${businessName}.`;
            const serviceWhatsAppUrl = formatWhatsAppUrl(whatsappNumber, bookingText);

            return (
              <div
                key={service.id}
                className="bg-white p-6 sm:p-7 rounded-2xl border border-[#EFE8DE] shadow-sm hover:shadow-md hover:border-[#D6BEA0] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#8C6A47] border border-[#EAE3D9] font-medium">
                      {service.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{service.duration_minutes} min</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-lg text-stone-900 font-medium mb-2">
                    {service.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F2ECE3] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">
                      Investimento
                    </span>
                    <span className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                      {formatCurrency(service.price)}
                    </span>
                  </div>

                  <a
                    href={serviceWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#A9855E] text-stone-800 hover:text-white border border-[#E7DFD5] hover:border-[#A9855E] text-xs font-semibold tracking-wide transition-all active:scale-95 group"
                  >
                    <span>Agendar</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-white transition-colors" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rodapé da seção de serviços */}
        <div className="mt-12 text-center">
          <p className="text-xs text-stone-500 max-w-lg mx-auto">
            * Procedimentos de mechas e coloração demandam teste prévio de mecha gratuito para validação da saúde do fio.
          </p>
        </div>
      </div>
    </section>
  );
}


import { DifferentialItem } from "@/types/database";
import { Sparkles, ShieldCheck, Clock, HeartHandshake } from "lucide-react";

interface SalonBenefitsProps {
  differentials?: DifferentialItem[];
}

export function SalonBenefits({ differentials }: SalonBenefitsProps) {
  const defaultDifferentials = [
    {
      id: "1",
      title: "Diagnóstico Capilar Prévio",
      description: "Avaliação minuciosa da elasticidade, porosidade e saúde do fio para assegurar total integridade antes de qualquer transformação química.",
      icon: Sparkles,
    },
    {
      id: "2",
      title: "Cosméticos de Padrão Internacional",
      description: "Protocolos executados exclusivamente com fórmulas de alta performance para nutrição profunda e proteção térmica prolongada.",
      icon: ShieldCheck,
    },
    {
      id: "3",
      title: "Atendimento Rigoroso com Hora Marcada",
      description: "Respeito absoluto ao seu tempo. Agenda organizada com intervalo exclusivo entre clientes para garantir dedicação integral.",
      icon: Clock,
    },
    {
      id: "4",
      title: "Ambiente Acolhedor & Privativo",
      description: "Estrutura moderna e iluminada, climatização agradável, café especial e estações confortáveis para uma experiência relaxante.",
      icon: HeartHandshake,
    },
  ];

  const items = differentials && differentials.length > 0 ? differentials : defaultDifferentials;
  const icons = [Sparkles, ShieldCheck, Clock, HeartHandshake];

  return (
    <section id="diferenciais" className="py-16 sm:py-24 bg-white border-y border-[#EAE3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Seção */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-14 sm:mb-20">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#A9855E] font-semibold">
            Diferenciais de Atendimento
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-stone-900 font-normal tracking-tight">
            Cuidado que transcende a estética convencional
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Priorizamos a saúde da fibra capilar e a precisão técnica em cada procedimento realizado em nosso espaço.
          </p>
        </div>

        {/* Grid de 4 Pilares */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => {
            const IconComponent = icons[index % icons.length];

            return (
              <div
                key={item.id || index}
                className="p-6 sm:p-8 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DE] flex flex-col justify-between hover:border-[#D6BEA0] transition-colors group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#F2ECE3] border border-[#E7DFD5] text-[#8C6A47] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <IconComponent className="w-5 h-5 stroke-[1.8]" />
                  </div>

                  <h3 className="font-serif text-lg text-stone-900 font-medium mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EAE3D9]/60 text-[11px] text-[#A9855E] font-medium tracking-wide">
                  Padrão de Excelência
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

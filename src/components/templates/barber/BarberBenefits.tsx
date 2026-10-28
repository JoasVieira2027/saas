import { DifferentialItem } from "@/types/database";
import { Flame, Scissors, Clock, Beer } from "lucide-react";

interface BarberBenefitsProps {
  differentials?: DifferentialItem[];
}

export function BarberBenefits({ differentials }: BarberBenefitsProps) {
  const defaultDifferentials = [
    {
      id: "1",
      title: "Barboterapia com Toalha Quente",
      description: "Ritual completo com vapor de ozônio, óleos essenciais pré-barba, navalhete descartável e toalha quente para abertura dos poros sem irritação.",
      icon: Flame,
    },
    {
      id: "2",
      title: "Navalha & Acabamento Milimétrico",
      description: "Técnica apurada de alinhamento de contorno, degradê perfeito (fade) e finalização com lâmina de precisão cirúrgica.",
      icon: Scissors,
    },
    {
      id: "3",
      title: "Sem Espera & Hora Marcada",
      description: "Seu tempo é prioridade. Atendimento rigorosamente no horário agendado, com intervalo garantido para uma experiência sem pressa.",
      icon: Clock,
    },
    {
      id: "4",
      title: "Lounge com Bebida Cortesia",
      description: "Ambiente reservado com climatização agradável, café expresso moído na hora e cerveja artesanal gelada durante seu atendimento.",
      icon: Beer,
    },
  ];

  const items = differentials && differentials.length > 0 ? differentials : defaultDifferentials;
  const icons = [Flame, Scissors, Clock, Beer];

  return (
    <section id="diferenciais" className="py-16 sm:py-24 bg-[#141414] border-b border-stone-850 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-14 sm:mb-20">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
            Padrão de Barbearia
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-stone-100 font-bold tracking-tight">
            Por Que Cuidar do Visual Conosco
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            Resgatamos a essência do corte clássico e da toalha quente com o que há de mais atual em visagismo e conforto masculino.
          </p>
        </div>

        {/* Grid de Diferenciais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => {
            const IconComponent = icons[index % icons.length];

            return (
              <div
                key={item.id || index}
                className="p-6 sm:p-7 rounded-xl bg-stone-900/80 border border-stone-800 flex flex-col justify-between hover:border-[#C5A059]/50 transition-colors group"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-stone-950 border border-stone-800 text-[#C5A059] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <IconComponent className="w-5 h-5 stroke-[1.8]" />
                  </div>

                  <h3 className="font-serif text-lg text-stone-100 font-bold mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-800/80 text-[11px] text-[#C5A059] font-semibold tracking-wider uppercase">
                  Diferencial Exclusivo
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

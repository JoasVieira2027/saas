import { DifferentialItem } from "@/types/database";
import { ShieldCheck, HeartHandshake, Sparkles, Gem } from "lucide-react";

interface NailsBenefitsProps {
  differentials?: DifferentialItem[];
}

export function NailsBenefits({ differentials }: NailsBenefitsProps) {
  const defaultDifferentials = [
    {
      id: "1",
      title: "Biossegurança & Autoclave Cirúrgica",
      description: "Instrumentos metálicos 100% esterilizados em autoclave hospitalar e kits individuais com lixas descartáveis para total segurança.",
      icon: ShieldCheck,
    },
    {
      id: "2",
      title: "Preservação da Unha Natural",
      description: "Técnica apurada de preparação sem desbaste agressivo da lâmina, garantindo unhas saudáveis e fortes sob o gel.",
      icon: HeartHandshake,
    },
    {
      id: "3",
      title: "Curvatura C Fina & Natural",
      description: "Alongamento com espessura realista e simetria anatômica perfeita, sem aspecto pesado ou artificial.",
      icon: Gem,
    },
    {
      id: "4",
      title: "Brilho Espelhado de até 30 Dias",
      description: "Géis construtores e top coats hipoalergênicos importados que não amarelam, não descascam e mantêm acabamento de vidro.",
      icon: Sparkles,
    },
  ];

  const items = differentials && differentials.length > 0 ? differentials : defaultDifferentials;
  const icons = [ShieldCheck, HeartHandshake, Gem, Sparkles];

  return (
    <section id="diferenciais" className="py-16 sm:py-24 bg-[#FAF6F4] border-b border-[#F2EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-14 sm:mb-20">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#B75B4A] font-semibold">
            Biossegurança & Saúde
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-stone-900 font-normal tracking-tight">
            Excelência e Cuidados com a Sua Saúde
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Nossos protocolos de esterilização e produtos hipoalergênicos garantem uma experiência segura e de alto padrão.
          </p>
        </div>

        {/* Grid de Diferenciais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => {
            const IconComponent = icons[index % icons.length];

            return (
              <div
                key={item.id || index}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-[#F2EAE7] flex flex-col justify-between hover:border-[#ECC3B9] transition-colors group shadow-sm"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#FAF0ED] border border-[#F5DDD7] text-[#B75B4A] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <IconComponent className="w-5 h-5 stroke-[1.8]" />
                  </div>

                  <h3 className="font-serif text-lg text-stone-900 font-medium mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F2EAE7] text-[11px] text-[#B75B4A] font-medium tracking-wide">
                  Garantia de Qualidade
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


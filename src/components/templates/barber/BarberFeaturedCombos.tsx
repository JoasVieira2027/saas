import { ServiceItem } from "@/types/database";
import { formatCurrency, formatWhatsAppUrl } from "@/lib/utils";
import { Crown, Clock, Check, MessageCircle } from "lucide-react";

interface BarberFeaturedCombosProps {
  services: ServiceItem[];
  whatsappNumber: string;
  businessName: string;
}

export function BarberFeaturedCombos({
  services,
  whatsappNumber,
  businessName,
}: BarberFeaturedCombosProps) {
  const comboServices = services.filter(
    (s) =>
      s.category.toLowerCase().includes("combo") ||
      s.name.toLowerCase().includes("combo")
  );

  if (comboServices.length === 0) {
    return null;
  }

  return (
    <section id="combos" className="py-16 sm:py-24 bg-[#111111] text-white border-b border-stone-850 relative overflow-hidden">
      {/* Detalhe difuso */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-72 bg-[#C5A059]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-[#C5A059] text-xs uppercase font-bold tracking-wider">
            <Crown className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Mais Procurados</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-stone-100 font-bold tracking-tight">
            Combos VIP de Cabelo & Barba
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            Economize tempo e aproveite o ritual completo com condições exclusivas e bebida inclusa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {comboServices.map((combo) => {
            const bookingText = `Olá! Gostaria de agendar o "${combo.name}" no ${businessName}.`;
            const comboWhatsAppUrl = formatWhatsAppUrl(whatsappNumber, bookingText);

            return (
              <div
                key={combo.id}
                className="relative rounded-2xl bg-stone-900 border-2 border-[#C5A059]/40 p-6 sm:p-8 flex flex-col justify-between shadow-2xl hover:border-[#C5A059] transition-all group"
              >
                {/* Badge no topo */}
                <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-[#C5A059] text-stone-950 font-bold text-[10px] uppercase tracking-wider">
                  Experiência Completa
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
                    <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{combo.duration_minutes} minutos de atendimento</span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl text-stone-100 font-bold mb-3">
                    {combo.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-6">
                    {combo.description}
                  </p>

                  <div className="space-y-2 py-4 border-t border-stone-800 text-xs text-stone-300">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#C5A059] shrink-0" />
                      <span>Corte masculino com acabamento na navalha</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#C5A059] shrink-0" />
                      <span>Ritual de barboterapia com toalha quente</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#C5A059] shrink-0" />
                      <span>Cerveja artesanal ou café expresso de cortesia</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-800 mt-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block font-semibold">
                      Valor Especial
                    </span>
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
                      {formatCurrency(combo.price)}
                    </span>
                  </div>

                  <a
                    href={comboWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#C5A059] hover:bg-[#b59049] text-stone-950 text-xs uppercase tracking-wider font-bold transition-all shadow-md active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 fill-stone-950" />
                    <span>Garantir Combo</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


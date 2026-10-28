import { ContactInfo } from "@/types/database";

interface BarberFooterProps {
  businessName: string;
  contact: ContactInfo;
}

export function BarberFooter({ businessName, contact }: BarberFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] text-stone-400 py-12 text-xs border-t border-stone-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-900">
          <div className="text-center md:text-left">
            <div className="font-serif text-xl text-stone-100 font-bold uppercase tracking-tight">
              {businessName}
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] mt-0.5 font-bold">
              Barber Club & Grooming Tradicional
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-[11px] uppercase tracking-wider text-stone-400">
            <a href="#servicos" className="hover:text-stone-200 transition-colors">
              Serviços
            </a>
            <a href="#combos" className="hover:text-stone-200 transition-colors">
              Combos
            </a>
            <a href="#diferenciais" className="hover:text-stone-200 transition-colors">
              Diferenciais
            </a>
            <a href="#galeria" className="hover:text-stone-200 transition-colors">
              Galeria
            </a>
            <a href="#equipe" className="hover:text-stone-200 transition-colors">
              Barbeiros
            </a>
            <a href="#localizacao" className="hover:text-stone-200 transition-colors">
              Horários & Local
            </a>
          </nav>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-stone-500 text-[11px]">
          <div>
            {contact.address_street}, {contact.address_neighborhood} • {contact.address_city} - {contact.address_state}
          </div>

          <div>
            &copy; {currentYear} {businessName}. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}

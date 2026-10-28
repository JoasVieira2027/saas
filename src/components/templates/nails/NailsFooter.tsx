import { ContactInfo } from "@/types/database";

interface NailsFooterProps {
  businessName: string;
  contact: ContactInfo;
}

export function NailsFooter({ businessName, contact }: NailsFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FCFAF9] text-stone-500 py-12 text-xs border-t border-[#F2EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#F2EAE7]">
          <div className="text-center md:text-left">
            <div className="font-serif text-xl text-stone-900 font-normal">
              {businessName}
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#B75B4A] mt-0.5 font-semibold">
              Nail Studio • Alongamento em Gel & Fibra
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-[11px] uppercase tracking-wider text-stone-600">
            <a href="#servicos" className="hover:text-stone-900 transition-colors">
              Procedimentos
            </a>
            <a href="#galeria" className="hover:text-stone-900 transition-colors">
              Galeria
            </a>
            <a href="#diferenciais" className="hover:text-stone-900 transition-colors">
              Biossegurança
            </a>
            <a href="#sobre" className="hover:text-stone-900 transition-colors">
              A Profissional
            </a>
            <a href="#localizacao" className="hover:text-stone-900 transition-colors">
              Horários & Local
            </a>
          </nav>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-stone-400 text-[11px]">
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


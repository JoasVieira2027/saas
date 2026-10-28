import Link from "next/link";
import { ContactInfo } from "@/types/database";

interface SalonFooterProps {
  businessName: string;
  contact: ContactInfo;
}

export function SalonFooter({ businessName, contact }: SalonFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1C1917] text-stone-400 py-12 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-800">
          <div className="text-center md:text-left">
            <div className="font-serif text-xl text-stone-100 font-normal">
              {businessName}
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#A9855E] mt-0.5">
              Salão de Beleza & Estética Capilar
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-[11px] uppercase tracking-wider text-stone-400">
            <a href="#servicos" className="hover:text-stone-200 transition-colors">
              Serviços
            </a>
            <a href="#diferenciais" className="hover:text-stone-200 transition-colors">
              Diferenciais
            </a>
            <a href="#galeria" className="hover:text-stone-200 transition-colors">
              Resultados
            </a>
            <a href="#sobre" className="hover:text-stone-200 transition-colors">
              O Salão
            </a>
            <a href="#localizacao" className="hover:text-stone-200 transition-colors">
              Horários & Endereço
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


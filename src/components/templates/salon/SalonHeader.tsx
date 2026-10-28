"use client";

import { useState } from "react";
import Link from "next/link";
import { formatWhatsAppUrl } from "@/lib/utils";
import { Menu, X, MessageCircle } from "lucide-react";

interface SalonHeaderProps {
  businessName: string;
  whatsappNumber: string;
  defaultMessage: string;
}

export function SalonHeader({
  businessName,
  whatsappNumber,
  defaultMessage,
}: SalonHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const whatsappUrl = formatWhatsAppUrl(whatsappNumber, defaultMessage);

  const navLinks = [
    { label: "Serviços", href: "#servicos" },
    { label: "Diferenciais", href: "#diferenciais" },
    { label: "Resultados", href: "#galeria" },
    { label: "O Salão", href: "#sobre" },
    { label: "Horários & Endereço", href: "#localizacao" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE3D9] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Nome do Salão */}
          <Link href="#topo" className="flex flex-col group">
            <span className="font-serif text-xl sm:text-2xl text-stone-900 font-normal tracking-tight group-hover:text-[#8C6A47] transition-colors">
              {businessName}
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A9855E] font-medium">
              Concept Hair & Care
            </span>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-[0.15em] font-medium text-stone-600 hover:text-[#8C6A47] transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Botão Agendar no Header (Desktop) */}
          <div className="hidden sm:flex items-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#A9855E] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#8C6A47] transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Agendar Horário</span>
            </a>
          </div>

          {/* Botão Mobile Hamburger */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-[#F2ECE3] transition-colors focus:outline-none"
              aria-expanded={mobileMenuOpen}
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Overlay / Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EAE3D9] bg-[#FAF8F5] px-4 pt-4 pb-6 space-y-3 shadow-xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:text-stone-950 hover:bg-[#F2ECE3] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#EAE3D9]">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#A9855E] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#8C6A47] transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Agendar pelo WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}


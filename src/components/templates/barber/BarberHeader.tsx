"use client";

import { useState } from "react";
import Link from "next/link";
import { formatWhatsAppUrl } from "@/lib/utils";
import { Menu, X, Scissors, MessageCircle } from "lucide-react";

interface BarberHeaderProps {
  businessName: string;
  whatsappNumber: string;
  defaultMessage: string;
}

export function BarberHeader({
  businessName,
  whatsappNumber,
  defaultMessage,
}: BarberHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const whatsappUrl = formatWhatsAppUrl(whatsappNumber, defaultMessage);

  const navLinks = [
    { label: "Serviços", href: "#servicos" },
    { label: "Combos", href: "#combos" },
    { label: "Diferenciais", href: "#diferenciais" },
    { label: "Galeria", href: "#galeria" },
    { label: "Barbeiros", href: "#equipe" },
    { label: "Horários & Local", href: "#localizacao" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-md border-b border-stone-850 transition-all border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Nome da Barbearia */}
          <Link href="#topo" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-[#C5A059] group-hover:border-[#C5A059] transition-colors">
              <Scissors className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl text-stone-100 font-bold tracking-tight uppercase group-hover:text-[#C5A059] transition-colors block leading-tight">
                {businessName}
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium block">
                Barber Club & Grooming
              </span>
            </div>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-[0.15em] font-medium text-stone-400 hover:text-[#C5A059] transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA no Header */}
          <div className="hidden sm:flex items-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C5A059] text-stone-950 text-xs uppercase tracking-wider font-bold hover:bg-[#b59049] transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-stone-950" />
              <span>Agendar Horário</span>
            </a>
          </div>

          {/* Botão Mobile Hamburger */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors focus:outline-none"
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
        <div className="lg:hidden border-t border-stone-800 bg-[#161616] px-4 pt-4 pb-6 space-y-3 shadow-2xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-stone-300 hover:text-white hover:bg-stone-850 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-stone-800">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#C5A059] text-stone-950 text-xs uppercase tracking-wider font-bold hover:bg-[#b59049] transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-stone-950" />
              <span>Agendar pelo WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

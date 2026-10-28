"use client";

import { useState } from "react";
import Link from "next/link";
import { formatWhatsAppUrl } from "@/lib/utils";
import { Menu, X, Sparkles, MessageCircle } from "lucide-react";

interface NailsHeaderProps {
  businessName: string;
  whatsappNumber: string;
  defaultMessage: string;
}

export function NailsHeader({
  businessName,
  whatsappNumber,
  defaultMessage,
}: NailsHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const whatsappUrl = formatWhatsAppUrl(whatsappNumber, defaultMessage);

  const navLinks = [
    { label: "Procedimentos", href: "#servicos" },
    { label: "Galeria", href: "#galeria" },
    { label: "Biossegurança", href: "#diferenciais" },
    { label: "A Profissional", href: "#sobre" },
    { label: "Horários & Local", href: "#localizacao" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FCFAF9]/95 backdrop-blur-md border-b border-[#F2EAE7] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Nome da Nail Designer */}
          <Link href="#topo" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-[#FAF0ED] border border-[#F5DDD7] flex items-center justify-center text-[#B75B4A] group-hover:bg-[#F5DDD7] transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl text-stone-900 font-medium tracking-tight block leading-tight group-hover:text-[#B75B4A] transition-colors">
                {businessName}
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B75B4A] font-semibold block">
                Nail Studio & Gel Art
              </span>
            </div>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-[0.15em] font-medium text-stone-600 hover:text-[#B75B4A] transition-colors py-1"
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B75B4A] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#944436] transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Agendar Sessão</span>
            </a>
          </div>

          {/* Botão Mobile Hamburger */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-[#F5DDD7]/50 transition-colors focus:outline-none"
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

      {/* Menu Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#F2EAE7] bg-[#FCFAF9] px-4 pt-4 pb-6 space-y-3 shadow-xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:text-stone-950 hover:bg-[#FAF0ED] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#F2EAE7]">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#B75B4A] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#944436] transition-all shadow-sm active:scale-95"
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


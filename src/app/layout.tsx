import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GlowSaaS | Plataforma de Páginas para Negócios de Beleza",
  description: "Crie, personalize e publique landing pages de alta conversão para salões, barbearias e nail designers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased text-neutral-900 bg-neutral-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}

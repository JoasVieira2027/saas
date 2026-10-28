import Image from "next/image";
import { GalleryImage } from "@/types/database";

interface SalonGalleryProps {
  gallery?: GalleryImage[];
}

export function SalonGallery({ gallery }: SalonGalleryProps) {
  const defaultGallery: GalleryImage[] = [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      title: "Loiro Perolado & Esfumado",
      alt: "Resultado de mechas loiro perolado",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
      title: "Ambiente & Lavatórios",
      alt: "Espaço sofisticado e acolhedor",
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80",
      title: "Morena Iluminada Caramelo",
      alt: "Iluminação sutil em tons quentes",
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80",
      title: "Corte em Camadas Natural",
      alt: "Corte moderno com movimento",
    },
    {
      id: "5",
      url: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80",
      title: "Finalização & Brilho Espelhado",
      alt: "Finalização polida e alinhada",
    },
    {
      id: "6",
      url: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
      title: "Terapia & Nutrição Capilar",
      alt: "Tratamento de recuperação capilar",
    },
  ];

  const items = gallery && gallery.length > 0 ? gallery : defaultGallery;

  return (
    <section id="galeria" className="py-16 sm:py-24 bg-white border-t border-[#EAE3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12 sm:mb-16">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#A9855E] font-semibold">
            Portfólio & Resultados
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-stone-900 font-normal tracking-tight">
            Galeria de Transformações
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Cada trabalho reflete o respeito à identidade e às características únicas de cada cliente.
          </p>
        </div>

        {/* Grid de Fotos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#EFE8DE] shadow-sm"
            >
              <Image
                src={item.url}
                alt={item.alt || item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Overlay Suave com Legenda */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity flex items-end p-5 sm:p-6">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#D6BEA0] font-semibold mb-1">
                    Trabalho Autoral
                  </div>
                  <h3 className="font-serif text-base sm:text-lg text-white font-medium">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


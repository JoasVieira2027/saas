import Image from "next/image";
import { GalleryImage } from "@/types/database";

interface NailsGalleryProps {
  gallery?: GalleryImage[];
}

export function NailsGallery({ gallery }: NailsGalleryProps) {
  const defaultGallery: GalleryImage[] = [
    {
      id: "n1",
      url: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
      title: "Alongamento Nude Rosé",
      alt: "Unhas em gel com acabamento natural nude rosé",
    },
    {
      id: "n2",
      url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80",
      title: "Formato Almond Elegante",
      alt: "Design amendoado com esmaltação clean",
    },
    {
      id: "n3",
      url: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80",
      title: "Babyboomer Suave",
      alt: "Degradê suave em estilo babyboomer francês",
    },
    {
      id: "n4",
      url: "https://images.unsplash.com/photo-1522337094846-8a818192de1f?auto=format&fit=crop&w=800&q=80",
      title: "Blindagem & Brilho Duradouro",
      alt: "Unhas naturais blindadas com top coat espelhado",
    },
    {
      id: "n5",
      url: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
      title: "Nail Art Minimalista",
      alt: "Linhas finas e detalhes discretos em nail art",
    },
    {
      id: "n6",
      url: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=800&q=80",
      title: "Manutenção & Cuticulagem Russa",
      alt: "Acabamento perfeito de cutícula e nivelamento",
    },
  ];

  const items = gallery && gallery.length > 0 ? gallery : defaultGallery;

  return (
    <section id="galeria" className="py-16 sm:py-24 bg-white border-b border-[#F2EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12 sm:mb-16">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#B75B4A] font-semibold">
            Portfólio de Alongamentos
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-stone-900 font-normal tracking-tight">
            Galeria de Trabalhos em Destaque
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Curvatura delicada, formatos anatômicos e acabamento de alto brilho que preservam a sua beleza natural.
          </p>
        </div>

        {/* Grid de Fotos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF0ED] border border-[#F2EAE7] shadow-sm"
            >
              <Image
                src={item.url}
                alt={item.alt || item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Overlay Suave com Legenda */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/15 to-transparent opacity-80 group-hover:opacity-95 transition-opacity flex items-end p-5 sm:p-6">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#F5DDD7] font-semibold mb-1">
                    Design Autoral
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


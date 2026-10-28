import Image from "next/image";
import { GalleryImage } from "@/types/database";

interface BarberGalleryProps {
  gallery?: GalleryImage[];
}

export function BarberGallery({ gallery }: BarberGalleryProps) {
  const defaultGallery: GalleryImage[] = [
    {
      id: "b1",
      url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
      title: "Degradê Fade Alinhado",
      alt: "Corte fade em degradê preciso",
    },
    {
      id: "b2",
      url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
      title: "Barboterapia Tradicional",
      alt: "Ritual de toalha quente na barba",
    },
    {
      id: "b3",
      url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
      title: "Navalhado Clássico",
      alt: "Acabamento com navalha afiada",
    },
    {
      id: "b4",
      url: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=800&q=80",
      title: "Ambiente Vintage & Couro",
      alt: "Cadeiras clássicas e ambiente aconchegante",
    },
    {
      id: "b5",
      url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
      title: "Design de Barba & Contorno",
      alt: "Barba alinhada com precisão milimétrica",
    },
    {
      id: "b6",
      url: "https://images.unsplash.com/photo-1534778356534-d3d45b6df1da?auto=format&fit=crop&w=800&q=80",
      title: "Corte na Tesoura Clássico",
      alt: "Corte masculino à mão livre na tesoura",
    },
  ];

  const items = gallery && gallery.length > 0 ? gallery : defaultGallery;

  return (
    <section id="galeria" className="py-16 sm:py-24 bg-[#111111] text-white border-b border-stone-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12 sm:mb-16">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
            Galeria de Trabalhos
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-stone-100 font-bold tracking-tight">
            Cortes, Barba & Ambiente
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            Confira alguns dos trabalhos autorais executados por nossos barbeiros no dia a dia.
          </p>
        </div>

        {/* Grid de Fotos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-stone-900 border border-stone-800 shadow-lg"
            >
              <Image
                src={item.url}
                alt={item.alt || item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Overlay Escuro com Legenda */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity flex items-end p-5 sm:p-6">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#C5A059] font-bold mb-1">
                    Trabalho em Destaque
                  </div>
                  <h3 className="font-serif text-base sm:text-lg text-white font-bold">
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


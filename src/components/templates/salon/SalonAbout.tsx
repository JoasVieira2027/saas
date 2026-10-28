import Image from "next/image";
import { AboutSection, TeamMember } from "@/types/database";
import { Award, Users, Sparkles } from "lucide-react";

interface SalonAboutProps {
  about: AboutSection;
  team?: TeamMember[];
  businessName: string;
}

export function SalonAbout({ about, team, businessName }: SalonAboutProps) {
  const defaultTeam: TeamMember[] = [
    {
      id: "1",
      name: "Aline Vasconcelos",
      role: "Fundadora & Master Colorista",
      specialty: "Loiros Personalizados e Visagismo",
      image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "2",
      name: "Camila Silveira",
      role: "Especialista em Cortes & Styling",
      specialty: "Cortes Geométricos e Finalizações Naturais",
      image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "3",
      name: "Rodrigo Mello",
      role: "Terapeuta Capilar & Cuidados",
      specialty: "Saúde do Couro Cabeludo e Cronograma Intensivo",
      image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const teamMembers = team && team.length > 0 ? team : defaultTeam;

  return (
    <section id="sobre" className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Bloco 1: O Salão & Proposta */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Imagem do Salão */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl bg-[#E8D8C4] border border-[#EAE3D9]">
              <Image
                src={about.highlight_image_url}
                alt={`Espaço ${businessName}`}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover object-center"
              />
            </div>

            {/* Selo de Experiência */}
            <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-4 sm:p-5 rounded-2xl border border-[#E7DFD5] shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#F2ECE3] text-[#8C6A47] flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-stone-900 leading-none">
                  {about.years_experience}+ anos
                </div>
                <div className="text-[11px] text-stone-500 font-medium uppercase tracking-wider mt-1">
                  Tradição e Excelência
                </div>
              </div>
            </div>
          </div>

          {/* Texto Sobre */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#A9855E] font-semibold">
              Espaço & Proposta
            </span>

            <h2 className="font-serif text-2xl sm:text-4xl text-stone-900 font-normal tracking-tight">
              {about.title}
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
              {about.description}
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-[#EFE8DE]">
                <div className="flex items-center gap-2 text-stone-900 font-medium text-sm mb-1">
                  <Sparkles className="w-4 h-4 text-[#A9855E]" />
                  <span>Visagismo Integrado</span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Harmonização de tom de pele, formato de rosto e estilo de vida.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#EFE8DE]">
                <div className="flex items-center gap-2 text-stone-900 font-medium text-sm mb-1">
                  <Users className="w-4 h-4 text-[#A9855E]" />
                  <span>Equipe Qualificada</span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Profissionais certificados em academias de referência nacional e internacional.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 2: Equipe de Especialistas */}
        <div className="pt-12 border-t border-[#EAE3D9]">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-12">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#A9855E] font-semibold">
              Profissionais
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
              Especialistas dedicados ao seu cuidado
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white p-5 rounded-2xl border border-[#EFE8DE] shadow-sm flex items-center gap-4 group"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#EAE3D9]">
                  <Image
                    src={member.image_url}
                    alt={member.name}
                    fill
                    sizes="64px"
                    className="object-cover object-center group-hover:scale-105 transition-transform"
                  />
                </div>

                <div>
                  <h4 className="font-serif text-base text-stone-900 font-medium">
                    {member.name}
                  </h4>
                  <div className="text-xs text-[#8C6A47] font-medium">
                    {member.role}
                  </div>
                  {member.specialty && (
                    <div className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                      {member.specialty}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

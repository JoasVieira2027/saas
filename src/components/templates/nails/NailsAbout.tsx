import Image from "next/image";
import { AboutSection, TeamMember } from "@/types/database";
import { Award, Sparkles, Heart } from "lucide-react";

interface NailsAboutProps {
  about: AboutSection;
  team?: TeamMember[];
  businessName: string;
}

export function NailsAbout({ about, team, businessName }: NailsAboutProps) {
  const defaultTeam: TeamMember[] = [
    {
      id: "n1",
      name: "Gisele Rocha",
      role: "Fundadora & Master Nail Designer",
      specialty: "Gel Moldado, Fibra Slim e Cuticulagem Russa",
      image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "n2",
      name: "Beatriz Lima",
      role: "Especialista em Blindagem & Esmaltação",
      specialty: "Unhas Frágeis, Formatos Amendoados e Nail Art Clean",
      image_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const teamMembers = team && team.length > 0 ? team : defaultTeam;

  return (
    <section id="sobre" className="py-16 sm:py-24 bg-white border-b border-[#F2EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Bloco 1: O Studio & Filosofia */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl bg-[#FAF0ED] border border-[#F2EAE7]">
              <Image
                src={about.highlight_image_url}
                alt={`Studio ${businessName}`}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover object-center"
              />
            </div>

            {/* Selo de Experiência */}
            <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-4 sm:p-5 rounded-2xl border border-[#F2EAE7] shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#FAF0ED] text-[#B75B4A] flex items-center justify-center shrink-0 border border-[#F5DDD7]">
                <Award className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-stone-900 leading-none">
                  {about.years_experience}+ anos
                </div>
                <div className="text-[10px] text-stone-500 font-medium uppercase tracking-wider mt-1">
                  Dedicação & Arte
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#B75B4A] font-semibold">
              O Studio & Atendimento
            </span>

            <h2 className="font-serif text-2xl sm:text-4xl text-stone-900 font-normal tracking-tight">
              {about.title}
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
              {about.description}
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FCFAF9] border border-[#F2EAE7]">
                <div className="flex items-center gap-2 text-stone-900 font-medium text-sm mb-1">
                  <Sparkles className="w-4 h-4 text-[#B75B4A]" />
                  <span>Precisão Anatômica</span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Estrutura projetada para resistir ao dia a dia sem sobrecarregar a unha natural.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FCFAF9] border border-[#F2EAE7]">
                <div className="flex items-center gap-2 text-stone-900 font-medium text-sm mb-1">
                  <Heart className="w-4 h-4 text-[#B75B4A]" />
                  <span>Atendimento Acolhedor</span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Espaço intimista pensado para você relaxar enquanto cuidamos dos detalhes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 2: Nail Designers */}
        <div className="pt-12 border-t border-[#F2EAE7]">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-12">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#B75B4A] font-semibold">
              Especialistas
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
              Nossa Equipe de Nail Designers
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-[#FCFAF9] p-5 rounded-2xl border border-[#F2EAE7] shadow-sm flex items-center gap-4 group"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FAF0ED] shrink-0 border border-[#F5DDD7]">
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
                  <div className="text-xs text-[#B75B4A] font-semibold">
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


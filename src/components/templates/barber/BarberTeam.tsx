import Image from "next/image";
import { AboutSection, TeamMember } from "@/types/database";
import { Award, Scissors, CheckCircle } from "lucide-react";

interface BarberTeamProps {
  about: AboutSection;
  team?: TeamMember[];
  businessName: string;
}

export function BarberTeam({ about, team, businessName }: BarberTeamProps) {
  const defaultTeam: TeamMember[] = [
    {
      id: "b1",
      name: "Marcos Tavares",
      role: "Fundador & Master Barber",
      specialty: "Fade de Alta Precisão e Barba na Toalha",
      image_url: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "b2",
      name: "Diego Ramos",
      role: "Especialista em Navalha & Visagismo",
      specialty: "Alinhamento Clássico e Camuflagem de Fios",
      image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "b3",
      name: "Lucas Albuquerque",
      role: "Barber & Hair Stylist",
      specialty: "Cortes Contemporâneos e Texturização",
      image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const teamMembers = team && team.length > 0 ? team : defaultTeam;

  return (
    <section id="equipe" className="py-16 sm:py-24 bg-[#141414] text-white border-b border-stone-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Bloco 1: A Casa / História */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl bg-stone-900 border border-stone-800">
              <Image
                src={about.highlight_image_url}
                alt={`Ambiente ${businessName}`}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover object-center"
              />
            </div>

            {/* Badge de Tradição */}
            <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-stone-900 p-4 sm:p-5 rounded-xl border border-stone-800 shadow-xl flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-stone-950 text-[#C5A059] flex items-center justify-center shrink-0 border border-stone-800">
                <Award className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-white leading-none">
                  {about.years_experience}+ anos
                </div>
                <div className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider mt-1">
                  Tradição na Navalha
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
              História & Filosofia
            </span>

            <h2 className="font-serif text-2xl sm:text-4xl text-stone-100 font-bold tracking-tight">
              {about.title}
            </h2>

            <p className="text-stone-400 text-sm sm:text-base leading-relaxed font-normal">
              {about.description}
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-300">
              <div className="p-4 rounded-lg bg-stone-900 border border-stone-800 flex items-center gap-3">
                <Scissors className="w-5 h-5 text-[#C5A059] shrink-0" />
                <span>Cortes adaptados ao formato craniano e estilo pessoal</span>
              </div>

              <div className="p-4 rounded-lg bg-stone-900 border border-stone-800 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#C5A059] shrink-0" />
                <span>Protocolos de toalha quente e lâmina de precisão</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 2: Nossos Barbeiros */}
        <div className="pt-12 border-t border-stone-800">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-12">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
              Corpo Técnico
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-stone-100 font-bold">
              Nossos Barbeiros Especialistas
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-stone-900/90 p-5 rounded-xl border border-stone-800 shadow-md flex items-center gap-4 group"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-950 shrink-0 border border-stone-800">
                  <Image
                    src={member.image_url}
                    alt={member.name}
                    fill
                    sizes="64px"
                    className="object-cover object-center group-hover:scale-105 transition-transform"
                  />
                </div>

                <div>
                  <h4 className="font-serif text-base text-white font-bold">
                    {member.name}
                  </h4>
                  <div className="text-xs text-[#C5A059] font-medium">
                    {member.role}
                  </div>
                  {member.specialty && (
                    <div className="text-[11px] text-stone-400 mt-1 line-clamp-1">
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

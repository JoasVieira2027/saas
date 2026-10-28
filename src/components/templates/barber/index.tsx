import { PublicLandingPageData } from "@/types/landing-page";
import { BarberHeader } from "./BarberHeader";
import { BarberHero } from "./BarberHero";
import { BarberBenefits } from "./BarberBenefits";
import { BarberFeaturedCombos } from "./BarberFeaturedCombos";
import { BarberServices } from "./BarberServices";
import { BarberGallery } from "./BarberGallery";
import { BarberTeam } from "./BarberTeam";
import { BarberHoursAndLocation } from "./BarberHoursAndLocation";
import { BarberFinalCTA } from "./BarberFinalCTA";
import { BarberFooter } from "./BarberFooter";
import { BarberFloatingWhatsApp } from "./BarberFloatingWhatsApp";

interface BarberTemplateProps {
  data: PublicLandingPageData;
}

export function BarberTemplate({ data }: BarberTemplateProps) {
  const { tenant, page, services, business_hours } = data;

  return (
    <div className="min-h-screen bg-[#121212] text-stone-100 selection:bg-[#C5A059] selection:text-stone-950 font-sans antialiased">
      {/* 1. Header com Logo e Navegação */}
      <BarberHeader
        businessName={tenant.business_name}
        whatsappNumber={page.contact_info.whatsapp_number}
        defaultMessage={page.contact_info.whatsapp_default_message}
      />

      {/* 2. Hero de Impacto com Imagem e WhatsApp */}
      <BarberHero
        hero={page.hero_section}
        contact={page.contact_info}
        businessName={tenant.business_name}
      />

      {/* 3. Diferenciais da Barbearia */}
      <BarberBenefits differentials={page.differentials} />

      {/* 4. Combos VIP em Destaque (somente se existirem nos dados) */}
      <BarberFeaturedCombos
        services={services}
        whatsappNumber={page.contact_info.whatsapp_number}
        businessName={tenant.business_name}
      />

      {/* 5. Tabela de Serviços e Preços */}
      <BarberServices
        services={services}
        whatsappNumber={page.contact_info.whatsapp_number}
        businessName={tenant.business_name}
      />

      {/* 6. Galeria de Cortes, Barba e Ambiente */}
      <BarberGallery gallery={page.gallery} />

      {/* 7. Apresentação da Equipe / Barbeiros */}
      <BarberTeam
        about={page.about_section}
        team={page.team}
        businessName={tenant.business_name}
      />

      {/* 8. Horários e Localização */}
      <BarberHoursAndLocation
        businessHours={business_hours}
        contact={page.contact_info}
        businessName={tenant.business_name}
      />

      {/* 9. CTA Final para Agendamento */}
      <BarberFinalCTA
        businessName={tenant.business_name}
        whatsappNumber={page.contact_info.whatsapp_number}
        defaultMessage={page.contact_info.whatsapp_default_message}
      />

      {/* 10. Rodapé Profissional */}
      <BarberFooter
        businessName={tenant.business_name}
        contact={page.contact_info}
      />

      {/* 11. WhatsApp Flutuante */}
      <BarberFloatingWhatsApp
        whatsappNumber={page.contact_info.whatsapp_number}
        defaultMessage={page.contact_info.whatsapp_default_message}
      />
    </div>
  );
}


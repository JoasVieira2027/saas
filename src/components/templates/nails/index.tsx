import { PublicLandingPageData } from "@/types/landing-page";
import { NailsHeader } from "./NailsHeader";
import { NailsHero } from "./NailsHero";
import { NailsServices } from "./NailsServices";
import { NailsGallery } from "./NailsGallery";
import { NailsBenefits } from "./NailsBenefits";
import { NailsAbout } from "./NailsAbout";
import { NailsHoursAndLocation } from "./NailsHoursAndLocation";
import { NailsFinalCTA } from "./NailsFinalCTA";
import { NailsFooter } from "./NailsFooter";
import { NailsFloatingWhatsApp } from "./NailsFloatingWhatsApp";

interface NailsTemplateProps {
  data: PublicLandingPageData;
}

export function NailsTemplate({ data }: NailsTemplateProps) {
  const { tenant, page, services, business_hours } = data;

  return (
    <div className="min-h-screen bg-[#FCFAF9] text-stone-900 selection:bg-[#F5DDD7] selection:text-stone-900 font-sans antialiased">
      {/* 1. Header com Logo e Navegação */}
      <NailsHeader
        businessName={tenant.business_name}
        whatsappNumber={page.contact_info.whatsapp_number}
        defaultMessage={page.contact_info.whatsapp_default_message}
      />

      {/* 2. Hero Visual com Fotografia Forte e WhatsApp */}
      <NailsHero
        hero={page.hero_section}
        contact={page.contact_info}
        businessName={tenant.business_name}
      />

      {/* 3. Procedimentos e Serviços */}
      <NailsServices
        services={services}
        whatsappNumber={page.contact_info.whatsapp_number}
        businessName={tenant.business_name}
      />

      {/* 4. Galeria de Trabalhos em Destaque */}
      <NailsGallery gallery={page.gallery} />

      {/* 5. Diferenciais e Biossegurança */}
      <NailsBenefits differentials={page.differentials} />

      {/* 6. Apresentação da Nail Designer / Equipe */}
      <NailsAbout
        about={page.about_section}
        team={page.team}
        businessName={tenant.business_name}
      />

      {/* 7. Horários e Localização */}
      <NailsHoursAndLocation
        businessHours={business_hours}
        contact={page.contact_info}
        businessName={tenant.business_name}
      />

      {/* 8. CTA Final para Agendamento */}
      <NailsFinalCTA
        businessName={tenant.business_name}
        whatsappNumber={page.contact_info.whatsapp_number}
        defaultMessage={page.contact_info.whatsapp_default_message}
      />

      {/* 9. Rodapé Profissional */}
      <NailsFooter
        businessName={tenant.business_name}
        contact={page.contact_info}
      />

      {/* 10. WhatsApp Flutuante */}
      <NailsFloatingWhatsApp
        whatsappNumber={page.contact_info.whatsapp_number}
        defaultMessage={page.contact_info.whatsapp_default_message}
      />
    </div>
  );
}


import { PublicLandingPageData } from "@/types/landing-page";
import { SalonHeader } from "./SalonHeader";
import { SalonHero } from "./SalonHero";
import { SalonBenefits } from "./SalonBenefits";
import { SalonServices } from "./SalonServices";
import { SalonGallery } from "./SalonGallery";
import { SalonAbout } from "./SalonAbout";
import { SalonHoursAndLocation } from "./SalonHoursAndLocation";
import { SalonFinalCTA } from "./SalonFinalCTA";
import { SalonFooter } from "./SalonFooter";
import { SalonFloatingWhatsApp } from "./SalonFloatingWhatsApp";

interface SalonTemplateProps {
  data: PublicLandingPageData;
}

export function SalonTemplate({ data }: SalonTemplateProps) {
  const { tenant, page, services, business_hours } = data;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 selection:bg-[#E8D8C4] selection:text-stone-900 font-sans antialiased">
      {/* 1. Header com Logo e Navegação */}
      <SalonHeader
        businessName={tenant.business_name}
        whatsappNumber={page.contact_info.whatsapp_number}
        defaultMessage={page.contact_info.whatsapp_default_message}
      />

      {/* 2. Hero Editorial com Imagem e CTA */}
      <SalonHero
        hero={page.hero_section}
        contact={page.contact_info}
        businessName={tenant.business_name}
      />

      {/* 3. Destaques e Benefícios (Diferenciais) */}
      <SalonBenefits differentials={page.differentials} />

      {/* 4. Menu de Procedimentos & Serviços */}
      <SalonServices
        services={services}
        whatsappNumber={page.contact_info.whatsapp_number}
        businessName={tenant.business_name}
      />

      {/* 5. Galeria de Fotos / Resultados */}
      <SalonGallery gallery={page.gallery} />

      {/* 6. Apresentação do Salão & Equipe */}
      <SalonAbout
        about={page.about_section}
        team={page.team}
        businessName={tenant.business_name}
      />

      {/* 7. Horários & Localização */}
      <SalonHoursAndLocation
        businessHours={business_hours}
        contact={page.contact_info}
        businessName={tenant.business_name}
      />

      {/* 8. CTA Final para Agendamento */}
      <SalonFinalCTA
        businessName={tenant.business_name}
        whatsappNumber={page.contact_info.whatsapp_number}
        defaultMessage={page.contact_info.whatsapp_default_message}
      />

      {/* 9. Rodapé Profissional */}
      <SalonFooter
        businessName={tenant.business_name}
        contact={page.contact_info}
      />

      {/* 10. Botão Flutuante de WhatsApp */}
      <SalonFloatingWhatsApp
        whatsappNumber={page.contact_info.whatsapp_number}
        defaultMessage={page.contact_info.whatsapp_default_message}
      />
    </div>
  );
}


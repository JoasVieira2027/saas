import { LandingPage, ServiceItem, BusinessHour, Tenant } from "./database";

export interface PublicLandingPageData {
  tenant: {
    business_name: string;
    slug: string;
    segment: "salon" | "barber" | "nails";
    status: "active" | "suspended" | "trial";
  };
  page: LandingPage;
  services: ServiceItem[];
  business_hours: BusinessHour[];
}

export type TemplateVariant = "salon" | "barber" | "nails";

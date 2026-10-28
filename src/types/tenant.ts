import { Tenant, Profile, LandingPage, ServiceItem, BusinessHour } from "./database";

export interface TenantWithDetails extends Tenant {
  owner: Profile;
  landing_page?: LandingPage | null;
  services?: ServiceItem[];
  business_hours?: BusinessHour[];
}

export interface CreateTenantDTO {
  business_name: string;
  slug: string;
  segment: "salon" | "barber" | "nails";
  owner_name: string;
  owner_email: string;
  owner_password?: string;
  plan_type?: "starter" | "pro";
}

export interface UpdateTenantDTO {
  business_name?: string;
  slug?: string;
  segment?: "salon" | "barber" | "nails";
  status?: "active" | "suspended" | "trial";
  plan_type?: "starter" | "pro";
}


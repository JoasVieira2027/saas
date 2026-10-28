export type UserRole = "superadmin" | "tenant_admin";

export type TenantStatus = "active" | "suspended" | "trial";

export type SubscriptionStatus = "active" | "pending" | "overdue" | "suspended" | "cancelled";

export type PaymentMethod = "pix" | "boleto" | "credit_card" | "cash" | "bank_transfer";

export type PlanType = "starter" | "pro";

export type SegmentType = "salon" | "barber" | "nails";

export type PageStatus = "draft" | "published";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Tenant {
  id: string;
  owner_id: string;
  business_name: string;
  slug: string;
  segment: SegmentType;
  custom_domain?: string | null;
  plan_type: PlanType;
  status: TenantStatus;
  subscription_status?: SubscriptionStatus;
  monthly_price_cents?: number;
  due_day?: number;
  next_due_date?: string;
  last_payment_date?: string | null;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPayment {
  id: string;
  tenant_id: string;
  amount_cents: number;
  paid_at: string;
  due_date: string;
  payment_method: PaymentMethod;
  billing_period: string; // Ex: "03/2026"
  notes?: string;
  recorded_by: string;
  created_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  admin_email: string;
  action:
    | "suspend_tenant"
    | "activate_tenant"
    | "publish_page"
    | "unpublish_page"
    | "record_payment"
    | "update_subscription"
    | "update_notes"
    | "create_tenant"
    | "impersonate_tenant"
    | "stop_impersonation";
  target_tenant_id: string | null;
  target_tenant_name: string;
  details: Record<string, any>;
  created_at: string;
}

export interface LandingPageTheme {
  primary_color: string;
  accent_color: string;
  font_preset: "modern" | "classic" | "luxury";
  dark_mode: boolean;
}

export interface HeroSection {
  badge: string;
  headline: string;
  subheadline: string;
  cta_text: string;
  hero_image_url: string;
}

export interface AboutSection {
  title: string;
  description: string;
  years_experience: number;
  highlight_image_url: string;
}

export interface ContactInfo {
  whatsapp_number: string;
  whatsapp_default_message: string;
  address_street: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  google_maps_url: string;
  instagram_handle: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  alt: string;
}

export interface DifferentialItem {
  id: string;
  title: string;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image_url: string;
  specialty?: string;
}

export interface LandingPage {
  id: string;
  tenant_id: string;
  template_id: SegmentType;
  status: PageStatus;
  theme_config: LandingPageTheme;
  hero_section: HeroSection;
  about_section: AboutSection;
  contact_info: ContactInfo;
  gallery?: GalleryImage[];
  differentials?: DifferentialItem[];
  team?: TeamMember[];
  seo_title: string;
  seo_description: string;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceItem {
  id: string;
  tenant_id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  image_url?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface BusinessHour {
  id: string;
  tenant_id: string;
  day_of_week: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  open_time: string; // "09:00"
  close_time: string; // "19:00"
  is_closed: boolean;
}

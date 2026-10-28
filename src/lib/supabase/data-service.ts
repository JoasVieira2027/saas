import { createClient } from "./server";
import { Tenant, LandingPage, ServiceItem, BusinessHour, Profile } from "@/types/database";

// Base de dados em memória para demonstração e testes locais offline
const DEMO_PROFILES: Record<string, Profile> = {
  "admin-1": {
    id: "admin-1",
    email: "admin@saas.com",
    full_name: "Administrador Geral",
    role: "superadmin",
    created_at: new Date().toISOString(),
  },
  "salon-owner-1": {
    id: "salon-owner-1",
    email: "aline@lumiere.com",
    full_name: "Aline Vasconcelos",
    role: "tenant_admin",
    created_at: new Date().toISOString(),
  },
  "barber-owner-1": {
    id: "barber-owner-1",
    email: "marcos@navalha.com",
    full_name: "Marcos Tavares",
    role: "tenant_admin",
    created_at: new Date().toISOString(),
  },
  "nails-owner-1": {
    id: "nails-owner-1",
    email: "gisele@nails.com",
    full_name: "Gisele Rocha",
    role: "tenant_admin",
    created_at: new Date().toISOString(),
  },
};

let DEMO_TENANTS: Tenant[] = [
  {
    id: "tenant-salon-1",
    owner_id: "salon-owner-1",
    business_name: "Lumière Concept Hair & Spa",
    slug: "lumiere-hair",
    segment: "salon",
    plan_type: "pro",
    status: "active",
    created_at: "2026-01-10T10:00:00Z",
    updated_at: "2026-02-15T14:30:00Z",
  },
  {
    id: "tenant-barber-1",
    owner_id: "barber-owner-1",
    business_name: "Navalha de Ouro Barber Club",
    slug: "navalha-de-ouro",
    segment: "barber",
    plan_type: "starter",
    status: "active",
    created_at: "2026-01-15T11:00:00Z",
    updated_at: "2026-02-18T16:00:00Z",
  },
  {
    id: "tenant-nails-1",
    owner_id: "nails-owner-1",
    business_name: "Studio Gisele Nail Art & Gel",
    slug: "gisele-nails",
    segment: "nails",
    plan_type: "starter",
    status: "active",
    created_at: "2026-02-01T09:00:00Z",
    updated_at: "2026-02-20T11:20:00Z",
  },
];

let DEMO_PAGES: Record<string, LandingPage> = {
  "tenant-salon-1": {
    id: "page-salon-1",
    tenant_id: "tenant-salon-1",
    template_id: "salon",
    status: "published",
    theme_config: {
      primary_color: "#A9855E",
      accent_color: "#C2A37E",
      font_preset: "luxury",
      dark_mode: false,
    },
    hero_section: {
      badge: "Salão de Beleza & Estética",
      headline: "Elegância e cuidado em cada detalhe do seu cabelo",
      subheadline: "Especialistas em mechas personalizadas, tratamentos capilares profundos e visagismo.",
      cta_text: "Agendar Atendimento VIP",
      hero_image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
    },
    about_section: {
      title: "Nossa Filosofia de Beleza",
      description: "Acreditamos que cada cliente possui uma beleza singular. Nosso espaço foi pensado para oferecer momentos de relaxamento e tratamentos com os melhores cosméticos internacionais.",
      years_experience: 12,
      highlight_image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    },
    contact_info: {
      whatsapp_number: "11988887777",
      whatsapp_default_message: "Olá! Gostaria de informações sobre horários disponíveis para mechas e corte.",
      address_street: "Rua Oscar Freire, 1420",
      address_neighborhood: "Jardins",
      address_city: "São Paulo",
      address_state: "SP",
      google_maps_url: "https://maps.google.com",
      instagram_handle: "@lumierehair",
    },
    seo_title: "Lumière Concept Hair | Salão de Beleza nos Jardins",
    seo_description: "Salão de beleza premium com especialistas em loiros, mechas, corte e estética capilar.",
    published_at: "2026-02-15T14:30:00Z",
    created_at: "2026-01-10T10:00:00Z",
    updated_at: "2026-02-15T14:30:00Z",
  },
  "tenant-barber-1": {
    id: "page-barber-1",
    tenant_id: "tenant-barber-1",
    template_id: "barber",
    status: "published",
    theme_config: {
      primary_color: "#C5A059",
      accent_color: "#1C1C1C",
      font_preset: "classic",
      dark_mode: true,
    },
    hero_section: {
      badge: "Barbearia Tradicional & Moderna",
      headline: "Estilo com tradição e precisão na navalha",
      subheadline: "Cortes modernos, barba alinhada e ambiente exclusivo com café e cerveja artesanal.",
      cta_text: "Garantir Meu Horário",
      hero_image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
    },
    about_section: {
      title: "A Arte da Barba e Cabelo",
      description: "Resgatamos o ritual clássico das barbearias tradicionais com o que há de mais atual em visagismo masculino e cuidados para barba e cabelo.",
      years_experience: 9,
      highlight_image_url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
    },
    contact_info: {
      whatsapp_number: "11977776666",
      whatsapp_default_message: "E aí! Gostaria de marcar corte e barba para hoje/amanhã.",
      address_street: "Avenida Paulista, 850",
      address_neighborhood: "Bela Vista",
      address_city: "São Paulo",
      address_state: "SP",
      google_maps_url: "https://maps.google.com",
      instagram_handle: "@barbernavalha",
    },
    seo_title: "Navalha de Ouro Barber Club | Barbearia na Paulista",
    seo_description: "Corte masculino, barba na toalha quente e atendimento sem fila. Agende pelo WhatsApp.",
    published_at: "2026-02-18T16:00:00Z",
    created_at: "2026-01-15T11:00:00Z",
    updated_at: "2026-02-18T16:00:00Z",
  },
  "tenant-nails-1": {
    id: "page-nails-1",
    tenant_id: "tenant-nails-1",
    template_id: "nails",
    status: "published",
    theme_config: {
      primary_color: "#E0A395",
      accent_color: "#F5DDD7",
      font_preset: "modern",
      dark_mode: false,
    },
    hero_section: {
      badge: "Unhas em Gel & Fibra de Vidro",
      headline: "Unhas perfeitas, resistentes e com acabamento natural",
      subheadline: "Alongamento em gel, blindagem e nail art de alta precisão com durabilidade incomparável.",
      cta_text: "Agendar Minha Sessão",
      hero_image_url: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80",
    },
    about_section: {
      title: "Saúde das Unhas & Alta Durabilidade",
      description: "Trabalhamos com materiais antialérgicos de alta qualidade e técnicas que preservam a integridade e saúde da unha natural com máxima elegância.",
      years_experience: 6,
      highlight_image_url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80",
    },
    contact_info: {
      whatsapp_number: "11966665555",
      whatsapp_default_message: "Oi Gisele! Quero agendar aplicação de unhas em gel.",
      address_street: "Rua Domingos de Morais, 500 - Sala 42",
      address_neighborhood: "Vila Mariana",
      address_city: "São Paulo",
      address_state: "SP",
      google_maps_url: "https://maps.google.com",
      instagram_handle: "@giselenailart",
    },
    seo_title: "Studio Gisele Nail Art | Unhas em Gel e Fibra",
    seo_description: "Especialista em unhas de gel, esmaltação em gel e banho de gel em São Paulo.",
    published_at: "2026-02-20T11:20:00Z",
    created_at: "2026-02-01T09:00:00Z",
    updated_at: "2026-02-20T11:20:00Z",
  },
};

const DEMO_SERVICES: Record<string, ServiceItem[]> = {
  "tenant-salon-1": [
    {
      id: "srv-1",
      tenant_id: "tenant-salon-1",
      category: "Cabelo",
      name: "Mechas Criativas & Iluminação",
      description: "Técnica personalizada com teste de mecha prévio e tonalização premium.",
      price: 480.0,
      duration_minutes: 180,
      image_url: null,
      sort_order: 1,
      is_active: true,
      created_at: "2026-01-10T10:00:00Z",
    },
    {
      id: "srv-2",
      tenant_id: "tenant-salon-1",
      category: "Cabelo",
      name: "Corte Visagista & Escova Modelada",
      description: "Estudo do formato do rosto e finalização com proteção térmica.",
      price: 180.0,
      duration_minutes: 60,
      image_url: null,
      sort_order: 2,
      is_active: true,
      created_at: "2026-01-10T10:00:00Z",
    },
    {
      id: "srv-3",
      tenant_id: "tenant-salon-1",
      category: "Tratamento",
      name: "Cronograma de Hidratação Profunda",
      description: "Recuperação lipídica e selagem de cutículas para brilho intenso.",
      price: 220.0,
      duration_minutes: 75,
      image_url: null,
      sort_order: 3,
      is_active: true,
      created_at: "2026-01-10T10:00:00Z",
    },
  ],
  "tenant-barber-1": [
    {
      id: "srv-4",
      tenant_id: "tenant-barber-1",
      category: "Cabelo",
      name: "Corte Degradê / Fade Clássico",
      description: "Acabamento na navalha, lavagem refrescante e pomada modeladora.",
      price: 65.0,
      duration_minutes: 40,
      image_url: null,
      sort_order: 1,
      is_active: true,
      created_at: "2026-01-15T11:00:00Z",
    },
    {
      id: "srv-5",
      tenant_id: "tenant-barber-1",
      category: "Barba",
      name: "Barboterapia com Toalha Quente",
      description: "Massagem facial, esfoliação, navalhado clássico e balm pós-barba.",
      price: 55.0,
      duration_minutes: 35,
      image_url: null,
      sort_order: 2,
      is_active: true,
      created_at: "2026-01-15T11:00:00Z",
    },
    {
      id: "srv-6",
      tenant_id: "tenant-barber-1",
      category: "Combo",
      name: "Combo Imperial (Cabelo + Barba)",
      description: "Experiência completa com bebida de cortesia.",
      price: 110.0,
      duration_minutes: 70,
      image_url: null,
      sort_order: 3,
      is_active: true,
      created_at: "2026-01-15T11:00:00Z",
    },
  ],
  "tenant-nails-1": [
    {
      id: "srv-7",
      tenant_id: "tenant-nails-1",
      category: "Alongamento",
      name: "Alongamento em Gel Moldado",
      description: "Estrutura resistente com curvatura C natural e cuticulagem russa.",
      price: 190.0,
      duration_minutes: 120,
      image_url: null,
      sort_order: 1,
      is_active: true,
      created_at: "2026-02-01T09:00:00Z",
    },
    {
      id: "srv-8",
      tenant_id: "tenant-nails-1",
      category: "Manutenção",
      name: "Manutenção de Gel (até 25 dias)",
      description: "Nivelamento, troca de cor e reforço da estrutura.",
      price: 130.0,
      duration_minutes: 90,
      image_url: null,
      sort_order: 2,
      is_active: true,
      created_at: "2026-02-01T09:00:00Z",
    },
    {
      id: "srv-9",
      tenant_id: "tenant-nails-1",
      category: "Blindagem",
      name: "Blindagem de Diamante & Esmaltação em Gel",
      description: "Proteção da unha natural com brilho de até 20 dias.",
      price: 110.0,
      duration_minutes: 60,
      image_url: null,
      sort_order: 3,
      is_active: true,
      created_at: "2026-02-01T09:00:00Z",
    },
  ],
};

const DEMO_HOURS: Record<string, BusinessHour[]> = {
  "tenant-salon-1": [
    { id: "h1", tenant_id: "tenant-salon-1", day_of_week: 1, open_time: "Fechado", close_time: "", is_closed: true },
    { id: "h2", tenant_id: "tenant-salon-1", day_of_week: 2, open_time: "09:00", close_time: "19:00", is_closed: false },
    { id: "h3", tenant_id: "tenant-salon-1", day_of_week: 3, open_time: "09:00", close_time: "19:00", is_closed: false },
    { id: "h4", tenant_id: "tenant-salon-1", day_of_week: 4, open_time: "09:00", close_time: "20:00", is_closed: false },
    { id: "h5", tenant_id: "tenant-salon-1", day_of_week: 5, open_time: "09:00", close_time: "20:00", is_closed: false },
    { id: "h6", tenant_id: "tenant-salon-1", day_of_week: 6, open_time: "08:30", close_time: "19:00", is_closed: false },
    { id: "h7", tenant_id: "tenant-salon-1", day_of_week: 0, open_time: "Fechado", close_time: "", is_closed: true },
  ],
  "tenant-barber-1": [
    { id: "h8", tenant_id: "tenant-barber-1", day_of_week: 1, open_time: "10:00", close_time: "20:00", is_closed: false },
    { id: "h9", tenant_id: "tenant-barber-1", day_of_week: 2, open_time: "09:00", close_time: "21:00", is_closed: false },
    { id: "h10", tenant_id: "tenant-barber-1", day_of_week: 3, open_time: "09:00", close_time: "21:00", is_closed: false },
    { id: "h11", tenant_id: "tenant-barber-1", day_of_week: 4, open_time: "09:00", close_time: "21:00", is_closed: false },
    { id: "h12", tenant_id: "tenant-barber-1", day_of_week: 5, open_time: "09:00", close_time: "21:00", is_closed: false },
    { id: "h13", tenant_id: "tenant-barber-1", day_of_week: 6, open_time: "08:00", close_time: "19:00", is_closed: false },
    { id: "h14", tenant_id: "tenant-barber-1", day_of_week: 0, open_time: "Fechado", close_time: "", is_closed: true },
  ],
  "tenant-nails-1": [
    { id: "h15", tenant_id: "tenant-nails-1", day_of_week: 1, open_time: "09:00", close_time: "18:00", is_closed: false },
    { id: "h16", tenant_id: "tenant-nails-1", day_of_week: 2, open_time: "09:00", close_time: "18:00", is_closed: false },
    { id: "h17", tenant_id: "tenant-nails-1", day_of_week: 3, open_time: "09:00", close_time: "18:00", is_closed: false },
    { id: "h18", tenant_id: "tenant-nails-1", day_of_week: 4, open_time: "09:00", close_time: "19:00", is_closed: false },
    { id: "h19", tenant_id: "tenant-nails-1", day_of_week: 5, open_time: "09:00", close_time: "19:00", is_closed: false },
    { id: "h20", tenant_id: "tenant-nails-1", day_of_week: 6, open_time: "09:00", close_time: "16:00", is_closed: false },
    { id: "h21", tenant_id: "tenant-nails-1", day_of_week: 0, open_time: "Fechado", close_time: "", is_closed: true },
  ],
};

function isLiveSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes("mock-project") && !url.includes("your-project"));
}

export const dataService = {
  // 1. Obter Perfil
  async getProfile(userId: string): Promise<Profile | null> {
    if (isLiveSupabaseConfigured()) {
      const supabase = await createClient();
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
      return data;
    }
    return DEMO_PROFILES[userId] || null;
  },

  // 2. Obter Todos os Tenants (Restrito ao Superadmin)
  async getAllTenants(): Promise<Tenant[]> {
    if (isLiveSupabaseConfigured()) {
      const supabase = await createClient();
      const { data } = await supabase.from("tenants").select("*").order("created_at", { ascending: false });
      return data || [];
    }
    return [...DEMO_TENANTS];
  },

  // 3. Obter Tenant por Proprietário (Para o Painel do Cliente)
  async getTenantByOwner(ownerId: string): Promise<Tenant | null> {
    if (isLiveSupabaseConfigured()) {
      const supabase = await createClient();
      const { data } = await supabase.from("tenants").select("*").eq("owner_id", ownerId).single();
      return data;
    }
    return DEMO_TENANTS.find((t) => t.owner_id === ownerId) || null;
  },

  // 4. Obter Landing Page por Tenant ID
  async getLandingPageByTenantId(tenantId: string): Promise<LandingPage | null> {
    if (isLiveSupabaseConfigured()) {
      const supabase = await createClient();
      const { data } = await supabase.from("landing_pages").select("*").eq("tenant_id", tenantId).single();
      return data;
    }
    return DEMO_PAGES[tenantId] || null;
  },

  // 5. Obter Dados Públicos por Slug (Com validação estrita de isolamento e status ativo)
  async getPublicPageBySlug(slug: string): Promise<{
    tenant: Tenant;
    page: LandingPage;
    services: ServiceItem[];
    business_hours: BusinessHour[];
  } | null> {
    if (isLiveSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: tenant } = await supabase
        .from("tenants")
        .select("*")
        .eq("slug", slug)
        .eq("status", "active")
        .single();

      if (!tenant) return null;

      const { data: page } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("tenant_id", tenant.id)
        .eq("status", "published")
        .single();

      if (!page) return null;

      const { data: services } = await supabase
        .from("services")
        .select("*")
        .eq("tenant_id", tenant.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      const { data: hours } = await supabase
        .from("business_hours")
        .select("*")
        .eq("tenant_id", tenant.id)
        .order("day_of_week", { ascending: true });

      return {
        tenant,
        page,
        services: services || [],
        business_hours: hours || [],
      };
    }

    const tenant = DEMO_TENANTS.find((t) => t.slug === slug);
    if (!tenant) return null;

    const page = DEMO_PAGES[tenant.id];
    if (!page) return null;

    const services = DEMO_SERVICES[tenant.id] || [];
    const business_hours = DEMO_HOURS[tenant.id] || [];

    return {
      tenant,
      page,
      services,
      business_hours,
    };
  },

  // 6. Atualizar Status do Tenant (Superadmin)
  async updateTenantStatus(tenantId: string, status: "active" | "suspended" | "trial"): Promise<boolean> {
    if (isLiveSupabaseConfigured()) {
      const supabase = await createClient();
      const { error } = await supabase.from("tenants").update({ status }).eq("id", tenantId);
      return !error;
    }
    const tenant = DEMO_TENANTS.find((t) => t.id === tenantId);
    if (tenant) {
      tenant.status = status;
      return true;
    }
    return false;
  },

  // 7. Criar Novo Cliente/Tenant (Superadmin)
  async createTenant(data: {
    business_name: string;
    slug: string;
    segment: "salon" | "barber" | "nails";
    owner_name: string;
    owner_email: string;
    plan_type: "starter" | "pro";
  }): Promise<Tenant> {
    const newOwnerId = `owner-${Date.now()}`;
    const newTenantId = `tenant-${Date.now()}`;

    DEMO_PROFILES[newOwnerId] = {
      id: newOwnerId,
      email: data.owner_email,
      full_name: data.owner_name,
      role: "tenant_admin",
      created_at: new Date().toISOString(),
    };

    const newTenant: Tenant = {
      id: newTenantId,
      owner_id: newOwnerId,
      business_name: data.business_name,
      slug: data.slug.toLowerCase().trim().replace(/\s+/g, "-"),
      segment: data.segment,
      plan_type: data.plan_type,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    DEMO_TENANTS.unshift(newTenant);

    // Inicializa a landing page correspondente
    DEMO_PAGES[newTenantId] = {
      id: `page-${Date.now()}`,
      tenant_id: newTenantId,
      template_id: data.segment,
      status: "draft",
      theme_config: {
        primary_color: data.segment === "barber" ? "#C5A059" : data.segment === "nails" ? "#E0A395" : "#A9855E",
        accent_color: data.segment === "barber" ? "#1C1C1C" : data.segment === "nails" ? "#F5DDD7" : "#C2A37E",
        font_preset: data.segment === "barber" ? "classic" : data.segment === "nails" ? "modern" : "luxury",
        dark_mode: data.segment === "barber",
      },
      hero_section: {
        badge: data.segment === "barber" ? "Barbearia Tradicional" : data.segment === "nails" ? "Nail Designer" : "Salão de Beleza",
        headline: data.business_name,
        subheadline: "Atendimento personalizado e serviços de alta qualidade.",
        cta_text: "Agendar Horário",
        hero_image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
      },
      about_section: {
        title: "Sobre Nós",
        description: "Oferecemos os melhores tratamentos com pontualidade e dedicação.",
        years_experience: 5,
        highlight_image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      },
      contact_info: {
        whatsapp_number: "11999999999",
        whatsapp_default_message: "Olá! Gostaria de agendar um horário.",
        address_street: "Endereço comercial",
        address_neighborhood: "Bairro",
        address_city: "Cidade",
        address_state: "UF",
        google_maps_url: "",
        instagram_handle: "@seunegocio",
      },
      seo_title: `${data.business_name} | Agendamentos`,
      seo_description: `Conheça os serviços de ${data.business_name} e agende seu horário online.`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return newTenant;
  },

  // 8. Atualizar Configurações da Landing Page (Cliente)
  async updateLandingPage(tenantId: string, updates: Partial<LandingPage>): Promise<LandingPage | null> {
    const page = DEMO_PAGES[tenantId];
    if (!page) return null;

    DEMO_PAGES[tenantId] = {
      ...page,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return DEMO_PAGES[tenantId];
  },

  // 9. Publicar ou Reverter para Rascunho
  async togglePublishPage(tenantId: string): Promise<LandingPage | null> {
    const page = DEMO_PAGES[tenantId];
    if (!page) return null;

    const newStatus = page.status === "published" ? "draft" : "published";
    page.status = newStatus;
    if (newStatus === "published") {
      page.published_at = new Date().toISOString();
    }
    page.updated_at = new Date().toISOString();
    return page;
  },
};

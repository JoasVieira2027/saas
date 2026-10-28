"use server";

import { revalidatePath } from "next/cache";
import { requireTenant } from "@/lib/auth";
import { dataService } from "@/lib/supabase/data-service";
import { SegmentType } from "@/types/database";

// 1. Alternar Status de Publicação (Proteção estrita por sessão do proprietário)
export async function togglePublishAction(tenantId?: string): Promise<void> {
  const session = await requireTenant();
  const tenant = await dataService.getTenantByOwner(session.userId);

  if (!tenant) {
    throw new Error("Não autorizado: Usuário não possui tenant associado.");
  }

  // Se um tenantId foi explicitamente fornecido, valida correspondência com o tenant da sessão
  if (tenantId && tenant.id !== tenantId) {
    throw new Error("Não autorizado: Tentativa de manipular tenant de terceiros.");
  }

  await dataService.togglePublishPage(tenant.id);
  revalidatePath("/app");
  revalidatePath("/app/editor");
  revalidatePath("/app/preview");
  if (tenant.slug) {
    revalidatePath(`/p/${tenant.slug}`);
  }
}

// 2. Salvar Identidade & Cores & Template
export async function saveIdentityAction(formData: FormData): Promise<void> {
  const session = await requireTenant();
  const tenant = await dataService.getTenantByOwner(session.userId);

  if (!tenant) {
    throw new Error("Tenant não localizado.");
  }

  const business_name = (formData.get("business_name") as string)?.trim();
  const segment = (formData.get("segment") as SegmentType) || tenant.segment;
  const primary_color = formData.get("primary_color") as string;
  const accent_color = formData.get("accent_color") as string;
  const whatsapp_number = formData.get("whatsapp_number") as string;
  const instagram_handle = formData.get("instagram_handle") as string;

  if (business_name) {
    await dataService.updateTenant(tenant.id, {
      business_name,
      segment,
    });
  }

  const page = await dataService.getLandingPageByTenantId(tenant.id);
  if (page) {
    await dataService.updateLandingPage(tenant.id, {
      template_id: segment,
      theme_config: {
        ...page.theme_config,
        primary_color: primary_color || page.theme_config.primary_color,
        accent_color: accent_color || page.theme_config.accent_color,
      },
      contact_info: {
        ...page.contact_info,
        whatsapp_number: whatsapp_number || page.contact_info.whatsapp_number,
        instagram_handle: instagram_handle || page.contact_info.instagram_handle,
      },
    });
  }

  revalidatePath("/app");
  revalidatePath("/app/editor");
  revalidatePath("/app/preview");
  if (tenant.slug) {
    revalidatePath(`/p/${tenant.slug}`);
  }
}

// 3. Salvar Seção Hero (Topo)
export async function saveHeroAction(formData: FormData): Promise<void> {
  const session = await requireTenant();
  const tenant = await dataService.getTenantByOwner(session.userId);

  if (!tenant) {
    throw new Error("Tenant não localizado.");
  }

  const badge = formData.get("badge") as string;
  const headline = formData.get("headline") as string;
  const subheadline = formData.get("subheadline") as string;
  const cta_text = formData.get("cta_text") as string;
  const hero_image_url = formData.get("hero_image_url") as string;

  const page = await dataService.getLandingPageByTenantId(tenant.id);
  if (page) {
    await dataService.updateLandingPage(tenant.id, {
      hero_section: {
        ...page.hero_section,
        badge: badge || page.hero_section.badge,
        headline: headline || page.hero_section.headline,
        subheadline: subheadline || page.hero_section.subheadline,
        cta_text: cta_text || page.hero_section.cta_text,
        hero_image_url: hero_image_url || page.hero_section.hero_image_url,
      },
    });
  }

  revalidatePath("/app");
  revalidatePath("/app/editor");
  revalidatePath("/app/preview");
  if (tenant.slug) {
    revalidatePath(`/p/${tenant.slug}`);
  }
}

// 4. Criar Novo Serviço
export async function createServiceAction(formData: FormData): Promise<void> {
  const session = await requireTenant();
  const tenant = await dataService.getTenantByOwner(session.userId);

  if (!tenant) {
    throw new Error("Tenant não localizado.");
  }

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || "";
  const category = (formData.get("category") as string) || "Geral";
  const price = parseFloat((formData.get("price") as string) || "0");
  const duration_minutes = parseInt((formData.get("duration_minutes") as string) || "60", 10);

  if (!name) return;

  await dataService.createService(tenant.id, {
    name,
    description,
    category,
    price,
    duration_minutes,
    is_active: true,
  });

  revalidatePath("/app");
  revalidatePath("/app/editor");
  revalidatePath("/app/preview");
  if (tenant.slug) {
    revalidatePath(`/p/${tenant.slug}`);
  }
}

// 5. Atualizar Serviço
export async function updateServiceAction(formData: FormData): Promise<void> {
  const session = await requireTenant();
  const tenant = await dataService.getTenantByOwner(session.userId);

  if (!tenant) {
    throw new Error("Tenant não localizado.");
  }

  const serviceId = formData.get("serviceId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const price = parseFloat((formData.get("price") as string) || "0");
  const duration_minutes = parseInt((formData.get("duration_minutes") as string) || "60", 10);
  const is_active = formData.get("is_active") === "true";

  if (!serviceId || !name) return;

  await dataService.updateService(tenant.id, serviceId, {
    name,
    description,
    category,
    price,
    duration_minutes,
    is_active,
  });

  revalidatePath("/app");
  revalidatePath("/app/editor");
  revalidatePath("/app/preview");
  if (tenant.slug) {
    revalidatePath(`/p/${tenant.slug}`);
  }
}

// 6. Remover Serviço
export async function deleteServiceAction(serviceId: string): Promise<void> {
  const session = await requireTenant();
  const tenant = await dataService.getTenantByOwner(session.userId);

  if (!tenant) {
    throw new Error("Tenant não localizado.");
  }

  await dataService.deleteService(tenant.id, serviceId);

  revalidatePath("/app");
  revalidatePath("/app/editor");
  revalidatePath("/app/preview");
  if (tenant.slug) {
    revalidatePath(`/p/${tenant.slug}`);
  }
}

// 7. Adicionar Imagem à Galeria
export async function addGalleryImageAction(formData: FormData): Promise<void> {
  const session = await requireTenant();
  const tenant = await dataService.getTenantByOwner(session.userId);

  if (!tenant) {
    throw new Error("Tenant não localizado.");
  }

  const url = (formData.get("url") as string)?.trim();
  const title = (formData.get("title") as string)?.trim() || "Trabalho Realizado";

  if (!url) return;

  const result = await dataService.addGalleryImage(tenant.id, {
    url,
    title,
    alt: title,
  });

  if (!result) {
    throw new Error("Falha ao salvar imagem na galeria. Verifique a configuração e tente novamente.");
  }

  revalidatePath("/app");
  revalidatePath("/app/editor");
  revalidatePath("/app/preview");
  if (tenant.slug) {
    revalidatePath(`/p/${tenant.slug}`);
  }
}

// 8. Remover Imagem da Galeria
export async function deleteGalleryImageAction(imageId: string): Promise<void> {
  const session = await requireTenant();
  const tenant = await dataService.getTenantByOwner(session.userId);

  if (!tenant) {
    throw new Error("Tenant não localizado.");
  }

  const result = await dataService.deleteGalleryImage(tenant.id, imageId);

  if (!result) {
    throw new Error("Falha ao remover imagem da galeria. Verifique a configuração e tente novamente.");
  }

  revalidatePath("/app");
  revalidatePath("/app/editor");
  revalidatePath("/app/preview");
  if (tenant.slug) {
    revalidatePath(`/p/${tenant.slug}`);
  }
}

// 9. Salvar Informações (Sobre, Endereço e Horários)
export async function saveAboutAndHoursAction(formData: FormData): Promise<void> {
  const session = await requireTenant();
  const tenant = await dataService.getTenantByOwner(session.userId);

  if (!tenant) {
    throw new Error("Tenant não localizado.");
  }

  const about_title = formData.get("about_title") as string;
  const about_description = formData.get("about_description") as string;
  const years_experience = parseInt((formData.get("years_experience") as string) || "5", 10);
  const address_street = formData.get("address_street") as string;
  const address_neighborhood = formData.get("address_neighborhood") as string;
  const address_city = formData.get("address_city") as string;
  const address_state = formData.get("address_state") as string;
  const google_maps_url = formData.get("google_maps_url") as string;

  const page = await dataService.getLandingPageByTenantId(tenant.id);
  if (page) {
    await dataService.updateLandingPage(tenant.id, {
      about_section: {
        ...page.about_section,
        title: about_title || page.about_section.title,
        description: about_description || page.about_section.description,
        years_experience: isNaN(years_experience) ? page.about_section.years_experience : years_experience,
      },
      contact_info: {
        ...page.contact_info,
        address_street: address_street || page.contact_info.address_street,
        address_neighborhood: address_neighborhood || page.contact_info.address_neighborhood,
        address_city: address_city || page.contact_info.address_city,
        address_state: address_state || page.contact_info.address_state,
        google_maps_url: google_maps_url || page.contact_info.google_maps_url,
      },
    });
  }

  revalidatePath("/app");
  revalidatePath("/app/editor");
  revalidatePath("/app/preview");
  if (tenant.slug) {
    revalidatePath(`/p/${tenant.slug}`);
  }
}

// 10. Atualizar Status para Rascunho / Publicado
export async function setPublishStatusAction(status: "draft" | "published"): Promise<void> {
  const session = await requireTenant();
  const tenant = await dataService.getTenantByOwner(session.userId);

  if (!tenant) {
    throw new Error("Tenant não localizado.");
  }

  await dataService.setPageStatus(tenant.id, status);

  revalidatePath("/app");
  revalidatePath("/app/editor");
  revalidatePath("/app/preview");
  if (tenant.slug) {
    revalidatePath(`/p/${tenant.slug}`);
  }
}

// 11. Atualização Básica (Compatibilidade com tela de configurações legada)
export async function updateBasicInfoAction(formData: FormData): Promise<void> {
  const session = await requireTenant();
  const tenant = await dataService.getTenantByOwner(session.userId);

  if (!tenant) {
    throw new Error("Tenant não localizado.");
  }

  const headline = (formData.get("headline") as string)?.trim();
  const subheadline = (formData.get("subheadline") as string)?.trim();
  const whatsapp_number = (formData.get("whatsapp_number") as string)?.trim();
  const instagram_handle = (formData.get("instagram_handle") as string)?.trim();
  const whatsapp_default_message = (formData.get("whatsapp_default_message") as string)?.trim();
  const address_street = (formData.get("address_street") as string)?.trim();
  const address_city = (formData.get("address_city") as string)?.trim();

  const page = await dataService.getLandingPageByTenantId(tenant.id);
  if (page) {
    await dataService.updateLandingPage(tenant.id, {
      hero_section: {
        ...page.hero_section,
        headline: headline || page.hero_section.headline,
        subheadline: subheadline || page.hero_section.subheadline,
      },
      contact_info: {
        ...page.contact_info,
        whatsapp_number: whatsapp_number || page.contact_info.whatsapp_number,
        instagram_handle: instagram_handle || page.contact_info.instagram_handle,
        whatsapp_default_message: whatsapp_default_message || page.contact_info.whatsapp_default_message,
        address_street: address_street || page.contact_info.address_street,
        address_city: address_city || page.contact_info.address_city,
      },
    });
  }

  revalidatePath("/app");
  revalidatePath("/app/settings");
  revalidatePath("/app/editor");
  revalidatePath("/app/preview");
  if (tenant.slug) {
    revalidatePath(`/p/${tenant.slug}`);
  }
}

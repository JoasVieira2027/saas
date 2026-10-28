"use server";

import { revalidatePath } from "next/cache";
import { requireTenant } from "@/lib/auth";
import { dataService } from "@/lib/supabase/data-service";

export async function togglePublishAction(tenantId: string): Promise<void> {
  const session = await requireTenant();
  const tenant = await dataService.getTenantByOwner(session.userId);

  if (!tenant || tenant.id !== tenantId) {
    throw new Error("Não autorizado.");
  }

  await dataService.togglePublishPage(tenantId);
  revalidatePath("/app");
  if (tenant.slug) {
    revalidatePath(`/p/${tenant.slug}`);
  }
}

export async function updateBasicInfoAction(formData: FormData): Promise<void> {
  const session = await requireTenant();
  const tenant = await dataService.getTenantByOwner(session.userId);

  if (!tenant) {
    throw new Error("Tenant não localizado.");
  }

  const whatsapp_number = formData.get("whatsapp_number") as string;
  const whatsapp_default_message = formData.get("whatsapp_default_message") as string;
  const address_street = formData.get("address_street") as string;
  const address_city = formData.get("address_city") as string;
  const instagram_handle = formData.get("instagram_handle") as string;
  const headline = formData.get("headline") as string;
  const subheadline = formData.get("subheadline") as string;

  const currentPage = await dataService.getLandingPageByTenantId(tenant.id);

  if (currentPage) {
    await dataService.updateLandingPage(tenant.id, {
      hero_section: {
        ...currentPage.hero_section,
        headline: headline || currentPage.hero_section.headline,
        subheadline: subheadline || currentPage.hero_section.subheadline,
      },
      contact_info: {
        ...currentPage.contact_info,
        whatsapp_number: whatsapp_number || currentPage.contact_info.whatsapp_number,
        whatsapp_default_message: whatsapp_default_message || currentPage.contact_info.whatsapp_default_message,
        address_street: address_street || currentPage.contact_info.address_street,
        address_city: address_city || currentPage.contact_info.address_city,
        instagram_handle: instagram_handle || currentPage.contact_info.instagram_handle,
      },
    });

    revalidatePath("/app");
    revalidatePath("/app/settings");
    revalidatePath(`/p/${tenant.slug}`);
  }
}

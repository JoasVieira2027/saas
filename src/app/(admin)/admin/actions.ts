"use server";

import { revalidatePath } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { dataService } from "@/lib/supabase/data-service";

export async function updateTenantStatusAction(
  tenantId: string,
  status: "active" | "suspended" | "trial"
): Promise<void> {
  await requireSuperadmin();
  await dataService.updateTenantStatus(tenantId, status);
  revalidatePath("/admin");
  revalidatePath("/admin/clients");
}

export async function createTenantAction(formData: FormData): Promise<void> {
  await requireSuperadmin();

  const business_name = formData.get("business_name") as string;
  const slug = formData.get("slug") as string;
  const segment = formData.get("segment") as "salon" | "barber" | "nails";
  const owner_name = formData.get("owner_name") as string;
  const owner_email = formData.get("owner_email") as string;
  const plan_type = (formData.get("plan_type") as "starter" | "pro") || "starter";

  if (!business_name || !slug || !segment || !owner_name || !owner_email) {
    return;
  }

  await dataService.createTenant({
    business_name,
    slug,
    segment,
    owner_name,
    owner_email,
    plan_type,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/clients");
}

"use server";

import { redirect } from "next/navigation";
import { setSession, clearSession } from "@/lib/auth";
import { dataService } from "@/lib/supabase/data-service";

export async function loginAction(formData: FormData): Promise<void> {
  const email = (formData.get("email") as string)?.toLowerCase().trim();

  if (!email) {
    redirect("/login?error=missing_email");
  }

  // Perfis pré-configurados para testes e homologação
  const knownProfiles: Record<string, string> = {
    "admin@saas.com": "admin-1",
    "aline@lumiere.com": "salon-owner-1",
    "marcos@navalha.com": "barber-owner-1",
    "gisele@nails.com": "nails-owner-1",
  };

  const userId = knownProfiles[email];

  if (!userId) {
    redirect("/login?error=not_found");
  }

  const profile = await dataService.getProfile(userId);

  if (!profile) {
    redirect("/login?error=profile_not_found");
  }

  await setSession(profile);

  if (profile.role === "superadmin") {
    redirect("/admin");
  } else {
    redirect("/app");
  }
}

export async function quickLoginAction(userId: string): Promise<void> {
  const profile = await dataService.getProfile(userId);
  if (!profile) {
    throw new Error("Perfil não encontrado.");
  }

  await setSession(profile);

  if (profile.role === "superadmin") {
    redirect("/admin");
  } else {
    redirect("/app");
  }
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}

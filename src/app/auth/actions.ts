"use server";

import { redirect } from "next/navigation";
import { setSession, clearSession } from "@/lib/auth";
import { dataService } from "@/lib/supabase/data-service";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData): Promise<void> {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = (formData.get("password") as string) || "";

  if (!email) {
    redirect("/login?error=missing_email");
  }

  // 1. Em produção com Supabase ao vivo configurado, autentica via credenciais Supabase Auth
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("mock-project") &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project")
  );

  if (process.env.NODE_ENV === "production" && isSupabaseConfigured) {
    if (!password) {
      redirect("/login?error=missing_password");
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      redirect("/login?error=invalid_credentials");
    }

    const profile = await dataService.getProfile(data.user.id);
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

  // 2. Ambiente de Desenvolvimento / Homologação Local (Mock Seguro com Validação)
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

  // Em modo de desenvolvimento, exige preenchimento de senha
  if (!password) {
    redirect("/login?error=missing_password");
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
  // BLOQUEIO ESTRITO: O atalho de login rápido NUNCA é permitido em ambiente de produção
  if (process.env.NODE_ENV === "production") {
    throw new Error("O recurso de login rápido está estritamente desabilitado em ambiente de produção.");
  }

  // Em desenvolvimento, só permite IDs de perfis pré-definidos de homologação
  const allowedDemoIds = new Set(["admin-1", "salon-owner-1", "barber-owner-1", "nails-owner-1"]);
  if (!allowedDemoIds.has(userId)) {
    throw new Error("Identificador de perfil não autorizado para acesso rápido.");
  }

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

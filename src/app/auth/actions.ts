"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { setSession, clearSession } from "@/lib/auth";
import { dataService } from "@/lib/supabase/data-service";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData): Promise<void> {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = (formData.get("password") as string) || "";

  if (!email) {
    redirect("/login?error=missing_email");
  }

  // 1. Quando o Supabase real está configurado, autentica via credenciais Supabase Auth
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("mock-project") &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project")
  );

  if (isSupabaseConfigured) {
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

    // Busca o perfil do usuário pelo id ou pelo e-mail (modelo de acesso exclusivo por convite)
    let profile = await dataService.getProfile(data.user.id);
    if (!profile && email) {
      profile = await dataService.getProfileByEmail(email);
    }

    if (!profile) {
      // Usuário autenticado no Auth mas sem perfil no SaaS (sem convite/autorização)
      await supabase.auth.signOut();
      redirect("/login?error=invite_required");
    }

    await setSession(profile);

    if (profile.role === "superadmin") {
      redirect("/admin");
    } else {
      redirect("/app");
    }
  }

  // 2. Bloqueio absoluto de fallback de homologação em ambiente de produção
  if (process.env.NODE_ENV === "production") {
    redirect("/login?error=invalid_credentials");
  }

  // 3. Ambiente de Desenvolvimento / Homologação Local Offline (Mock com Validação)
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

  // Em modo de desenvolvimento offline, exige preenchimento de senha
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
  // Encerrar sessão nativa do Supabase quando configurado (defense-in-depth)
  // O cookie assinado HMAC é o mecanismo primário de autenticação; o signOut do
  // Supabase é camada adicional de segurança para invalidar tokens JWT remotamente.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const isRealSupabase =
    supabaseUrl.length > 0 &&
    !supabaseUrl.includes("mock-project") &&
    !supabaseUrl.includes("your-project");

  if (isRealSupabase) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignora falha do signOut — o cookie assinado é o mecanismo primário.
      // O clearSession() abaixo garante o encerramento local independentemente.
    }
  }

  await clearSession();
  redirect("/login");
}

// 4. Iniciar Fluxo de Login com Google OAuth
export async function loginWithGoogleAction(): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const isRealSupabase =
    supabaseUrl.length > 0 &&
    !supabaseUrl.includes("mock-project") &&
    !supabaseUrl.includes("your-project");

  if (!isRealSupabase) {
    // Em modo de testes locais/offline
    redirect("/login?error=oauth_not_configured_local");
  }

  const supabase = await createClient();

  // Resolve a URL base real considerando headers do proxy/Vercel e sanitização
  const headerList = await headers();
  const rawHost = headerList.get("x-forwarded-host") || headerList.get("host") || "";
  const cleanHost = rawHost.split(",")[0].trim();
  const proto = headerList.get("x-forwarded-proto") || (process.env.NODE_ENV === "production" ? "https" : "http");

  let appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl || (appUrl.includes("localhost") && cleanHost && !cleanHost.includes("localhost"))) {
    appUrl = `${proto}://${cleanHost}`;
  } else if (!appUrl && cleanHost) {
    appUrl = `${proto}://${cleanHost}`;
  }
  if (!appUrl) {
    appUrl = "http://localhost:3000";
  }
  appUrl = appUrl.replace(/\/+$/, "");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${appUrl}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error || !data.url) {
    redirect("/login?error=oauth_init_failed");
  }

  redirect(data.url);
}

// 5. Solicitar Redefinição de Senha
export async function resetPasswordAction(formData: FormData): Promise<void> {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  if (!email) {
    redirect("/login?error=missing_email");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const isRealSupabase =
    supabaseUrl.length > 0 &&
    !supabaseUrl.includes("mock-project") &&
    !supabaseUrl.includes("your-project");

  if (isRealSupabase) {
    try {
      const supabase = await createClient();
      const headerList = await headers();
      const host = headerList.get("x-forwarded-host") || headerList.get("host");
      const proto = headerList.get("x-forwarded-proto") || (process.env.NODE_ENV === "production" ? "https" : "http");
      const appUrl = host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");

      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${appUrl}/auth/callback?next=/app/settings`,
      });
    } catch {
      // Silencia falhas para evitar user enumeration
    }
  }

  // Resposta segura e padronizada para prevenir vazamento de dados
  redirect("/login?status=reset_email_sent");
}

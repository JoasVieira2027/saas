import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { dataService } from "@/lib/supabase/data-service";
import { setSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=oauth_missing_code", request.url));
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.user) {
      return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
    }

    const user = data.user;
    const userEmail = user.email || "";
    const fullName =
      (user.user_metadata?.full_name as string) ||
      (user.user_metadata?.name as string) ||
      userEmail.split("@")[0] ||
      "Usuário";

    // Busca o perfil do usuário (resiliente para id ou user_id)
    let profile = await dataService.getProfile(user.id);

    // Se o perfil ainda não existir (novo usuário Google), cria com segurança (role estrito: tenant_admin)
    if (!profile && userEmail) {
      profile = await dataService.ensureProfile(user.id, userEmail, fullName);
    }

    if (!profile) {
      return NextResponse.redirect(new URL("/login?error=profile_not_found", request.url));
    }

    // Assina o cookie HMAC da aplicação
    await setSession(profile);

    // Redirecionamento baseado no papel real verificado
    if (profile.role === "superadmin") {
      const targetUrl = next && next.startsWith("/admin") ? next : "/admin";
      return NextResponse.redirect(new URL(targetUrl, request.url));
    } else {
      const targetUrl = next && next.startsWith("/app") ? next : "/app";
      return NextResponse.redirect(new URL(targetUrl, request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login?error=oauth_error", request.url));
  }
}


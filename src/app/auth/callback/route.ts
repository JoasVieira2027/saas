import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { dataService } from "@/lib/supabase/data-service";
import { setSession, signSessionData, SESSION_COOKIE_NAME, type SessionData } from "@/lib/auth";
import { Profile } from "@/types/database";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "";
  const errorParam = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  // Resolve dinamicamente a URL base de origem considerando proxies reversos (Vercel)
  const host = request.headers.get("x-forwarded-host") || requestUrl.host;
  const proto =
    request.headers.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "production" ? "https" : requestUrl.protocol.replace(":", ""));
  const origin = `${proto}://${host}`;

  // Se o provedor OAuth externo retornar erro na autorização
  if (errorParam || errorDescription) {
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=oauth_missing_code`);
  }

  try {
    const cookieStore = await cookies();
    const cookiesToSetLater: { name: string; value: string; options?: CookieOptions }[] = [];

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-project.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key";

    // Cliente SSR configurado para capturar e propagar os cookies da sessão Supabase
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // Ignora erro caso invocado em contexto restrito
            }
            cookiesToSetLater.push({ name, value, options });
          });
        },
      },
    });

    // 1. Troca o código temporário OAuth por sessão ativa no Supabase Auth
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.user) {
      return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
    }

    const user = data.user;
    const userEmail = (user.email || "").toLowerCase().trim();

    // 2. Modelo de acesso exclusivo por convite:
    // Busca o perfil diretamente com o cliente autenticado (satisfaz RLS auth.uid() = user.id)
    let profile: Profile | null = null;

    const { data: directProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (directProfile) {
      profile = {
        id: (directProfile.id as string) || user.id,
        email: (directProfile.email as string) || userEmail,
        full_name: (directProfile.full_name as string) || (directProfile.name as string) || "Usuário",
        role: (directProfile.role as Profile["role"]) || "tenant_admin",
        created_at: (directProfile.created_at as string) || new Date().toISOString(),
      };
    }

    // Fallback defensivo por e-mail caso o perfil tenha sido pré-cadastrado pelo e-mail
    if (!profile && userEmail) {
      const { data: emailProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", userEmail)
        .maybeSingle();

      if (emailProfile) {
        profile = {
          id: (emailProfile.id as string) || user.id,
          email: (emailProfile.email as string) || userEmail,
          full_name: (emailProfile.full_name as string) || (emailProfile.name as string) || "Usuário",
          role: (emailProfile.role as Profile["role"]) || "tenant_admin",
          created_at: (emailProfile.created_at as string) || new Date().toISOString(),
        };
      }
    }

    // Fallback secundário através do dataService
    if (!profile) {
      const dsProfile = (await dataService.getProfile(user.id)) || (userEmail ? await dataService.getProfileByEmail(userEmail) : null);
      if (dsProfile) {
        profile = dsProfile;
      }
    }

    // 3. Se o usuário não possuir convite/perfil pré-existente no banco:
    // Não permite cadastro público irrestrito nem atribui permissões.
    // Encerra a sessão aberta no Auth e redireciona com mensagem informativa.
    if (!profile) {
      try {
        await supabase.auth.signOut();
      } catch {}
      return NextResponse.redirect(`${origin}/login?error=invite_required`);
    }

    // 4. Determina a rota real de destino baseada no papel oficial do perfil verificado
    let targetPath = "/app";
    if (profile.role === "superadmin") {
      targetPath = next && next.startsWith("/admin") ? next : "/admin";
    } else {
      targetPath = next && next.startsWith("/app") ? next : "/app";
    }

    // 5. Instancia a resposta de redirecionamento para a rota de destino
    const response = NextResponse.redirect(`${origin}${targetPath}`);

    // 6. Propaga os cookies do Supabase SSR no cabeçalho Set-Cookie da resposta HTTP com proteção
    for (const { name, value, options } of cookiesToSetLater) {
      try {
        response.cookies.set(name, value, options);
      } catch {
        try {
          response.cookies.set(name, value);
        } catch {}
      }
    }

    // 7. Assina e grava o cookie HMAC-SHA256 da sessão da aplicação GlowSaaS
    const sessionData: SessionData = {
      userId: profile.id,
      email: profile.email,
      role: profile.role,
      fullName: profile.full_name,
    };
    const signedToken = await signSessionData(sessionData);

    response.cookies.set(SESSION_COOKIE_NAME, signedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    // Sincroniza defensivamente no cookieStore do Next.js sem interromper o fluxo caso rejeitado
    try {
      await setSession(profile);
    } catch {}

    return response;
  } catch (err) {
    console.error("[OAuth Callback Error]:", err);
    return NextResponse.redirect(`${origin}/login?error=oauth_error`);
  }
}

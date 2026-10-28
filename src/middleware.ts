import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // 1. Tratamento de Subdomínios Multitenant
  // Exemplo: 'lumiere-hair.meusaas.com' ou 'lumiere-hair.localhost:3000'
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  const cleanHostname = hostname.replace(`:${request.nextUrl.port}`, "");
  const cleanRoot = rootDomain.split(":")[0];

  const isSubdomain =
    cleanHostname.endsWith(cleanRoot) &&
    cleanHostname !== cleanRoot &&
    !cleanHostname.startsWith("admin.") &&
    !cleanHostname.startsWith("app.") &&
    !cleanHostname.startsWith("www.");

  if (isSubdomain) {
    const subdomain = cleanHostname.replace(`.${cleanRoot}`, "");
    // Reescreve a requisição para a rota pública do tenant
    return NextResponse.rewrite(new URL(`/p/${subdomain}${pathname}`, request.url));
  }

  // 2. Proteção de Rotas com Base na Sessão (Cookies Seguros)
  const sessionCookie = request.cookies.get("saas_auth_session");
  let userSession: { role?: string } | null = null;

  if (sessionCookie?.value) {
    try {
      userSession = JSON.parse(sessionCookie.value);
    } catch {
      userSession = null;
    }
  }

  // Redireciona usuários já autenticados que acessam /login
  if (pathname === "/login" && userSession) {
    if (userSession.role === "superadmin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/app", request.url));
  }

  // Proteção da área exclusiva do Superadmin (/admin)
  if (pathname.startsWith("/admin")) {
    if (!userSession) {
      return NextResponse.redirect(new URL("/login?error=auth_required", request.url));
    }
    if (userSession.role !== "superadmin") {
      return NextResponse.redirect(new URL("/app?error=unauthorized", request.url));
    }
  }

  // Proteção do Painel do Cliente (/app)
  if (pathname.startsWith("/app")) {
    if (!userSession) {
      return NextResponse.redirect(new URL("/login?error=auth_required", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica o middleware a todas as rotas exceto:
     * - arquivos estáticos (_next/static, _next/image, favicon.ico)
     * - arquivos de mídia na pasta public
     */
    "/((?!_next/static|_next/image|favicon.ico|templates|images).*)",
  ],
};

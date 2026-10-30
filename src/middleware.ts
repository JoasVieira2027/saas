import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
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

  // 1.1 Redirecionamento defensivo de callback OAuth que chegue na raiz ou outra rota com ?code=...
  if (request.nextUrl.searchParams.has("code") && pathname !== "/auth/callback") {
    const callbackUrl = new URL("/auth/callback", request.url);
    callbackUrl.search = request.nextUrl.search;
    return NextResponse.redirect(callbackUrl);
  }

  // 2. Proteção de Rotas com Base na Sessão Criptograficamente Assinada
  const sessionCookie = request.cookies.get("saas_auth_session");
  const userSession = sessionCookie?.value ? await verifySessionToken(sessionCookie.value) : null;

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


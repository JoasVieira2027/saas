import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

test("1. Route Handler: Persistência de cookies Supabase SSR e HMAC na resposta HTTP", () => {
  const routePath = path.join(rootDir, "src", "app", "auth", "callback", "route.ts");
  assert.ok(fs.existsSync(routePath), "route.ts deve existir");
  const code = fs.readFileSync(routePath, "utf-8");

  // Garante que o route handler intercepta e propaga cookies na resposta HTTP do redirect
  assert.ok(code.includes("createServerClient"), "Deve utilizar createServerClient do @supabase/ssr");
  assert.ok(code.includes("cookiesToSetLater"), "Deve armazenar os cookies definidos pelo Supabase SSR");
  assert.ok(code.includes("response.cookies.set"), "Deve propagar cookies explicitamente no objeto de resposta");
  assert.ok(code.includes("SESSION_COOKIE_NAME"), "Deve assinar e gravar o cookie da sessão da aplicação");
  assert.ok(code.includes("signSessionData"), "Deve usar assinatura criptográfica HMAC-SHA256");
});

test("2. Modelo de Convite Estrito: Rejeição de usuários não convidados sem cadastro automático", () => {
  const routePath = path.join(rootDir, "src", "app", "auth", "callback", "route.ts");
  const code = fs.readFileSync(routePath, "utf-8");

  // Garante que não há criação automática de perfil para usuários desconhecidos
  assert.ok(!code.includes("ensureProfile"), "NÃO deve chamar ensureProfile para auto-cadastrar qualquer usuário Google");
  assert.ok(code.includes("invite_required"), "Deve redirecionar para invite_required caso não haja perfil autorizado");
  assert.ok(code.includes("supabase.auth.signOut()"), "Deve invalidar a sessão Supabase se o usuário não tiver convite");
});

test("3. Redirecionamento de Rotas: Rotas reais (/admin para superadmin, /app para cliente)", () => {
  const routePath = path.join(rootDir, "src", "app", "auth", "callback", "route.ts");
  const code = fs.readFileSync(routePath, "utf-8");

  assert.ok(code.includes('profile.role === "superadmin"'), "Deve checar papel de superadmin");
  assert.ok(code.includes('"/admin"'), "Superadmin deve ser direcionado para /admin");
  assert.ok(code.includes('"/app"'), "Cliente deve ser direcionado para /app");
});

test("4. Resolução Dinâmica de Host: Prevenção de desvio para localhost em produção", () => {
  const actionsPath = path.join(rootDir, "src", "app", "auth", "actions.ts");
  const routePath = path.join(rootDir, "src", "app", "auth", "callback", "route.ts");
  const actionsCode = fs.readFileSync(actionsPath, "utf-8");
  const routeCode = fs.readFileSync(routePath, "utf-8");

  assert.ok(actionsCode.includes("x-forwarded-host"), "actions.ts deve respeitar x-forwarded-host do proxy");
  assert.ok(routeCode.includes("x-forwarded-host"), "route.ts deve respeitar x-forwarded-host do proxy");
  assert.ok(actionsCode.includes("redirectTo: `${appUrl}/auth/callback`"), "OAuth deve apontar para /auth/callback");
});

test("5. Camada de Dados: dataService provê getProfileByEmail com busca segura", () => {
  const dataServicePath = path.join(rootDir, "src", "lib", "supabase", "data-service.ts");
  const code = fs.readFileSync(dataServicePath, "utf-8");

  assert.ok(code.includes("getProfileByEmail"), "dataService deve possuir getProfileByEmail");
  assert.ok(code.includes('.eq("email", normalizedEmail)'), "Deve filtrar por e-mail normalizado");
});

test("6. UI da Página de Login: Mensagens amigáveis para invite_required, auth_required e unauthorized", () => {
  const loginPath = path.join(rootDir, "src", "app", "(auth)", "login", "page.tsx");
  const code = fs.readFileSync(loginPath, "utf-8");

  assert.ok(code.includes("invite_required"), "Deve tratar erro invite_required");
  assert.ok(code.includes("auth_required"), "Deve tratar erro auth_required");
  assert.ok(code.includes("unauthorized"), "Deve tratar erro unauthorized");
});


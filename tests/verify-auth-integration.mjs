import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(".");

// 1. Validação da Migration 0005 (Schema de Compatibilidade e OAuth)
test("1. Migration 0005: Compatibilização de perfis, colunas esperadas e RLS", () => {
  const m5Path = path.join(rootDir, "supabase", "migrations", "0005_auth_profiles_compat.sql");
  assert.ok(fs.existsSync(m5Path), "0005_auth_profiles_compat.sql deve existir");

  const sqlContent = fs.readFileSync(m5Path, "utf-8");

  assert.ok(sqlContent.includes("ADD COLUMN IF NOT EXISTS email"), "Deve adicionar coluna email");
  assert.ok(sqlContent.includes("ADD COLUMN IF NOT EXISTS full_name"), "Deve adicionar coluna full_name");
  assert.ok(sqlContent.includes("ADD COLUMN IF NOT EXISTS role"), "Deve adicionar coluna role");
  assert.ok(sqlContent.includes("profiles_role_check"), "Deve conter constraint de validação de role");
  assert.ok(sqlContent.includes("is_superadmin()"), "Deve atualizar a função is_superadmin");
  assert.ok(sqlContent.includes("handle_new_user()"), "Deve atualizar a trigger handle_new_user");
  assert.ok(sqlContent.includes("ON CONFLICT (id) DO UPDATE"), "Deve usar ON CONFLICT para prevenir duplicidade");
});

// 2. Prevenção Estrita de Elevação de Privilégios no Banco
test("2. Prevenção de Elevação de Privilégios: Novos cadastros, OAuth e Updates NUNCA escalam superadmin", () => {
  const m5Path = path.join(rootDir, "supabase", "migrations", "0005_auth_profiles_compat.sql");
  const sqlContent = fs.readFileSync(m5Path, "utf-8");

  // Garante que a trigger força 'tenant_admin'
  assert.ok(
    sqlContent.includes("'tenant_admin'"),
    "A trigger handle_new_user deve fixar o papel 'tenant_admin'"
  );

  // Garante que o UPDATE em caso de conflito NÃO sobrescreve o role
  const onConflictBlock = sqlContent.slice(sqlContent.indexOf("ON CONFLICT (id) DO UPDATE"));
  assert.ok(
    !onConflictBlock.includes("role = EXCLUDED.role"),
    "O UPDATE no conflito NUNCA deve alterar a coluna role"
  );

  // Garante a presença do gatilho BEFORE UPDATE protect_profile_role
  assert.ok(
    sqlContent.includes("protect_profile_role()"),
    "Deve conter a função trigger protect_profile_role"
  );
  assert.ok(
    sqlContent.includes("tr_protect_profile_role"),
    "Deve registrar o trigger tr_protect_profile_role"
  );
  assert.ok(
    sqlContent.includes("NEW.role IS DISTINCT FROM OLD.role"),
    "Trigger deve interceptar qualquer tentativa de alteração do role"
  );

  // Garante a blindagem na política RLS de UPDATE
  assert.ok(
    sqlContent.includes("role = 'tenant_admin' OR public.is_superadmin()"),
    "A política RLS de UPDATE deve restringir o role para tenant_admin ou superadmin"
  );
});

// 3. Validação do Route Handler de OAuth (/auth/callback - Modelo Convite)
test("3. Route Handler OAuth: /auth/callback processa código e valida acesso por convite", () => {
  const callbackPath = path.join(rootDir, "src", "app", "auth", "callback", "route.ts");
  assert.ok(fs.existsSync(callbackPath), "A rota /auth/callback/route.ts deve existir");

  const callbackCode = fs.readFileSync(callbackPath, "utf-8");

  assert.ok(callbackCode.includes("exchangeCodeForSession"), "Deve trocar o código de autorização por sessão");
  assert.ok(callbackCode.includes("dataService.getProfile"), "Deve buscar o perfil do usuário logado");
  assert.ok(callbackCode.includes("invite_required"), "Deve barrar usuários sem convite pré-existente");
  assert.ok(callbackCode.includes("setSession(profile)"), "Deve assinar a sessão com HMAC");
  assert.ok(callbackCode.includes('profile.role === "superadmin"'), "Deve validar se é superadmin para redirecionar");
});

// 4. Validação da Camada de Dados (Resiliência para schema legado e oficial)
test("4. Camada de Dados: dataService.getProfile suporta id e user_id defensivamente", () => {
  const dataServicePath = path.join(rootDir, "src", "lib", "supabase", "data-service.ts");
  const code = fs.readFileSync(dataServicePath, "utf-8");

  assert.ok(code.includes('.eq("id", userId)'), "Deve buscar primariamente por id");
  assert.ok(code.includes('.eq("user_id", userId)'), "Deve ter fallback para coluna legada user_id");
  assert.ok(code.includes("ensureProfile"), "Deve conter método ensureProfile seguro");
  assert.ok(code.includes('role: "tenant_admin"'), "ensureProfile deve forçar role tenant_admin");
});

// 5. Validação das Server Actions de Autenticação
test("5. Server Actions: Login com Google e Recuperação de Senha Segura", () => {
  const actionsPath = path.join(rootDir, "src", "app", "auth", "actions.ts");
  const code = fs.readFileSync(actionsPath, "utf-8");

  assert.ok(code.includes("loginWithGoogleAction"), "Deve exportar loginWithGoogleAction");
  assert.ok(code.includes("signInWithOAuth"), "Deve invocar signInWithOAuth com provedor google");
  assert.ok(code.includes("resetPasswordAction"), "Deve exportar resetPasswordAction");
  assert.ok(code.includes("resetPasswordForEmail"), "Deve invocar resetPasswordForEmail");
  assert.ok(code.includes("reset_email_sent"), "Deve retornar status genérico para prevenir user enumeration");
});

// 6. Interface de Login: Suporte a Google OAuth e E-mail
test("6. UI de Login: Botão Google, recuperação de senha e tratamento de erros", () => {
  const loginPagePath = path.join(rootDir, "src", "app", "(auth)", "login", "page.tsx");
  const code = fs.readFileSync(loginPagePath, "utf-8");

  assert.ok(code.includes("loginWithGoogleAction"), "Formulário deve invocar loginWithGoogleAction");
  assert.ok(code.includes("Continuar com o Google"), "Deve exibir botão Continuar com o Google");
  assert.ok(code.includes("resetPasswordAction"), "Deve conter formulário de redefinição de senha");
  assert.ok(code.includes("reset_email_sent"), "Deve exibir mensagem amigável de e-mail de recuperação");
});


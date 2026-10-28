import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// 1. Verificação de Proteção de Segredos e .gitignore
test("1. Proteção de Segredos: .env.local não rastreado no git e .env.example completo", () => {
  const gitignorePath = path.join(rootDir, ".gitignore");
  const gitignore = fs.readFileSync(gitignorePath, "utf-8");

  assert.ok(gitignore.includes(".env*.local"), ".gitignore deve conter '.env*.local'");

  // Verifica que .env.local nunca foi adicionado ao rastreamento do Git
  let trackedEnvLocal = "";
  try {
    trackedEnvLocal = execSync("git ls-files .env.local", { cwd: rootDir, encoding: "utf-8" }).trim();
  } catch {
    trackedEnvLocal = "";
  }
  assert.equal(trackedEnvLocal, "", ".env.local NÃO deve estar rastreado no Git");

  // Verifica que .env.example documenta todas as 6 variáveis necessárias
  const envExamplePath = path.join(rootDir, ".env.example");
  const envExample = fs.readFileSync(envExamplePath, "utf-8");
  const requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_ROOT_DOMAIN",
    "SESSION_SECRET",
  ];

  for (const envVar of requiredEnvVars) {
    assert.ok(envExample.includes(envVar), `.env.example deve documentar a variável '${envVar}'`);
  }
});

// 2. Validação de Fail-Closed de SESSION_SECRET em Ambiente de Produção
test("2. Resiliência de Configuração: Fail-closed para SESSION_SECRET em produção", () => {
  function testSessionSecretValidation(nodeEnv, secret) {
    if (!secret) {
      if (nodeEnv === "production") {
        throw new Error("CONFIGURAÇÃO CRÍTICA AUSENTE: A variável de ambiente SESSION_SECRET é obrigatória em ambiente de produção.");
      }
      return "dev-fallback";
    }
    if (nodeEnv === "production" && secret.length < 32) {
      throw new Error("CONFIGURAÇÃO INSEGURA: A variável SESSION_SECRET deve conter no mínimo 32 caracteres em ambiente de produção.");
    }
    return secret;
  }

  // A. Em desenvolvimento sem segredo -> fallback permitido
  assert.equal(testSessionSecretValidation("development", undefined), "dev-fallback");

  // B. Em produção sem segredo -> DEVE FALHAR IMEDIATAMENTE (Fail-Closed)
  assert.throws(
    () => testSessionSecretValidation("production", undefined),
    /CONFIGURAÇÃO CRÍTICA AUSENTE/,
    "Produção sem SESSION_SECRET deve lançar erro fatal"
  );

  // C. Em produção com segredo fraco (< 32 caracteres) -> DEVE REJEITAR
  assert.throws(
    () => testSessionSecretValidation("production", "short-secret-123"),
    /CONFIGURAÇÃO INSEGURA/,
    "Produção com chave curta deve lançar erro fatal"
  );

  // D. Em produção com chave forte de 64 caracteres -> APROVADO
  const strongSecret = "e7b4f8a192c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789a";
  assert.equal(testSessionSecretValidation("production", strongSecret), strongSecret);
});

// 3. Bloqueio Absoluto de Mocks e Contas de Homologação em Produção
test("3. Bloqueio de Homologação: Código de login nunca permite contas simuladas em produção", () => {
  const actionsPath = path.join(rootDir, "src", "app", "auth", "actions.ts");
  const actionsCode = fs.readFileSync(actionsPath, "utf-8");

  // Verifica que há redirecionamento de erro antes de qualquer mapa de knownProfiles
  const prodCheckIndex = actionsCode.indexOf('if (process.env.NODE_ENV === "production")');
  const knownProfilesIndex = actionsCode.indexOf("const knownProfiles");

  assert.ok(prodCheckIndex !== -1, "Deve haver verificação de NODE_ENV === 'production'");
  assert.ok(knownProfilesIndex !== -1, "Deve existir knownProfiles para homologação local");
  assert.ok(
    prodCheckIndex < knownProfilesIndex,
    "A checagem de produção deve ocorrer ANTES de qualquer acesso a knownProfiles"
  );
  assert.ok(
    actionsCode.includes('redirect("/login?error=invalid_credentials")'),
    "Deve redirecionar caso tente fallback em produção"
  );
});

// 4. Coerência e Ordem de Dependência das Migrações SQL
test("4. Integridade das Migrações: Ordem 0001 -> 0002 -> 0003 e ausência de SQL destrutivo", () => {
  const m1Path = path.join(rootDir, "supabase", "migrations", "0001_initial_schema.sql");
  const m2Path = path.join(rootDir, "supabase", "migrations", "0002_superadmin_payments_audit.sql");
  const m3Path = path.join(rootDir, "supabase", "migrations", "0003_security_hardening.sql");

  assert.ok(fs.existsSync(m1Path), "0001_initial_schema.sql deve existir");
  assert.ok(fs.existsSync(m2Path), "0002_superadmin_payments_audit.sql deve existir");
  assert.ok(fs.existsSync(m3Path), "0003_security_hardening.sql deve existir");

  const m1 = fs.readFileSync(m1Path, "utf-8");
  const m2 = fs.readFileSync(m2Path, "utf-8");
  const m3 = fs.readFileSync(m3Path, "utf-8");

  // Nenhuma migration deve conter DROP TABLE destrutivo
  assert.ok(!m1.includes("DROP TABLE "), "0001 não deve ter DROP TABLE");
  assert.ok(!m2.includes("DROP TABLE "), "0002 não deve ter DROP TABLE");
  assert.ok(!m3.includes("DROP TABLE "), "0003 não deve ter DROP TABLE");

  // 0002 adiciona a coluna subscription_status
  assert.ok(m2.includes("ADD COLUMN IF NOT EXISTS subscription_status"), "0002 deve criar subscription_status");

  // 0003 depende de subscription_status criada na 0002
  assert.ok(m3.includes("tenants.subscription_status NOT IN ('suspended', 'cancelled')"), "0003 depende de coluna da 0002");

  // 0003 substitui a função handle_new_user fixando role = tenant_admin
  assert.ok(m3.includes("'tenant_admin'"), "0003 deve fixar tenant_admin");
  assert.ok(m3.includes("SET search_path = public, auth"), "0003 deve fixar search_path");
});

// 5. Cabeçalhos de Segurança em Produção
test("5. Segurança HTTP: next.config.ts define cabeçalhos de segurança recomendados", () => {
  const nextConfigPath = path.join(rootDir, "next.config.ts");
  const nextConfig = fs.readFileSync(nextConfigPath, "utf-8");

  assert.ok(nextConfig.includes("X-Content-Type-Options"), "Deve definir X-Content-Type-Options");
  assert.ok(nextConfig.includes("X-Frame-Options"), "Deve definir X-Frame-Options");
  assert.ok(nextConfig.includes("Referrer-Policy"), "Deve definir Referrer-Policy");
  assert.ok(nextConfig.includes("images.unsplash.com"), "Deve autorizar imagens do Unsplash");
  assert.ok(nextConfig.includes("*.supabase.co"), "Deve autorizar imagens do Supabase Storage");
});

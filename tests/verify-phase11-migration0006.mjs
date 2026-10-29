import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(".");
const m6Path = path.join(rootDir, "supabase", "migrations", "0006_profiles_privilege_hardening.sql");

test("1. Migration 0006: Estrutura, Idempotência e Bloco Transacional", () => {
  assert.ok(fs.existsSync(m6Path), "0006_profiles_privilege_hardening.sql deve existir");
  const sql = fs.readFileSync(m6Path, "utf-8");

  assert.ok(sql.includes("BEGIN;"), "Deve conter BEGIN;");
  assert.ok(sql.trimEnd().endsWith("COMMIT;"), "Deve finalizar com COMMIT;");
  assert.ok(sql.includes("profiles_role_check"), "Deve reforçar constraint de role");
});

test("2. Blindagem contra Autoelevação de Role (Trigger e RLS)", () => {
  const sql = fs.readFileSync(m6Path, "utf-8");

  // Gatilho no motor do banco
  assert.ok(
    sql.includes("NEW.role IS DISTINCT FROM OLD.role"),
    "Gatilho deve interceptar qualquer modificação no role"
  );
  assert.ok(
    sql.includes("IF NOT public.is_superadmin() THEN"),
    "Gatilho deve verificar se o usuário é superadmin antes de permitir alteração de role"
  );
  assert.ok(
    sql.includes("RAISE EXCEPTION"),
    "Gatilho deve abortar com exceção caso usuário comum tente alterar role"
  );

  // Política RLS de UPDATE
  assert.ok(
    sql.includes("role = 'tenant_admin' OR public.is_superadmin()"),
    "RLS de UPDATE deve restringir o WITH CHECK para impedir atribuição de superadmin por usuário comum"
  );
});

test("3. Proteção contra Adulteração de Identificadores (id e user_id)", () => {
  const sql = fs.readFileSync(m6Path, "utf-8");

  // Imutabilidade da PK 'id'
  assert.ok(
    sql.includes("NEW.id IS DISTINCT FROM OLD.id"),
    "Gatilho deve checar tentativa de alteração da chave primária"
  );
  assert.ok(
    sql.includes("A chave primária (id) do perfil é imutável"),
    "Deve lançar exceção explícita se houver tentativa de mudar a PK"
  );

  // Imutabilidade de 'user_id'
  assert.ok(
    sql.includes("NEW.user_id := OLD.user_id;"),
    "Gatilho deve forçar a preservação do user_id original"
  );
});

test("4. Blindagem de Inserções Diretas (INSERT)", () => {
  const sql = fs.readFileSync(m6Path, "utf-8");

  // Política RLS para INSERT restrita a superadmin
  assert.ok(
    sql.includes('CREATE POLICY "profiles_insert_superadmin_only"'),
    "Deve existir política explícita restringindo INSERT direto"
  );
  assert.ok(
    sql.includes("WITH CHECK (public.is_superadmin())"),
    "Apenas superadmin pode inserir perfis diretamente via API"
  );

  // Gatilho BEFORE INSERT
  assert.ok(
    sql.includes("TG_OP = 'INSERT'"),
    "Gatilho deve tratar evento de INSERT"
  );
  assert.ok(
    sql.includes("NEW.role := 'tenant_admin'"),
    "Gatilho deve forçar tenant_admin para qualquer inserção de usuário comum"
  );
});

test("5. Preservação de Cadastro (Google OAuth e Senha) e Superadmin Legítimo", () => {
  const sql = fs.readFileSync(m6Path, "utf-8");

  // Superadmin legítimo tem permissão de leitura, atualização, inserção e deleção
  assert.ok(
    sql.includes("id = auth.uid() OR public.is_superadmin()"),
    "Superadmin deve ter acesso de leitura e atualização a todos os perfis"
  );
  assert.ok(
    sql.includes('CREATE POLICY "profiles_delete_superadmin_only"'),
    "Superadmin deve ter política exclusiva para exclusão"
  );

  // Funções de apoio protegidas
  assert.ok(
    sql.includes("SECURITY DEFINER"),
    "Função de gatilho deve ser SECURITY DEFINER"
  );
  assert.ok(
    sql.includes("SET search_path = public, auth"),
    "Função de gatilho deve fixar search_path contra ataques de injeção de schema"
  );
  assert.ok(
    sql.includes("REVOKE ALL ON FUNCTION public.protect_profile_role()"),
    "Deve revogar privilégios de execução direta de protect_profile_role para anon/public"
  );
});

test("6. Limpeza de Políticas Permissivas Residuais em Inglês e Português", () => {
  const sql = fs.readFileSync(m6Path, "utf-8");

  const legacyPolicies = [
    "Usuário autenticado visualiza seu próprio perfil",
    "Usuário autenticado atualiza seu próprio perfil",
    "Superadmin tem acesso total a perfis",
    "Public profiles are viewable by everyone",
    "Users can insert their own profile",
    "Users can update own profile",
    "Profiles are viewable by users who created them",
    "Enable read access for all users",
    "Enable insert for authenticated users only",
    "Enable update for users based on email",
    "Allow individual read",
    "Allow individual update",
    "Allow individual insert",
  ];

  for (const pol of legacyPolicies) {
    assert.ok(
      sql.includes(pol),
      `Deve conter DROP POLICY IF EXISTS para a política residual '${pol}'`
    );
  }
});

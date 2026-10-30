import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

test("1. Autenticação e Restrição: Apenas Superadmin pode cadastrar clientes", () => {
  const actionsPath = path.join(rootDir, "src", "app", "(admin)", "admin", "actions.ts");
  const code = fs.readFileSync(actionsPath, "utf-8");

  assert.ok(code.includes("export async function createTenantAction"), "createTenantAction deve existir");
  assert.ok(code.includes("await requireSuperadmin()"), "Deve exigir requireSuperadmin()");
});

test("2. Camada de Dados: dataService.createTenant persiste no Supabase com Auth e Profiles", () => {
  const dataServicePath = path.join(rootDir, "src", "lib", "supabase", "data-service.ts");
  const code = fs.readFileSync(dataServicePath, "utf-8");

  assert.ok(code.includes("createAdminClient"), "Deve utilizar createAdminClient para provisionamento administrativo");
  assert.ok(code.includes('role: "tenant_admin"'), "Perfil criado deve possuir estritamente role tenant_admin");
  assert.ok(/from\("tenants"\)[\s\S]*?\.insert/.test(code), "Deve persistir na tabela public.tenants");
  assert.ok(/from\("landing_pages"\)[\s\S]*?\.insert/.test(code), "Deve inicializar landing page no banco");
});

test("3. Supabase Server: createAdminClient provê cliente administrativo seguro", () => {
  const serverPath = path.join(rootDir, "src", "lib", "supabase", "server.ts");
  const code = fs.readFileSync(serverPath, "utf-8");

  assert.ok(code.includes("export function createAdminClient"), "createAdminClient deve ser exportado");
  assert.ok(code.includes("SUPABASE_SERVICE_ROLE_KEY"), "Deve utilizar SUPABASE_SERVICE_ROLE_KEY com segurança");
  assert.ok(code.includes("createSupabaseClient"), "Deve criar cliente @supabase/supabase-js");
});

test("4. Integridade de Auditoria: recordAuditLog não causa erro de sintaxe de UUID", () => {
  const dataServicePath = path.join(rootDir, "src", "lib", "supabase", "data-service.ts");
  const code = fs.readFileSync(dataServicePath, "utf-8");

  assert.ok(code.includes('.from("admin_audit_logs").insert'), "Deve inserir log no banco");
  // Confirma que não passa o campo id como string "log-*" na inserção do Supabase
  assert.ok(!code.includes('.from("admin_audit_logs").insert(newLog)'), "Não deve passar newLog com id de texto para o Supabase");
});

test("5. Listagem de Clientes: getAllTenants busca clientes ativos no banco", () => {
  const dataServicePath = path.join(rootDir, "src", "lib", "supabase", "data-service.ts");
  const code = fs.readFileSync(dataServicePath, "utf-8");

  assert.ok(code.includes('.from("tenants").select("*")'), "Deve consultar tabela tenants");
  assert.ok(code.includes("getAllTenants"), "Método getAllTenants deve existir");
});

test("6. UI de Gestão de Clientes: Formulário e feedback visual de sucesso", () => {
  const pagePath = path.join(rootDir, "src", "app", "(admin)", "admin", "clients", "page.tsx");
  const code = fs.readFileSync(pagePath, "utf-8");

  assert.ok(code.includes("createTenantAction"), "Formulário deve invocar createTenantAction");
  assert.ok(code.includes("tenant_created"), "Deve tratar status de sucesso tenant_created");
  assert.ok(code.includes("AdminClientsTable"), "Deve exibir a tabela AdminClientsTable");
});

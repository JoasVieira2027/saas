# RELATÓRIO TÉCNICO: REDESIGN EDITORIAL DA HOME E CORREÇÃO DE ROTAS PÚBLICAS

**Documento:** `docs/RELATORIO-REDESIGN-E-ROTAS.md`  
**Data:** 29 de Outubro de 2026  
**Projeto:** GlowSaaS (Landing Page Comercial e Sistema Multitenant)  
**Status:** Implementado, testado e validado com build de produção e 48/48 testes automatizados aprovados.

---

## 1. Problemas Encontrados na Auditoria Prévia

1. **Erros 404 nas URLs dos Modelos de Demonstração em Produção (`/p/lumiere-hair`, etc.)**:
   - As páginas públicas de demonstração dos três segmentos (Salão, Barbearia e Unhas em Gel) resultavam em erro HTTP 404 quando acessadas no ambiente publicado da Vercel.
2. **Duplicação de Seções e Excesso Visual na Home Anterior**:
   - A página inicial possuía duas seções consecutivas exibindo os mesmos três modelos (um resumo na primeira dobra e outra grade logo abaixo).
   - O esquema de cores anterior forçava um tema excessivamente escuro (`bg-neutral-950`), com gradientes dourados vibrantes e cartões pesados, incompatível com a proposta de um SaaS comercial de estética editorial sofisticada.
3. **Falta de Demonstração Visual Real da Página no Hero**:
   - A primeira dobra não apresentava a interface de um site criado na prática, dificultando a compreensão imediata do produto pelo visitante.
4. **Resolução de Páginas Públicas Inflexível no `dataService`**:
   - Em produção (`isLiveSupabaseConfigured() = true`), o método `getPublicPageBySlug` consultava estritamente a tabela `public.tenants` do Supabase. Como os modelos de demonstração são nativos da aplicação e não registros inseridos no banco remoto, a query retornava nulo e disparava `notFound()`.

---

## 2. Causas Identificadas para os Erros 404

### Mecanismo do Erro:
1. No arquivo [`src/app/(public-sites)/p/[slug]/page.tsx`](file:///d:/Saas/src/app/(public-sites)/p/[slug]/page.tsx), a requisição é resolvida via:
   ```ts
   const data = await dataService.getPublicPageBySlug(slug);
   if (!data) notFound();
   ```
2. No ambiente Vercel, as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão configuradas, ativando o modo `isLiveSupabaseConfigured() = true`.
3. As migrations 0001 a 0004 executadas no Supabase criaram as tabelas estruturais, mas não inseriram dados nas tabelas `public.tenants` ou `public.landing_pages`.
4. Ao consultar `supabase.from("tenants").select("*").eq("slug", slug)...`, o Supabase retornava zero registros (`data: null`).
5. A implementação anterior encerrava a busca imediatamente com `if (!tenant) return null;`, sem consultar a coleção em memória de modelos oficiais (`DEMO_TENANTS`).
6. O Next.js então acionava a rota `notFound()`, gerando o status 404 para qualquer visitante que tentasse ver os exemplos comerciais.

### Solução Aplicada:
- No método `dataService.getPublicPageBySlug(slug)` em [`src/lib/supabase/data-service.ts`](file:///d:/Saas/src/lib/supabase/data-service.ts), foi adicionado um fallback defensivo: caso o tenant não exista na base remota, verifica se corresponde a um dos três modelos demonstrativos oficiais (`lumiere-hair`, `navalha-de-ouro`, `gisele-nails`).
- As regras de isolamento foram integralmente preservadas: clientes com status suspenso, inadimplentes cancelados ou páginas em rascunho continuam sendo estritamente bloqueados.

---

## 3. Arquivos Modificados

| Arquivo | Natureza da Alteração |
|---|---|
| [`src/app/page.tsx`](file:///d:/Saas/src/app/page.tsx) | Redesign completo da página inicial com direção visual editorial (fundo creme/off-white `#FBF9F5`, texto grafite `#1C1917`, destaque refinado `#8C5E32`, tipografia serifada, eliminação de duplicações e mockup visual realista). |
| [`src/lib/supabase/data-service.ts`](file:///d:/Saas/src/lib/supabase/data-service.ts) | Implementação de fallback defensivo em `getPublicPageBySlug` para os slugs dos modelos de demonstração pré-configurados, mantendo prioridade para registros reais do Supabase e regras de isolamento. |
| [`tests/verify-phase10-landing-routes.mjs`](file:///d:/Saas/tests/verify-phase10-landing-routes.mjs) | Nova suíte de testes automatizados com 4 asserções validando a resiliência das rotas públicas, integridade dos 3 modelos e conformidade da Home. |

---

## 4. Melhorias Visuais Realizadas

1. **Direção Estética Editorial Premium**:
   - **Fundo**: Transição para tom creme/off-white (`#FBF9F5` com cards `#FFFFFF` e bordas sutis `#EAE4DC`), transmitindo sofisticação, higiene visual e credibilidade profissional (estilo Aesop, Kinfolk e Stripe Press).
   - **Tipografia**: Hierarquia balanceada com títulos em família serifada de alto padrão e textos explicativos em sans-serif limpa e legível.
   - **Cor de Destaque**: Bronze/âmbar sóbrio (`#8C5E32`) para chips, preços e ênfases pontuais, sem uso de gradientes artificiais ou excesso de efeitos.
2. **Hero com Demonstração Convincente**:
   - Adicionado mockup de navegador realista exibindo a interface funcional do modelo Lumière Concept, com fotografia real de salão, tabela com preços em reais, endereço no Jardins e botão de agendamento via WhatsApp.
3. **Seção Única de Modelos**:
   - Unificação da exibição dos modelos em uma única grade com três colunas:
     - **Salão de Beleza** (`Lumière Concept`): Foto de ambiente profissional, foco em mechas e tratamentos, link para `/p/lumiere-hair`.
     - **Barbearia** (`Navalha de Ouro`): Estética clássica, foco em barba na toalha quente e combos, link para `/p/navalha-de-ouro`.
     - **Unhas em Gel** (`Studio Gisele Nails`): Destaque para alongamento em gel moldado e biossegurança, link para `/p/gisele-nails`.
4. **Benefícios Concretos e Reais**:
   - Seção estruturada destacando funcionalidades existentes: layout mobile-first, apresentação de preços/duração, botão de WhatsApp com texto automático, painel de edição para o cliente, endereço no Maps e ausência de comissões por agendamento.
5. **Condições Comerciais Transparentes**:
   - Exibição clara dos planos mensais reais (Starter a R$ 97/mês e Pro a R$ 197/mês) e fluxo de ativação assistida.
6. **FAQ Objetivo**:
   - 5 perguntas frequentes respondidas com base nas regras do sistema real.
7. **Cabeçalho e Rodapé Compactos**:
   - Cabeçalho minimalista com navegação direta e botão para a área de login. Rodapé sóbrio sem links quebrados.

---

## 5. Funcionalidades Preservadas

- **Autenticação**: Login por e-mail/senha, Google OAuth, Route Handler `/auth/callback` e recuperação de senha.
- **Segurança de Sessão**: Assinatura criptográfica HMAC-SHA256 no cookie `saas_auth_session`.
- **Painel Administrativo (`/admin`)**: Acesso restrito a usuários com `role = 'superadmin'` e funções de auditoria.
- **Painel do Cliente (`/app`)**: Rotas `/app/editor`, `/app/preview`, `/app/settings` e persistência de dados.
- **Templates Nativos**: Componentes [`SalonTemplate`](file:///d:/Saas/src/components/templates/salon/index.tsx), [`BarberTemplate`](file:///d:/Saas/src/components/templates/barber/index.tsx) e [`NailsTemplate`](file:///d:/Saas/src/components/templates/nails/index.tsx).
- **Isolamento Multitenant**: Proteção de rotas, verificação de tenants suspensos/cancelados e políticas RLS.

---

## 6. Testes Executados e Resultados Reais

### 6.1 Compilação TypeScript
- Comando: `npx tsc --noEmit`
- **Resultado:** Código 0 (Zero erros de tipagem).

### 6.2 Build de Produção do Next.js
- Comando: `npm run build`
- **Resultado:** Sucesso absoluto (Código 0). Todas as 13 rotas estáticas e dinâmicas foram geradas:
  - `○ /` (Home redesenhada estática: 174 B)
  - `○ /_not-found`
  - `ƒ /admin`
  - `ƒ /admin/clients`
  - `ƒ /admin/clients/[id]`
  - `ƒ /app`
  - `ƒ /app/editor`
  - `ƒ /app/preview`
  - `ƒ /app/settings`
  - `ƒ /auth/callback`
  - `○ /comecar`
  - `ƒ /login`
  - `ƒ /p/[slug]`

### 6.3 Suíte Completa de Testes Automatizados (10/10 suítes, 48/48 testes)
- `tests/verify-phase2.mjs`: 4/4 aprovados ✅
- `tests/verify-phase3-salon.mjs`: 4/4 aprovados ✅
- `tests/verify-phase4-barber.mjs`: 4/4 aprovados ✅
- `tests/verify-phase5-nails.mjs`: 4/4 aprovados ✅
- `tests/verify-phase6-editor.mjs`: 4/4 aprovados ✅
- `tests/verify-phase7-superadmin.mjs`: 6/6 aprovados ✅
- `tests/verify-phase8-security.mjs`: 7/7 aprovados ✅
- `tests/verify-phase9-predeploy.mjs`: 5/5 aprovados ✅
- `tests/verify-auth-integration.mjs`: 6/6 aprovados ✅
- `tests/verify-phase10-landing-routes.mjs`: 4/4 aprovados ✅
- **Total:** **48 testes executados com 100% de sucesso**.

---

## 7. URLs Verificadas

| URL / Rota | Comportamento Verificado | Status |
|---|---|---|
| `/` | Nova landing page editorial com demonstração, modelos, planos e FAQ | ✅ Homologada localmente |
| `/p/lumiere-hair` | Modelo de Salão de Beleza com serviços, mechas, galeria e WhatsApp | ✅ Homologada localmente |
| `/p/navalha-de-ouro` | Modelo de Barbearia com combos, barba, horários e WhatsApp | ✅ Homologada localmente |
| `/p/gisele-nails` | Modelo de Unhas em Gel com alongamento, biossegurança e WhatsApp | ✅ Homologada localmente |
| `/p/slug-inexistente` | Retorna status 404 (Not Found) padrão | ✅ Homologada localmente |
| `/comecar` | Formulário de onboarding e solicitação de ativação | ✅ Homologada localmente |
| `/login` | Tela de autenticação com login por senha e botão Google OAuth | ✅ Homologada localmente |

---

## 8. Problemas Restantes e Limitações

1. **Deploy no Vercel**:
   - Conforme as restrições obrigatórias, não foram executados comandos de `git push` ou deploy remoto. As correções estão aplicadas e testadas localmente no workspace. Para que a Vercel sirva o novo código, as alterações precisarão ser comitadas e enviadas ao repositório GitHub (`origin/master`).
2. **Compatibilização da tabela `public.profiles` no Supabase**:
   - Conforme documentado em [`docs/PLANO-COMPATIBILIDADE-PROFILES.md`](file:///d:/Saas/docs/PLANO-COMPATIBILIDADE-PROFILES.md), a aplicação da Migration 0005 v2 e a promoção da conta `contatojoasvieira@gmail.com` a `superadmin` continuam aguardando execução manual pelo operador no SQL Editor do Supabase Dashboard.


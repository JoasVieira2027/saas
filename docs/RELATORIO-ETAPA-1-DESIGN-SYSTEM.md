# Relatório de Implementação: Etapa 1 — Design System & Fundações Visuais dos Templates Públicos

**Data:** 30 de Outubro de 2026  
**Documento de Referência:** `docs/AUDITORIA-VISUAL-TEMPLATES.md`  
**Escopo:** Exclusivamente as fundações de design system e tokens visuais para os templates de **Salão de Beleza**, **Barbearia** e **Unhas/Estética**, sem ainda alterar a estrutura de nenhum template.

---

## 1. Arquivos Alterados

1. [`tailwind.config.ts`](file:///d:/Saas/tailwind.config.ts)
   - Expansão dos tokens de cores por nicho (`salon`, `barber`, `nails`).
   - Definição de tokens de sombras específicas (`salon-soft`, `salon-card`, `salon-hover`, `salon-floating`, `barber-card`, `barber-hover`, `barber-gold`, `barber-floating`, `nails-soft`, `nails-card`, `nails-hover`, `nails-floating`).
   - Tokens de espaçamento de letras para títulos e badges (`tracking-editorial`, `tracking-badge`, `tracking-club`).
   - Suporte à família tipográfica de clube tradicional/heráldico (`font-barber`).
   - Tokens de arredondamento expandidos (`rounded-4xl`, `rounded-5xl`).

2. [`src/app/globals.css`](file:///d:/Saas/src/app/globals.css)
   - Importação da fonte `Cinzel` (Google Fonts) em harmonia com `Playfair Display` e `Plus Jakarta Sans`.
   - Adição da variável CSS `--font-barber` no `:root`.
   - Criação de classes de componentes semânticos por nicho sob `@layer components`:
     - **Salão (`salon`):** `.badge-salon`, `.card-salon`, `.btn-salon-primary`, `.btn-salon-secondary`, `.glass-salon`.
     - **Barbearia (`barber`):** `.badge-barber`, `.card-barber`, `.card-barber-combo`, `.btn-barber-primary`, `.btn-barber-secondary`, `.glass-barber`.
     - **Unhas (`nails`):** `.badge-nails`, `.card-nails`, `.btn-nails-primary`, `.btn-nails-secondary`, `.glass-nails`.

---

## 2. Tokens e Classes Criados / Modificados

### A. Salão de Beleza (Editorial / Luxo Silencioso)
- **Paleta de Superfícies & Acentos:**
  - `salon.linen` (`#FAF8F5`): Fundo principal linho/creme suave.
  - `salon.champagne` (`#FAF7F2`): Superfície de apoio e destaque sutil.
  - `salon.sand` (`#EAE3D9`): Borda refinada e divisórias delicadas.
  - `salon.bronze` (`#8C6A47`): Tipografia de destaque e elementos de prestígio.
  - `salon.gold` (`#A9855E`): Acentos de conversão e botões principais.
  - `salon.dark` (`#231F1C`): Superfície escura de contraste para chamadas de fechamento.
- **Sombras Difusas:**
  - `shadow-salon-card`: `0 10px 30px -4px rgba(60, 40, 20, 0.05), 0 2px 8px -2px rgba(60, 40, 20, 0.03)`.
  - `shadow-salon-hover`: `0 20px 40px -8px rgba(169, 133, 94, 0.14), 0 4px 12px -2px rgba(60, 40, 20, 0.04)`.
  - `shadow-salon-floating`: `0 12px 36px -6px rgba(140, 106, 71, 0.25)`.
- **Classes Utilitárias Reutilizáveis:**
  - `.badge-salon`: Badge em formato pílula com borda refinada e tracking largo.
  - `.card-salon`: Card branco com borda suave e elevação difusa.
  - `.btn-salon-primary` e `.btn-salon-secondary`: Botões em pílula com transições aveludadas.
  - `.glass-salon`: Efeito de vidro champanhe com `backdrop-blur-md`.

### B. Barbearia (Dark Premium / Barber Club)
- **Paleta de Superfícies & Acentos:**
  - `barber.pitch` (`#0D0D0D`): Fundo base de alto contraste.
  - `barber.charcoal` (`#121212`): Fundo principal escuro com calor sóbrio.
  - `barber.card` (`#171717`): Cartões e blocos de conteúdo com relevo escuro.
  - `barber.card-hover` (`#1F1F1F`): Estado ativo/hover de cartões.
  - `barber.border` (`#282828`): Borda sutil de metal escovado escuro.
  - `barber.border-light` (`#383838`): Borda de botões secundários e separadores.
  - `barber.gold` (`#C5A059`): Destaque em ouro envelhecido tradicional.
  - `barber.gold-light` (`#E0BE78`) e `gold-dark` (`#9E7B35`): Gradientes de combos VIP.
- **Sombras Escuras & Glows:**
  - `shadow-barber-card`: `0 12px 32px -6px rgba(0, 0, 0, 0.75), 0 0 1px 1px rgba(255, 255, 255, 0.05)`.
  - `shadow-barber-hover`: `0 16px 40px -8px rgba(0, 0, 0, 0.85), 0 0 1px 1px rgba(197, 160, 89, 0.35)`.
  - `shadow-barber-gold`: `0 0 30px -5px rgba(197, 160, 89, 0.2)`.
  - `shadow-barber-floating`: `0 12px 36px -6px rgba(0, 0, 0, 0.85), 0 0 2px 1px rgba(197, 160, 89, 0.4)`.
- **Classes Utilitárias Reutilizáveis:**
  - `.badge-barber`: Badge angulado com borda escura e tipografia âmbar/dourada em caixa alta.
  - `.card-barber`: Card de procedimento escuro com realce metálico no hover.
  - `.card-barber-combo`: Card VIP destacado com gradiente vertical escuro e borda dupla em ouro envelhecido.
  - `.btn-barber-primary` e `.btn-barber-secondary`: Botões estruturados com raios firmes (`rounded-lg`).
  - `.glass-barber`: Vidro fumê escuro com `backdrop-blur-md`.

### C. Unhas & Estética (Clean Luxury / Estética Refinada)
- **Paleta de Superfícies & Acentos:**
  - `nails.pure` (`#FCFAF9`): Fundo off-white com leve toque aquecido.
  - `nails.card` (`#FFFFFF`): Cartões brancos de máxima nitidez e limpeza.
  - `nails.petal` (`#FAF0ED`): Fundo de badges e destaques em rosé suave.
  - `nails.blush` (`#F5DDD7`): Seleção de texto e realces delicados.
  - `nails.border` (`#F2EAE7`): Borda tênue hipoalergênica.
  - `nails.border-focus` (`#ECC3B9`): Borda de foco e hover.
  - `nails.terracotta` (`#B75B4A`): Tom nobre de conversão e botões principais.
  - `nails.terracotta-dark` (`#944436`): Estado hover de alta legibilidade.
- **Sombras Leves de Pétala:**
  - `shadow-nails-card`: `0 10px 28px -4px rgba(183, 91, 74, 0.04), 0 2px 8px -2px rgba(0, 0, 0, 0.02)`.
  - `shadow-nails-hover`: `0 18px 36px -6px rgba(183, 91, 74, 0.12), 0 4px 12px -2px rgba(183, 91, 74, 0.04)`.
  - `shadow-nails-floating`: `0 12px 36px -6px rgba(183, 91, 74, 0.25)`.
- **Classes Utilitárias Reutilizáveis:**
  - `.badge-nails`: Badge em tom rosé com borda aveludada.
  - `.card-nails`: Card off-white limpo com borda hipoalergênica e sombra ultra-suave.
  - `.btn-nails-primary` e `.btn-nails-secondary`: Botões em formato pílula com acabamento terracota.
  - `.glass-nails`: Vidro cristalino com reflexo suave e calor rosé.

---

## 3. O que Foi Preservado

- [x] **Zero alterações nos componentes de templates atuais:** Nenhum template foi reescrito ou desestruturado nesta etapa.
- [x] **IDs das âncoras funcionais intactos:** `#topo`, `#servicos`, `#diferenciais`, `#galeria`, `#sobre`, `#localizacao` preservados.
- [x] **Landing page comercial principal (`/`) intacta:** As variáveis globais de `:root` (`--font-sans`, `--font-serif`, `--font-display`, `--background`, `--foreground`) continuam operando normalmente.
- [x] **Prevenção de zoom mobile no Safari/iOS:** A regra `input, select, textarea { font-size: 16px !important; }` foi preservada sem modificações.
- [x] **Supabase, RLS, banco de dados e contratos TypeScript:** Nenhuma migration, tabela ou coluna foi criada ou alterada.
- [x] **Painel Administrativo e Editor do Cliente:** Rotas `/admin`, `/app` e `/app/editor` permanecem inalteradas.
- [x] **Roteamento público `/p/[slug]`:** Todas as proteções de isolamento de tenants (suspensos e em rascunho) permanecem operando.

---

## 4. Testes Executados e Resultados

1. **TypeScript Type Check:**
   - Comando: `npx tsc --noEmit`
   - Resultado: **0 erros**. Compilação estrita aprovada.

2. **Testes Específicos dos Templates Públicos:**
   - Comando: `node --test tests/verify-phase3-salon.mjs tests/verify-phase4-barber.mjs tests/verify-phase5-nails.mjs tests/verify-phase10-landing-routes.mjs`
   - Resultado: **16 testes aprovados (100% de sucesso)**.
     - Componentes de Salão, Barbearia e Unhas intactos.
     - Formatação monetária BRL preservada.
     - URLs sanitizadas do WhatsApp preservadas.
     - Regras de prevenção de zoom no iOS confirmadas.
     - Cores `#121212`, `#C5A059`, `#FCFAF9` e `#F5DDD7` validadas.

3. **Bateria Geral de Testes:**
   - Comando: `node --test tests/*.mjs`
   - Resultado: **66 testes executados e 66 aprovados (100% pass)**.

4. **Build de Produção do Next.js:**
   - Comando: `npm run build`
   - Resultado: Compilação das 13 rotas estáticas e dinâmicas finalizada com sucesso (Exit code 0).

5. **Servidor de Desenvolvimento:**
   - Reativado em segundo plano e operacional em `http://localhost:3000`.

---

## 5. Possíveis Riscos e Mitigações para as Próximas Etapas

| Risco Potencial | Impacto | Mitigação Já Estabelecida |
| :--- | :--- | :--- |
| **Quebra de testes de asserção literal em arquivos específicos** | Alguns testes automatizados buscam strings literais como `#121212` em `BarberTemplate` e `#FCFAF9` em `NailsTemplate`. | Manter os tokens hexadecimais canônicos presentes nos componentes orquestradores (`index.tsx`) de cada template durante os redesigns das etapas 2, 3 e 4. |
| **Quebra dos links do menu de âncoras** | Se os IDs das seções forem alterados, o menu de navegação e os botões de atalho param de rolar até as seções correspondentes. | Manter rigorosamente os IDs `#topo`, `#servicos`, `#diferenciais`, `#galeria`, `#sobre`, `#localizacao` em todas as próximas etapas. |
| **Incompatibilidade com dados ausentes/opcionais** | Tenants reais podem não ter fotos na galeria ou equipe cadastrada. | Preservar as condicionais defensivas (`services.length === 0`, `gallery && gallery.length > 0 ? ... : defaultGallery`) implementadas no código atual. |


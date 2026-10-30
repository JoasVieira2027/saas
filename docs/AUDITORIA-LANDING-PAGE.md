# Auditoria Visual e de Conversão — Landing Page GlowSaaS

**Data:** 29/10/2026  
**Arquivo analisado:** `src/app/page.tsx` (780 linhas)  
**URL de produção:** `https://saas-lake-kappa-86.vercel.app/`  
**Escopo:** somente leitura — nenhum arquivo será alterado nesta etapa.

---

## Parte 1 — Diagnóstico da Landing Page Atual

### Estrutura existente (9 seções)

| # | Seção | Linhas | Observação rápida |
|---|-------|--------|-------------------|
| 1 | Header sticky | 47-95 | Compacto, com nav e CTA |
| 2 | Hero + browser mockup | 101-217 | Headline + preview do Lumière |
| 3 | Modelos (3 cards) | 222-397 | Salão, Barbearia, Nails |
| 4 | Benefícios (6 cards) | 402-478 | Grade 3×2 de recursos |
| 5 | Como Funciona (3 passos) | 483-523 | Numeração 01/02/03 |
| 6 | Planos (Starter + Pro) | 528-650 | R$ 97/mês e R$ 197/mês |
| 7 | FAQ (5 perguntas) | 655-713 | Accordion estático |
| 8 | CTA final | 718-742 | Chamada de encerramento |
| 9 | Footer | 748-777 | Links + copyright |

### O que já funciona bem

- **Paleta de cores coerente e sóbria.** Tons de bege/creme (`#FBF9F5`, `#EAE4DC`) com preto quase-puro (`#1C1917`) e dourado seco (`#8C5E32`). Não é genérico nem "colorido demais".
- **Tipografia com serifa nos títulos e sans nos parágrafos.** Dá um tom editorial correto para o nicho de beleza.
- **Browser mockup no Hero.** Mostra o produto real (Lumière Concept) em vez de uma ilustração genérica. Isso é bom para credibilidade.
- **Cards dos 3 modelos com links reais.** O visitante pode clicar e ver uma página de verdade funcionando — isso é o melhor argumento de venda.
- **Planos com preços claros e sem surpresas.** R$ 97 e R$ 197 com feature list. Transparente.
- **FAQ com perguntas reais.** Responde as objeções mais prováveis (comissões, autonomia, processo de contratação).
- **Responsividade básica.** O layout se adapta razoavelmente entre desktop e mobile.

---

## Parte 2 — Problemas Visuais e Comerciais Identificados

### 2.1 Tipografia e fontes

| Problema | Impacto | Detalhe |
|----------|---------|---------|
| **Fontes do sistema operacional** | ALTO | A página usa `Georgia` como serif e `-apple-system/Segoe UI` como sans. Cada visitante vê uma tipografia diferente dependendo do SO. Em Linux, a serif cai para Times New Roman — aspecto amador. |
| **Falta de fonte display para o logo** | MÉDIO | O `--font-display` está declarado no Tailwind mas nunca carregado. O logo "GlowSaaS" usa a mesma Georgia genérica do restante. |
| **Subtítulos e parágrafos muito pequenos** | MÉDIO | Textos de corpo com `text-xs` (12px) em desktop. Legível no monitor, mas frágil em telas com alto DPI e cansativo para leitura. |

### 2.2 Hero e primeira impressão

| Problema | Impacto | Detalhe |
|----------|---------|---------|
| **Headline genérica** | ALTO | "Sua página profissional, pronta para valorizar o seu trabalho" — funcional mas descartável. Não comunica resultado concreto nem diferencial. Poderia ser de qualquer SaaS de landing pages. |
| **Subtítulo denso demais** | MÉDIO | São 3 propostas em uma frase longa ("serviços com valores", "fotos reais", "agendamento no WhatsApp"). A atenção se dispersa. |
| **CTA principal diz "Solicitar criação da página"** | ALTO | O verbo "solicitar" passa a ideia de burocracia, processo lento, pedido que precisa ser aprovado. Pouco incentivo a clicar. |
| **Mockup do browser é estático e flat** | MÉDIO | O preview ocupa bastante espaço vertical mas parece um print estático de tela. Não tem profundidade nem destaque visual. Em celular, o mockup fica comprimido e perde legibilidade. |
| **Imagem do Hero é repetida na seção de modelos** | BAIXO | A mesma foto do Unsplash (`photo-1560066984-138dadb4c035`) aparece no mockup do Hero E no card do modelo de Salão. Parece reutilização preguiçosa. |

### 2.3 Seção de Modelos

| Problema | Impacto | Detalhe |
|----------|---------|---------|
| **Fotos genéricas do Unsplash** | ALTO | As imagens são bonitas mas claramente de banco. O visitante reconhece instantaneamente. Não mostram o sistema real. O ideal seria screenshot/mockup de cada template. |
| **Cards muito uniformes** | MÉDIO | Os 3 cards são visualmente idênticos (mesma cor, mesma estrutura). Não há diferenciação visual que reforce a identidade de cada segmento (masculina para barbearia, delicada para nails, luxo para salão). |
| **Feature list repetitiva entre os cards** | BAIXO | Os checkmarks são variações do mesmo conceito (preço, galeria, WhatsApp). Não há diferenciação clara de por que cada modelo existe. |

### 2.4 Seção de Benefícios

| Problema | Impacto | Detalhe |
|----------|---------|---------|
| **Grade 3×2 com 6 cards iguais** | MÉDIO | Todas as caixas têm exatamente o mesmo tamanho, peso visual e estilo. Nenhum benefício se destaca como principal. É uma lista, não uma hierarquia. |
| **Benefícios são features, não resultados** | ALTO | "Catálogo com Preço e Duração" é uma feature. O resultado é: "Pare de responder 'quanto custa' 30 vezes por dia no WhatsApp". A linguagem fala para desenvolvedores, não para cabeleireiras. |
| **Sem nenhum elemento visual ou dado concreto** | MÉDIO | Nenhum número, screenshot, comparação antes/depois, depoimento ou dado. É puro texto descritivo. |

### 2.5 Seção Como Funciona

| Problema | Impacto | Detalhe |
|----------|---------|---------|
| **Etapas são corretas mas frias** | BAIXO | 01 → 02 → 03 funciona. Mas é visualmente seco — 3 blocos de texto sem nenhuma imagem, ícone contextual ou exemplo visual. |
| **Não há conector visual entre os passos** | BAIXO | Nada indica sequência (linha, seta, progresso). São 3 blocos soltos numa grade. |

### 2.6 Seção de Planos

| Problema | Impacto | Detalhe |
|----------|---------|---------|
| **CTA do Starter é passivo** | MÉDIO | "Solicitar ativação" com fundo branco, sem preenchimento. Parece botão secundário desabilitado. |
| **Diferenciação entre planos é fraca** | MÉDIO | O Pro tem tudo do Starter + 3 itens ("ilimitados", "galeria expandida", "suporte prioritário"). A diferença de R$ 100/mês não parece justificada. |
| **Sem indicação de período de teste** | MÉDIO | Não menciona se existe trial, garantia de satisfação ou cancelamento fácil. Isso é objeção forte para profissional autônomo. |

### 2.7 FAQ

| Problema | Impacto | Detalhe |
|----------|---------|---------|
| **Perguntas estáticas sem accordion** | BAIXO | Todas as respostas estão abertas simultaneamente. Funciona com 5 perguntas, mas ocupa muito espaço vertical sem necessidade. |
| **Falta pergunta sobre cancelamento** | MÉDIO | A objeção principal do público-alvo (cabeleireiras autônomas) é "e se eu quiser cancelar?". Não está respondida. |

### 2.8 CTA Final e Footer

| Problema | Impacto | Detalhe |
|----------|---------|---------|
| **CTA final sem urgência ou diferencial** | MÉDIO | "Pronto para transformar a apresentação do seu espaço?" — mesma energia da headline. Sem novo argumento, dado ou incentivo. |
| **Botão "Acessar painel do cliente"** no CTA final | BAIXO | Mistura prospecto com cliente existente na mesma seção. Dilui a ação principal. |

### 2.9 Problemas estruturais e técnicos

| Problema | Impacto | Detalhe |
|----------|---------|---------|
| **780 linhas em um único arquivo** | MANUTENÇÃO | Todo o código da landing page está em `page.tsx`. Qualquer ajuste exige navegar centenas de linhas. Sem componentização. |
| **Sem Open Graph / social preview** | MÉDIO | O metadata tem title e description mas falta `og:image`, `twitter:card` etc. Links compartilhados no Instagram/WhatsApp ficam sem preview. |
| **Sem favicon customizado** | BAIXO | Usa o default do Next.js. |
| **Inconsistência de design com `/comecar`** | MÉDIO | A landing page (`/`) usa tema claro (bege). A página `/comecar` usa tema escuro (neutral-950) com gradientes amber. A transição é brusca — parecem dois produtos diferentes. |
| **Sem depoimentos ou prova social** | ALTO | Nenhum depoimento, caso de uso, número de clientes ou logo de parceiro. Para um SaaS que quer parecer consolidado, isso é a lacuna mais grave. |

---

## Parte 3 — O Que Remover, Manter e Melhorar

### ✅ Manter como está

- Paleta de cores geral (bege/creme + preto + dourado seco)
- Estrutura de seções (Hero → Modelos → Benefícios → Processo → Planos → FAQ → CTA)
- Preview com browser mockup no Hero (conceito bom, execução a melhorar)
- Links reais para os modelos ao vivo
- Transparência de preços
- Responsividade CSS base
- Tema editorial (serifa + sans)

### ❌ Remover ou substituir

- Imagem repetida entre Hero e card do Salão
- Textos com `text-xs` como corpo de leitura em desktop
- CTA "Solicitar criação da página" (verbo passivo)
- Botão "Acessar painel do cliente" dentro do CTA final (mover para footer ou header)
- Uniformidade visual total entre os 3 cards de modelo

### 🔧 Melhorar

- Headline → focar em resultado concreto para o profissional
- Subtítulo → mais curto, com uma proposta clara
- Browser mockup → mais profundidade, talvez com sombra realista e tamanho melhor em mobile
- Cards de modelo → screenshots reais ou mockups dos templates em vez de fotos Unsplash
- Benefícios → linguagem de resultados, não de features técnicas
- Benefícios → destaque visual para 2-3 principais em vez de 6 iguais
- Passos → adicionar ícones ou imagens contextuais
- Planos → CTA mais forte no Starter, justificar melhor a diferença do Pro
- FAQ → accordion interativo
- CTA final → novo argumento (ex: "7 dias para avaliar, sem compromisso")
- Prova social → adicionar seção de depoimentos (mesmo que inicial)

---

## Parte 4 — Estrutura Recomendada

### Ordem das seções (revisada)

```
1. Header — logo, nav, "Entrar", CTA "Criar minha página"
2. Hero — headline de resultado, subtítulo curto, 2 CTAs, browser mockup melhorado
3. Prova social leve — "Já utilizado por X profissionais" ou logos/avatares
4. Modelos — 3 cards com screenshots dos templates reais, diferenciação visual por segmento
5. Benefícios — 3 principais destacados + 3 secundários menores, linguagem de resultado
6. Como Funciona — 3 etapas com ícones, conectores visuais e exemplos
7. Planos — Starter e Pro com CTAs fortes, menção a garantia/cancelamento
8. Depoimentos — 2-3 testemunhos com foto, nome e segmento (pode ser fictício inicialmente)
9. FAQ — accordion interativo com 5-6 perguntas
10. CTA final — argumento diferente do Hero, com urgência leve
11. Footer — copyright, links de navegação, link para login
```

### Mudanças de conteúdo prioritárias

**Headline atual:**
> "Sua página profissional, pronta para valorizar o seu trabalho."

**Sugestões de headline (escolher uma):**
1. "Seus clientes já estão no WhatsApp. Agora, a sua tabela de serviços também."
2. "A página que faltava entre o seu Instagram e o agendamento."
3. "Tabela de serviços, galeria e agendamento por WhatsApp — tudo em uma página profissional feita para o seu negócio."

**CTA principal atual:**
> "Solicitar criação da página"

**Sugestão de CTA:**
> "Criar minha página" ou "Começar agora — 7 dias grátis"

---

## Parte 5 — Direção Visual Recomendada

### Identidade a transmitir

- **Profissional e confiável** — não experimental, não "startup", não "gerado por IA"
- **Limpo e organizado** — espaçamento generoso, pouca decoração
- **Elegante mas acessível** — o público são profissionais autônomos, não empresas tech

### Tipografia

| Elemento | Recomendação |
|----------|-------------|
| Títulos (h1, h2) | Carregar uma serifa real via Google Fonts: **Playfair Display**, **DM Serif Display** ou **Lora**. Peso 400-500. |
| Corpo de texto | **Inter** ou **DM Sans**. Tamanho mínimo 14px em desktop (nunca `text-xs` para parágrafos). |
| Logo "GlowSaaS" | Font weight bold na mesma serifa dos títulos. Não precisa de fonte separada. |
| Monospace (URLs) | Manter o `font-mono` do sistema, está OK para o browser mockup. |

### Cores

Manter a paleta atual com ajustes de contraste:

| Uso | Cor atual | Ajuste sugerido |
|-----|-----------|----------------|
| Background | `#FBF9F5` | ✅ Manter |
| Texto principal | `#1C1917` | ✅ Manter |
| Texto secundário | `#57534E` | Subir levemente para `#44403C` — melhor contraste WCAG |
| Accent dourado | `#8C5E32` | ✅ Manter — funciona bem para badges e ícones |
| CTA principal | `#1C1917` (preto) | ✅ Manter — sóbrio e profissional |
| Bordas | `#DDD7CD` / `#EAE4DC` | ✅ Manter |

### Espaçamento e layout

- **Max-width**: manter `max-w-6xl` (1152px)
- **Padding vertical de seção**: aumentar de `py-16 sm:py-24` para `py-20 sm:py-28` — mais respiro
- **Gap entre cards**: manter `gap-6` para cards de modelo, considerar `gap-8` para benefícios
- **Textos de corpo**: mínimo `text-sm` (14px) em desktop, nunca `text-xs` exceto labels e metadados

### Imagens

- **Substituir fotos genéricas Unsplash nos cards de modelo** por screenshots ou mockups dos templates reais em viewport de celular. Isso mostra o produto de verdade.
- **Manter a foto Unsplash no browser mockup do Hero** — contextualiza o ambiente do salão.
- **Não duplicar imagens** entre seções.

### O que NÃO adicionar

- Gradientes elaborados ou backgrounds com blur
- Animações de entrada (fade-in, slide-up) — peso desnecessário
- Partículas, confetti, sparkles animados
- Cards com sombras enormes ou efeitos 3D
- Ilustrações abstratas estilo "startup landing page"
- Carrosséis automáticos

---

## Parte 6 — Melhorias Prioritárias por Impacto na Conversão

### Prioridade 1 — Impacto direto na taxa de conversão

| # | Melhoria | Justificativa |
|---|----------|---------------|
| **P1.1** | Reescrever headline e subtítulo com foco em resultado | É a primeira coisa que o visitante lê. Determina se continua scrollando. |
| **P1.2** | Trocar CTA "Solicitar criação da página" por ação direta | Verbo passivo → verbo ativo. Reduz percepção de atrito. |
| **P1.3** | Adicionar seção de prova social (depoimentos ou números) | A ausência total de prova social é a maior barreira de confiança. |
| **P1.4** | Reescrever benefícios como resultados, não features | O público-alvo precisa se identificar com o problema, não com a funcionalidade. |

### Prioridade 2 — Qualidade visual e profissionalismo

| # | Melhoria | Justificativa |
|---|----------|---------------|
| **P2.1** | Carregar fontes profissionais (Google Fonts) | Elimina a inconsistência entre navegadores/SO e sobe o nível percebido. |
| **P2.2** | Aumentar tamanhos mínimos de texto de `text-xs` para `text-sm` | Melhora legibilidade e percepção de qualidade. |
| **P2.3** | Substituir fotos Unsplash dos cards por screenshots dos templates | Mostra o produto real. É a prova mais direta de valor. |
| **P2.4** | Dar identidade visual distinta a cada card de modelo | Reforça que cada template é pensado para um segmento diferente. |

### Prioridade 3 — Polimentos de UX e objections handling

| # | Melhoria | Justificativa |
|---|----------|---------------|
| **P3.1** | Adicionar menção a garantia/cancelamento na seção de planos | Reduz objeção de compromisso financeiro. |
| **P3.2** | FAQ com accordion interativo | Reduz scroll e melhora escaneabilidade. |
| **P3.3** | CTA final com argumento diferente do Hero | Evita repetição. O visitante que chegou até aqui precisa de um "empurrão" diferente. |
| **P3.4** | Harmonizar visual de `/comecar` com a landing page | Transição brusca claro→escuro quebra a confiança e parece outro site. |
| **P3.5** | Adicionar Open Graph metadata com imagem social | Links compartilhados no WhatsApp/Instagram ficam com preview atrativo. |

---

## Parte 7 — Plano de Implementação em Etapas Seguras

Cada etapa é independente, pode ser testada e revertida sem afetar funcionalidades.

### Etapa 1 — Tipografia e tamanhos de texto
**Risco:** nenhum | **Impacto visual:** alto | **Arquivos:** `layout.tsx`, `globals.css`, `page.tsx`

- Instalar fontes via `next/font/google` (ex: Playfair Display + Inter)
- Atualizar variáveis CSS `--font-serif` e `--font-sans`
- Substituir todas as ocorrências de `text-xs` em parágrafos por `text-sm`
- Verificar que os templates de salão/barbearia/nails não são afetados

### Etapa 2 — Reescrita de textos comerciais
**Risco:** nenhum | **Impacto na conversão:** alto | **Arquivos:** `page.tsx`

- Headline com foco em resultado
- Subtítulo mais curto e direto
- CTAs com verbos ativos
- Benefícios reescritos como problemas resolvidos
- Sem alteração de estrutura HTML

### Etapa 3 — Seção de prova social
**Risco:** baixo | **Impacto na conversão:** alto | **Arquivos:** `page.tsx`

- Adicionar seção entre Hero e Modelos com 2-3 depoimentos
- Pode ser dados iniciais do próprio fundador ou clientes beta
- Layout simples: citação + nome + segmento + foto (avatar)

### Etapa 4 — Cards de modelo com screenshots reais
**Risco:** baixo | **Impacto visual:** alto | **Arquivos:** `page.tsx`, imagens novas

- Capturar screenshots dos 3 templates reais em viewport mobile
- Substituir fotos Unsplash nos cards por esses screenshots
- Manter as fotos Unsplash apenas no browser mockup do Hero e nos templates

### Etapa 5 — Componentização
**Risco:** nenhum (refactor) | **Impacto:** manutenção | **Arquivos:** novos componentes

- Extrair cada seção em componente separado: `HeroSection`, `ModelsSection`, `BenefitsSection`, `StepsSection`, `PricingSection`, `FAQSection`, `CTASection`
- Manter `page.tsx` como composição limpa
- Reduz o arquivo de 780 linhas para ~50

### Etapa 6 — FAQ interativo e polimentos
**Risco:** baixo | **Impacto:** médio | **Arquivos:** `page.tsx` ou componente FAQ

- Converter FAQ para accordion com `<details>`/`<summary>` nativos (sem JavaScript extra)
- Adicionar pergunta sobre cancelamento
- Melhorar espaçamento vertical entre seções

### Etapa 7 — Harmonização da página `/comecar`
**Risco:** baixo | **Impacto:** médio | **Arquivos:** `comecar/page.tsx`

- Migrar de tema escuro para tema claro (mesma paleta da landing page)
- Manter a estrutura do formulário
- Unificar botões e tipografia com a landing page

### Etapa 8 — Metadata social (Open Graph)
**Risco:** nenhum | **Impacto:** médio | **Arquivos:** `page.tsx` (metadata), imagem OG

- Gerar imagem OG (1200×630) com logotipo e tagline
- Adicionar `openGraph` e `twitter` no objeto metadata
- Testar com validador do Facebook e Twitter

---

## Resumo Executivo

A landing page atual tem uma **boa base estrutural e uma paleta de cores acertada**. A organização em seções lógicas (Hero → Modelos → Benefícios → Planos → FAQ) segue o padrão esperado de um SaaS.

Os **3 problemas mais graves** que impedem a conversão são:

1. **Ausência total de prova social.** Sem depoimentos, números ou casos reais, o visitante não tem razão para confiar.
2. **Textos descrevem features em vez de resolver problemas.** O público-alvo (cabeleireiras, barbeiros, nail designers) precisa se identificar com a dor, não com a funcionalidade técnica.
3. **Tipografia genérica do sistema operacional.** A fonte muda entre Windows, Mac e Linux. Isso quebra a consistência visual e reduz a percepção de profissionalismo.

A correção pode ser feita em **8 etapas independentes**, começando pela tipografia e reescrita de textos (maior impacto, menor risco).


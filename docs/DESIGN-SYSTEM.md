# Mente em Paz — Design System para o Portal

**Direção visual:** Refúgio Sereno · **Versão:** 1.1 (out/2026)
**Fonte da verdade:** o site de vendas (`github.com/davvidzy/mente-em-paz`). Todos os valores abaixo são os mesmos usados em produção. Em caso de dúvida, o código do site vence este documento.

> **Para quem vai implementar o portal:** use os tokens exatamente como estão (seção 9 tem o CSS pronto para colar). Não crie cores, fontes ou raios novos. Componentes que o site ainda não tem (formulários, navegação do portal etc.) estão na seção 7, marcados como **extensão para o portal**: seguem as mesmas regras, mas ainda não foram usados no site.

---

## 1. Essência da marca

O **Mente em Paz** é um método digital de descanso noturno para **mulheres adultas que cuidam dos pais idosos**: muita carga mental, preocupação constante, culpa ao tirar um tempo para si e dificuldade de desacelerar à noite.

O portal é onde ela **usa** o produto (áudios guiados, caderno, checklist, guia). A interface precisa parecer um lugar calmo e seguro, que ela queira abrir à noite.

| A interface deve transmitir | Evitar |
|---|---|
| Tranquilidade, acolhimento, confiança | Aparência hospitalar ou clínica |
| Sofisticação discreta, leveza | Design corporativo frio |
| Sensação de pausa e descanso | Gradientes chamativos, brilhos, neon |
| Simplicidade (nada para "aprender a usar") | Elementos piscando, contadores, pressa |
| Respiro: muito espaço em branco | Layouts apertados, excesso de informação |
| | Excesso de emojis, clichês de spa, espiritualidade excessiva |

**Regra central:** espaçamento generoso é parte da identidade, não um detalhe. A calma começa na diagramação.

---

## 2. Cores

### 2.1 Tokens

| Token | HEX | Nome | Uso |
|---|---|---|---|
| `brand` | `#253E43` | verde-petróleo | Texto principal, títulos, botão primário, ícones fortes |
| `brand-deep` | `#192F33` | verde profundo | Hover do botão primário, rodapé, áreas escuras |
| `sage` | `#A5B9A9` | sálvia | **Só decorativo**: fundos suaves (com opacidade), linhas, detalhes. Nunca texto pequeno sobre creme |
| `sage-deep` | `#58736D` | sálvia escuro | Texto secundário, legendas, ícones, eyebrows |
| `sage-ink` | `#516B65` | sálvia tinta (derivado) | Texto secundário **sobre o fundo areia** (`surface`), para manter AA |
| `accent` | `#D7B6A7` | rosé-terra | Acentos afetivos pontuais: pontinhos, aspas, barra de progresso de vídeo, pequenos traços |
| `canvas` | `#F8F5EF` | creme | **Fundo principal** de todas as telas |
| `surface` | `#F0EAE1` | areia suave | Fundo alternado de seções, caixas de destaque |
| `line` | `#DED9D0` | borda natural | Bordas de cards, divisórias, trilhas de progresso |
| `white` | `#FFFFFF` | branco | Fundo de cards, texto sobre `brand` |

**Cor exclusiva da logo:** `#7D947C` (sálvia da arte original) aparece **só** no "+" e na folha do símbolo. Não use como cor de interface.

**Proporção orientativa:** cerca de 55% creme, 25% petróleo, 12% sálvia e 8% rosé. É uma referência, não uma regra por tela.

### 2.2 Opacidades em uso no site
- `sage/30`: fundo dos círculos de ícone (ex.: benefícios, passos).
- `sage/15–40`: fundos de check e selos suaves.
- `brand-deep/55` + `backdrop-blur(2px)`: overlay de modal.
- `white/75–95`: cards translúcidos sobre fundo com arte.
- `white/60–80`: texto secundário sobre fundo `brand` / `brand-deep`.

### 2.3 Contraste (WCAG)

| Texto / Fundo | Razão | Uso permitido |
|---|---|---|
| `brand` / `canvas` | 10,4 : 1 | Qualquer texto |
| `brand` / `white` | 11,4 : 1 | Qualquer texto |
| `white` / `brand` | 11,4 : 1 | Qualquer texto |
| `sage-deep` / `canvas` | 4,7 : 1 | Texto secundário (AA) |
| `sage-deep` / `white` | 5,1 : 1 | Texto secundário (AA) |
| `sage-deep` / `surface` | 4,3 : 1 ❌ | **Não** usar em texto pequeno; use `sage-ink` |
| `sage-ink` / `surface` | 4,8 : 1 | Texto secundário sobre areia (AA) |
| `sage` / `brand` | 5,5 : 1 | Texto de apoio sobre fundo escuro |
| `sage` / `canvas` | ~1,9 : 1 ❌ | Nunca como texto |

### 2.4 Modo escuro
O site **não tem** modo escuro, e a marca é clara por definição. Se o portal quiser um "modo noite", use `brand-deep` como fundo, `brand` como superfície, `canvas` como texto e `sage` como texto secundário. Valide o contraste antes de publicar e trate como extensão, não como padrão.

---

## 3. Tipografia

### 3.1 Famílias

| Papel | Família | Pesos | Uso |
|---|---|---|---|
| Títulos | **Lora** (serifada) | 500, 600 | H1, H2, H3, frases emocionais, nomes de planos, preços |
| Interface e texto | **DM Sans** | 400, 500, 600 | Parágrafos, botões, labels, menus, formulários, tudo de UI |

- Carregamento no site: **auto-hospedado** via `@fontsource-variable/lora` e `@fontsource-variable/dm-sans` (sem requisição ao Google; melhor para LGPD e performance). Alternativa: Google Fonts com `display=swap`.
- Fallbacks: `Lora → Georgia, "Times New Roman", serif` · `DM Sans → system-ui, -apple-system, "Segoe UI", sans-serif`.

### 3.2 Escala

| Estilo | Família / peso | Tamanho (fluido) | Entrelinha | Espaçamento |
|---|---|---|---|---|
| **H1** | Lora 600 | `clamp(32px, 2.4vw + 22px, 44px)` | 1.17 (hero: 1.24) | -0.012em |
| **H2** | Lora 600 | `clamp(27px, 1.1vw + 22px, 34px)` | 1.2 | -0.01em |
| **H3** | Lora 500 | `clamp(21px, 0.4vw + 20px, 24px)` | 1.25 | — |
| **Corpo** | DM Sans 400 | 16px (mobile) / 18px (≥ 768px) | 1.65 | — |
| **Corpo destaque** | DM Sans 400 | 17px / 18px | 1.6–1.7 | — |
| **Pequeno** | DM Sans 400 | 14px | 1.55 | — |
| **Eyebrow** | DM Sans 600, CAIXA ALTA | 13px (12px em telas < 360px) | — | 0.12em (0.08em < 360px) |
| **Botão** | DM Sans 600 | 16px | 1.375 | — |
| **Legal / rodapé** | DM Sans 400 | 12–13.5px | 1.5 | — |
| **Preço** | Lora 600 | 52px (centavos 24px, "R$" 20px) | 1 | -0.02em |

### 3.3 Regras
- Títulos com `text-wrap: balance`; parágrafos com `text-wrap: pretty`.
- Texto longo **alinhado à esquerda**. Centralizar só títulos curtos e blocos de 1 a 3 linhas.
- Largura de leitura máxima: **740px** (≈ 60–70 caracteres por linha).
- **Destaque em títulos:** em vez de itálico ou marca-texto, a segunda frase muda de tom (`sage-deep`) e começa em nova linha. Ex.: "Você cuida de quem ama. / *Agora é hora de cuidar de você.*" (a parte após a barra em `sage-deep`).
- Negrito no corpo só para o nome do produto ou uma palavra-chave por parágrafo (DM Sans 600, cor `brand`).
- Números tabulares (`font-variant-numeric: tabular-nums`) em tempos, contadores e progresso.

---

## 4. Layout e espaçamento

### 4.1 Grid e container

| Faixa | Margem lateral (`--page-gutter`) | Espaço entre seções (`--section-space`) | Entre blocos (`--block-space`) |
|---|---|---|---|
| Mobile (< 768px) | **24px** (mínimo excepcional 16px) | 76px | 28px |
| Tablet (768–1279px) | `clamp(40px, 6vw, 64px)` | `clamp(80px, 10vw, 104px)` | 40px |
| Desktop (≥ 1280px) | `clamp(80px, 7vw, 120px)` | `clamp(112px, 9vw, 136px)` | 44px |

- **Container:** `width: min(100% - 2 × gutter, 1120px)`, centralizado.
- **Leitura:** `max-width: 740px`.
- **Telas de foco** (uma tarefa só, como o quiz ou o player): coluna de `max-width: 560px`.
- **Mobile-first sempre:** desenhar em 375px e depois testar 320, 360, 390 e 430, então 768, 1024 e 1440. **Nenhuma rolagem horizontal** em nenhuma largura.
- Base de espaçamento: **8px** (múltiplos de 4 para ajustes finos).

### 4.2 Ritmo
- Fundo alternado entre seções: `canvas` → `surface` → `canvas`… Seções de fechamento/CTA podem usar `brand` (escuro).
- Hero e telas de entrada: muito respiro vertical (mobile 56–72px no topo; desktop 96–136px).

### 4.3 Raios

| Elemento | Raio |
|---|---|
| Botão (md) | 12px (`--radius-btn`) |
| Botão grande (lg) | 14px |
| Card / opção / input | 16px (`--radius-card`) |
| Card de plano, player de vídeo | 20px |
| Modal | 24px (no mobile, só cantos superiores: bottom sheet) |
| Foto da especialista | 18px (mobile) / 24px (desktop) |
| Pílulas, selos, avatares, botões de ícone | 9999px |

### 4.4 Sombras (sempre muito suaves)

| Token | Valor | Uso |
|---|---|---|
| `--shadow-soft` | `0 1px 2px rgb(37 62 67 / .04), 0 8px 24px -12px rgb(37 62 67 / .12)` | Cards em hover, opção selecionada, caixas de destaque |
| `--shadow-lift` | `0 2px 4px rgb(37 62 67 / .05), 0 18px 40px -20px rgb(37 62 67 / .25)` | Modal, card em destaque (plano recomendado), avisos flutuantes |
| Botão primário | `0 10px 24px -14px rgb(25 47 51 / .7)` (hover: `0 14px 30px -14px … / .75`) | Só no CTA principal |

Nunca usar sombras pretas duras, brilhos externos ou bordas luminosas.

---

## 5. Movimento

- Curva padrão: **`cubic-bezier(0.22, 0.61, 0.36, 1)`** (`--ease-calm`).
- **Entrada de tela/bloco:** fade + subir 10px, 520ms.
- **Revelar ao rolar:** fade + subir 14px, 700ms, uma única vez (IntersectionObserver).
- **Fade simples:** 400ms (overlays, avisos).
- **Hover/estado:** 200–300ms em cor, borda e sombra. Botão pressionado: `scale(0.985)`.
- **"Respiração"** (indicador de carregamento/áudio tocando): escala 0.92 → 1.06, 2.4s, em loop.
- Carrossel infinito: linear, pausa no hover/foco.
- **`prefers-reduced-motion: reduce` é obrigatório:** desligar animações e transições, e o carrossel vira rolagem manual.
- Nada de bounce, parallax pesado, piscar ou animação que distraia da leitura.

---

## 6. Iconografia e imagens

### 6.1 Ícones
- Biblioteca: **Lucide** (`lucide-react` no site). Lineares, pontas arredondadas.
- Traço: **1.5–1.8** para ícones de conteúdo; **2–3** só em micro-ícones (check dentro de círculo, setas de botão).
- Tamanhos: 16px (inline), 18–20px (botões/listas), 22–24px (cards), 36–48px (ilustrativos).
- Ícone de conteúdo costuma ficar dentro de um **círculo `sage/30`** (36–48px) ou quadrado arredondado com borda `line` e fundo `canvas`.
- Ícones decorativos sempre com `aria-hidden`.

Ícones já usados no site (para manter o vocabulário): `ShieldCheck` (garantia), `Infinity` (vitalício), `BadgeCheck` (pagamento único), `Repeat` (reutilizável), `MoonStar` (noite), `Headphones` (áudio), `NotebookPen` (caderno), `ListChecks` (checklist), `BookOpen` (guia), `Play`/`Pause`/`RotateCcw` (players), `Check`, `ArrowRight`, `ChevronLeft`, `Plus` (accordion), `X` (fechar), `UserRound` (avatar vazio), `Sparkles` (benefício).

### 6.2 Fotografia e ilustração
- Mulheres adultas reais, ambientes domésticos plausíveis, **luz quente e suave**, fim de dia: lençóis, linho, caderno, chá, luminária, sofá.
- Expressões de pausa e acolhimento, nunca sorrisos forçados.
- Ilustração: botânica sutil, formas orgânicas, poucos elementos.
- Arte de fundo do site: **círculos e lua em linha fina** (traço 0.3–0.8px na cor `line`, `accent/45` ou `white/6` sobre escuro).
- **Evitar:** meditação posada, hospital, excesso de luas e estrelas, imagens escuras ou saturadas.
- Formato: WebP em 2 larguras (400/800) com `srcset`, `width`/`height` declarados e `loading="lazy"` abaixo da dobra.

---

## 7. Componentes

> Os tamanhos de toque são de **no mínimo 44px** em tudo que é clicável. O foco visível é obrigatório (ver seção 8).

### 7.1 Botões

| Variante | Visual | Quando usar |
|---|---|---|
| **Primário** | Fundo `brand`, texto branco, sombra suave; hover `brand-deep` | A ação principal da tela (uma por tela, idealmente) |
| **Secundário** | Fundo `canvas`, borda 1px `brand`, texto `brand`; hover fundo branco | Ação alternativa (ex.: plano Essencial) |
| **Claro** | Fundo `canvas`, texto `brand`, sombra; para fundos escuros | CTA sobre fundo `brand` |
| **Ghost** | Só texto `brand`, sublinhado no hover | Ação terciária ("Prefiro continuar…", "Voltar") |
| **Contorno pequeno** | Borda `brand/80`, texto `brand`, 15px; hover inverte (fundo `brand`) | Header ("Ver planos") |

| Tamanho | Altura mín. | Padding | Raio | Texto |
|---|---|---|---|---|
| md | 48px | 24px × 12px | 12px | DM Sans 600 16px |
| lg | 56px | 20px (mobile) / 36px (≥ 640px) × 14px | 14px | DM Sans 600 16px |

- Seta `ArrowRight` 18px à direita nos CTAs de avanço; desloca 2px no hover.
- **Texto do CTA em uma linha no mobile**: texto curto e direto ("Quero descansar melhor").
- Botão cheio (`width: 100%`) no mobile para CTAs principais; `max-width` 400–460px no desktop.
- Desabilitado: opacidade 55%, cursor `not-allowed`, e o rótulo explica o motivo (ex.: "Checkout em configuração").

### 7.2 Cards
- Fundo `white`, borda 1px `line`, raio 16px, **sem sombra** (ou `shadow-soft`).
- Padding: 20px (mobile) → 28px (desktop). Abaixo de 360px: 16px.
- Hover em cards clicáveis: subir 2px + `shadow-soft`.
- **Card de destaque** (ex.: plano recomendado): borda 1.5px `brand`, `shadow-lift`, raio 20px, selo em pílula `brand` sobreposto à borda superior (`-14px`), texto branco 12.5px 600.
- **Caixa suave** (informação contextual): fundo `surface`, sem borda, raio 16px, padding 20px.

### 7.3 Opções de escolha (quiz / seleção única)
- Botão de largura total, `min-height` 64px, raio 16px, padding 20px × 16px, texto DM Sans 16.5–17px.
- Repouso: fundo `white/70`, borda `line`. Hover: borda `sage-deep/60`, fundo branco.
- Selecionado: borda `brand`, fundo branco, `shadow-soft`, marcador circular 24px preenchido `brand` com check branco. Sem cores de "certo/errado".
- Espaço entre opções: 12px. No máximo 4 opções por pergunta. Avanço automático após ~220ms.

### 7.4 Progresso
- Trilha 4px, raio total, `line/80`; preenchimento `brand`; transição de largura 500ms `ease-calm`.
- Rótulo ao lado: DM Sans 500 14px `sage-deep`, números tabulares ("1 de 3").

### 7.5 Eyebrow / rótulo de seção
- DM Sans 600, 13px, CAIXA ALTA, tracking 0.12em, `sage-deep`. **Sempre uma linha** no mobile (≤ 30 caracteres).

### 7.6 Lista com check
- Círculo 20px (`sage/40` com check `brand`, ou `brand` com check branco no item em destaque), ícone `Check` 12px traço 3; gap 12px; texto 16px.

### 7.7 Selos e pílulas
- Pílula informativa: borda `line`, fundo `white/70`, texto 14px `sage-deep`, padding 8px × 16px, com ponto `accent` de 6px.
- Selo sólido: fundo `brand`, texto branco 12–12.5px 600, padding 4px × 12px.
- Selo "provisório/rascunho": borda tracejada `sage-deep/50`, texto 12px 600 caixa alta.

### 7.8 Accordion (FAQ)
- Itens separados por divisórias `line` (borda em cima e embaixo do bloco).
- Botão da pergunta: `min-height` 64px, DM Sans 500 17–18px `brand`; ícone `Plus` em círculo 32px (borda `line`) que gira 45° e fica `brand` cheio quando aberto.
- Resposta: 16–18px `sage-deep`, abre com animação de altura (`grid-template-rows: 0fr → 1fr`, 400ms). Uma aberta por vez. `aria-expanded` / `aria-controls`.

### 7.9 Modal
- Overlay `brand-deep/55` + blur 2px. Painel `canvas`, `shadow-lift`, `max-width` 540px, raio 24px; **no mobile vira bottom sheet** (encosta embaixo, só cantos superiores arredondados, `max-height` 92dvh com rolagem interna).
- Botão fechar: 44px, círculo, ícone `X` 20px `sage-deep`, canto superior direito.
- Foco preso dentro, `Esc` fecha, scroll de fundo bloqueado, foco volta ao elemento de origem.
- Ordem: símbolo da marca 44px → título Lora 500 23–26px → texto 16.5px `sage-deep` → conteúdo → CTA primário cheio → ação ghost.

### 7.10 Aviso flutuante (toast)
- Topo, centralizado, `max-width` 448px; card branco, borda `accent`, `shadow-lift`, raio 16px; ícone 20px `sage-deep`; título 15px 600 + texto 14px `sage-deep`; fecha sozinho em ~7s e tem botão de fechar.

### 7.11 Aviso de cookies
- Barra inferior com margem de 12–20px, card `white/95` com blur, borda `line`, `shadow-lift`; texto 14px; botões "Recusar" (contorno `line`) e "Aceitar" (primário), 44px de altura.

### 7.12 Player de áudio (essencial para o portal)
- Card branco (borda `line`, raio 16px, padding 16–20px), layout horizontal.
- **Botão play/pause:** círculo 56px `brand`, ícones `Play`/`Pause` preenchidos 20px brancos. Tocando: anel `sage` 1px em volta com animação de "respiração".
- Título do áudio: DM Sans 500 15px, truncado em uma linha.
- Barra: trilha 4px `line`, progresso `brand`, "thumb" 14px `brand` com borda branca 2px.
- Tempos: 13px `sage-deep`, números tabulares (atual à esquerda, duração à direita).
- Acessível: botão com `aria-label` ("Reproduzir áudio"/"Pausar áudio"), slider com `aria-valuetext` ("1:20 de 8:05").

### 7.13 Player de vídeo
- Raio 20px, fundo `brand-deep`, `shadow-lift`. Vertical 9:16 com `max-width` 360px, ou 16:9 com largura total.
- Capa com botão central: círculo 72px `canvas/95`, ícone `Play` 28px `brand`.
- Barra de progresso de 4px na base, com degradê `black/55` → transparente atrás dos tempos (12px, branco 90%); preenchimento `accent`.

### 7.14 Header
- Altura 64px; logo horizontal com 28px de altura à esquerda; ação à direita.
- Fixo no topo: transparente no início e, ao rolar, `canvas/90` + blur + borda inferior `line/80`.

### 7.15 Rodapé
- Fundo `brand-deep`, texto `white/75`; logo horizontal invertida com 30px; links 15px (alvos de 44px); aviso legal 13.5px `white/60`; copyright 13px `white/50` acima de uma divisória `white/10`.

### 7.16 Placeholders de desenvolvimento
- Borda tracejada 2px `sage-deep/45`, listras diagonais `sage/12`, raio 16px, rótulo "PLACEHOLDER DE DESENVOLVIMENTO". **Nunca** aparecem em produção.

### 7.17 Extensão para o portal (ainda não usada no site)
Componentes que o portal provavelmente vai precisar, derivados das mesmas regras:

| Componente | Especificação |
|---|---|
| **Campo de texto** | Altura 48–52px, fundo `white`, borda 1px `line`, raio 12px, padding 14px × 16px, texto DM Sans 16px `brand` (16px evita zoom no iOS). Placeholder `sage-deep`. Foco: borda `brand` + anel `0 0 0 3px sage/35`. Erro: borda `#B4533E` (ver nota) e mensagem 14px abaixo. Label acima, DM Sans 500 15px. |
| **Área de escrita (caderno)** | Como o campo de texto, fundo `canvas` ou `white`, `min-height` 160px, entrelinha 1.7, muito espaço. Salvar automaticamente, com estado discreto ("Salvo") em 13px `sage-deep`. |
| **Checkbox (checklist)** | Quadrado 22px, raio 6px, borda 1.5px `line`; marcado: fundo `brand`, check branco. Item inteiro clicável (44px+). Item concluído: texto `sage-deep` (sem riscar agressivo). |
| **Navegação inferior (mobile)** | Barra fixa 64px + safe-area, fundo `canvas/95` com blur, borda superior `line`; 3 a 5 itens com ícone 22px + rótulo 12px; ativo em `brand`, inativo em `sage-deep`. |
| **Abas** | Texto DM Sans 500 15px; ativa: `brand` com sublinhado 2px `brand`; inativa: `sage-deep`. |
| **Lista de áudios** | Card por áudio: número da sessão em círculo `sage/30`, título Lora 500 18–20px, duração 14px `sage-deep`, estado "ouvido" com `Check` em círculo `brand`. |
| **Estado vazio** | Ícone 40px em círculo `sage/30`, título H3, uma frase `sage-deep`, um botão. Tom acolhedor ("Seu primeiro momento começa aqui."). |
| **Carregando** | Símbolo da marca com animação de "respiração" (ver seção 5) ou blocos `surface` com pulso suave. Nada de spinner agressivo. |

> **Nota sobre cor de erro:** o design system não define uma cor de erro. A sugestão `#B4533E` (terracota derivada do rosé, contraste ≈ 4,9 : 1 sobre branco) deve ser validada antes do uso. Evite vermelho vivo.

---

## 8. Acessibilidade (obrigatório)

- Contraste mínimo **AA (4,5 : 1)** para texto comum. Ver a tabela da seção 2.3.
- **Foco visível:** `outline: 2px solid #253E43; outline-offset: 3px; border-radius: 6px` (sobre fundo escuro, outline `canvas`).
- Alvos de toque de **≥ 44 × 44px**.
- Um `h1` por página, com hierarquia de headings correta.
- Ícones decorativos com `aria-hidden`; botões só com ícone têm `aria-label`.
- Modal com foco preso + `Esc`; accordion com `aria-expanded`; players com controles rotulados.
- Respeitar `prefers-reduced-motion`.
- Em troca de etapa ou tela: mover o foco para o título e rolar ao topo.
- `lang="pt-BR"` e textos alternativos descritivos.

---

## 9. Tokens prontos para colar

### 9.1 Tailwind CSS v4 (como no site)

```css
@import "@fontsource-variable/lora/wght.css";
@import "@fontsource-variable/dm-sans/wght.css";
@import "tailwindcss";

@theme {
  --color-brand: #253e43;
  --color-brand-deep: #192f33;
  --color-sage: #a5b9a9;
  --color-sage-deep: #58736d;
  --color-sage-ink: #516b65;
  --color-accent: #d7b6a7;
  --color-canvas: #f8f5ef;
  --color-surface: #f0eae1;
  --color-line: #ded9d0;

  --font-serif: "Lora Variable", "Lora", Georgia, "Times New Roman", serif;
  --font-sans: "DM Sans Variable", "DM Sans", system-ui, -apple-system, "Segoe UI", sans-serif;

  --radius-card: 16px;
  --radius-btn: 12px;

  --shadow-soft: 0 1px 2px rgb(37 62 67 / 0.04), 0 8px 24px -12px rgb(37 62 67 / 0.12);
  --shadow-lift: 0 2px 4px rgb(37 62 67 / 0.05), 0 18px 40px -20px rgb(37 62 67 / 0.25);

  --ease-calm: cubic-bezier(0.22, 0.61, 0.36, 1);
}
```

Classes geradas: `bg-brand`, `text-sage-deep`, `border-line`, `bg-surface`, `font-serif`, `rounded-(--radius-card)`, `shadow-(--shadow-soft)`, `ease-(--ease-calm)` etc.

### 9.2 CSS puro (qualquer stack)

```css
:root {
  /* cores */
  --color-brand: #253e43;
  --color-brand-deep: #192f33;
  --color-sage: #a5b9a9;
  --color-sage-deep: #58736d;
  --color-sage-ink: #516b65;
  --color-accent: #d7b6a7;
  --color-canvas: #f8f5ef;
  --color-surface: #f0eae1;
  --color-line: #ded9d0;

  /* tipografia */
  --font-serif: "Lora", Georgia, "Times New Roman", serif;
  --font-sans: "DM Sans", system-ui, -apple-system, "Segoe UI", sans-serif;

  /* forma e profundidade */
  --radius-btn: 12px;
  --radius-card: 16px;
  --shadow-soft: 0 1px 2px rgb(37 62 67 / 0.04), 0 8px 24px -12px rgb(37 62 67 / 0.12);
  --shadow-lift: 0 2px 4px rgb(37 62 67 / 0.05), 0 18px 40px -20px rgb(37 62 67 / 0.25);
  --ease-calm: cubic-bezier(0.22, 0.61, 0.36, 1);

  /* layout */
  --container-max: 1120px;
  --reading-max: 740px;
  --page-gutter: 24px;
  --section-space: 76px;
  --block-space: 28px;
}
@media (min-width: 768px) {
  :root { --page-gutter: clamp(40px, 6vw, 64px); --section-space: clamp(80px, 10vw, 104px); --block-space: 40px; }
}
@media (min-width: 1280px) {
  :root { --page-gutter: clamp(80px, 7vw, 120px); --section-space: clamp(112px, 9vw, 136px); --block-space: 44px; }
}

body {
  background: var(--color-canvas);
  color: var(--color-brand);
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}
@media (min-width: 768px) { body { font-size: 18px; } }

h1, h2, h3 { font-family: var(--font-serif); text-wrap: balance; }
p { text-wrap: pretty; }
:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 3px; border-radius: 6px; }

.container-page { width: min(calc(100% - 2 * var(--page-gutter)), var(--container-max)); margin-inline: auto; }
.reading { max-width: var(--reading-max); }
.section { padding-block: var(--section-space); }

.t-h1 { font: 600 clamp(32px, 2.4vw + 22px, 44px)/1.17 var(--font-serif); letter-spacing: -0.012em; }
.t-h2 { font: 600 clamp(27px, 1.1vw + 22px, 34px)/1.2 var(--font-serif); letter-spacing: -0.01em; }
.t-h3 { font: 500 clamp(21px, 0.4vw + 20px, 24px)/1.25 var(--font-serif); }
.t-eyebrow { font-size: 13px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-sage-deep); }
.t-muted { color: var(--color-sage-deep); }
.t-small { font-size: 14px; line-height: 1.55; }

.card { background: #fff; border: 1px solid var(--color-line); border-radius: var(--radius-card); }

.btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  min-height: 48px; padding: 12px 24px; border-radius: var(--radius-btn);
  background: var(--color-brand); color: #fff;
  font: 600 16px/1.375 var(--font-sans);
  box-shadow: 0 10px 24px -14px rgb(25 47 51 / 0.7);
  transition: background-color 300ms var(--ease-calm), box-shadow 300ms var(--ease-calm), transform 300ms var(--ease-calm);
}
.btn-primary:hover { background: var(--color-brand-deep); }
.btn-primary:active { transform: scale(0.985); }

@keyframes mp-enter { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.anim-enter { animation: mp-enter 520ms var(--ease-calm) both; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 1ms !important; animation-iteration-count: 1 !important; transition-duration: 1ms !important; }
}
```

### 9.3 JSON (para ferramentas de design / tokens)

```json
{
  "color": {
    "brand": "#253E43", "brand-deep": "#192F33",
    "sage": "#A5B9A9", "sage-deep": "#58736D", "sage-ink": "#516B65",
    "accent": "#D7B6A7",
    "canvas": "#F8F5EF", "surface": "#F0EAE1", "line": "#DED9D0", "white": "#FFFFFF",
    "logo-sage": "#7D947C"
  },
  "font": { "serif": "Lora", "sans": "DM Sans" },
  "radius": { "btn": 12, "btn-lg": 14, "card": 16, "plan": 20, "modal": 24, "pill": 9999 },
  "layout": { "container": 1120, "reading": 740, "focus": 560, "gutter-mobile": 24, "base": 8 },
  "touch-target-min": 44,
  "ease": "cubic-bezier(0.22, 0.61, 0.36, 1)"
}
```

---

## 10. Logotipo

### 10.1 Arquivos (SVG, texto já convertido em curvas)

Baixe direto do repositório público:

| Versão | Positiva (fundo claro) | Invertida (fundo escuro) | Monocromática |
|---|---|---|---|
| Horizontal | [logo-horizontal.svg](https://raw.githubusercontent.com/davvidzy/mente-em-paz/main/src/assets/brand/logo-horizontal.svg) | [logo-horizontal-inverse.svg](https://raw.githubusercontent.com/davvidzy/mente-em-paz/main/src/assets/brand/logo-horizontal-inverse.svg) | [logo-horizontal-mono.svg](https://raw.githubusercontent.com/davvidzy/mente-em-paz/main/src/assets/brand/logo-horizontal-mono.svg) |
| Vertical | [logo-vertical.svg](https://raw.githubusercontent.com/davvidzy/mente-em-paz/main/src/assets/brand/logo-vertical.svg) | [logo-vertical-inverse.svg](https://raw.githubusercontent.com/davvidzy/mente-em-paz/main/src/assets/brand/logo-vertical-inverse.svg) | [logo-vertical-mono.svg](https://raw.githubusercontent.com/davvidzy/mente-em-paz/main/src/assets/brand/logo-vertical-mono.svg) |
| Símbolo | [logo-symbol.svg](https://raw.githubusercontent.com/davvidzy/mente-em-paz/main/src/assets/brand/logo-symbol.svg) | [logo-symbol-inverse.svg](https://raw.githubusercontent.com/davvidzy/mente-em-paz/main/src/assets/brand/logo-symbol-inverse.svg) | [logo-symbol-mono.svg](https://raw.githubusercontent.com/davvidzy/mente-em-paz/main/src/assets/brand/logo-symbol-mono.svg) |
| Símbolo simplificado (≤ 32px) | [logo-symbol-simple.svg](https://raw.githubusercontent.com/davvidzy/mente-em-paz/main/src/assets/brand/logo-symbol-simple.svg) | — | — |

Ícones prontos: [favicon.svg](https://raw.githubusercontent.com/davvidzy/mente-em-paz/main/public/favicon.svg), [favicon-32.png](https://raw.githubusercontent.com/davvidzy/mente-em-paz/main/public/favicon-32.png), [apple-touch-icon.png](https://raw.githubusercontent.com/davvidzy/mente-em-paz/main/public/apple-touch-icon.png) (180px), [icon-192.png](https://raw.githubusercontent.com/davvidzy/mente-em-paz/main/public/icon-192.png), [icon-512.png](https://raw.githubusercontent.com/davvidzy/mente-em-paz/main/public/icon-512.png).

Proporções: horizontal **647 × 128**, vertical **224 × 355**, símbolo **128 × 128** (área visual de 108 com margem de proteção embutida).

### 10.2 Composição
Lua crescente (`#253E43`) + "+" arredondado e curva orgânica em forma de folha (`#7D947C`) + nome em **Lora 500**. Na versão invertida: lua e nome em `#F8F5EF`, "+" e folha em `#A5B9A9`.

### 10.3 Uso

| Onde | Versão | Altura |
|---|---|---|
| Header / topo do portal | Horizontal | 28–32px |
| Rodapé / áreas escuras | Horizontal invertida | 30px |
| Login, splash, capas de áudio, caderno | Vertical | livre |
| Avatar, favicon, app icon, selos, loading | Símbolo (≤ 32px: simplificado) | — |
| Ao lado do nome já escrito | Símbolo, com `alt=""` | — |

- Preservar proporção e área de proteção; não esticar, girar, inclinar ou recolorir; nada de sombra ou gradiente.
- Fundo preferido: creme. Sobre fotos, só com área limpa e contraste suficiente.
- O "+" remete a cuidado. **Não** usar a marca para sugerir atendimento médico ou certificação clínica.

---

## 11. Voz e texto (microcopy)

**Fale com uma mulher adulta, capaz, cansada, sem fragilizá-la.** Acolhimento sem culpa adicional.

| Fazer | Não fazer |
|---|---|
| Frases curtas e diretas, uma ideia por frase | Parágrafos longos |
| "Você" e verbos no presente | Linguagem técnica ou clínica |
| Benefícios concretos e realistas | Promessas de cura: "cure sua insônia", "elimine a ansiedade", "durma instantaneamente" |
| "Pausa", "momento", "prática", "descanso", "cuidado" | **"Ritual"** (pode ser gatilho; foi removido do site) |
| Tom de possibilidade ("pode ajudar", "imagine…") | Afirmar o que ela sente ou deseja sem ela ter dito |
| CTA no presente, em 1 linha ("Quero descansar melhor") | Urgência artificial, contagem regressiva, "últimas vagas" |
| Reforçar que é complementar ao cuidado profissional | Simular serviço médico ou psicológico |

**Frases de referência:** "Você cuida de quem ama. Agora é hora de cuidar de você." · "Um descanso que também é seu." · "Você cuida de todos. Menos de você."

**Condições comerciais confirmadas** (podem aparecer no portal): pagamento único · acesso vitalício · garantia de 7 dias · uso ilimitado dos áudios.

**Aviso legal padrão:** "O Mente em Paz é um recurso complementar de autocuidado e bem-estar. Não é tratamento médico ou psicológico e não substitui o acompanhamento de profissionais de saúde."

---

## 12. Checklist antes de publicar uma tela do portal

- [ ] Usa só os tokens deste documento (nenhuma cor, fonte ou raio novo).
- [ ] Fundo `canvas`; texto principal `brand`; secundário `sage-deep` (`sage-ink` sobre `surface`).
- [ ] Testada em 320, 375, 390, 430, 768 e 1440px, **sem rolagem horizontal**.
- [ ] Margens de 24px no mobile e conteúdo de leitura ≤ 740px.
- [ ] Alvos de toque ≥ 44px; foco visível; contraste AA.
- [ ] Uma ação principal por tela; CTA em 1 linha no mobile.
- [ ] Animações discretas e `prefers-reduced-motion` respeitado.
- [ ] Texto sem "ritual", sem promessa de cura e sem diagnóstico.
- [ ] Logo na versão certa para o fundo.

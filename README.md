# Mente em Paz — Funil Quiz → Resultado → Landing → Checkout

Site do infoproduto **Mente em Paz** (Método de Descanso Noturno Para Quem Cuida).
Identidade visual: design system **Refúgio Sereno** (`Mente em Paz - Conteúdo para Claude/`).

| Rota | Página |
|---|---|
| `/` | Quiz (3 perguntas, abre direto na 1ª; sem preços) |
| `/resultado/` | Resultado personalizado |
| `/mente-em-paz/` | Landing Page de vendas (vídeo dentro do hero) |
| `/privacidade/`, `/termos/` | Páginas legais |
| Checkout | Plataforma externa (links em `src/config/site.ts`) |

**Stack:** Vite (multi-page) + React + TypeScript + Tailwind CSS v4 + Lucide. Gera um site 100% estático, que funciona na raiz do domínio ou em subpasta.

---

## Comandos

```bash
npm install          # instalar dependências
npm run dev          # desenvolvimento → http://localhost:5173
npm run build        # checa tipos, gera dist/, pré-renderiza a LP e mostra o checklist de lançamento
npm test             # testes do motor de resultados (64 combinações)
npm run test:e2e     # testes de navegador (rode npm run build antes)
npm run check:launch # checklist estrito: falha se algo bloquear a publicação
npm run images       # converte images-src/ → public/img/ (WebP 400/800)
```

> Abrir o `index.html` direto do disco não funciona. Use `npm run dev` ou sirva o `dist/`.

---

## Onde editar cada coisa

| O quê | Arquivo |
|---|---|
| Preços, planos, upgrade, **links de checkout**, garantia, FAQ, mídia, depoimentos, bônus | `src/config/site.ts` |
| Textos da Landing (todas as seções) | `src/config/landing.ts` |
| Perguntas do quiz, **pesos**, textos dos resultados | `src/config/quiz.ts` |
| Política de Privacidade e Termos | `src/config/legal.ts` |
| Pixel, domínio | `.env` (copie de `.env.example`) |
| Cores, fontes, espaçamentos | `src/styles/index.css` (`@theme` e `:root`) |

**Preços ficam em centavos** (`1990` = R$ 19,90). A diferença do upgrade e o "de/por" do popup são calculados automaticamente.

### Materiais pendentes: como ativar

| Material | Como ativar | Sem ele |
|---|---|---|
| **Checkouts** | Preencher `checkoutEssencialUrl`, `checkoutCompletoUrl` e `checkoutUpgradeUrl` (https://) | Botão desabilitado ("Checkout em configuração"); em dev, aviso de integração pendente |
| **Meta Pixel** | ID `4617173178570579` e consentimento em `src/config/pixel.ts` (`VITE_META_PIXEL_ID` tem prioridade). Com `REQUIRE_CONSENT = false` o código base vai no `<head>` de todas as páginas (PageView na entrada, sem aviso de cookies); com `true`, só depois do "Aceitar" | — |
| **Utmify** | Pixel `6ae005d49e436dbeb71fd8ed` e script de UTMs em `src/config/pixel.ts` (`VITE_UTMIFY_PIXEL_ID` tem prioridade). Vão no `<head>` de todas as páginas junto com o Meta | — |
| **Vídeo** (no hero, abaixo dos benefícios) | Arquivos em `public/video/` + `media.video.sources` e `poster` | Espaço oculto |
| **Áudio** | Arquivo em `public/audio/` + `media.audioPreview.src` | Seção de demonstração de áudio oculta |
| **Depoimentos** (carrossel infinito) | Itens reais e autorizados em `testimonials`: `name`, `daysAsClient`, `avatar`, `print` (print do WhatsApp) e `printAlt`. Imagens em `images-src/depoimentos/` → `npm run images` | Seção oculta |
| **Especialista** (abaixo do áudio) | Dados reais em `expert` (`src/config/site.ts`): nome, profissão, registro (CRP, se psicóloga), foto 4:5 e bio. Depois mude `verified: true` | Seção oculta |
| **Benefícios do hero** | `landing.hero.benefits` em `src/config/landing.ts`. "Acesso vitalício" está desativado até ser confirmado | — |
| **Preços individuais dos bônus** | Só se cada bônus for vendido separadamente por esse valor: confirme `valueCents` em `bonuses.items` e mude `bonuses.showValues: true` (`src/config/site.ts`) | Seção mostra "5 bônus inclusos sem custo adicional", sem preço riscado |
| **Domínio** | `VITE_SITE_URL=https://...` | Sem canonical absoluto e sem sitemap.xml |
| **Legal** | Campos `[PENDENTE]` em `src/config/legal.ts` + `brand.contactEmail` / `legalEntity` | `check:launch` bloqueia |

Em `npm run dev`, cada material ausente aparece como **placeholder de desenvolvimento** (tracejado e identificado). Esses placeholders nunca vão para o build de produção.

**Vídeo (VSL 9:16):** converta para 720×1280, em **WebM (VP9)** e **MP4 (H.264 com faststart)**, a ~1 Mbps, mais um poster `.webp`. O player não deixa a pessoa avançar além do trecho já assistido. Se o arquivo passar de ~20 MB, considere hospedar o vídeo fora.

---

## Funil e regras

- **O quiz não vende.** Sem preços e sem pedir dados de contato. Ao terminar, mostra o resultado e um CTA, sem redirecionar sozinho.
- **Motor de resultados** (`src/lib/classifier.ts`): pontuação com pesos documentados em `src/config/quiz.ts`, 4 perfis e desempate determinístico (primeiro o desejo da P5, depois uma prioridade fixa). Respostas positivas geram um tom preventivo. As frases "Pelo que você contou" repetem literalmente o que a pessoa respondeu.
- **Privacidade:** as respostas ficam só no `sessionStorage` do aparelho. A landing lê apenas o perfil, para mostrar uma frase discreta de acolhimento. Nada do quiz vai para URL, UTMs ou Pixel.
- **UTMs** (`utm_*`, `fbclid`, `gclid`, `src`, `sck`) são preservadas do anúncio até o checkout, sem sobrescrever parâmetros que o link de checkout já tenha.
- **Popup de upgrade:** abre só ao clicar no Essencial. Aceitar leva ao `checkoutUpgradeUrl` e recusar leva ao Essencial. Depois de recusado, não reabre na mesma visita.

### Eventos (Meta Pixel, só após consentimento)

| Evento interno | Meta |
|---|---|
| `landing_page_viewed` | `ViewContent` |
| `checkout_redirect` | `InitiateCheckout` (value, currency) |
| demais (`quiz_*`, `video_*`, `audio_preview_started`, `plan_section_viewed`, `essencial_clicked`, `completo_clicked`, `upgrade_*`) | `trackCustom` |
| **Compra** | **Não é disparada no site.** Configure o `Purchase` (com value e currency) na plataforma de checkout ou via API de Conversões |

Para depurar, em desenvolvimento os eventos aparecem no console, e `window.__mpEvents` lista todos.

---

## Deploy na Hostinger (plano Business)

1. Crie o repositório no GitHub e envie o projeto para a branch `main`.
2. No GitHub, em **Settings → Secrets and variables → Actions → Variables**, crie `VITE_SITE_URL`, `VITE_META_PIXEL_ID` e, se for usar, `VITE_UTMIFY_PIXEL_ID`.
3. A cada push na `main`, o workflow `.github/workflows/deploy.yml` roda os testes, gera o build e publica **só o `dist/`** na branch `deploy`.
4. Na Hostinger, abra **hPanel → Sites → Avançado → Git** e crie o repositório com o endereço do GitHub, a branch **`deploy`** e o diretório vazio (para instalar na raiz do `public_html`).
   - Repositório privado: adicione a chave SSH que o hPanel mostra em **GitHub → Settings → Deploy keys**.
   - O `public_html` precisa estar **vazio** na primeira implantação.
5. Ative a **Implantação automática**: copie a URL do webhook do hPanel e cadastre em **GitHub → Settings → Webhooks** (evento *push*).
6. O `.htaccess` incluído força HTTPS, ativa compressão e cache e aponta a página 404.

Antes de anunciar, rode `npm run check:launch` e valide os eventos em **Gerenciador de Eventos → Testar eventos**.

---

## Estrutura

```
index.html, resultado/, mente-em-paz/, privacidade/, termos/   entradas HTML
src/config/        conteúdo editável (site, landing, quiz, legal)
src/lib/           classifier, analytics, consent, checkout, params, routes, session, format
src/components/    quiz/, landing/sections/ (uma seção por arquivo), ui/, legal/
src/assets/brand/  logos SVG (positiva, invertida, mono; horizontal, vertical, símbolo)
public/            .htaccess, favicons, og-image.jpg, manifest, 404
scripts/           build-logos.py, build-brand-assets.mjs, optimize-images.mjs, prerender.mjs, check-launch.mjs, static-server.mjs
tests/e2e/         Playwright (dev e produção, raiz e subpasta, 320–1440 px)
```

### Logos

Os SVGs foram reconstruídos a partir dos PNGs aprovados (originais em `images-src/brand/`): geometria limpa da lua, do "+" e da curva, com o texto em **Lora 500 convertido em curvas** (não depende de fonte instalada). A lua usa o token `#253E43`. O "+" e a curva usam `#7D947C`, o sálvia da arte original, só dentro da logo. Para regenerar:

```bash
python scripts/build-logos.py caminho/para/Lora[wght].ttf   # SVGs
node scripts/build-brand-assets.mjs                          # favicons, ícones e og-image
```

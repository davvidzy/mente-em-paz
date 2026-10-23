/**
 * Verificação de pré-lançamento. Roda automaticamente após `npm run build`
 * (apenas avisa) e em modo estrito com `npm run check:launch` (falha se houver bloqueio).
 *
 * BLOQUEIO = publicar assim seria enganoso ou quebrado.
 * AVISO    = recomendado resolver; o site funciona com segurança sem ele.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const strict = process.argv.includes("--strict");
const site = readFileSync("src/config/site.ts", "utf8");
const legal = readFileSync("src/config/legal.ts", "utf8");
const env = existsSync(".env") ? readFileSync(".env", "utf8") : "";

const envVal = (k) => (env.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1] ?? process.env[k] ?? "").trim();
const field = (k) => site.match(new RegExp(`${k}:\\s*"([^"]*)"`))?.[1] ?? "";

const block = [];
const warn = [];

// Checkout
for (const k of ["checkoutEssencialUrl", "checkoutCompletoUrl", "checkoutUpgradeUrl"]) {
  const v = field(k);
  if (!v) block.push(`checkout.${k} vazio — o botão correspondente fica desabilitado em produção.`);
  else if (!v.startsWith("https://")) block.push(`checkout.${k} precisa começar com https://`);
}

if (/previewCheckout:\s*true/.test(site))
  block.push("checkout.previewCheckout = true (modo de visualização) — desligue antes de anunciar.");

// Rastreamento e domínio
if (!envVal("VITE_META_PIXEL_ID")) warn.push("VITE_META_PIXEL_ID não definido — nenhum evento será enviado ao Meta.");
if (!envVal("VITE_SITE_URL")) warn.push("VITE_SITE_URL não definido — sem canonical, og:url absoluto e sitemap.xml.");

// Mídia e prova social (seções ficam ocultas — só informativo)
if (/sources:\s*\[\]/.test(site)) warn.push("Vídeo de apresentação não configurado — seção oculta.");
if (/audioPreview:\s*\{\s*src:\s*""/.test(site)) warn.push("Trecho de áudio não configurado — seção oculta.");
if (/testimonials:\s*Testimonial\[\]\s*=\s*\[\]/.test(site)) warn.push("Sem depoimentos — seção oculta.");

// Especialista
if (/countdownSeconds:\s*(?!0\b)\d/.test(site))
  warn.push("Cronômetro de TESTE nos bônus (bonuses.countdownSeconds) — reinicia a cada visita; remova antes de anunciar.");
if (/^\s*showValues:\s*true/m.test(site))
  warn.push("Bônus com valor riscado (bonuses.showValues = true) — só mantenha se os valores individuais forem reais.");
if (/verified:\s*false/.test(site)) warn.push("Seção da especialista com conteúdo provisório (expert.verified = false) — oculta.");

// Legal
if (legal.includes("[PENDENTE")) block.push("Textos legais com campos [PENDENTE] em src/config/legal.ts.");
if (!field("contactEmail")) warn.push("brand.contactEmail vazio — link de Contato oculto no rodapé.");

// Build: nada de placeholder de desenvolvimento no dist
if (existsSync("dist")) {
  const files = [];
  const walk = (d) =>
    readdirSync(d).forEach((n) => {
      const p = join(d, n);
      statSync(p).isDirectory() ? walk(p) : /\.(js|html)$/.test(p) && files.push(p);
    });
  walk("dist");
  if (files.some((f) => readFileSync(f, "utf8").includes("Placeholder de desenvolvimento")))
    block.push("Placeholder de desenvolvimento encontrado em dist/.");
}

const c = { r: "\x1b[31m", y: "\x1b[33m", g: "\x1b[32m", d: "\x1b[2m", x: "\x1b[0m" };
console.log(`\n${c.d}── Checklist de lançamento — Mente em Paz ──${c.x}`);
block.forEach((m) => console.log(`${c.r}✗ BLOQUEIO${c.x} ${m}`));
warn.forEach((m) => console.log(`${c.y}! aviso${c.x}    ${m}`));
if (!block.length && !warn.length) console.log(`${c.g}✓ Tudo pronto para publicar.${c.x}`);
console.log();

if (strict && block.length) {
  console.error(`${block.length} bloqueio(s). Resolva antes de publicar.`);
  process.exit(1);
}

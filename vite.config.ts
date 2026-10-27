/// <reference types="vitest/config" />
import { resolve } from "node:path";
import { defineConfig, loadEnv, type HtmlTagDescriptor, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { META_DIRECT, META_PIXEL_ID, REQUIRE_CONSENT, UTMIFY_PIXEL_ID, UTMIFY_UTMS_SCRIPT } from "./src/config/pixel";

const r = (p: string) => resolve(import.meta.dirname, p);

const PAGES = {
  quiz: "index.html",
  resultado: "resultado/index.html",
  landing: "mente-em-paz/index.html",
  privacidade: "privacidade/index.html",
  termos: "termos/index.html",
};
/** Páginas que entram no sitemap (as demais são noindex). */
const INDEXABLE = ["/", "/mente-em-paz/"];

/**
 * SEO: com VITE_SITE_URL definido (ex.: https://www.seudominio.com.br), insere canonical,
 * og:url e og:image absolutos e gera sitemap.xml. robots.txt é sempre gerado.
 */
function seo(siteUrl: string): Plugin {
  const base = siteUrl.replace(/\/+$/, "");
  return {
    name: "mente-em-paz-seo",
    apply: "build",
    transformIndexHtml(html, ctx) {
      if (!base) return html;
      const rel = ctx.filename.replace(/\\/g, "/").split(import.meta.dirname.replace(/\\/g, "/"))[1] ?? "";
      const path = rel.replace(/^\//, "").replace(/index\.html$/, "");
      const url = `${base}/${path}`;
      return html
        .replace(
          "<!-- canonical e og:url absolutos são inseridos no build quando brand.siteUrl estiver configurado -->",
          `<link rel="canonical" href="${url}" />\n    <meta property="og:url" content="${url}" />`,
        )
        .replace('content="/og-image.jpg"', `content="${base}/og-image.jpg"`);
    },
    generateBundle() {
      const robots = ["User-agent: *", "Allow: /", ...(base ? [`Sitemap: ${base}/sitemap.xml`] : [])].join("\n");
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robots + "\n" });
      if (base) {
        const urls = INDEXABLE.map((p) => `  <url><loc>${base}${p}</loc></url>`).join("\n");
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        });
      }
    },
  };
}

/**
 * Pixels no <head> de cada página: Utmify (pixel + script de UTMs, os mesmos scripts do
 * painel, sem a ofuscação) e, só com META_DIRECT, o Meta (código oficial). Saem antes do
 * JavaScript do site — quem sai cedo também é contado e as UTMs são capturadas na hora.
 * Só sem consentimento obrigatório (config/pixel.ts); com consentimento, lib/analytics.ts
 * carrega tudo depois do "Aceitar".
 */
function adPixels({ meta, utmify, utms }: { meta: string; utmify: string; utms: boolean }): Plugin {
  return {
    name: "mente-em-paz-ad-pixels",
    apply: "build",
    transformIndexHtml: () => {
      if (REQUIRE_CONSENT) return [];
      const tags: HtmlTagDescriptor[] = [];
      if (meta && META_DIRECT) {
        tags.push(
          {
            tag: "script",
            injectTo: "head",
            children: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${meta}');fbq('track','PageView');`,
          },
          {
            tag: "noscript",
            injectTo: "body-prepend",
            children: `<img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=${meta}&ev=PageView&noscript=1" />`,
          },
        );
      }
      if (utmify) {
        tags.push(
          { tag: "script", injectTo: "head", children: `window.pixelId=${JSON.stringify(utmify)};` },
          { tag: "script", injectTo: "head", attrs: { src: "https://cdn.utmify.com.br/scripts/pixel/pixel.js", async: true, defer: true } },
        );
      }
      if (utms) {
        tags.push({
          tag: "script",
          injectTo: "head",
          attrs: {
            src: "https://cdn.utmify.com.br/scripts/utms/latest.js",
            async: true,
            defer: true,
            "data-utmify-prevent-xcod-sck": "",
            "data-utmify-prevent-subids": "",
          },
        });
      }
      return tags;
    },
  };
}

// Multi-page: cada rota é uma pasta com index.html (funciona em qualquer servidor estático,
// incluindo a Hostinger). `base: "./"` gera caminhos relativos → o site funciona na raiz ou em subpasta.
export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, import.meta.dirname, "VITE_");
  return {
    base: "./",
    plugins: [
      react(),
      tailwindcss(),
      ...(isSsrBuild
        ? []
        : [
            seo(env.VITE_SITE_URL ?? ""),
            adPixels({
              meta: env.VITE_META_PIXEL_ID || META_PIXEL_ID,
              utmify: env.VITE_UTMIFY_PIXEL_ID || UTMIFY_PIXEL_ID,
              utms: UTMIFY_UTMS_SCRIPT,
            }),
          ]),
    ],
    // Pré-render (`vite build --ssr`): assets apontam para a raiz da página gerada
    // (__MP_ROOT__, definido por scripts/prerender.mjs), com os mesmos nomes do build do navegador.
    experimental: {
      renderBuiltUrl: (filename, { ssr }) =>
        ssr ? { runtime: `globalThis.__MP_ROOT__ + ${JSON.stringify(filename)}` } : { relative: true },
    },
    build: isSsrBuild
      ? { target: "node20", outDir: ".prerender", emptyOutDir: true, copyPublicDir: false }
      : {
          target: "es2020",
          rollupOptions: {
            input: Object.fromEntries(Object.entries(PAGES).map(([k, v]) => [k, r(v)])),
          },
        },
    test: {
      include: ["src/**/*.test.ts"],
    },
  };
});

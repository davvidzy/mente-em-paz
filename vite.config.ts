/// <reference types="vitest/config" />
import { resolve } from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

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

// Multi-page: cada rota é uma pasta com index.html (funciona em qualquer servidor estático,
// incluindo a Hostinger). `base: "./"` gera caminhos relativos → o site funciona na raiz ou em subpasta.
export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, import.meta.dirname, "VITE_");
  return {
    base: "./",
    plugins: [react(), tailwindcss(), ...(isSsrBuild ? [] : [seo(env.VITE_SITE_URL ?? "")])],
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

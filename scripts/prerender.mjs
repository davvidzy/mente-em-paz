/**
 * Pré-render da landing e do quiz: grava o HTML do React dentro de <div id="root"> no dist/.
 * Roda depois de `vite build` e `vite build --ssr` (ver package.json).
 * Sem isso a página fica em branco até o JavaScript baixar e executar —
 * em 3G lento, vários segundos.
 */
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, posix, resolve } from "node:path";
import { pathToFileURL } from "node:url";

/** Página → funções exportadas por src/entries/server.tsx (conteúdo e script inline opcional). */
const PAGES = {
  "dist/mente-em-paz/index.html": { render: "renderLanding", script: "landingInlineScript" },
  "dist/index.html": { render: "renderQuiz" },
};
const EMPTY_ROOT = '<div id="root"></div>';

/**
 * CSS embutido no HTML: a página pinta assim que o HTML chega, sem esperar mais uma
 * ida e volta ao servidor (≈2 s em 3G lento), e as fontes são descobertas mais cedo.
 * As url() do CSS são relativas à pasta assets/ e passam a ser relativas à página.
 */
function inlineCss(html, file) {
  return html.replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_, href) => {
    const css = readFileSync(resolve(dirname(file), href), "utf8").replace(
      /url\(\s*['"]?(?!data:|https?:|\/|#)([^'")]+)['"]?\s*\)/g,
      (_, u) => `url(${posix.join(posix.dirname(href), u)})`,
    );
    return `<style>${css}</style>`;
  });
}

for (const [file, fn] of Object.entries(PAGES)) {
  const html = readFileSync(file, "utf8");
  if (!html.includes(EMPTY_ROOT)) throw new Error(`${file}: <div id="root"></div> não encontrado`);
  // Mesma raiz relativa que a página usa no navegador (data-root) — links e assets saem iguais.
  globalThis.__MP_ROOT__ = html.match(/data-root="([^"]*)"/)?.[1] ?? "./";
  // Uma instância do módulo por página: as URLs dos assets são calculadas ao importar,
  // com a raiz (__MP_ROOT__) da página da vez.
  const server = await import(`${pathToFileURL(".prerender/server.js").href}?page=${encodeURIComponent(file)}`);
  const script = fn.script ? `<script>${server[fn.script]()}</script>` : "";
  writeFileSync(file, inlineCss(html, file).replace(EMPTY_ROOT, `<div id="root">${server[fn.render]()}</div>${script}`));
  console.log(`pré-render: ${file}`);
}

rmSync(".prerender", { recursive: true, force: true });

/**
 * Rotas relativas à raiz do site. Cada HTML declara `data-root` ("./" ou "../"),
 * então o site funciona tanto na raiz do domínio quanto em uma subpasta.
 *
 * No navegador a raiz é resolvida uma vez, no carregamento: o quiz troca de URL
 * com pushState (/ → /resultado/) e um caminho relativo passaria a apontar errado.
 * No pré-render do build não há `document`: scripts/prerender.mjs define
 * `__MP_ROOT__` com o data-root da página e as URLs saem relativas a ela.
 */
declare global {
  var __MP_ROOT__: string | undefined;
}

const ROOT =
  typeof document === "undefined"
    ? null
    : new URL(document.documentElement.dataset.root ?? "./", window.location.href).toString();

const at = (path: string) => (ROOT ? new URL(path, ROOT).toString() : (globalThis.__MP_ROOT__ ?? "./") + path);

export const routes = {
  quiz: () => at(""),
  result: () => at("resultado/"),
  landing: () => at("mente-em-paz/"),
  privacy: () => at("privacidade/"),
  terms: () => at("termos/"),
  asset: (path: string) => (/^https?:\/\//.test(path) ? path : at(path.replace(/^\.?\//, ""))),
};

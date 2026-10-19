/**
 * Rotas relativas à raiz do site. Cada HTML declara `data-root` ("./" ou "../"),
 * então o site funciona tanto na raiz do domínio quanto em uma subpasta.
 */
const rootAttr = document.documentElement.dataset.root ?? "./";
const ROOT = new URL(rootAttr, window.location.href);

export const routes = {
  quiz: () => new URL("./", ROOT).toString(),
  result: () => new URL("resultado/", ROOT).toString(),
  landing: () => new URL("mente-em-paz/", ROOT).toString(),
  privacy: () => new URL("privacidade/", ROOT).toString(),
  terms: () => new URL("termos/", ROOT).toString(),
  asset: (path: string) => (/^https?:\/\//.test(path) ? path : new URL(path, ROOT).toString()),
};

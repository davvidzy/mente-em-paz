import "../styles/index.css";
import { startTransition, StrictMode, type ReactNode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { initAnalytics } from "../lib/analytics";
import { captureParams } from "../lib/params";

/** Inicialização comum a todas as páginas. */
export function boot(app: ReactNode) {
  captureParams();
  initAnalytics();
  const root = document.getElementById("root")!;
  const tree = <StrictMode>{app}</StrictMode>;
  // Página pré-renderizada no build (landing): reaproveita o HTML que já está na tela.
  // Em transição, a hidratação é fatiada e não trava toques/rolagem em celular fraco.
  if (root.hasChildNodes()) startTransition(() => void hydrateRoot(root, tree));
  else createRoot(root).render(tree);
}

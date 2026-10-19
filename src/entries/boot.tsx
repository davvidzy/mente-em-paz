import "../styles/index.css";
import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { initAnalytics } from "../lib/analytics";
import { captureParams } from "../lib/params";

/** Inicialização comum a todas as páginas. */
export function boot(app: ReactNode) {
  captureParams();
  initAnalytics();
  createRoot(document.getElementById("root")!).render(<StrictMode>{app}</StrictMode>);
}

import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { LandingApp } from "../components/landing/LandingApp";

/**
 * Pré-render da landing no build (scripts/prerender.mjs): o HTML já chega com o
 * conteúdo, e landing.tsx só "liga" a página (hydrate). Em rede lenta a visitante
 * lê a oferta segundos antes de o JavaScript terminar de carregar.
 */
export function render() {
  return renderToString(
    <StrictMode>
      <LandingApp />
    </StrictMode>,
  );
}

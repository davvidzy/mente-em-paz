/**
 * Meta Pixel — lido pelo site (config/site.ts → lib/analytics.ts) e pelo build
 * (vite.config.ts põe o código base no <head> de cada página).
 * Arquivo sem `import.meta` de propósito: o vite.config.ts também o importa.
 */

/** ID do pixel (público — aparece no código de qualquer página com pixel). VITE_META_PIXEL_ID tem prioridade. */
export const META_PIXEL_ID = "1701181361725576";

/**
 * LGPD: true = o pixel só carrega depois de "Aceitar" no aviso de cookies.
 * false = carrega na entrada, já no <head> (PageView antes mesmo do site terminar de carregar),
 * sem aviso de cookies. A política de privacidade (config/legal.ts) acompanha esta escolha.
 */
export const REQUIRE_CONSENT = false;

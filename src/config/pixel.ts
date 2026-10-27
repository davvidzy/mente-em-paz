/**
 * Pixels de anúncio (Meta e Utmify) — lidos pelo site (config/site.ts → lib/analytics.ts)
 * e pelo build (vite.config.ts põe os códigos no <head> de cada página).
 * Arquivo sem `import.meta` de propósito: o vite.config.ts também o importa.
 * IDs são públicos (aparecem no código de qualquer página com pixel).
 */

/** Meta Pixel. VITE_META_PIXEL_ID tem prioridade. */
export const META_PIXEL_ID = "4617173178570579";

/** Utmify — pixel (pixelId do painel). VITE_UTMIFY_PIXEL_ID tem prioridade. Vazio = desativado. */
export const UTMIFY_PIXEL_ID = "6ae005d49e436dbeb71fd8ed";

/** Utmify — script de UTMs (cdn.utmify.com.br/scripts/utms/latest.js). */
export const UTMIFY_UTMS_SCRIPT = true;

/**
 * LGPD: true = os pixels só carregam depois de "Aceitar" no aviso de cookies.
 * false = carregam na entrada, já no <head> (antes mesmo do site terminar de carregar),
 * sem aviso de cookies. A política de privacidade (config/legal.ts) acompanha esta escolha.
 */
export const REQUIRE_CONSENT = false;

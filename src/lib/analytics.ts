/**
 * Camada única de eventos → Meta Pixel.
 *
 * • Sem ID configurado ou sem consentimento: nada é enviado.
 * • Eventos anteriores ao consentimento ficam em fila (só nesta página) e
 *   são enviados se a visitante aceitar; descartados se recusar.
 * • Privacidade: apenas parâmetros da lista ALLOWED chegam ao Meta.
 *   Respostas e perfil do quiz NUNCA são enviados a ferramentas de anúncio.
 * • Purchase NÃO é disparado no site — vem do checkout (pixel/API da plataforma).
 */
import { tracking } from "../config/site";
import { getConsent, onConsent } from "./consent";

export type EventName =
  // quiz
  | "quiz_started"
  | "quiz_question_answered"
  | "quiz_completed"
  | "quiz_result_viewed"
  | "quiz_result_cta_clicked"
  // landing
  | "landing_page_viewed"
  | "video_started"
  | "video_progress"
  | "video_completed"
  | "audio_preview_started"
  | "plan_section_viewed"
  // oferta
  | "essencial_clicked"
  | "completo_clicked"
  | "upgrade_popup_opened"
  | "upgrade_accepted"
  | "upgrade_declined"
  | "checkout_redirect"
  // roleta de cupom
  | "coupon_wheel_opened"
  | "coupon_wheel_spun"
  | "coupon_copied"
  | "coupon_cta_clicked";

type Params = Record<string, string | number | boolean | undefined>;

/** Eventos internos → eventos padrão do Meta. Os demais vão como trackCustom. */
const META_STANDARD: Partial<Record<EventName, string>> = {
  landing_page_viewed: "ViewContent",
  checkout_redirect: "InitiateCheckout",
};

const ALLOWED = new Set(["question_number", "percent", "value", "currency", "plan", "content_name"]);

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean };
    _fbq?: unknown;
    /** Registro local dos eventos (debug e testes automatizados). */
    __mpEvents?: { name: EventName; params: Params }[];
  }
}

let loaded = false;
let pending: [EventName, Params][] = [];
const once = new Set<string>();

function sanitize(params: Params): Params {
  const out: Params = {};
  for (const [k, v] of Object.entries(params)) if (ALLOWED.has(k) && v !== undefined) out[k] = v;
  return out;
}

function loadTools() {
  if (loaded) return;
  loaded = true;

  // Sem consentimento obrigatório, o build já pôs o código base no <head> (init + PageView
  // na entrada) — aqui não se repete, senão o PageView sairia duplicado.
  if (tracking.metaPixelId && !window.fbq) {
    // Snippet oficial do Meta Pixel (base code)
    /* eslint-disable */
    (function (f: any, b: Document, e: string, v: string) {
      if (f.fbq) return;
      const n: any = (f.fbq = function (...args: unknown[]) {
        n.callMethod ? n.callMethod(...args) : n.queue.push(args);
      });
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      const t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      b.head.appendChild(t);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    window.fbq!("init", tracking.metaPixelId);
    window.fbq!("track", "PageView");
  }
}

function send(name: EventName, params: Params) {
  if (!window.fbq) return;
  const clean = sanitize(params);
  const std = META_STANDARD[name];
  if (std) window.fbq("track", std, clean);
  else window.fbq("trackCustom", name, clean);
}

export function track(name: EventName, params: Params = {}) {
  (window.__mpEvents ??= []).push({ name, params });
  if (tracking.debug) console.info("[track]", name, params);

  const consent = getConsent();
  if (consent === "granted") {
    loadTools();
    send(name, params);
  } else if (consent === null) {
    pending.push([name, params]);
  }
}

/** Dispara no máximo uma vez por carregamento de página. */
export function trackOnce(name: EventName, params: Params = {}, key: string = name) {
  if (once.has(key)) return;
  once.add(key);
  track(name, params);
}

/** Chamar uma vez na entrada de cada página. */
export function initAnalytics() {
  if (getConsent() === "granted") loadTools();
  onConsent((state) => {
    if (state === "granted") {
      loadTools();
      pending.forEach(([n, p]) => send(n, p));
    }
    pending = [];
  });
}

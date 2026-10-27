/**
 * Destinos de checkout. Toda URL de compra passa por aqui.
 * URL vazia → `null`: o botão não leva a lugar inexistente.
 */
import { checkout, plans, tracking, upgrade, type PlanId } from "../config/site";
import { track } from "./analytics";
import { withParams } from "./params";

export type CheckoutKind = "essencial" | "completo" | "upgrade";

const URLS: Record<CheckoutKind, string> = {
  essencial: checkout.checkoutEssencialUrl,
  completo: checkout.checkoutCompletoUrl,
  upgrade: checkout.checkoutUpgradeUrl,
};

/** Há URL válida configurada? (não lê a página — seguro no pré-render) */
export function hasCheckoutUrl(kind: CheckoutKind): boolean {
  return /^https:\/\//.test(URLS[kind]?.trim() ?? "");
}

declare global {
  interface Window {
    /** Montado pelo script de UTMs da Utmify (scripts/utms/latest.js). */
    utmParams?: URLSearchParams;
  }
}

export function checkoutUrl(kind: CheckoutKind): string | null {
  if (!hasCheckoutUrl(kind)) return null;
  const url = new URL(withParams(URLS[kind].trim()));
  // A Utmify remonta as UTMs com o ID da visita (utm_source=…jLj<id>) e só aplica isso
  // a links <a>; os botões de compra navegam por código, então a mesclagem é feita aqui.
  // Sem isso a venda chega à Utmify sem ligação com a visita/anúncio.
  try {
    window.utmParams?.forEach((value, key) => {
      if (value) url.searchParams.set(key, value);
    });
  } catch {
    /* script da Utmify ausente ou bloqueado: seguem as UTMs da própria URL */
  }
  return url.toString();
}

export function checkoutValueCents(kind: CheckoutKind): number {
  return kind === "upgrade" ? upgrade.priceCents : plans[kind as PlanId].priceCents;
}

/** Fluxo de compra está pronto? (todas as URLs necessárias configuradas) */
export function purchaseReady(): boolean {
  const needed: CheckoutKind[] = ["essencial", "completo"];
  if (upgrade.enabled) needed.push("upgrade");
  return needed.every(hasCheckoutUrl);
}

/**
 * Registra o InitiateCheckout e redireciona.
 * Retorna false se a URL não está configurada (o chamador mostra o aviso).
 */
export function goToCheckout(kind: CheckoutKind): boolean {
  const url = checkoutUrl(kind);
  if (!url) return false;
  const value = checkoutValueCents(kind) / 100;
  track("checkout_redirect", {
    value,
    currency: tracking.currency,
    plan: kind,
    content_name: kind === "essencial" ? plans.essencial.name : plans.completo.name,
  });
  // pequena folga para o pixel enviar antes da navegação
  window.setTimeout(() => openCheckout(url), window.fbq ? 250 : 0);
  return true;
}

/**
 * Navega por um link <a> (e não location.assign): a Utmify registra o InitiateCheckout ao
 * ver o clique num link de checkout, em qualquer navegador. Por location.assign ela só
 * percebe via Navigation API, que navegadores antigos (ex.: iOS desatualizado) não têm.
 */
function openCheckout(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.hidden = true;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

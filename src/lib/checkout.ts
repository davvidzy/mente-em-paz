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

export function checkoutUrl(kind: CheckoutKind): string | null {
  const raw = URLS[kind]?.trim();
  if (!raw || !/^https:\/\//.test(raw)) return null;
  return withParams(raw);
}

export function checkoutValueCents(kind: CheckoutKind): number {
  return kind === "upgrade" ? upgrade.priceCents : plans[kind as PlanId].priceCents;
}

/** Fluxo de compra está pronto? (todas as URLs necessárias configuradas) */
export function purchaseReady(): boolean {
  const needed: CheckoutKind[] = ["essencial", "completo"];
  if (upgrade.enabled) needed.push("upgrade");
  return needed.every((k) => checkoutUrl(k) !== null);
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
  window.setTimeout(() => window.location.assign(url), window.fbq ? 250 : 0);
  return true;
}

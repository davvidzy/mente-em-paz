/**
 * Consentimento (LGPD) para ferramentas não essenciais (Meta Pixel).
 * Nada de rastreamento é carregado antes da escolha da visitante.
 */
import { tracking } from "../config/site";
import { read, write } from "./storage";

export type ConsentState = "granted" | "denied" | null;
const KEY = "mp_consent";
const listeners = new Set<(s: ConsentState) => void>();

/** Há alguma ferramenta configurada que dependa de consentimento? */
export const hasTrackingTools = () => Boolean(tracking.metaPixelId);

export function getConsent(): ConsentState {
  if (!tracking.requireConsent) return "granted";
  const v = read<string>(KEY, "local");
  return v === "granted" || v === "denied" ? v : null;
}

export function setConsent(state: Exclude<ConsentState, null>): void {
  write(KEY, state, "local");
  listeners.forEach((fn) => fn(state));
}

export function onConsent(fn: (s: ConsentState) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

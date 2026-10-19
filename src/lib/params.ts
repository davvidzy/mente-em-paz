/**
 * Preservação de parâmetros de campanha (UTMs, fbclid…) do anúncio até o checkout.
 * Guardados em sessionStorage (só nesta aba, apagados ao fechar).
 * Nunca recebem respostas do quiz.
 */
import { checkout } from "../config/site";
import { read, write } from "./storage";

const KEY = "mp_params";

export function captureParams(): void {
  const url = new URL(window.location.href);
  const stored = read<Record<string, string>>(KEY) ?? {};
  let changed = false;
  for (const name of checkout.forwardQueryParams) {
    const v = url.searchParams.get(name);
    if (v) {
      stored[name] = v;
      changed = true;
    }
  }
  if (changed) write(KEY, stored);
}

export function getParams(): Record<string, string> {
  return read<Record<string, string>>(KEY) ?? {};
}

/** Acrescenta os parâmetros guardados à URL, SEM sobrescrever os que já existem nela. */
export function withParams(target: string | URL): string {
  const url = new URL(target, window.location.href);
  for (const [k, v] of Object.entries(getParams())) {
    if (!url.searchParams.has(k)) url.searchParams.set(k, v);
  }
  return url.toString();
}

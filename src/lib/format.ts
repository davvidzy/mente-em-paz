const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 1990 → "R$ 19,90" (com espaço normal, para quebrar bem no layout). */
export function formatBRL(cents: number): string {
  return brl.format(cents / 100).replace(/ /g, " ");
}

/** Divide o preço para exibição tipográfica: { currency: "R$", int: "19", dec: ",90" } */
export function priceParts(cents: number) {
  const int = Math.floor(cents / 100);
  const dec = String(cents % 100).padStart(2, "0");
  return { currency: "R$", int: int.toLocaleString("pt-BR"), dec: `,${dec}` };
}

/** Substitui {chaves} em um texto de configuração. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? String(values[k]) : m));
}

/** Converte **destaque** em segmentos para renderização. */
export function splitEmphasis(text: string): { text: string; em: boolean }[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("**") ? { text: part.slice(2, -2), em: true } : { text: part, em: false },
    );
}

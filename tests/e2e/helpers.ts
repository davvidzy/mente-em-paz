import { expect, type Page } from "@playwright/test";

export const ANSWERS_PAIS = [
  "Continuo pensando nos meus pais.",
  "Medo de acontecer algo com meus pais.",
  "Consigo aproveitar esse momento.",
];

export const ANSWERS_CALM = [
  "Geralmente consigo relaxar.",
  "Nada específico, só não consigo desacelerar.",
  "Consigo aproveitar esse momento.",
];

export const TOTAL = 3;

export async function answerQuiz(page: Page, answers: string[]) {
  for (const [i, label] of answers.entries()) {
    await expect(page.getByText(`Pergunta ${i + 1} de ${TOTAL}`)).toBeVisible();
    await page.getByRole("button", { name: label, exact: true }).click();
  }
}

export async function events(page: Page): Promise<string[]> {
  return page.evaluate(() => (window.__mpEvents ?? []).map((e) => e.name));
}

/** Eventos registrados pelo teste — sobrevivem ao redirecionamento para o checkout. */
export async function recordEvents(page: Page): Promise<string[]> {
  const names: string[] = [];
  await page.exposeFunction("__recordEvent", (name: string) => names.push(name));
  await page.addInitScript(() => {
    const list: { name: string }[] = [];
    list.push = (...items) => {
      for (const e of items) (window as unknown as { __recordEvent: (n: string) => void }).__recordEvent(e.name);
      return Array.prototype.push.apply(list, items);
    };
    (window as unknown as { __mpEvents: unknown }).__mpEvents = list;
  });
  return names;
}

/** Responde no lugar do Meta e da Utmify: nenhum evento de teste chega aos pixels reais. Devolve as URLs pedidas. */
export async function blockTrackers(page: Page): Promise<string[]> {
  const hits: string[] = [];
  await page.route(/facebook\.(net|com)|utmify\.com\.br/, (route) => {
    hits.push(route.request().url());
    return route.fulfill({ contentType: "text/javascript", body: "" });
  });
  return hits;
}

/** Responde no lugar da Wiapy: o teste confere o destino sem abrir o checkout real. */
export async function stubCheckout(page: Page) {
  await page.route("https://pay.wiapy.com/**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Checkout (teste)</title>" }),
  );
}

export function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  return errors;
}

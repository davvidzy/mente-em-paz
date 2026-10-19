import { expect, type Page } from "@playwright/test";

export const ANSWERS_PAIS = [
  "Continuo pensando nos meus pais.",
  "Medo de acontecer algo com meus pais.",
  "Só em algumas noites.",
  "Preocupação de alguém precisar de mim.",
  "Tranquilidade por saber que fiz o possível.",
];

export const ANSWERS_CALM = [
  "Geralmente consigo relaxar.",
  "Nada específico, só não consigo desacelerar.",
  "Na maioria das vezes, sim.",
  "Consigo aproveitar esse momento.",
  "Uma rotina noturna mais leve.",
];

export async function answerQuiz(page: Page, answers: string[]) {
  for (const [i, label] of answers.entries()) {
    await expect(page.getByText(`Pergunta ${i + 1} de 5`)).toBeVisible();
    await page.getByRole("button", { name: label, exact: true }).click();
  }
}

export async function events(page: Page): Promise<string[]> {
  return page.evaluate(() => (window.__mpEvents ?? []).map((e) => e.name));
}

export function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  return errors;
}

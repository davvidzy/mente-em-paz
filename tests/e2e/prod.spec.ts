import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { ANSWERS_PAIS, answerQuiz, collectErrors } from "./helpers";

const WIDTHS = [320, 360, 375, 390, 430, 768, 1024, 1440];
const PREVIEW = /previewCheckout:\s*true/.test(readFileSync("src/config/site.ts", "utf8"));

test.describe("Build de produção", () => {
  test("sem rolagem horizontal em nenhuma largura (quiz, resultado, LP)", async ({ page }) => {
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 800 });
      for (const path of ["/", "/mente-em-paz/", "/privacidade/"]) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${path} @ ${w}px`).toBeLessThanOrEqual(0);
      }
      await page.goto("/");
      await page.getByRole("button", { name: /Descobrir agora/ }).click();
      const overflowQ = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflowQ, `pergunta @ ${w}px`).toBeLessThanOrEqual(0);
    }
  });

  test("LP: ordem das seções, opcionais ocultas, sem placeholders, botões sem checkout desabilitados", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/mente-em-paz/");
    const order = await page.locator("main [data-section]").evaluateAll((els) => els.map((e) => e.getAttribute("data-section")));
    // áudio, especialista provisória, espaço de bônus e depoimentos sem conteúdo → ocultos; vídeo fica no hero
    expect(order).toEqual(["identificacao", "produto", "planos", "garantia", "faq", "cta-final"]);
    await expect(page.locator("[data-hero] video")).toHaveCount(0);
    await expect(page.locator("[data-dev-placeholder]")).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText("Placeholder");

    if (PREVIEW) {
      // modo de visualização: botões ativos, popup abre, nada redireciona
      await page.locator('[data-plan="essencial"]').click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toContainText("De R$ 67,90 por R$ 57,90");
      await page.getByRole("button", { name: /Sim, quero o Completo/ }).click();
      await expect(page.locator("[data-notice]")).toContainText("Checkout em configuração");
      await expect(page).toHaveURL(/\/mente-em-paz\/$/);
    } else {
      for (const id of ["essencial", "completo"]) {
        const btn = page.locator(`[data-plan="${id}"]`);
        await expect(btn).toBeDisabled();
        await expect(btn).toHaveText("Checkout em configuração");
      }
    }
    await expect(page.locator("#planos")).toContainText("39");
    await expect(page.locator("#planos")).toContainText("67");
    // sem pixel configurado → sem banner de cookies e sem script do Meta
    await expect(page.getByRole("region", { name: "Aviso de cookies" })).toHaveCount(0);
    expect(await page.locator('script[src*="fbevents"]').count()).toBe(0);
    expect(errors).toEqual([]);
  });

  test("site em subpasta: quiz → resultado → LP", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("http://localhost:4174/promo/?utm_source=ig");
    await page.getByRole("button", { name: /Descobrir agora/ }).click();
    await answerQuiz(page, ANSWERS_PAIS);
    await expect(page).toHaveURL("http://localhost:4174/promo/resultado/");
    await page.getByRole("button", { name: /Conhecer o Mente em Paz/ }).click();
    await expect(page).toHaveURL("http://localhost:4174/promo/mente-em-paz/?utm_source=ig");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Agora é hora de cuidar de você");
    // logo e fontes carregaram
    const logoOk = await page.locator("header img").first().evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    expect(logoOk).toBe(true);
    expect(errors).toEqual([]);
  });

  test("acessibilidade básica: um h1 por página, imagens com alt, alvos de toque ≥ 44px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/mente-em-paz/");
    await expect(page.locator("h1")).toHaveCount(1);
    const missingAlt = await page.locator("img:not([alt])").count();
    expect(missingAlt).toBe(0);
    const small = await page.locator("main button:visible, header button:visible").evaluateAll((els) =>
      els.map((e) => e.getBoundingClientRect()).filter((r) => r.height < 44).length,
    );
    expect(small).toBe(0);
  });
});

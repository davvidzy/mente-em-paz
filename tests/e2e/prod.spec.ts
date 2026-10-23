import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ANSWERS_PAIS, answerQuiz, collectErrors, stubCheckout } from "./helpers";

const WIDTHS = [320, 360, 375, 390, 430, 768, 1024, 1440];
const SITE = readFileSync("src/config/site.ts", "utf8");
const PREVIEW = /previewCheckout:\s*true/.test(SITE);
const READY = ["checkoutEssencialUrl", "checkoutCompletoUrl", "checkoutUpgradeUrl"].every((k) => new RegExp(`${k}:\\s*"https://`).test(SITE));

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
      await page.getByText("Continuo pensando nos meus pais.").click(); // vai para a pergunta 2
      await page.getByText("Pergunta 2 de 3").waitFor();
      const overflowQ = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflowQ, `pergunta @ ${w}px`).toBeLessThanOrEqual(0);
    }
  });

  test("LP: ordem das seções, opcionais ocultas, sem placeholders, botões de compra conforme o checkout", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/mente-em-paz/");
    const order = await page.locator("main [data-section]").evaluateAll((els) => els.map((e) => e.getAttribute("data-section")));
    // áudio, especialista provisória, espaço de bônus e depoimentos sem conteúdo → ocultos; vídeo fica no hero
    expect(order).toEqual(["identificacao", "produto", "bonus", "planos", "garantia", "faq", "cta-final"]);
    await expect(page.locator("[data-hero] video")).toHaveCount(0);
    await expect(page.locator("[data-dev-placeholder]")).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText("Placeholder");

    if (READY) {
      // links reais: popup do Essencial e aceite levam ao checkout de upgrade (Wiapy simulada)
      await stubCheckout(page);
      await page.locator('[data-plan="essencial"]').click();
      await expect(page.getByRole("dialog")).toContainText("De R$ 67,90 por R$ 57,90");
      await page.getByRole("button", { name: /Sim, quero o Completo/ }).click();
      await expect(page).toHaveURL(/^https:\/\/pay\.wiapy\.com\//);
      await page.goBack();
    } else if (PREVIEW) {
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
    const small = await page.locator("main :is(button, a.btn):visible, header :is(a, button):visible").evaluateAll((els) =>
      els.map((e) => e.getBoundingClientRect()).filter((r) => r.height < 44).length,
    );
    expect(small).toBe(0);
  });

  test("bônus: 5 cards do Completo, textos curtos no celular, total e cronômetro", async ({ page }) => {
    const lines = (sel: string) =>
      page.locator(sel).evaluateAll((els) =>
        els.map((e) => Math.round(e.getBoundingClientRect().height / parseFloat(getComputedStyle(e).lineHeight))),
      );
    for (const width of [320, 390, 430]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/mente-em-paz/");
      const sec = page.locator("#bonus");
      await expect(sec.getByRole("heading", { level: 3 })).toHaveCount(5);
      await expect(sec.getByText("Incluso no Completo")).toHaveCount(5);
      expect(Math.max(...(await lines("#bonus-title"))), `título @ ${width}px`).toBeLessThanOrEqual(2);
      expect(Math.max(...(await lines("#bonus-title + p"))), `texto @ ${width}px`).toBeLessThanOrEqual(3);
      expect(Math.max(...(await lines("#bonus [data-bonus-desc]"))), `descrições @ ${width}px`).toBeLessThanOrEqual(3);
      const overflow = await sec.evaluate((s) => [...s.querySelectorAll("*")].filter((e) => e.getBoundingClientRect().right > innerWidth).length);
      expect(overflow, `estouro @ ${width}px`).toBe(0);
    }
    const sec = page.locator("#bonus");
    await expect(sec).not.toContainText("estão incluídos no");
    // capas carregadas (também em subpasta, ver teste sem JS)
    const covers = sec.locator("article img");
    await expect(covers).toHaveCount(5);
    for (const img of await covers.all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
    }
    // card do Completo lista os mesmos 5 bônus da seção
    const planBonuses = page.locator("#planos [data-plan-bonuses]");
    await expect(planBonuses).toContainText("+ 5 bônus exclusivos");
    expect(await planBonuses.getByRole("listitem").allInnerTexts()).toEqual(await sec.getByRole("heading", { level: 3 }).allInnerTexts());
    if (/^\s*showValues:\s*true/m.test(SITE)) {
      await expect(sec.locator("s")).toHaveText("R$ 124,50");
      await expect(sec).toContainText("R$ 0,00");
    } else {
      await expect(sec.locator("s")).toHaveCount(0);
      await expect(sec).toContainText("5 bônus inclusos sem custo adicional");
    }
    if (/countdownSeconds:\s*(?!0\b)\d/.test(SITE)) {
      const timer = sec.getByRole("timer");
      const first = await timer.innerText();
      await expect(timer).not.toHaveText(first, { timeout: 3000 }); // diminuindo
      expect(await timer.innerText()).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    }
  });

  test("acessibilidade: axe sem violações WCAG 2.2 AA (LP com pergunta do FAQ aberta, quiz)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    // sem a animação de entrada: o axe mede as cores finais (e não blocos ainda em opacidade 0)
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const path of ["/mente-em-paz/", "/"]) {
      await page.goto(path);
      const faq = page.locator("main button[aria-expanded]").first(); // abre uma pergunta (uma por vez)
      if (await faq.count()) await faq.click();
      const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`), path).toEqual([]);
    }
  });

  test("LP pré-renderizada: oferta legível e navegável sem JavaScript", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false, baseURL: "http://localhost:4174" });
    const page = await ctx.newPage();
    await page.goto("/promo/mente-em-paz/"); // em subpasta: links e assets relativos
    await expect(page.locator("h1")).toContainText("Agora é hora de cuidar de você");
    await expect(page.locator("#planos")).toContainText("R$ 39,90");
    const logoOk = await page.locator("header img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    expect(logoOk).toBe(true);
    const cover = page.locator("#bonus article img").first();
    await cover.scrollIntoViewIfNeeded();
    await expect.poll(() => cover.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
    await page.locator("header a[href='#planos']").click();
    await expect(page).toHaveURL(/#planos$/);
    await expect(page.locator("footer a", { hasText: "Termos de Uso" })).toHaveAttribute("href", "../termos/");
    await ctx.close();
  });
});

import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ANSWERS_PAIS, answerQuiz, blockMeta, collectErrors, stubCheckout } from "./helpers";

const WIDTHS = [320, 360, 375, 390, 430, 768, 1024, 1440];
const SITE = readFileSync("src/config/site.ts", "utf8");
const PREVIEW = /previewCheckout:\s*true/.test(SITE);
const READY = ["checkoutEssencialUrl", "checkoutCompletoUrl", "checkoutUpgradeUrl"].every((k) => new RegExp(`${k}:\\s*"https://`).test(SITE));

test.beforeEach(({ page }) => blockMeta(page));

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
    // especialista só com expert.verified; depoimentos sem conteúdo → ocultos
    const expertOn = !/verified:\s*false/.test(SITE);
    expect(order).toEqual(["identificacao", "diferencial", "produto", "demonstracao", ...(expertOn ? ["especialista"] : []), "programa", "bonus", "planos", "garantia", "faq", "cta-final"]);
    await expect(page.locator("[data-hero] video")).toHaveCount(0);
    // mockup do portal entre a descrição e o CTA, já carregado
    const mockup = page.locator("[data-hero] img[data-hero-mockup]");
    await expect.poll(() => mockup.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
    const [descBottom, mockTop, mockBottom, ctaTop] = await page.evaluate(() => {
      const r = (s: string) => document.querySelector(s)!.getBoundingClientRect();
      return [r("#hero-title + p").bottom, r("[data-hero-mockup]").top, r("[data-hero-mockup]").bottom, r("[data-hero] a[href='#planos']").top];
    });
    expect(mockTop).toBeGreaterThan(descBottom);
    expect(ctaTop).toBeGreaterThan(mockBottom);
    await expect(page.locator("[data-dev-placeholder]")).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText("Placeholder");

    if (READY) {
      // links reais: popup do Essencial e aceite levam ao checkout de upgrade (Wiapy simulada)
      await stubCheckout(page);
      await page.locator('[data-plan="essencial"]').click();
      await expect(page.getByRole("dialog")).toContainText("De R$ 67,90 por R$ 57,90");
      await page.getByRole("dialog").getByRole("button", { name: "Quero o Completo" }).click();
      await expect(page).toHaveURL(/^https:\/\/pay\.wiapy\.com\//);
      await page.goBack();
    } else if (PREVIEW) {
      // modo de visualização: botões ativos, popup abre, nada redireciona
      await page.locator('[data-plan="essencial"]').click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toContainText("De R$ 67,90 por R$ 57,90");
      await page.getByRole("dialog").getByRole("button", { name: "Quero o Completo" }).click();
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
    // conteúdo dos planos (Completo primeiro): 8 itens no Completo, 5 no Essencial, cada um com sua frase final
    const items = page.locator("#planos [data-plan-items]");
    await expect(items.nth(1).getByRole("listitem")).toHaveCount(5);
    await expect(items.nth(0).getByRole("listitem")).toHaveCount(8);
    await expect(items.nth(0).locator("[data-plan-closing]")).toHaveText("O programa completo e recursos extras para quando a rotina pedir mais cuidado.");
    await expect(items.nth(1).locator("[data-plan-closing]")).toHaveText("Uma forma simples de começar seu momento de descanso.");
    await expect(page.locator("#planos")).toContainText("Experiência completa");
    await expect(page.locator("#planos")).toContainText("5% de desconto no Pix");
    await expect(page.locator("#programa li")).toHaveCount(7);
    // objeções resolvidas antes dos planos
    await expect(page.locator("#diferencial li")).toHaveCount(3);
    await expect(page.locator("#produto [data-routine] > li")).toHaveCount(3);
    await expect(page.locator("#demonstracao")).toContainText("Trecho real de um dos áudios do Mente em Paz.");
    await expect(page.locator("#garantia [data-guarantee-notes] li")).toHaveCount(4);
    await expect(page.locator("main")).not.toContainText("esse é o objetivo");
    // sem aviso de cookies na tela (pixel na entrada ou recusado no estado padrão dos testes)
    await expect(page.getByRole("region", { name: "Aviso de cookies" })).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test("site em subpasta: quiz → resultado → LP", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("http://localhost:4174/promo/?utm_source=ig");
    await answerQuiz(page, ANSWERS_PAIS);
    await expect(page).toHaveURL("http://localhost:4174/promo/resultado/");
    await page.getByRole("button", { name: /Conhecer o Mente em Paz/ }).click();
    await expect(page).toHaveURL("http://localhost:4174/promo/mente-em-paz/?utm_source=ig");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Sua noite mais tranquila começa com um simples play.");
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

  test("Meta Pixel: PageView na entrada, sem duplicar (ou só após aceitar, com consentimento)", async ({ browser }) => {
    const consent = /REQUIRE_CONSENT\s*=\s*true/.test(readFileSync("src/config/pixel.ts", "utf8"));
    const ctx = await browser.newContext({ storageState: undefined, baseURL: "http://localhost:4173" });
    const page = await ctx.newPage();
    const hits = await blockMeta(page); // Meta simulado: nada chega ao pixel real
    // o código oficial enfileira `arguments` (não arrays)
    const calls = () => page.evaluate(() => (window.fbq?.queue ?? []).map((c) => Array.from(c as ArrayLike<unknown>).slice(0, 2).join(" ")));
    const banner = page.getByRole("region", { name: "Aviso de cookies" });

    for (const path of ["/", "/mente-em-paz/"]) {
      const html = await (await page.request.get(path)).text();
      // código base no <head> (antes do JS do site) e <noscript> — só sem consentimento obrigatório
      expect(html.includes("fbq('init','1701181361725576')"), path).toBe(!consent);
      expect(html.includes("facebook.com/tr?id=1701181361725576"), path).toBe(!consent);
    }

    await page.goto("/mente-em-paz/");
    if (consent) {
      await expect(banner).toBeVisible();
      expect(hits).toEqual([]);
      await banner.getByRole("button", { name: "Aceitar" }).click();
    } else {
      await page.waitForTimeout(1500); // o aviso apareceria em 0,9 s
      await expect(banner).toHaveCount(0);
    }
    await expect(page.locator('script[src*="fbevents"]')).toHaveCount(1);
    await expect.poll(calls).toEqual(expect.arrayContaining(["track ViewContent"]));
    const sent = await calls();
    expect(sent.filter((c) => c === "init 1701181361725576")).toHaveLength(1);
    expect(sent.filter((c) => c === "track PageView")).toHaveLength(1);
    expect(hits.some((u) => u.includes("fbevents.js"))).toBe(true);
    await ctx.close();
  });

  test("áudio de demonstração: carrega e toca", async ({ page }) => {
    await page.goto("/mente-em-paz/");
    const sec = page.locator("#demonstracao");
    const audio = sec.locator("audio");
    await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => a.duration || 0)).toBeGreaterThan(5);
    await sec.getByRole("button", { name: "Reproduzir áudio" }).click();
    await expect(sec.getByRole("button", { name: "Pausar áudio" })).toBeVisible();
    await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => a.currentTime)).toBeGreaterThan(0);
  });

  test("bônus: 5 cards do Completo, textos curtos no celular, total e prazo", async ({ page }) => {
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
      expect(Math.max(...(await lines("#bonus [data-bonus-benefit]"))), `benefícios @ ${width}px`).toBeLessThanOrEqual(3);
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
    if (/^\s*showValues:\s*true/m.test(SITE)) {
      await expect(sec.locator("s")).toHaveText("R$ 134,50");
      await expect(sec).toContainText("R$ 0,00");
    } else {
      await expect(sec.locator("s")).toHaveCount(0);
      await expect(sec).toContainText("5 bônus exclusivos");
      await expect(sec).toContainText("Incluídos no Mente em Paz Completo, sem custo adicional.");
    }
    const days = Number(SITE.match(/deadlineDaysAhead:\s*(\d+)/)?.[1] ?? 0);
    if (days > 0) {
      // data de hoje + N no aparelho da visitante (não a do build)
      const expected = await page.evaluate((n) => {
        const d = new Date();
        d.setDate(d.getDate() + n);
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
      }, days);
      await expect(sec.locator("[data-deadline]")).toHaveText(expected);
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
    await expect(page.locator("h1")).toContainText("Sua noite mais tranquila começa com um simples play.");
    // sem JavaScript: prazo dos bônus já com a data de hoje (script inline) e compra por link
    await expect(page.locator("#bonus [data-deadline]")).toHaveText(/^\d{2}\/\d{2}$/);
    if (READY) await expect(page.locator('#planos a[data-plan="completo"]')).toHaveAttribute("href", /^https:\/\/pay\.wiapy\.com\//);
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

  test("especialista virtual: sem profissão nem CRP, aviso discreto no rodapé", async ({ page }) => {
    test.skip(/verified:\s*false/.test(SITE), "seção da especialista oculta");
    await page.goto("/mente-em-paz/");
    const sec = page.locator("#especialista");
    await expect(sec.getByRole("heading", { level: 2 })).toHaveText("Clara Martins");
    await expect(page.locator("body")).not.toContainText(/Psicóloga|CRP/);
    await expect(sec).toContainText("apresentadora virtual do Mente em Paz");
    await expect(sec).toContainText("Por trás do Mente em Paz existe uma equipe");
    await expect(page.locator("footer")).toContainText("Clara Martins é a apresentadora virtual do Mente em Paz.");
  });
});

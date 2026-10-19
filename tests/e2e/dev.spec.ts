import { expect, test } from "@playwright/test";
import { ANSWERS_CALM, ANSWERS_PAIS, answerQuiz, collectErrors, events } from "./helpers";

test.describe("Quiz", () => {
  test("fluxo completo: 5 perguntas, sem preços, resultado e CTA para a LP com UTMs", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/?utm_source=facebook&utm_campaign=lancamento&fbclid=abc123");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Você cuida de quem ama");
    await page.getByRole("button", { name: /Descobrir agora/ }).click();

    for (const [i, label] of ANSWERS_PAIS.entries()) {
      await expect(page.getByText(`Pergunta ${i + 1} de 5`)).toBeVisible();
      await expect(page.locator("body")).not.toContainText("R$");
      await page.getByRole("button", { name: label, exact: true }).click();
    }
    await expect(page).toHaveURL(/\/resultado\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Seu dia termina, mas suas preocupações continuam.");
    await expect(page.getByText("Terminar o dia sabendo que fez o possível")).toBeVisible();
    await expect(page.locator("body")).not.toContainText("R$");
    // respostas não vão para a URL
    expect(page.url()).not.toMatch(/pais|perfil|answer/);

    await page.getByRole("button", { name: /Conhecer o Mente em Paz/ }).click();
    await expect(page).toHaveURL(/\/mente-em-paz\/\?/);
    const url = new URL(page.url());
    expect(url.searchParams.get("utm_source")).toBe("facebook");
    expect(url.searchParams.get("utm_campaign")).toBe("lancamento");
    expect(url.searchParams.get("fbclid")).toBe("abc123");
    // frase discreta de acolhimento conforme o perfil
    await expect(page.locator("[data-eyebrow]")).toHaveText("Para quem cuida dos pais");
    expect(errors).toEqual([]);
  });

  test("Voltar (botão e navegador) preserva respostas; Q1 volta ao início", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Descobrir agora/ }).click();
    await page.getByRole("button", { name: "Minha cabeça não para de pensar.", exact: true }).click();
    await expect(page.getByText("Pergunta 2 de 5")).toBeVisible();

    await page.getByRole("button", { name: "Voltar" }).click();
    await expect(page.getByText("Pergunta 1 de 5")).toBeVisible();
    await expect(page.getByRole("button", { name: "Minha cabeça não para de pensar.", exact: true })).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "Voltar" }).click();
    await expect(page.getByRole("button", { name: /Descobrir agora/ })).toBeVisible();

    await page.goForward();
    await expect(page.getByText("Pergunta 1 de 5")).toBeVisible();
    await page.goForward();
    await expect(page.getByText("Pergunta 2 de 5")).toBeVisible();
    await page.goBack();
    await expect(page.getByText("Pergunta 1 de 5")).toBeVisible();
  });

  test("respostas diferentes geram resultados diferentes; positivas → tom preventivo", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Descobrir agora/ }).click();
    await answerQuiz(page, ANSWERS_CALM);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Seu descanso também merece um lugar na sua rotina.");
    await expect(page.getByText(/geralmente consegue relaxar ao deitar/)).toBeVisible();

    // refazer
    await page.getByRole("button", { name: /Refazer o quiz/ }).click();
    await expect(page.getByRole("button", { name: /Descobrir agora/ })).toBeVisible();
    await page.getByRole("button", { name: /Descobrir agora/ }).click();
    await answerQuiz(page, [
      "Minha cabeça não para de pensar.",
      "Preocupação com o dia seguinte.",
      "Quase nunca.",
      "Dificuldade de desligar os pensamentos.",
      "Menos pensamentos e preocupações.",
    ]);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Seu corpo está cansado, mas sua mente continua ocupada.");
  });

  test("eventos do quiz na ordem, sem respostas nos parâmetros e sem Purchase", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Descobrir agora/ }).click();
    await answerQuiz(page, ANSWERS_PAIS);
    await expect(page).toHaveURL(/\/resultado\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const evs = await events(page);
    expect(evs).toEqual([
      "quiz_started",
      ...Array(5).fill("quiz_question_answered"),
      "quiz_completed",
      "quiz_result_viewed",
    ]);
    const params = await page.evaluate(() => (window.__mpEvents ?? []).map((e) => e.params));
    for (const p of params) expect(Object.keys(p).every((k) => k === "question_number")).toBe(true);
  });

  test("acessar /resultado/ sem quiz volta ao início", async ({ page }) => {
    await page.goto("/resultado/");
    await expect(page).toHaveURL(/localhost:5173\/$/);
    await expect(page.getByRole("button", { name: /Descobrir agora/ })).toBeVisible();
  });
});

test.describe("Landing — ofertas (dev, checkout pendente)", () => {
  test("Essencial abre o popup; Esc fecha; foco preso; recusar → aviso do Essencial e não reabre", async ({ page }) => {
    await page.goto("/mente-em-paz/");
    const essencial = page.locator('[data-plan="essencial"]');
    await essencial.scrollIntoViewIfNeeded();
    await essencial.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Por apenas R$ 18,00 a mais");
    await expect(dialog).toContainText("R$ 67,90");
    await expect(page.getByRole("button", { name: /Sim, quero o Completo por R\$ 57,90/ })).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");

    // foco preso
    for (let i = 0; i < 5; i++) await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(essencial).toBeFocused();

    await essencial.click();
    await page.getByRole("button", { name: "Prefiro continuar com o Essencial." }).click();
    await expect(page.locator("[data-notice]")).toContainText("checkoutEssencialUrl");

    await essencial.click(); // não reabre de forma insistente
    await expect(dialog).toBeHidden();

    const evs = await events(page);
    expect(evs).toContain("upgrade_popup_opened");
    expect(evs).toContain("upgrade_declined");
    expect(evs.filter((e) => e === "upgrade_popup_opened")).toHaveLength(2);
    expect(evs).not.toContain("checkout_redirect");
  });

  test("aceitar upgrade → aviso do checkout de upgrade; Completo → aviso do Completo", async ({ page }) => {
    await page.goto("/mente-em-paz/");
    await page.locator('[data-plan="essencial"]').click();
    await page.getByRole("button", { name: /Sim, quero o Completo/ }).click();
    await expect(page.locator("[data-notice]")).toContainText("checkoutUpgradeUrl");
    await page.getByRole("button", { name: "Fechar aviso" }).click();
    await page.locator('[data-plan="completo"]').click();
    await expect(page.locator("[data-notice]")).toContainText("checkoutCompletoUrl");
    expect(await events(page)).toEqual(expect.arrayContaining(["upgrade_accepted", "completo_clicked"]));
  });

  test("FAQ abre uma pergunta por vez", async ({ page }) => {
    await page.goto("/mente-em-paz/");
    const q1 = page.getByRole("button", { name: "Preciso ter problemas para dormir?" });
    const q2 = page.getByRole("button", { name: "Posso ouvir os áudios mais de uma vez?" });
    await q1.click();
    await expect(q1).toHaveAttribute("aria-expanded", "true");
    await q2.click();
    await expect(q2).toHaveAttribute("aria-expanded", "true");
    await expect(q1).toHaveAttribute("aria-expanded", "false");
    await q2.click();
    await expect(q2).toHaveAttribute("aria-expanded", "false");
  });

  test("hero mobile: eyebrow em 1 linha, benefícios e vídeo logo abaixo do CTA", async ({ page }) => {
    for (const w of [320, 375]) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.goto("/mente-em-paz/");
      const eb = page.locator("[data-eyebrow]");
      const fits = await eb.evaluate((e) => e.scrollWidth <= e.clientWidth && e.clientHeight < 24);
      expect(fits, `eyebrow @ ${w}px`).toBe(true);
      const hero = page.locator("[data-hero]");
      await expect(hero.getByRole("list", { name: "Benefícios" })).toBeVisible();
      await expect(hero.locator("[data-dev-placeholder]")).toContainText("Vídeo de apresentação");
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `overflow @ ${w}px`).toBeLessThanOrEqual(0);
    }
    await expect(page.locator("#video-title")).toHaveCount(0); // seção de vídeo separada não existe mais
  });

  test("depoimentos: carrossel infinito com ≥ 4 placeholders (dev)", async ({ page }) => {
    await page.goto("/mente-em-paz/");
    const cards = page.locator('[data-testimonial="placeholder"]');
    expect(await cards.count()).toBeGreaterThanOrEqual(8); // 4 + cópia do loop
    await expect(page.locator("#depoimentos")).toContainText("Cliente há 7 dias");
    const anim = await page.locator(".mp-marquee-track").evaluate((e) => getComputedStyle(e).animationName);
    expect(anim).toBe("mp-marquee");
  });

  test("planos: Essencial antes do Completo no mobile, garantia abaixo de cada CTA; popup com novo texto", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/mente-em-paz/");
    const ess = await page.locator('[data-plan="essencial"]').boundingBox();
    const comp = await page.locator('[data-plan="completo"]').boundingBox();
    expect(ess!.y).toBeLessThan(comp!.y);
    await expect(page.locator("#planos [data-guarantee]")).toHaveCount(2);
    await page.locator('[data-plan="essencial"]').click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading")).toHaveText("Um desconto para você cuidar ainda mais de você.");
    await expect(dialog).toContainText("Por apenas R$ 18,00 a mais, leve o Mente em Paz Completo.");
    await expect(dialog).not.toContainText("materiais extras para acompanhar");
  });

  test("especialista logo abaixo da demonstração de áudio, marcada como provisória (dev)", async ({ page }) => {
    await page.goto("/mente-em-paz/");
    const order = await page.locator("main [data-section]").evaluateAll((els) => els.map((e) => e.id));
    expect(order.indexOf("especialista")).toBe(order.indexOf("demonstracao") + 1);
    const sec = page.locator("#especialista");
    await expect(sec.getByRole("heading", { level: 2 })).toHaveText("Clara Martins");
    await expect(sec).toContainText("Provisório");
  });

  test("CTA do hero rola até os planos", async ({ page }) => {
    await page.goto("/mente-em-paz/");
    await page.getByRole("button", { name: /Quero descansar melhor/ }).click();
    await expect(page.locator("#planos-title")).toBeInViewport();
  });
});

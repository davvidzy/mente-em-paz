import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { ANSWERS_CALM, ANSWERS_PAIS, TOTAL, answerQuiz, blockMeta, collectErrors, events, recordEvents, stubCheckout } from "./helpers";

test.beforeEach(({ page }) => blockMeta(page));

test.describe("Quiz", () => {
  test("fluxo completo: abre direto na 1ª pergunta, 3 perguntas, sem preços, resultado e CTA para a LP com UTMs", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/?utm_source=facebook&utm_campaign=lancamento&fbclid=abc123");
    // sem tela inicial
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Quando você finalmente deita, o que acontece?");
    await expect(page.getByText("3 perguntas", { exact: true })).toBeVisible();
    await expect(page.locator("body")).not.toContainText("sem cadastro");
    await expect(page.getByRole("button", { name: "Voltar" })).toHaveCount(0);

    for (const [i, label] of ANSWERS_PAIS.entries()) {
      await expect(page.getByText(`Pergunta ${i + 1} de ${TOTAL}`)).toBeVisible();
      await expect(page.locator("body")).not.toContainText("R$");
      await page.getByRole("button", { name: label, exact: true }).click();
    }
    await expect(page).toHaveURL(/\/resultado\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Seus pais dormem.Sua mente, não.");
    await expect(page.getByText("Como o Mente em Paz pode ajudar")).toBeVisible();
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

  test("Voltar (botão e navegador) preserva respostas", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Minha cabeça não para de pensar.", exact: true }).click();
    await expect(page.getByText("Pergunta 2 de 3")).toBeVisible();

    await page.getByRole("button", { name: "Voltar" }).click();
    await expect(page.getByText("Pergunta 1 de 3")).toBeVisible();
    await expect(page.getByRole("button", { name: "Minha cabeça não para de pensar.", exact: true })).toHaveAttribute("aria-pressed", "true");

    await page.goForward();
    await expect(page.getByText("Pergunta 2 de 3")).toBeVisible();
    await page.goBack();
    await expect(page.getByText("Pergunta 1 de 3")).toBeVisible();
  });

  test("respostas diferentes geram resultados diferentes; positivas → tom preventivo", async ({ page }) => {
    const cases: [string[], string][] = [
      [ANSWERS_CALM, "Proteja o descanso que você tem."],
      [
        ["Minha cabeça não para de pensar.", "Preocupação com o dia seguinte.", "Dificuldade de desligar os pensamentos."],
        "Seu corpo deita.Sua mente, não.",
      ],
      [
        ["Continuo pensando nos meus pais.", "Sensação de ter responsabilidades demais.", "Culpa por não estar ajudando."],
        "Você cuida de todos.Menos de você.",
      ],
    ];
    for (const [answers, title] of cases) {
      await page.goto("/");
      await page.evaluate(() => sessionStorage.clear());
      await page.goto("/");
      await answerQuiz(page, answers);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    }
  });

  test("resultado cabe em uma tela (sem rolagem) do iPhone SE ao desktop", async ({ page }) => {
    for (const [w, h] of [[320, 568], [375, 667], [390, 844], [1440, 900]]) {
      await page.setViewportSize({ width: w, height: h });
      await page.goto("/");
      await answerQuiz(page, ANSWERS_PAIS);
      await expect(page.locator("[data-result-title]")).toBeVisible();
      const overflow = await page.evaluate(() => ({
        y: document.documentElement.scrollHeight - innerHeight,
        x: document.documentElement.scrollWidth - innerWidth,
      }));
      expect(overflow, `${w}x${h}`).toEqual({ y: 0, x: 0 });
      // só título, "Seu resultado" e o card — sem refazer/espelho/desejo
      await expect(page.getByRole("button", { name: /Refazer/ })).toHaveCount(0);
      await expect(page.getByText("Pelo que você contou")).toHaveCount(0);
      await page.evaluate(() => sessionStorage.clear());
    }
  });

  test("eventos do quiz na ordem, sem respostas nos parâmetros e sem Purchase", async ({ page }) => {
    await page.goto("/");
    await answerQuiz(page, ANSWERS_PAIS);
    await expect(page).toHaveURL(/\/resultado\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const evs = await events(page);
    expect(evs).toEqual([
      "quiz_started",
      ...Array(TOTAL).fill("quiz_question_answered"),
      "quiz_completed",
      "quiz_result_viewed",
    ]);
    const params = await page.evaluate(() => (window.__mpEvents ?? []).map((e) => e.params));
    for (const p of params) expect(Object.keys(p).every((k) => k === "question_number")).toBe(true);
  });

  test("acessar /resultado/ sem quiz volta ao início", async ({ page }) => {
    await page.goto("/resultado/");
    await expect(page).toHaveURL(/localhost:5173\/$/);
    await expect(page.getByText("Pergunta 1 de 3")).toBeVisible();
  });
});

test.describe("Landing — ofertas (dev, checkout Wiapy)", () => {
  test("Essencial abre o popup; Esc fecha; foco preso; recusar → checkout do Essencial e não reabre", async ({ page }) => {
    const evs = await recordEvents(page);
    await stubCheckout(page);
    await page.goto("/mente-em-paz/");
    const essencial = page.locator('[data-plan="essencial"]');
    await essencial.scrollIntoViewIfNeeded();
    await essencial.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Por apenas R$ 18,00 a mais");
    await expect(dialog).toContainText("R$ 67,90");
    await expect(dialog.getByRole("button", { name: "Quero o Completo" })).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");

    // foco preso
    for (let i = 0; i < 5; i++) await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(essencial).toBeFocused();

    await essencial.click();
    await page.getByRole("button", { name: "Prefiro continuar com o Essencial" }).click();
    await expect(page).toHaveURL(/^https:\/\/pay\.wiapy\.com\/RRmfu6Uf2RK/);

    await page.goBack();
    await page.locator('[data-plan="essencial"]').click(); // não reabre de forma insistente: vai direto
    await expect(page).toHaveURL(/^https:\/\/pay\.wiapy\.com\/RRmfu6Uf2RK/);

    expect(evs).toContain("upgrade_declined");
    expect(evs.filter((e) => e === "upgrade_popup_opened")).toHaveLength(2);
    expect(evs).toContain("checkout_redirect");
  });

  test("aceitar upgrade → checkout de R$ 57,90; Completo → checkout de R$ 67,90; UTMs repassadas", async ({ page }) => {
    const evs = await recordEvents(page);
    await stubCheckout(page);
    await page.goto("/mente-em-paz/?utm_source=ig");
    await page.locator('[data-plan="essencial"]').click();
    await page.getByRole("dialog").getByRole("button", { name: "Quero o Completo" }).click();
    await expect(page).toHaveURL("https://pay.wiapy.com/HWF_wPkMAg7?utm_source=ig");
    await page.goBack();
    await page.locator('[data-plan="completo"]').click();
    await expect(page).toHaveURL("https://pay.wiapy.com/4U-4VtXIgz-e?utm_source=ig");
    expect(evs).toEqual(expect.arrayContaining(["upgrade_accepted", "completo_clicked", "checkout_redirect"]));
  });

  test("FAQ abre uma pergunta por vez", async ({ page }) => {
    await page.goto("/mente-em-paz/");
    const q1 = page.getByRole("button", { name: "Qual plano escolher?" });
    const q2 = page.getByRole("button", { name: "E se o e-mail de acesso não chegar?" });
    await q1.click();
    await expect(q1).toHaveAttribute("aria-expanded", "true");
    await q2.click();
    await expect(q2).toHaveAttribute("aria-expanded", "true");
    await expect(q1).toHaveAttribute("aria-expanded", "false");
    // suporte: link do WhatsApp com a mensagem pronta
    await expect(page.locator("#faq a", { hasText: "WhatsApp" })).toHaveAttribute("href", /^https:\/\/wa\.me\/5561996727795\?text=/);
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

  test("planos: Completo acima do Essencial no mobile, garantia abaixo de cada CTA; popup com novo texto", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/mente-em-paz/");
    const ess = await page.locator('[data-plan="essencial"]').boundingBox();
    const comp = await page.locator('[data-plan="completo"]').boundingBox();
    expect(comp!.y).toBeLessThan(ess!.y);
    await expect(page.locator("#planos [data-guarantee]")).toHaveCount(2);
    await page.locator('[data-plan="essencial"]').click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading")).toHaveText("Por apenas R$ 18,00 a mais, leve o Completo.");
    await expect(dialog).toContainText("De R$ 67,90 por R$ 57,90");
    await expect(dialog).not.toContainText("materiais extras para acompanhar");
  });

  test("popup de upgrade no celular: ~80% da tela, sem rolagem, botão em 1 linha, recusa sublinhada", async ({ page }) => {
    for (const [w, h] of [[320, 568], [360, 640], [375, 667], [390, 844], [430, 932]]) {
      await page.setViewportSize({ width: w, height: h });
      await page.goto("/mente-em-paz/");
      await page.evaluate(() => sessionStorage.clear()); // recusa anterior não reabre o popup
      await page.locator('[data-plan="essencial"]').click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      const box = await dialog.evaluate((d) => ({ h: d.clientHeight, sh: d.scrollHeight }));
      expect(box.sh, `rolagem @ ${w}x${h}`).toBeLessThanOrEqual(box.h);
      expect(Math.abs(box.h / h - 0.8), `altura @ ${w}x${h}`).toBeLessThan(0.02);
      const accept = dialog.getByRole("button", { name: "Quero o Completo" });
      expect(await accept.evaluate((b) => b.clientHeight), `botão em 1 linha @ ${w}`).toBeLessThanOrEqual(60);
      const decline = dialog.getByRole("button", { name: "Prefiro continuar com o Essencial" });
      expect(await decline.evaluate((b) => getComputedStyle(b).textDecorationLine)).toContain("underline");
      await page.keyboard.press("Escape");
    }
  });

  test("especialista logo abaixo da demonstração de áudio, marcada como provisória (dev)", async ({ page }) => {
    await page.goto("/mente-em-paz/");
    const order = await page.locator("main [data-section]").evaluateAll((els) => els.map((e) => e.id));
    expect(order.indexOf("especialista")).toBe(order.indexOf("demonstracao") + 1);
    const sec = page.locator("#especialista");
    await expect(sec.getByRole("heading", { level: 2 })).toHaveText("Clara Martins");
    await expect(sec).not.toContainText(/Psicóloga|CRP/);
    await expect(sec).toContainText("mulheres cuidadoras");
    await expect(sec.locator("blockquote")).toBeVisible();
    // não aprovada: marcada como prévia (e oculta no site publicado — ver prod.spec)
    if (/verified:\s*false/.test(readFileSync("src/config/site.ts", "utf8"))) await expect(sec).toContainText("Prévia · não publicada");
  });

  test("CTA do hero rola até os planos", async ({ page }) => {
    await page.goto("/mente-em-paz/");
    await page.getByRole("link", { name: /Quero descansar melhor/ }).click();
    await expect(page.locator("#planos-title")).toBeInViewport();
  });
});

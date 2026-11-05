/**
 * Textos da Landing Page (/mente-em-paz/), na ordem das seções.
 * Preços, planos, bônus, depoimentos, garantia e FAQ ficam em `site.ts`.
 * Trechos entre ** ** são exibidos em destaque.
 * Regra de copy (mobile 390px): títulos em 1–2 linhas, descrições em até 2 linhas,
 * cards com uma frase só. Condições de compra podem ocupar mais quando necessário.
 */

export const landing = {
  header: { cta: "Ver planos" },

  hero: {
    title: "O dia termina. **Mas sua mente não desliga?**",
    body: "Áudios guiados para desacelerar os pensamentos e relaxar antes de dormir.",
    cta: "Quero desacelerar",
    /**
     * Benefícios abaixo do CTA (discretos). SÓ condições reais e confirmadas.
     * `enabled: false` = não aparece no site.
     */
    benefits: [
      { icon: "duration", label: "Até 15 áudios guiados", enabled: true },
      { icon: "lifetime", label: "Acesso vitalício", enabled: true },
      { icon: "guarantee", label: "Garantia de {dias} dias", enabled: true },
      { icon: "once", label: "Pagamento único", enabled: true },
      { icon: "lying", label: "Ouça já na cama", enabled: false },
      { icon: "easy", label: "Sem precisar saber meditar", enabled: false },
    ] as { icon: "guarantee" | "lying" | "easy" | "lifetime" | "once" | "duration"; label: string; enabled: boolean }[],
  },

  /** Vídeo do portal (seção própria, logo após a identificação). */
  video: {
    title: "Muito mais que áudios para ouvir.",
  },

  identification: {
    title: "Nem todo cansaço desaparece ao deitar.",
    thoughts: ["Será que esqueci alguma coisa?", "E se amanhã der errado?", "Por que não consigo desligar?"],
    after: "Nem tudo precisa ser resolvido hoje.",
  },

  /**
   * Biblioteca: lista dos áudios (títulos e minutos em site.ts → program) com os
   * 3 passos de uso e o CTA. Também faz o papel do antigo "Mais que áudios soltos".
   */
  program: {
    title: "{n} áudios para cada momento.",
    text: "Do fim do expediente à hora de deitar, um caminho guiado para desacelerar.",
    steps: ["Escolha seu momento", "Dê o play", "Acompanhe a prática"],
    /** Etiqueta nos áudios que vêm no Essencial. */
    essencialTag: "Também no Essencial",
    cta: "Quero começar",
  },

  audioDemo: {
    title: "Ouça um pouco do Mente em Paz.",
    text: "Um trecho real de um dos áudios guiados.",
  },

  /** Bônus do Completo (itens e valores em site.ts). {n} = nº de bônus; {plano} = nome do Completo. */
  bonus: {
    /** Até 2 linhas no celular. */
    title: "{n} bônus para sua rotina.",
    /** Até 2 linhas no celular. */
    text: "Mais apoio para as noites mais difíceis.",
    tag: "Incluso no Completo",
    // com bonuses.showValues = true
    totalLabel: "Valor dos {n} bônus:",
    totalNote: "{n} bônus incluídos no Completo, sem custo adicional.",
    /** Com bonuses.deadlineDaysAhead > 0. {data} = hoje + N dias (DD/MM). */
    deadlineLabel: "Bônus grátis no Completo até {data}",
    // com bonuses.showValues = false
    noValuesHighlight: "{n} bônus exclusivos",
    noValuesNote: "Incluídos no Completo, sem custo adicional.",
  },

  testimonials: {
    title: "O que dizem nossas clientes.",
    text: "Experiências reais de quem incluiu o Mente em Paz na rotina.",
  },

  /** Roleta de cupom (código e prêmio em site.ts → coupon). {premio} = coupon.prize. */
  couponWheel: {
    badge: "Oferta misteriosa",
    title: "Gire a roleta e ganhe",
    titleAccent: "um desconto",
    /** {min} = coupon.validMinutes. */
    text: "Uma tentativa por pessoa · válido por {min} minutos.",
    spin: "Girar agora",
    spinning: "Girando…",
    wonTitle: "Parabéns! Você ganhou",
    wonText: "Use o cupom abaixo no checkout.",
    codeLabel: "Seu cupom",
    copy: "Copiar",
    copied: "Copiado!",
    expiresLabel: "Expira em",
    expiredTitle: "Seu cupom expirou",
    expiredText: "O prazo de {min} minutos para usar o desconto terminou.",
    expiredCta: "Ver os planos",
    cta: "Usar cupom agora",
    /** Rótulo (leitores de tela) do botão flutuante que reabre o cupom ganho. */
    reopen: "Ver meu cupom de desconto",
  },

  plans: {
    title: "Escolha seu Mente em Paz.",
    pendingCta: "Checkout em configuração",
  },

  finalCta: {
    title: "Sua mente também merece descanso.",
    cta: "Quero meu Mente em Paz",
  },

  footer: {
    disclaimer:
      "O Mente em Paz é um conteúdo de relaxamento e bem-estar, de uso complementar. Não é um tratamento e não substitui orientação especializada.",
  },
};

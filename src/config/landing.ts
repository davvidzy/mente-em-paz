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
    title: "Sua noite mais tranquila começa com **um simples play.**",
    body: "Até 7 áudios guiados para desacelerar antes de dormir. Sem meditar, sem complicações.",
    cta: "Quero descansar melhor",
    /**
     * Benefícios abaixo do CTA (discretos). SÓ condições reais e confirmadas.
     * `enabled: false` = não aparece no site.
     */
    benefits: [
      { icon: "duration", label: "Áudios de 10 a 17 min", enabled: true },
      { icon: "lifetime", label: "Acesso vitalício", enabled: true },
      { icon: "guarantee", label: "Garantia de {dias} dias", enabled: true },
      { icon: "once", label: "Pagamento único", enabled: true },
      { icon: "lying", label: "Ouça já deitada", enabled: false },
      { icon: "easy", label: "Sem precisar saber meditar", enabled: false },
    ] as { icon: "guarantee" | "lying" | "easy" | "lifetime" | "once" | "duration"; label: string; enabled: boolean }[],
  },

  identification: {
    title: "Seu corpo cansa. Sua mente não para.",
    thoughts: ["Será que meus pais estão bem?", "E se precisarem de mim?", "Será que fiz tudo hoje?"],
    after: "Cuidar de você não é abandonar quem ama.",
  },

  /** Diferença para áudios avulsos/gratuitos (logo após a identificação). Bloco compacto. */
  difference: {
    title: "Mais que áudios soltos: um caminho guiado.",
    text: "Sessões organizadas para preocupações, culpa e pensamentos acelerados.",
    items: [
      { icon: "sequence", text: "Uma sequência pronta para seguir." },
      { icon: "care", text: "Áudios pensados para a rotina de quem cuida." },
      { icon: "portal", text: "Tudo em um portal, para ouvir no seu ritmo." },
    ] as { icon: "sequence" | "care" | "portal"; text: string }[],
  },

  product: {
    title: "Como funciona?",
    steps: [
      "Receba seu acesso e abra o portal no celular.",
      "Deite, escolha um áudio e dê o play.",
      "Relaxe no seu ritmo. Pode pausar quando precisar.",
    ],
    cta: "Quero começar",
  },

  /** Lista das 7 noites (títulos e minutos em site.ts → program). */
  program: {
    title: "7 noites para desacelerar.",
    text: "Um áudio por noite. Depois, repita seus favoritos.",
    /** Etiqueta nas noites que vêm no Essencial. */
    essencialTag: "Também no Essencial",
  },

  audioDemo: {
    title: "Dê o play e sinta a experiência.",
    text: "Experimente um trecho real do Mente em Paz.",
  },

  /** Bônus do Completo (itens e valores em site.ts). {n} = nº de bônus; {plano} = nome do Completo. */
  bonus: {
    /** Até 2 linhas no celular. */
    title: "{n} bônus para sua rotina.",
    /** Até 2 linhas no celular. */
    text: "Mais apoio para você e momentos de paz para seus pais.",
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
    title: "Quem começa a cuidar de si também merece ser ouvida.",
    text: "Experiências reais de mulheres que incluíram o Mente em Paz na rotina.",
    /** {dias} = dias como cliente. */
    since: "Cliente há {dias} dias",
  },

  plans: {
    title: "Escolha seu Mente em Paz.",
    pendingCta: "Checkout em configuração",
  },

  finalCta: {
    title: "Agora, reserve um momento para você.",
    cta: "Quero meu Mente em Paz",
  },

  footer: {
    disclaimer:
      "O Mente em Paz é um recurso complementar de autocuidado e bem-estar. Não é tratamento médico ou psicológico e não substitui o acompanhamento de profissionais de saúde.",
  },
};

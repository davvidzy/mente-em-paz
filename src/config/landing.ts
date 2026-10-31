/**
 * Textos da Landing Page (/mente-em-paz/), na ordem das seções.
 * Preços, planos, bônus, depoimentos, garantia e FAQ ficam em `site.ts`.
 * Trechos entre ** ** são exibidos em destaque.
 */

export const landing = {
  header: { cta: "Ver planos" },

  hero: {
    title: "Sua noite mais tranquila começa com **um simples play.**",
    body: "Conheça o **Mente em Paz**: um programa com até 7 áudios guiados, organizados para ajudar você a desacelerar antes de dormir. Sem precisar saber meditar, esvaziar a mente ou mudar sua rotina.",
    cta: "Quero descansar melhor",
    /**
     * Benefícios abaixo do CTA (discretos). SÓ condições reais e confirmadas.
     * `enabled: false` = fora do hero (o acesso vitalício aparece nos planos e na garantia).
     */
    benefits: [
      { icon: "lying", label: "Ouça já deitada", enabled: true },
      { icon: "easy", label: "Sem precisar saber meditar", enabled: true },
      { icon: "once", label: "Pagamento único", enabled: true },
      { icon: "guarantee", label: "{dias} dias de garantia", enabled: true },
      { icon: "lifetime", label: "Acesso vitalício", enabled: false },
      { icon: "duration", label: "Áudios de 10 a 17 min", enabled: false },
    ] as { icon: "guarantee" | "lying" | "easy" | "lifetime" | "once" | "duration"; label: string; enabled: boolean }[],
  },

  identification: {
    title: "Seu corpo está cansado. Mas sua mente não descansa.",
    thoughts: [
      "Será que meus pais estão bem?",
      "E se precisarem de mim durante a noite?",
      "Será que fiz tudo o que precisava hoje?",
    ],
    after:
      "Cuidar de você não é deixar de cuidar deles. É o que te dá força para continuar.",
  },

  /** Diferença para áudios gratuitos (logo após a identificação). Bloco compacto. */
  difference: {
    title: "Não são apenas áudios de relaxamento. É um caminho guiado para desacelerar.",
    text: "Em vez de procurar o que ouvir a cada noite, você encontra sessões organizadas para diferentes momentos: preocupações, culpa, pensamentos acelerados e dificuldade de desligar do dia.",
    items: [
      { icon: "sequence", text: "Uma sequência pronta para seguir." },
      { icon: "care", text: "Áudios pensados para a rotina de quem cuida." },
      { icon: "portal", text: "Tudo organizado em um portal, para ouvir no seu ritmo." },
    ] as { icon: "sequence" | "care" | "portal"; text: string }[],
    closing: "Sem precisar decidir o que fazer. É só escolher seu áudio e dar o play.",
  },

  product: {
    title: "Como funciona?",
    steps: [
      "Receba o acesso por e-mail e abra o portal no celular.",
      "Deite, escolha o áudio e dê play. Não precisa saber meditar.",
      "Acompanhe no seu ritmo. Se precisar interromper, você pode continuar depois.",
    ],
    /** Dúvidas rápidas logo abaixo dos passos (antes dos planos; o FAQ detalha). */
    routine: {
      title: "Feito para caber na sua rotina. Não para virar mais uma obrigação.",
      items: [
        "Não precisa separar um horário extra: pode ouvir já deitada.",
        "Se seus pais precisarem de você, basta pausar.",
        "Não precisa esvaziar a mente nem acertar uma técnica.",
      ],
    },
    cta: "Quero começar agora",
  },

  /** Lista das 7 noites (títulos e minutos em site.ts → program). */
  program: {
    title: "Suas 7 noites",
    text: "Um áudio por noite, na ordem. Depois, repita os que mais fizerem bem a você.",
    /** Etiqueta nas noites que vêm no Essencial. */
    essencialTag: "Também no Essencial",
  },

  audioDemo: {
    title: "Antes de decidir, experimente um pedacinho dessa tranquilidade.",
    text: "Dê o play e conheça a experiência de ter uma voz guiando você para desacelerar, sem precisar fazer nada complicado.",
    /** Abaixo do player. */
    caption: "Trecho real de um dos áudios do Mente em Paz.",
  },

  /** Bônus do Completo (itens e valores em site.ts). {n} = nº de bônus; {plano} = nome do Completo. */
  bonus: {
    /** Até 2 linhas no celular. */
    title: "E mais {n} bônus para cuidar de você.",
    /** Até 3 linhas no celular. */
    text: "Recursos extras para acalmar a mente nos dias difíceis e dividir momentos de paz com seus pais.",
    tag: "Incluso no Completo",
    // com bonuses.showValues = true
    totalLabel: "Valor dos {n} bônus:",
    totalNote: "Incluídos no {plano}, sem custo adicional.",
    /** Com bonuses.deadlineDaysAhead > 0. {data} = hoje + N dias (DD/MM). */
    deadlineLabel: "Bônus grátis no Completo até {data}",
    // com bonuses.showValues = false
    noValuesHighlight: "{n} bônus exclusivos",
    noValuesNote: "Incluídos no {plano}, sem custo adicional.",
  },

  testimonials: {
    title: "Quem começa a cuidar de si também merece ser ouvida.",
    text: "Conheça experiências reais de mulheres que incluíram o Mente em Paz em sua rotina.",
    /** {dias} = dias como cliente. */
    since: "Cliente há {dias} dias",
  },

  plans: {
    title: "Escolha como quer começar seu momento de paz.",
    text: "Comece com as primeiras noites guiadas ou tenha a experiência completa, com recursos extras para diferentes momentos da sua rotina.",
    pendingCta: "Checkout em configuração",
  },

  finalCta: {
    title: "Você já faz tanto por quem ama. Reserve alguns minutos para você.",
    cta: "Quero meu Mente em Paz",
  },

  footer: {
    disclaimer:
      "O Mente em Paz é um recurso complementar de autocuidado e bem-estar. Não é tratamento médico ou psicológico e não substitui o acompanhamento de profissionais de saúde.",
  },
};

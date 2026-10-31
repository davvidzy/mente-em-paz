/**
 * Textos da Landing Page (/mente-em-paz/), na ordem das seções.
 * Preços, planos, bônus, depoimentos, garantia e FAQ ficam em `site.ts`.
 * Trechos entre ** ** são exibidos em destaque.
 */
import type { ProfileId } from "./quiz";

export const landing = {
  header: { cta: "Ver planos" },

  hero: {
    /** Uma linha no mobile (≤ 30 caracteres). */
    eyebrow: "Pausa noturna para quem cuida",
    title: "Seu dia terminou. **Sua mente continua de plantão.**",
    body: "O **Mente em Paz** é um programa de 7 noites com áudios guiados para desligar o alerta e descansar, sem deixar de cuidar de quem você ama.",
    cta: "Quero descansar melhor",
    /**
     * Benefícios abaixo do CTA. SÓ condições reais e confirmadas.
     * `enabled: false` = aguardando confirmação (não aparece no site).
     */
    benefits: [
      { icon: "duration", label: "Áudios de 10 a 17 min", enabled: true },
      { icon: "lifetime", label: "Acesso vitalício", enabled: true },
      { icon: "guarantee", label: "Garantia de {dias} dias", enabled: true },
      { icon: "once", label: "Pagamento único", enabled: true },
      { icon: "repeat", label: "Use quantas vezes quiser", enabled: false },
      { icon: "digital", label: "100% digital", enabled: false },
    ] as { icon: "guarantee" | "repeat" | "digital" | "lifetime" | "once" | "duration"; label: string; enabled: boolean }[],
  },

  /** Substitui o eyebrow quando a visitante vem do quiz. Uma linha no mobile (≤ 30 caracteres). */
  heroWelcome: {
    pais: "Para quem cuida dos pais",
    culpa: "Para descansar sem culpa",
    pensamentos: "Para desacelerar a mente",
    sobrecarga: "Para um respiro na rotina",
  } satisfies Record<ProfileId, string>,

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

  product: {
    title: "Como funciona?",
    steps: [
      "Receba o acesso por e-mail e abra o portal no celular.",
      "Deite, coloque o fone e dê play no áudio da noite.",
      "Pegou no sono no meio? Ótimo, esse é o objetivo.",
    ],
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
    title: "Ouça um trecho",
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
    noValuesHighlight: "{n} bônus inclusos sem custo adicional",
    noValuesNote: "Incluídos no {plano}.",
  },

  testimonials: {
    title: "O que dizem nossas clientes",
    /** {dias} = dias como cliente. */
    since: "Cliente há {dias} dias",
  },

  plans: {
    title: "Escolha seu momento de paz.",
    pendingCta: "Checkout em configuração",  },

  finalCta: {
    title: "Você já faz tanto por quem ama. Reserve alguns minutos para você.",
    cta: "Quero meu Mente em Paz",
  },

  footer: {
    disclaimer:
      "O Mente em Paz é um recurso complementar de autocuidado e bem-estar. Não é tratamento médico ou psicológico e não substitui o acompanhamento de profissionais de saúde.",
  },
};

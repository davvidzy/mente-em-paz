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
    title: "Você cuida de quem ama. **Agora é hora de cuidar de você.**",
    body: "O **Mente em Paz** reúne áudios guiados para você desacelerar à noite e descansar com mais tranquilidade.",
    cta: "Quero descansar melhor",
    /**
     * Benefícios abaixo do CTA. SÓ condições reais e confirmadas.
     * `enabled: false` = aguardando confirmação (não aparece no site).
     */
    benefits: [
      { icon: "lifetime", label: "Acesso vitalício", enabled: true },
      { icon: "once", label: "Pagamento único", enabled: true },
      { icon: "guarantee", label: "Garantia de {dias} dias", enabled: true },
      { icon: "repeat", label: "Use quantas vezes quiser", enabled: true },
      { icon: "digital", label: "100% digital", enabled: false },
    ] as { icon: "guarantee" | "repeat" | "digital" | "lifetime" | "once"; label: string; enabled: boolean }[],
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
      "Você não precisa esperar todas as preocupações desaparecerem para começar a cuidar de si.",
  },

  product: {
    title: "Como funciona?",
    steps: [
      "Escolha um momento tranquilo da noite.",
      "Acompanhe o áudio guiado no seu ritmo.",
      "Repita sempre que sentir necessidade.",
    ],
    cta: "Quero começar agora",
  },

  audioDemo: {
    title: "Ouça um trecho",
  },

  // Seção de bônus: aguardando novas instruções (ver BonusSlot.tsx)

  testimonials: {
    title: "O que dizem nossas clientes",
    /** {dias} = dias como cliente. */
    since: "Cliente há {dias} dias",
  },

  plans: {
    title: "Escolha seu momento de paz.",
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

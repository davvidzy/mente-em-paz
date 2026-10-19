/**
 * ─────────────────────────────────────────────────────────────────────
 *  CONFIGURAÇÃO CENTRAL — Mente em Paz
 * ─────────────────────────────────────────────────────────────────────
 *  Tudo o que é comercial ou editável fica aqui: preços, planos, links de
 *  checkout, mídia, depoimentos, garantia, FAQ e IDs de rastreamento.
 *  Os componentes apenas LEEM este arquivo.
 *
 *  Regras:
 *  • Preços em CENTAVOS (1990 = R$ 19,90) — evita erro de arredondamento.
 *  • Valores derivados (diferença do upgrade, "de/por") são CALCULADOS.
 *  • Campo vazio ("") = pendente. Em produção o componente é ocultado ou
 *    desabilitado com segurança; em desenvolvimento aparece um aviso.
 *  • Nunca preencher com dados fictícios (depoimentos, URLs, IDs).
 */

// ── Marca ────────────────────────────────────────────────────────────
export const brand = {
  name: "Mente em Paz",
  tagline: "Método de Descanso Noturno Para Quem Cuida",
  /** Domínio final (sem barra no fim). Usado em canonical/OG/sitemap. */
  siteUrl: (import.meta.env.VITE_SITE_URL as string | undefined) ?? "", // PENDENTE — definir VITE_SITE_URL no .env
  contactEmail: "", // PENDENTE — e-mail de contato exibido no rodapé
  /** Razão social / CNPJ do responsável, se houver. Nunca inventar. */
  legalEntity: "", // PENDENTE
};

// ── Checkout (plataforma externa) ───────────────────────────────────
// Links fornecidos pela plataforma de pagamento. Deixe "" até ter o link real.
export const checkout = {
  checkoutEssencialUrl: "", // PENDENTE — Essencial, preço cheio
  checkoutCompletoUrl: "", // PENDENTE — Completo, preço cheio (clique direto no plano)
  checkoutUpgradeUrl: "", // PENDENTE — Completo com preço de upgrade (aceite no popup)
  /**
   * ⚠ TEMPORÁRIO — modo de visualização: com os links ainda vazios, deixa os botões
   * de compra ativos (e o popup de upgrade abrindo) para revisar o fluxo no site
   * publicado. Sem link, o clique mostra "Checkout em configuração" — nunca redireciona.
   * Desligar (false) antes de anunciar, ou quando os links forem preenchidos.
   */
  previewCheckout: true,
  /** Parâmetros de campanha repassados do anúncio até o checkout. */
  forwardQueryParams: [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "gclid",
    "src", // usados pela Utmify
    "sck",
  ],
};

// ── Planos ───────────────────────────────────────────────────────────
export type PlanId = "essencial" | "completo";

export interface Plan {
  id: PlanId;
  name: string;
  /** Nome exibido no card (ex.: "Essencial"). */
  shortName: string;
  description: string;
  priceCents: number;
  /** Ex.: "ou 3x de R$ 6,99". Só preencher com a condição REAL do checkout. */
  installmentsNote?: string;
  /** Condição de pagamento exibida abaixo do preço (confirmada: pagamento único). */
  paymentNote?: string;
  items: string[];
  cta: string;
  featured: boolean;
  /** Rótulo discreto (sem apelo falso de popularidade). */
  tag?: string;
}

export const plans: Record<PlanId, Plan> = {
  essencial: {
    id: "essencial",
    name: "Mente em Paz Essencial",
    shortName: "Essencial",
    description: "Para dar o primeiro passo.",
    priceCents: 3990,
    paymentNote: "Pagamento único · acesso vitalício",
    items: ["7 áudios guiados", "Guia de utilização", "Método noturno reutilizável"],
    cta: "Quero o Essencial",
    featured: false,
  },
  completo: {
    id: "completo",
    name: "Mente em Paz Completo",
    shortName: "Completo",
    description: "Mais apoio para a sua rotina.",
    priceCents: 6790,
    paymentNote: "Pagamento único · acesso vitalício",
    items: [
      "Tudo do Essencial",
      "Caderno digital",
      "Checklist noturno",
      "Materiais complementares",
    ],
    cta: "Quero o Completo",
    featured: true,
    tag: "Recomendado",
  },
};

// ── Upgrade (popup ao escolher o Essencial) ─────────────────────────
// O preço de upgrade SUBSTITUI o do Essencial. Deve ser uma oferta real,
// efetivamente praticada no checkout `checkoutUpgradeUrl`.
export const upgrade = {
  enabled: true,
  priceCents: 5790, // substitui o Essencial (R$ 39,90 → R$ 57,90)
  title: "Um desconto para você cuidar ainda mais de você.",
  /** {diferenca} = upgrade − Essencial (calculado). */
  description:
    "Por apenas {diferenca} a mais, leve o Mente em Paz Completo.",
  /** {por} = preço de upgrade (calculado). O "De … por …" do popup também é calculado. */
  acceptCta: "Sim, quero o Completo por {por}",
  declineCta: "Prefiro continuar com o Essencial.",
};

// ── Garantia ─────────────────────────────────────────────────────────
export const guarantee = {
  days: 7,
  title: "Seu primeiro passo, com tranquilidade.",
  /** {dias} é substituído por `days`. */
  text: "Experimente por {dias} dias. Se não for para você, peça o reembolso dentro desse prazo.",
};

// ── Mídia ────────────────────────────────────────────────────────────
export interface VideoSource {
  src: string; // caminho em public/ (ex.: "video/vsl.webm") ou URL absoluta
  type: "video/webm" | "video/mp4";
}

export const media = {
  video: {
    /** Ordem de preferência. Vazio = vídeo ainda não enviado. */
    sources: [] as VideoSource[], // PENDENTE — ex.: [{ src: "video/vsl.webm", type: "video/webm" }, { src: "video/vsl.mp4", type: "video/mp4" }]
    poster: "", // PENDENTE — ex.: "video/vsl-poster.webp"
    /** Proporção do vídeo: "9/16" (vertical) ou "16/9" (horizontal). */
    aspect: "9/16" as "9/16" | "16/9",
    /** Bloquear avanço (não deixa pular para frente do ponto já assistido). */
    preventSeekForward: true,
    captionsSrc: "", // opcional — arquivo .vtt de legendas
  },
  audioPreview: {
    src: "", // PENDENTE — ex.: "audio/trecho-demonstracao.mp3"
    title: "Trecho de um áudio guiado",
  },
};

// ── Especialista (quem está por trás do Mente em Paz) ───────────────
// ⚠ Conteúdo PROVISÓRIO. Enquanto `verified` for false, a seção aparece só em
// desenvolvimento (com etiqueta "provisório") e fica OCULTA no site publicado.
// Ao preencher os dados reais: nunca atribuir formação/registro não comprovado.
// Se for psicóloga, o registro no CRP é obrigatório na divulgação (Resolução CFP).
export const expert = {
  verified: false, // PENDENTE — mudar para true só com dados reais confirmados
  name: "Clara Martins",
  role: "Psicóloga · Criadora do Mente em Paz", // PROVISÓRIO — confirmar profissão
  credential: "", // PENDENTE — ex.: "CRP 00/000000"
  photo: "", // PENDENTE — ex.: "img/clara-martins-800.webp" (retrato vertical 4:5)
  /** Uma frase curta (até ~2 linhas no mobile). */
  bio: "Criou o Mente em Paz para mulheres que cuidam de quem amam e chegam à noite sem espaço para si.", // PROVISÓRIO
};

// ── Depoimentos ──────────────────────────────────────────────────────
// SOMENTE depoimentos reais, com autorização de nome, foto e print.
// Lista vazia → seção oculta em produção.
// Imagens: coloque os originais em images-src/depoimentos/ e rode `npm run images`.
export interface Testimonial {
  name: string;
  /** Dias como cliente → "Cliente há X dias". Omitir se não souber. */
  daysAsClient?: number;
  /** Foto/avatar (ex.: "img/depoimentos/maria-avatar-400.webp"). Opcional. */
  avatar?: string;
  /** Print da conversa do WhatsApp (conteúdo intacto). */
  print: string;
  /** Descrição do print para leitores de tela (o texto do depoimento). */
  printAlt: string;
}

export const testimonials: Testimonial[] = [];

// ── Bônus / materiais do kit ─────────────────────────────────────────
export type BonusIcon = "notebook" | "checklist" | "guide";

export interface Bonus {
  title: string;
  description: string;
  icon: BonusIcon;
  /** false = oculto (ex.: material ainda não pronto para entrega). */
  available: boolean;
}

export const bonuses: Bonus[] = [
  {
    title: "Caderno de Desaceleração",
    description: "Um espaço para organizar os pensamentos antes de descansar.",
    icon: "notebook",
    available: true,
  },
  {
    title: "Checklist de Encerramento do Dia",
    description: "Um passo a passo para diminuir a sensação de que ainda há mil coisas a fazer.",
    icon: "checklist",
    available: true,
  },
  {
    title: "Guia da Pausa Noturna",
    description: "Orientações simples para transformar alguns minutos em um hábito de autocuidado.",
    icon: "guide",
    available: true,
  },
];

// ── FAQ ──────────────────────────────────────────────────────────────
export const faq: { q: string; a: string }[] = [
  {
    q: "Preciso ter problemas para dormir?",
    a: "Não. O Mente em Paz também é para quem deseja desacelerar e construir uma rotina de descanso mais tranquila.",
  },
  {
    q: "Posso ouvir os áudios mais de uma vez?",
    a: "Sim! O material foi pensado para ser reutilizado sempre que você desejar.",
  },
  {
    q: "Por quanto tempo terei acesso?",
    a: "Para sempre. O pagamento é único e o acesso é vitalício, sem mensalidades.",
  },
  {
    q: "O produto é físico?",
    a: "Não. O Mente em Paz é um produto 100% digital.",
  },
  {
    q: "Funciona mesmo se minha rotina for muito corrida?",
    a: "O método foi pensado para se adaptar a diferentes rotinas. Você pode escolher os momentos mais adequados para utilizá-lo.",
  },
  {
    q: "Substitui terapia ou acompanhamento médico?",
    a: "Não. É um recurso complementar de autocuidado e não substitui atendimento profissional.",
  },
];

// ── Rastreamento ─────────────────────────────────────────────────────
// IDs também podem vir de variáveis de ambiente (.env): VITE_META_PIXEL_ID.
export const tracking = {
  metaPixelId: (import.meta.env.VITE_META_PIXEL_ID as string | undefined) ?? "", // PENDENTE
  /** Utmify: cole o pixelId fornecido pelo painel. Vazio = desativado. */
  utmifyPixelId: (import.meta.env.VITE_UTMIFY_PIXEL_ID as string | undefined) ?? "", // PENDENTE
  /** Script de UTMs da Utmify (repasse automático de UTMs para o checkout). */
  utmifyUtmsScript: false,
  /** LGPD: só carrega pixels depois do consentimento da visitante. */
  requireConsent: true,
  currency: "BRL",
  /** Mostra os eventos no console (útil para testar). */
  debug: import.meta.env.DEV,
};

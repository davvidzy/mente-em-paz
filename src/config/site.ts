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

import { META_PIXEL_ID, REQUIRE_CONSENT } from "./pixel";

// ── Marca ────────────────────────────────────────────────────────────
export const brand = {
  name: "Mente em Paz",
  tagline: "Método de Descanso Noturno Para Quem Cuida",
  /** Domínio final (sem barra no fim). Usado em canonical/OG/sitemap. */
  siteUrl: (import.meta.env.VITE_SITE_URL as string | undefined) ?? "", // PENDENTE — definir VITE_SITE_URL no .env
  contactEmail: "", // PENDENTE — e-mail de contato exibido no rodapé
  /** WhatsApp de suporte, só dígitos com DDI (rodapé e FAQ). Vazio = oculto. */
  whatsapp: "5561996727795",
  /** Mensagem já escrita ao abrir o WhatsApp. */
  whatsappMessage: "Olá! Comprei o Mente em Paz e preciso de ajuda com o acesso.",
  /** Razão social / CNPJ do responsável, se houver. Nunca inventar. */
  legalEntity: "", // PENDENTE
};

// ── Checkout (plataforma externa) ───────────────────────────────────
// Links fornecidos pela plataforma de pagamento. Deixe "" até ter o link real.
export const checkout = {
  checkoutEssencialUrl: "https://pay.wiapy.com/RRmfu6Uf2RK", // Essencial, R$ 39,90
  checkoutCompletoUrl: "https://pay.wiapy.com/4U-4VtXIgz-e", // Completo, R$ 67,90 (clique direto no plano)
  checkoutUpgradeUrl: "https://pay.wiapy.com/HWF_wPkMAg7", // Completo com preço de upgrade, R$ 57,90 (aceite no popup)
  /**
   * ⚠ TEMPORÁRIO — modo de visualização: com os links ainda vazios, deixa os botões
   * de compra ativos (e o popup de upgrade abrindo) para revisar o fluxo no site
   * publicado. Sem link, o clique mostra "Checkout em configuração" — nunca redireciona.
   * Desligar (false) antes de anunciar, ou quando os links forem preenchidos.
   */
  previewCheckout: false,
  /** Parâmetros de campanha repassados do anúncio até o checkout. */
  forwardQueryParams: [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "gclid",
    "src", // origem/campanha usados por plataformas de checkout
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
  /** Ex.: "até 12x de R$ 8,06" (logo abaixo do preço). Só preencher com a condição REAL do checkout. */
  installmentsNote?: string;
  /** Linha discreta abaixo do parcelamento (ex.: "Acesso vitalício"). */
  paymentNote?: string;
  /** Linha em destaque acima da lista (ex.: "Tudo do Essencial +"). */
  itemsLead?: string;
  items: string[];
  /** Frase curta abaixo da lista: a diferença prática do plano, não quantidade. */
  closing?: string;
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
    description: "Comece com as 4 primeiras noites guiadas.",
    priceCents: 3990,
    installmentsNote: "até 10x de R$ 5,36",
    items: ["4 áudios guiados", "Guia para relaxar", "Caderno de reflexão", "Portal no celular", "Acesso vitalício"],
    cta: "Quero o Essencial",
    featured: false,
  },
  completo: {
    id: "completo",
    name: "Mente em Paz Completo",
    shortName: "Completo",
    description: "7 noites e 5 bônus para cuidar de você.",
    priceCents: 6790,
    installmentsNote: "até 12x de R$ 8,06",
    items: [
      "Tudo do Essencial",
      "Noites 5, 6 e 7",
      "3 áudios para seus pais",
      "SOS Mente Acelerada — 5 min",
      "Áudio para despertares noturnos",
      "Diário do Descarrego Mental",
      "Plano da Noite Organizada",
      "Acesso vitalício",
    ],
    cta: "Quero o Completo",
    featured: true,
    tag: "Experiência completa",
  },
};

// ── Pagamento e entrega (linhas abaixo dos planos e FAQ) ────────────
export const payment = {
  /** Desconto do Pix no checkout, em %. 0 = não exibe. */
  pixDiscountPercent: 5,
  /** {pix} = pixDiscountPercent. */
  pixNote: "ou {pix}% de desconto no Pix",
  secureNote: "Pagamento seguro · Pix ou cartão",
  accessNote: "Acesso enviado por e-mail logo após o pagamento",
};

// ── Programa de 7 noites (seção "Suas 7 noites" e durações citadas no site) ──
export const program = {
  /** Quantas noites (a partir da 1ª) estão no Essencial. */
  essencialNights: 4,
  nights: [
    { title: "O dia terminou, você pode descansar", minutes: 17 },
    { title: "Soltando o peso da culpa", minutes: 11 },
    { title: "Acalmando os pensamentos acelerados", minutes: 17 },
    { title: "Nem tudo precisa ser resolvido hoje", minutes: 10 },
    { title: "Você também merece cuidado", minutes: 12 },
    { title: "Saindo do estado de alerta", minutes: 13 },
    { title: "Sua prática de Mente em Paz", minutes: 13 },
  ],
};

// ── Upgrade (popup ao escolher o Essencial) ─────────────────────────
// O preço de upgrade SUBSTITUI o do Essencial. Deve ser uma oferta real,
// efetivamente praticada no checkout `checkoutUpgradeUrl`.
export const upgrade = {
  enabled: true,
  priceCents: 5790, // substitui o Essencial (R$ 39,90 → R$ 57,90)
  /** {diferenca} = upgrade − Essencial (calculado). Até 3 linhas no celular. */
  title: "Por apenas {diferenca} a mais, leve o Completo.",
  /** Acima da lista do que o Completo acrescenta. */
  extrasLabel: "Você ganha também:",
  /** O que o Completo acrescenta ao Essencial (curto: o popup não pode rolar no celular). */
  extras: [
    "Noites 5, 6 e 7 do programa",
    "3 áudios para seus pais",
    "SOS Mente Acelerada (5 min)",
    "Quando Acordo no Meio da Noite",
    "Diário do Descarrego Mental",
    "Plano da Noite Organizada",
  ],
  /** Uma linha no celular (≤ 20 caracteres). {por} disponível. O "De … por …" é calculado. */
  acceptCta: "Quero o Completo",
  declineCta: "Prefiro continuar com o Essencial",
};

// ── Cupom da roleta ─────────────────────────────────────────────────
// A roleta abre uma vez por visitante (ao chegar nos bônus) e SEMPRE dá o mesmo prêmio:
// por isso todas as casas mostram o mesmo desconto — nada de prêmios que nunca saem.
// O cupom precisa existir de verdade no checkout, com este código e este desconto.
export const coupon = {
  enabled: true,
  code: "QUEROSENTIRPAZ",
  /** Texto do prêmio (casas da roleta e resultado). */
  prize: "5% OFF",
  /** Casas da roleta (todas com o mesmo prêmio). */
  slices: 8,
};

// ── Garantia ─────────────────────────────────────────────────────────
export const guarantee = {
  days: 7,
  /** {dias} é substituído por `days`. */
  title: "{dias} dias para experimentar.",
  /** Procedimento real: reembolso pela plataforma de checkout, via e-mail de confirmação. */
  text: "Não era o que esperava? Peça o reembolso em até {dias} dias pelo link enviado por e-mail.",
  /** Informações de apoio (só condições reais). */
  notes: [
    "Pagamento único, sem mensalidade",
    "Acesso digital enviado após a confirmação do pagamento",
    "Acesso vitalício",
    "Suporte para dúvidas sobre o acesso",
  ],
};

// ── Mídia ────────────────────────────────────────────────────────────
export const media = {
  /**
   * Mockup do portal no hero (entre a descrição e o CTA). Imagem 3:2, sem sufixo:
   * "img/hero/mockup-portal" → -400, -800 e -1200.webp. Original em images-src/hero/ → `npm run images`.
   */
  mockup: {
    image: "img/hero/mockup-portal",
    alt: "O portal Mente em Paz no celular, no tablet e no computador, com o primeiro áudio pronto para ouvir.",
  },
  audioPreview: {
    src: "audio/trecho-demonstracao.mp3",
    title: "Trecho de um áudio guiado",
  },
};

// ── Especialista (quem está por trás do Mente em Paz) ───────────────
// Persona virtual: NÃO atribuir profissão regulamentada (psicóloga etc.), registro (CRP)
// nem formação — o aviso `disclosure` aparece no rodapé.
// A seção só aparece no site publicado com `verified: true`;
// em desenvolvimento aparece sempre (com etiqueta "provisório" enquanto faltar algo).
// Nunca atribuir números ou resultados não comprovados.
export const expert = {
  verified: true, // conteúdo aprovado
  eyebrow: "Conheça a apresentadora",
  name: "Clara Martins",
  /** Apresentação curta (sem autoria humana, formação ou vivências inventadas). */
  about: ["Uma voz de acolhimento para acompanhar seus momentos de descanso."],
  /** Transparência: aparece na própria seção e, discreto, no rodapé. */
  disclosure: "Clara Martins é a apresentadora virtual do Mente em Paz.",
  /**
   * Retrato 4:5, sem sufixo: "img/expert/clara-martins" → usa -400.webp e -800.webp.
   * Original (já recortado em 4:5) em images-src/expert/ → `npm run images`. Vazio = espaço reservado.
   */
  photo: "img/expert/clara-martins",
};

/** Pode aparecer no site publicado? */
export const expertPublished = expert.verified;

// ── Depoimentos ──────────────────────────────────────────────────────
// SOMENTE depoimentos reais, com autorização registrada de nome, foto, vídeo e texto.
// Sem `consent: true` o depoimento não aparece. Lista vazia → seção oculta em produção.
// Nada de fotos de banco de imagens, estrelas ou notas inventadas.
// Imagens: coloque os originais em images-src/depoimentos/ e rode `npm run images`.
export interface Testimonial {
  name: string;
  /** A cliente autorizou a publicação (guarde o registro da autorização). */
  consent: boolean;
  /** Dias como cliente → "Cliente há X dias". Omitir se não souber. */
  daysAsClient?: number;
  /** Foto/avatar da própria cliente (ex.: "img/depoimentos/maria-avatar-400.webp"). Opcional. */
  avatar?: string;
  /** Depoimento em texto, com as palavras dela. Use este, `print` ou `video`. */
  text?: string;
  /** Print da conversa do WhatsApp (conteúdo intacto) + descrição para leitores de tela. */
  print?: string;
  printAlt?: string;
  /** Vídeo curto (ex.: "video/depoimento-maria.mp4") e capa opcional. */
  video?: string;
  videoPoster?: string;
}

export const testimonials: Testimonial[] = [];

/** Só depoimentos com autorização registrada e algum conteúdo (texto, print ou vídeo). */
export const publishedTestimonials = testimonials.filter((t) => t.consent && Boolean(t.text || t.print || t.video));

// ── Bônus (exclusivos do Plano Completo) ────────────────────────────
export interface Bonus {
  name: string;
  /** Uma frase só: até 2 linhas no celular (≈ 55 caracteres). */
  description: string;
  /** Soma exibida riscada no box final (com `showValues: true`). */
  valueCents: number;
  /**
   * Capa quadrada, sem sufixo: "img/bonus/nome" → usa nome-400.webp e nome-800.webp.
   * Original em images-src/bonus/nome.jpg → `npm run images`. Vazio = ícone de presente.
   */
  image?: string;
}

export const bonuses = {
  /**
   * Mostra "Valor dos 5 bônus: R$ 134,50" riscado → "R$ 0,00" no box final.
   * Valores = preço real de cada um como order bump no checkout. Se algum deixar
   * de ser vendido por esse valor, use `false` (valor inventado é âncora enganosa — CDC).
   */
  showValues: true,
  /**
   * Prazo dos bônus grátis: "Bônus grátis no Completo até DD/MM", sempre a data de
   * HOJE + `deadlineDaysAhead` no aparelho da visitante. 0 = sem prazo.
   * ⚠ A promoção precisa existir de fato: retirar/encerrar manualmente quando acabar.
   */
  deadlineDaysAhead: 1,
  items: [
    {
      name: "Um Momento de Paz para Seus Pais",
      description: "3 áudios suaves para compartilhar com seus pais.",
      valueCents: 3990,
      image: "img/bonus/um-momento-de-paz-para-seus-pais",
    },
    {
      name: "Plano da Noite Organizada",
      description: "Organize cuidados e pendências antes de descansar.",
      valueCents: 2490,
      image: "img/bonus/plano-da-noite-organizada",
    },
    {
      name: "SOS Mente Acelerada",
      description: "5 minutos guiados para desacelerar os pensamentos.",
      valueCents: 1990,
      image: "img/bonus/sos-mente-acelerada",
    },
    {
      name: "Diário do Descarrego Mental",
      description: "Registre preocupações e organize sua mente.",
      valueCents: 2490,
      image: "img/bonus/diario-do-descarrego-mental",
    },
    {
      name: "Quando Acordo no Meio da Noite",
      description: "Um áudio tranquilo para despertares noturnos.",
      valueCents: 2490,
      image: "img/bonus/quando-acordo-no-meio-da-noite",
    },
  ] as Bonus[],
};

// ── FAQ ──────────────────────────────────────────────────────────────
// Ordem: ceticismo e medos primeiro, logística no meio, segurança no fim. Respostas curtas (1–2 frases).
// {whatsapp} vira um link para o WhatsApp de suporte (brand.whatsapp).
export const faq: { q: string; a: string }[] = [
  {
    q: "Preciso saber meditar?",
    a: "Não. Basta deitar, ouvir e acompanhar a voz guiada, no seu ritmo.",
  },
  {
    q: "Quanto dura cada áudio?",
    a: "De 10 a 17 minutos. Você pode ouvir já deitada. O SOS tem 5 minutos.",
  },
  {
    q: "E se meus pais precisarem de mim?",
    a: "Basta pausar e continuar depois. O momento de descanso se adapta à sua rotina.",
  },
  {
    q: "E se eu dormir durante o áudio?",
    a: "Tudo bem. Você pode ouvir novamente ou seguir para o próximo quando quiser.",
  },
  {
    q: "Qual plano escolher?",
    a: "O Essencial tem 4 noites. O Completo reúne as 7 noites e 5 bônus exclusivos.",
  },
  {
    q: "Como recebo o acesso?",
    a: "Por e-mail, após a confirmação do pagamento. Acesse pelo navegador, sem instalar aplicativo.",
  },
  {
    q: "Não recebi o e-mail. E agora?",
    a: "Confira spam e promoções. Se não encontrar, fale com nosso suporte no {whatsapp}.",
  },
  {
    q: "Posso ouvir sem internet?",
    a: "Sim. Baixe os áudios no celular e ouça offline.",
  },
  {
    q: "Posso ouvir sem incomodar ninguém?",
    a: "Sim. Use fones ou reproduza em volume baixo.",
  },
  {
    q: "Como funciona a garantia?",
    a: "Você tem 7 dias para pedir o reembolso pelo link enviado no e-mail da compra, sem precisar explicar o motivo.",
  },
  {
    q: "Tem mensalidade? Como posso pagar?",
    a: "Pagamento único por Pix ou cartão. Sem mensalidade e com acesso vitalício.",
  },
  {
    q: "Substitui acompanhamento profissional?",
    a: "Não. É um recurso de autocuidado, não um tratamento médico ou psicológico.",
  },
];

// ── Rastreamento ─────────────────────────────────────────────────────
// IDs também podem vir de variáveis de ambiente (.env): VITE_META_PIXEL_ID tem prioridade.
// `||` (e não `??`): no GitHub Actions uma variável não cadastrada chega como "".
export const tracking = {
  /** Meta Pixel — ID e consentimento ficam em config/pixel.ts (o build também lê). */
  metaPixelId: (import.meta.env.VITE_META_PIXEL_ID as string | undefined) || META_PIXEL_ID,
  /** LGPD: true = pixels só depois do "Aceitar"; false = na entrada (ver config/pixel.ts). */
  requireConsent: REQUIRE_CONSENT,
  currency: "BRL",
  /** Mostra os eventos no console (útil para testar). */
  debug: import.meta.env.DEV,
};

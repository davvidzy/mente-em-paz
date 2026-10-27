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
  /** Resumo em destaque abaixo da lista (ex.: "10 áudios + 3 ferramentas práticas"). */
  itemsSummary?: string;
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
    installmentsNote: "até 10x de R$ 5,36",
    items: [
      "4 áudios guiados (noites 1 a 4 do programa)",
      "Guia para relaxar antes de dormir",
      "Caderno de reflexão com perguntas guiadas",
      "Acesso pelo celular, no portal",
      "Acesso vitalício",
    ],
    cta: "Quero o Essencial",
    featured: false,
  },
  completo: {
    id: "completo",
    name: "Mente em Paz Completo",
    shortName: "Completo",
    description: "Mais apoio para a sua rotina.",
    priceCents: 6790,
    installmentsNote: "até 12x de R$ 8,06",
    itemsLead: "Tudo do Essencial +",
    items: [
      "Noites 5, 6 e 7 do programa",
      "SOS Mente Acelerada (5 min)",
      "Quando Acordo no Meio da Noite",
      "Diário do Descarrego Mental",
      "Plano da Noite Organizada",
      "Acesso vitalício a tudo",
    ],
    itemsSummary: "9 áudios guiados + 4 materiais de apoio",
    cta: "Quero o Completo",
    featured: true,
    tag: "Recomendado",
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
  /** Uma linha no celular (≤ 20 caracteres). {por} disponível. O "De … por …" é calculado. */
  acceptCta: "Quero o Completo",
  declineCta: "Prefiro continuar com o Essencial",
};

// ── Garantia ─────────────────────────────────────────────────────────
export const guarantee = {
  days: 7,
  title: "Seu primeiro passo, com tranquilidade.",
  /** {dias} é substituído por `days`. */
  text: "Experimente por {dias} dias. Se não for para você, peça o reembolso pelo link que chega no e-mail de confirmação da compra.",
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
    /**
     * ⚠ TEMPORÁRIO — sem vídeo, mostra no site publicado um espaço reservado discreto
     * ("Vídeo de apresentação em breve") no lugar do vídeo. false = espaço oculto.
     */
    showPlaceholder: true,
  },
  audioPreview: {
    src: "audio/trecho-demonstracao.mp3",
    title: "Trecho de um áudio guiado",
  },
};

// ── Especialista (quem está por trás do Mente em Paz) ───────────────
// Psicóloga: o CRP é OBRIGATÓRIO na divulgação (Código de Ética / resoluções do CFP).
// A seção só aparece no site publicado com `verified: true` E `credential` preenchido;
// em desenvolvimento aparece sempre (com etiqueta "provisório" enquanto faltar algo).
// Nunca atribuir formação, números ou resultados não comprovados.
export const expert = {
  verified: true, // nome e profissão confirmados
  eyebrow: "Quem criou o Mente em Paz",
  name: "Clara Martins",
  role: "Psicóloga",
  credential: "", // PENDENTE — ex.: "CRP 01/12345" (sem ele a seção fica oculta)
  /** Retrato vertical 4:5 (ex.: "img/clara-martins-800.webp"). Vazio = espaço reservado. */
  photo: "", // PENDENTE
  /** Área de atuação, logo abaixo do nome. */
  focus: "Bem-estar emocional, autocuidado e descanso de mulheres cuidadoras",
  /** Fala em primeira pessoa (validar o texto com ela). Até ~5 linhas no celular. */
  quote:
    "Eu acompanho mulheres que cuidam de todo mundo e chegam ao fim do dia sem espaço para si. Criei o Mente em Paz para que esse espaço exista: poucos minutos, à noite, só para você.",
  /** Linha de apoio abaixo da fala. */
  bio: "Os áudios foram pensados para a rotina real de quem cuida: curtos, simples de seguir e feitos para ouvir já deitada.",
};

/** Pode aparecer no site publicado? (profissão confirmada + registro). */
export const expertPublished = expert.verified && Boolean(expert.credential.trim());

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

// ── Bônus (exclusivos do Plano Completo) ────────────────────────────
export interface Bonus {
  name: string;
  /** Curta: até 3 linhas no celular (≈ 70 caracteres). */
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
   * Mostra "Valor dos 4 bônus: R$ 94,60" riscado → "R$ 0,00" no box final.
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
      name: "Plano da Noite Organizada",
      description: "Organize pendências e cuidados para encerrar o dia com clareza.",
      valueCents: 2490,
      image: "img/bonus/plano-da-noite-organizada",
    },
    {
      name: "SOS Mente Acelerada",
      description: "Pausa guiada de 5 minutos para quando a mente não para.",
      valueCents: 1990,
      image: "img/bonus/sos-mente-acelerada",
    },
    {
      name: "Diário do Descarrego Mental",
      description: "Registre as preocupações e tire as pendências da cabeça.",
      valueCents: 2490,
      image: "img/bonus/diario-do-descarrego-mental",
    },
    {
      name: "Quando Acordo no Meio da Noite",
      description: "Áudio acolhedor para quando você desperta inquieta de madrugada.",
      valueCents: 2490,
      image: "img/bonus/quando-acordo-no-meio-da-noite",
    },
  ] as Bonus[],
};

// ── FAQ ──────────────────────────────────────────────────────────────
// Ordem: ceticismo e medos primeiro, logística no meio, segurança no fim.
// {whatsapp} vira um link para o WhatsApp de suporte (brand.whatsapp).
export const faq: { q: string; a: string }[] = [
  {
    q: "Já tentei meditar e não funcionou. Isso é diferente?",
    a: "É. Você não precisa saber meditar nem esvaziar a mente. São relaxamentos guiados por voz: é só deitar, ouvir e seguir. Se os pensamentos vierem, tudo bem, a voz te ajuda a voltar para o descanso.",
  },
  {
    q: "Tenho pouco tempo. Quanto dura cada áudio?",
    a: "Os áudios do programa têm de 10 a 17 minutos, e você ouve já deitada, na hora de dormir: não precisa encontrar tempo extra no seu dia. O SOS Mente Acelerada tem 5 minutos, para quando você precisa de uma pausa rápida.",
  },
  {
    q: "E se precisarem de mim no meio do áudio?",
    a: "Pause e vá. O portal guarda o ponto em que você parou, e você continua quando voltar. O Mente em Paz foi feito para caber na rotina de quem cuida, não para competir com ela.",
  },
  {
    q: "E se eu dormir no meio do áudio?",
    a: "Ótimo, esse é o objetivo. Os áudios foram feitos para acompanhar você até o descanso. Na noite seguinte, continue de onde parou ou ouça de novo.",
  },
  {
    q: "Qual plano escolher?",
    a: "Se você quer começar pelo básico, o Essencial traz as 4 primeiras noites. Se costuma acordar de madrugada ou ter noites em que a mente dispara, o Completo traz as 7 noites e os áudios SOS para esses momentos.",
  },
  {
    q: "Como recebo o acesso?",
    a: "Logo após a confirmação do pagamento, você recebe um e-mail com o link e as instruções para entrar no portal. Ele abre no navegador do celular ou do computador, sem instalar aplicativo.",
  },
  {
    q: "E se o e-mail de acesso não chegar?",
    a: "Confira as pastas de spam e promoções. Se não estiver lá, fale com a gente no {whatsapp} que resolvemos para você.",
  },
  {
    q: "Preciso de internet boa para ouvir?",
    a: "Não. Você pode baixar os áudios no celular e ouvir offline, sem depender da internet na hora de dormir.",
  },
  {
    q: "Posso ouvir sem incomodar quem dorme perto de mim?",
    a: "Sim. Ouça com fone ou em volume baixo: os áudios são calmos e suaves.",
  },
  {
    q: "Como funciona a garantia?",
    a: "Você tem 7 dias para experimentar. Se não for para você, peça o reembolso pelo link que chega no e-mail de confirmação da compra, sem precisar explicar o motivo.",
  },
  {
    q: "Quais são as formas de pagamento? Tem mensalidade?",
    a: "Pix, com 5% de desconto, ou cartão de crédito em até 12x no Completo e em até 10x no Essencial. O pagamento é único, sem mensalidades, e o acesso é vitalício: ouça quantas vezes quiser.",
  },
  {
    q: "Substitui terapia ou acompanhamento médico?",
    a: "Não. É um recurso complementar de autocuidado e não substitui atendimento profissional.",
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

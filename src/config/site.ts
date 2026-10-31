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
    description: "O primeiro passo para começar a desacelerar à noite.",
    priceCents: 3990,
    installmentsNote: "até 10x de R$ 5,36",
    items: [
      "As 4 primeiras noites guiadas",
      "Guia para relaxar antes de dormir",
      "Caderno de reflexão",
      "Acesso ao portal pelo celular",
      "Acesso vitalício",
    ],
    closing: "Uma forma simples de começar seu momento de descanso.",
    cta: "Quero o Essencial",
    featured: false,
  },
  completo: {
    id: "completo",
    name: "Mente em Paz Completo",
    shortName: "Completo",
    description: "Mais recursos para cuidar de você em diferentes momentos da noite.",
    priceCents: 6790,
    installmentsNote: "até 12x de R$ 8,06",
    items: [
      "As 7 noites guiadas do programa",
      "3 áudios suaves para compartilhar com seus pais",
      "SOS Mente Acelerada de 5 minutos",
      "Áudio para quando acordar de madrugada",
      "Diário do Descarrego Mental",
      "Plano da Noite Organizada",
      "Todos os materiais do Essencial",
      "Acesso vitalício",
    ],
    closing: "O programa completo e recursos extras para quando a rotina pedir mais cuidado.",
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

// ── Garantia ─────────────────────────────────────────────────────────
export const guarantee = {
  days: 7,
  /** {dias} é substituído por `days`. */
  title: "Experimente por {dias} dias, com tranquilidade.",
  /** Procedimento real: reembolso pela plataforma de checkout, via e-mail de confirmação. */
  text: "Acesse os áudios, conheça o Mente em Paz e experimente no seu ritmo. Se decidir que não é para você, peça o reembolso em até {dias} dias pelo link que chega no e-mail de confirmação da compra.",
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
  eyebrow: "Conheça a voz que apresenta o Mente em Paz",
  name: "Clara Martins",
  /** Apresentação transparente (persona virtual + equipe real). Parágrafos curtos. */
  about: [
    "Criei o Mente em Paz pensando em mulheres que passam o dia cuidando de quem amam, mas encontram dificuldade para cuidar de si mesmas.",
    "Reuni áudios guiados e práticas simples para ajudar você a desacelerar e encontrar um momento de tranquilidade no fim do dia.",
    "Porque você também merece esse cuidado.",
  ],
  /** Aviso discreto no rodapé da landing. */
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
  /** Em destaque: a situação em que o bônus ajuda. Até 2–3 linhas no celular. */
  benefit: string;
  /** O que é, em texto menor. Até 3 linhas no celular (≈ 80 caracteres). */
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
      benefit: "Um cuidado que você também pode oferecer a quem ama.",
      description: "3 áudios suaves de relaxamento e tranquilidade para compartilhar com seus pais.",
      valueCents: 3990,
      image: "img/bonus/um-momento-de-paz-para-seus-pais",
    },
    {
      name: "Plano da Noite Organizada",
      benefit: "Organize o que precisa de atenção antes de encerrar o dia.",
      description: "Checklist preenchível para pendências, contatos e combinados de cuidado.",
      valueCents: 2490,
      image: "img/bonus/plano-da-noite-organizada",
    },
    {
      name: "SOS Mente Acelerada",
      benefit: "Uma pausa curta para quando os pensamentos não param.",
      description: "Áudio guiado de 5 minutos.",
      valueCents: 1990,
      image: "img/bonus/sos-mente-acelerada",
    },
    {
      name: "Diário do Descarrego Mental",
      benefit: "Coloque os pensamentos no papel em vez de repassar tudo mentalmente.",
      description: "Caderno digital preenchível para registrar preocupações e pendências.",
      valueCents: 2490,
      image: "img/bonus/diario-do-descarrego-mental",
    },
    {
      name: "Quando Acordo no Meio da Noite",
      benefit: "Um acompanhamento tranquilo para quando a noite é interrompida.",
      description: "Áudio de relaxamento para despertares noturnos.",
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
    a: "Tudo bem. Os áudios foram feitos para acompanhar você até o descanso. Na noite seguinte, continue de onde parou ou ouça de novo.",
  },
  {
    q: "Qual plano escolher?",
    a: "Se você quer começar pelo básico, o Essencial traz as 4 primeiras noites. Se costuma acordar de madrugada ou ter noites em que a mente dispara, o Completo traz as 7 noites, o SOS Mente Acelerada, o áudio para quando acordar de madrugada e os 3 áudios para compartilhar com seus pais.",
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

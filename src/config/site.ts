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
  tagline: "Áudios guiados para desacelerar à noite",
  /** Domínio final (sem barra no fim). Usado em canonical/OG/sitemap. */
  siteUrl: (import.meta.env.VITE_SITE_URL as string | undefined) ?? "", // PENDENTE — definir VITE_SITE_URL no .env
  contactEmail: "claramartinns@protonmail.com", // e-mail de contato (rodapé e textos legais)
  /** WhatsApp de suporte, só dígitos com DDI (rodapé e FAQ). Vazio = oculto. */
  whatsapp: "5561996727795",
  /** Mensagem já escrita ao abrir o WhatsApp. */
  whatsappMessage: "Olá! Comprei o Mente em Paz e preciso de ajuda com o acesso.",
  /** Razão social / CNPJ do responsável, se houver. Nunca inventar. */
  legalEntity: "", // PENDENTE — enquanto vazio, os textos legais usam o nome da marca
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
  /** Bônus do plano: mesma lista, com ícone de presente no lugar do check (depois de `items`). */
  bonusItems?: string[];
  /**
   * Frase curta abaixo da lista. {bonus} = soma dos valores dos bônus (bonuses.items);
   * com {bonus}, só aparece com `bonuses.showValues` (valor real de cada bônus).
   */
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
    description: "Comece com 4 áudios guiados.",
    priceCents: 3990,
    installmentsNote: "até 10x de R$ 5,36",
    items: ["4 áudios guiados", "Guia para relaxar", "Caderno de reflexão", "Portal no celular"],
    cta: "Quero o Essencial",
    featured: false,
  },
  completo: {
    id: "completo",
    name: "Mente em Paz Completo",
    shortName: "Completo",
    description: "15 áudios e 5 bônus para cuidar de você.",
    priceCents: 6790,
    installmentsNote: "até 12x de R$ 8,06",
    // sem "Tudo do Essencial +": seguido de "15 áudios" dava a entender 4 + 15
    items: ["15 áudios guiados", "Guia, caderno e portal"],
    bonusItems: [
      "Desligando do Dia — 3 áudios",
      "SOS Mente Acelerada — 5 min",
      "Áudio para despertares noturnos",
      "Diário do Descarrego Mental",
      "Plano da Noite Organizada",
    ],
    closing: "Inclui {bonus} em bônus grátis",
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

// ── Biblioteca de áudios (seção "Biblioteca") ───────────────────────
// `minutes` vazio = duração ainda não informada (o card mostra só a etiqueta, se houver).
export const program = {
  /** Quantos áudios (a partir do 1º) estão no Essencial. */
  essencialNights: 4,
  nights: [
    { title: "O dia terminou, você pode descansar", minutes: 17 },
    { title: "Soltando o peso da culpa", minutes: 11 },
    { title: "Acalmando os pensamentos acelerados", minutes: 17 },
    { title: "Nem tudo precisa ser resolvido hoje", minutes: 10 },
    { title: "Você também merece cuidado", minutes: 12 },
    { title: "Saindo do estado de alerta", minutes: 13 },
    { title: "Sua prática de Mente em Paz", minutes: 13 },
    // PENDENTE — durações dos áudios abaixo
    { title: "Deixando o Trabalho para Trás" },
    { title: "Uma Pausa Depois de um Dia Exaustivo" },
    { title: "Preparando a Mente para Descansar" },
    { title: "Uma Pausa para Desacelerar", minutes: 3 },
    { title: "Quando Tudo Parece Demais" },
    { title: "Uma Pausa Entre Responsabilidades" },
    { title: "Soltando a Tensão do Corpo" },
    { title: "Voltando ao Momento Presente" },
  ] as { title: string; minutes?: number }[],
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
    "Mais 11 áudios guiados",
    "Desligando do Dia (3 áudios)",
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
// A roleta abre centralizada quando a visitante chega ao meio da seção de bônus (a cada
// carregamento da página) e para SEMPRE na
// casa `winningSlice` (10%: o único cupom que a plataforma de checkout aceita).
// O cupom precisa existir de verdade no checkout, com este código e este desconto.
export const coupon = {
  enabled: true,
  code: "QUEROSENTIRPAZ",
  /** Prêmio entregue (resultado da roleta e botão flutuante). */
  prize: "10% OFF",
  /** Casas da roleta, em sentido horário a partir do topo. */
  slices: ["10%", "R$ 5", "5%", "R$ 10", "10%", "R$ 5", "5%", "R$ 10"],
  /** Índice da casa em que a roleta sempre para. */
  winningSlice: 0,
  /** Minutos para usar o cupom depois de ganhar. Ao zerar, o cupom some do site (roleta e botão). */
  validMinutes: 5,
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
  /**
   * Vídeo do portal no hero (abaixo dos benefícios). Vertical 9:16, 720×1280, H.264 com
   * faststart (começa a tocar antes de baixar tudo). Capa = 1º segundo do vídeo, em WebP.
   */
  video: {
    src: "video/apresentacao.mp4",
    poster: "video/apresentacao-capa.webp",
    label: "Vídeo: navegando pelo portal Mente em Paz no celular.",
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
  about: ["A voz que guia seus momentos de descanso."],
  /** Transparência: aparece, discreto, no rodapé. */
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
// Carrossel infinito só com imagens (prints/fotos), sem interação.
// SOMENTE depoimentos reais, com autorização registrada da cliente (`consent: true`).
// Nada de fotos de banco de imagens, estrelas ou notas inventadas.
// Imagens: originais em images-src/depoimentos/ → `npm run images` (gera -400 e -800.webp).
export interface Testimonial {
  /** Sem sufixo: "img/depoimentos/maria" → usa maria-400.webp e maria-800.webp. */
  image: string;
  /** O que a imagem diz, para leitores de tela (o texto do depoimento). */
  alt: string;
  /** A cliente autorizou a publicação (guarde o registro da autorização). */
  consent: boolean;
}

export const testimonials = {
  /**
   * Sem imagens, mostra no site espaços reservados vazios (sem nome nem texto)
   * para visualizar a seção. Desligado: `items` já tem os prints reais.
   */
  showPlaceholders: false,
  placeholderCount: 6,
  items: [
    {
      image: "img/depoimentos/camila",
      alt: "Conversa no WhatsApp com Camila: “Oi Clara, vim te agradecer de verdade. Ontem eu fiz o áudio antes de dormir e foi a 1ª noite em muito tempo que minha cabeça não ficou a mil. Chorei um pouco, respirei e consegui apagar. Me senti acolhida de um jeito que eu tava precisando muito.”",
      consent: true,
    },
    {
      image: "img/depoimentos/desc",
      alt: "Conversa no WhatsApp com cliente: “Clara, vim te agradecer. Eu não lembrava a última vez que tinha deitado e realmente relaxado. Ontem fiz o áudio 4 e senti meu corpo desacelerando… parece que alguém finalmente entendeu o que eu vivo.”",
      consent: true,
    },
    {
      image: "img/depoimentos/marta",
      alt: "Conversa no WhatsApp com Marta: “Bom dia, Clara. O guia de quando acordo no meio da noite foi o que mais me ajudou. Antes eu despertava e já começava a pensar em tudo. Esta madrugada consegui seguir o passo a passo e voltei a dormir sem desespero.”",
      consent: true,
    },
    {
      image: "img/depoimentos/pri",
      alt: "Conversa no WhatsApp com Pri: “Comprei sem esperar muito, mas me ajudou demais. Fiz o SOS de 5 min e deu uma acalmada absurda. Minha mente tava a mil e eu consegui desligar bem mais rápido.”",
      consent: true,
    },
    {
      image: "img/depoimentos/renata",
      alt: "Conversa no WhatsApp com Renata: “Clara, gostaria de agradecer. Tenho cuidado do meu pai há alguns meses e vinha encerrando os dias em estado de alerta. O material me ajudou a organizar a noite, reduzir a culpa e desacelerar antes de dormir. Foi uma ajuda real.”",
      consent: true,
    },
  ] as Testimonial[],
};

/** Só depoimentos com autorização registrada. */
export const publishedTestimonials = testimonials.items.filter((t) => t.consent && Boolean(t.image));

// ── Bônus (exclusivos do Plano Completo) ────────────────────────────
export interface Bonus {
  name: string;
  /** Uma frase só: até 2 linhas no celular (≈ 55 caracteres). */
  description: string;
  /** Soma exibida riscada no box final (com `showValues: true`). */
  valueCents: number;
  /**
   * Mockup quadrado (o bônus aberto no portal, no celular, + a capa), sem sufixo:
   * "img/bonus/nome" → usa nome-400, -800 e -1200.webp. Original em images-src/bonus/nome.png
   * → `npm run images`. Vazio = ícone de presente na galeria.
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
      name: "Desligando do Dia",
      description: "3 áudios curtos para sair do ritmo acelerado do dia.",
      valueCents: 3990,
      image: "img/bonus/desligando-do-dia",
    },
    {
      name: "Plano da Noite Organizada",
      description: "Organize pendências e tire o amanhã da cabeça.",
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
    a: "Há áudios de poucos minutos e sessões de até 17 minutos para ouvir já na cama.",
  },
  {
    q: "Preciso ouvir todos os áudios?",
    a: "Não. Siga a sequência ou escolha o áudio do momento. Pode pausar quando quiser.",
  },
  {
    q: "E se eu dormir durante o áudio?",
    a: "Tudo bem. Você pode ouvir novamente ou seguir para o próximo quando quiser.",
  },
  {
    q: "Qual plano escolher?",
    a: "O Essencial tem 4 áudios. O Completo reúne os 15 áudios e 5 bônus exclusivos.",
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
    q: "O Mente em Paz é um tratamento?",
    a: "Não. É um conteúdo de relaxamento e bem-estar para o fim do dia.",
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

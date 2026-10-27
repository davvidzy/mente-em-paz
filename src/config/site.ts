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
      "4 áudios para desacelerar a mente",
      "Práticas para relaxar antes de dormir",
      "Acesso pelo celular",
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
      "Programa completo de 7 noites",
      "3 áudios SOS para noites difíceis",
      "Diário para aliviar a mente",
      "Plano para noites sem preocupações",
      "Exercício para descansar sem culpa",
      "Acesso vitalício a tudo",
    ],
    itemsSummary: "10 áudios + 3 ferramentas práticas",
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
   * ⚠ Mostra "Valor dos 5 bônus: R$ 124,50" riscado → "R$ 0,00" no box final.
   * SÓ com `true` se cada bônus for de fato vendido separadamente por esse valor
   * (valor de referência inventado é âncora enganosa — CDC). Com `false`, o box
   * mostra apenas "5 bônus inclusos sem custo adicional".
   */
  showValues: true, // ⚠ TESTE — revisar antes de anunciar
  /**
   * ⚠ TESTE — cronômetro do desconto no box final, em segundos (12:30:32).
   * Reinicia a cada carregamento da página. 0 = sem cronômetro.
   * Remover antes de anunciar (contagem que reinicia é urgência falsa).
   */
  countdownSeconds: 12 * 3600 + 30 * 60 + 32,
  items: [
    {
      name: "Descansar Não É Abandonar",
      description: "Áudio e exercício para acolher a culpa de tirar um tempo para você.",
      valueCents: 2990,
      image: "img/bonus/descansar-nao-e-abandonar",
    },
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
// IDs também podem vir de variáveis de ambiente (.env): VITE_META_PIXEL_ID tem prioridade.
// `||` (e não `??`): no GitHub Actions uma variável não cadastrada chega como "".
export const tracking = {
  /** Meta Pixel — ID e consentimento ficam em config/pixel.ts (o build também lê). */
  metaPixelId: (import.meta.env.VITE_META_PIXEL_ID as string | undefined) || META_PIXEL_ID,
  /** Utmify: cole o pixelId fornecido pelo painel. Vazio = desativado. */
  utmifyPixelId: (import.meta.env.VITE_UTMIFY_PIXEL_ID as string | undefined) ?? "", // PENDENTE
  /** Script de UTMs da Utmify (repasse automático de UTMs para o checkout). */
  utmifyUtmsScript: false,
  /** LGPD: true = pixels só depois do "Aceitar"; false = na entrada (ver config/pixel.ts). */
  requireConsent: REQUIRE_CONSENT,
  currency: "BRL",
  /** Mostra os eventos no console (útil para testar). */
  debug: import.meta.env.DEV,
};

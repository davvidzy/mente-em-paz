/**
 * Textos legais — ESTRUTURA BASE, a ser revisada por quem responde juridicamente pelo produto.
 * Descreve apenas o que o site realmente faz. Campos [PENDENTE] precisam ser preenchidos
 * antes da publicação (o build avisa enquanto existirem).
 */
import { brand, guarantee, tracking } from "./site";

const responsavel = brand.legalEntity || "[PENDENTE: nome/razão social e CNPJ do responsável]";
const contato = brand.contactEmail || "[PENDENTE: e-mail de contato]";

export interface LegalDoc {
  title: string;
  updated: string;
  sections: { h: string; p: string[] }[];
}

export const privacy: LegalDoc = {
  title: "Política de Privacidade",
  updated: "16/10/2026",
  sections: [
    {
      h: "Quem somos",
      p: [`Este site é operado por ${responsavel}. Dúvidas sobre privacidade: ${contato}.`],
    },
    {
      h: "Quiz",
      p: [
        "O quiz não pede nome, e-mail, telefone ou qualquer dado de identificação.",
        "Suas respostas ficam guardadas apenas no armazenamento temporário do seu navegador (sessionStorage), para montar o resultado, e são apagadas quando você fecha a aba. Elas não são enviadas para nossos servidores nem para ferramentas de publicidade.",
        "O resultado é uma reflexão baseada nas respostas, e não um diagnóstico médico ou psicológico.",
      ],
    },
    {
      h: "Cookies e medição de anúncios",
      p: [
        `${tracking.requireConsent ? "Com o seu consentimento, usamos" : "Usamos"} o Meta Pixel (Meta Platforms) e, quando configurado, a ferramenta Utmify, para medir o desempenho dos nossos anúncios: por exemplo, visitas às páginas, início do quiz e cliques para o checkout. Essas ferramentas podem usar cookies e identificadores do seu navegador.`,
        "Nenhuma resposta do quiz é compartilhada com essas ferramentas.",
        tracking.requireConsent
          ? "Você pode aceitar ou recusar no aviso exibido no site. Para mudar sua escolha, limpe os dados do site no seu navegador e escolha novamente."
          : "Você pode limitar essa medição bloqueando cookies de terceiros nas configurações do seu navegador ou ajustando suas preferências de anúncios nas contas da Meta (Facebook e Instagram).",
      ],
    },
    {
      h: "Parâmetros de campanha",
      p: [
        "Quando você chega por um anúncio, parâmetros do link (como utm_source e fbclid) são guardados temporariamente na sua sessão e repassados à página de pagamento, para sabermos qual anúncio trouxe a visita.",
      ],
    },
    {
      h: "Compra",
      p: [
        "O pagamento é feito em plataforma externa de checkout, que trata seus dados de compra conforme a própria política de privacidade. [PENDENTE: nome da plataforma e link da política dela]",
      ],
    },
    {
      h: "Seus direitos (LGPD)",
      p: [
        `Você pode solicitar confirmação, acesso, correção ou exclusão de dados pessoais, além de revogar consentimentos, pelo e-mail ${contato}.`,
      ],
    },
  ],
};

export const terms: LegalDoc = {
  title: "Termos de Uso",
  updated: "16/10/2026",
  sections: [
    {
      h: "Sobre o produto",
      p: [
        "O Mente em Paz é um produto digital de autocuidado, com áudios guiados e materiais de apoio para uma rotina noturna de desaceleração.",
        "Não é tratamento médico, psicológico ou terapêutico, não promete cura e não substitui o acompanhamento de profissionais de saúde.",
      ],
    },
    {
      h: "Acesso",
      p: ["O pagamento é único e o acesso é vitalício, liberado após a confirmação do pagamento. [PENDENTE: forma de entrega do acesso]"],
    },
    {
      h: "Garantia e reembolso",
      p: [
        `Você pode solicitar o reembolso em até ${guarantee.days} dias após a compra, conforme as condições da plataforma de pagamento. [PENDENTE: confirmar o procedimento de solicitação]`,
      ],
    },
    {
      h: "Uso do conteúdo",
      p: ["O conteúdo é de uso pessoal e não pode ser revendido, redistribuído ou publicado sem autorização."],
    },
    {
      h: "Contato",
      p: [`${responsavel} · ${contato}`],
    },
  ],
};

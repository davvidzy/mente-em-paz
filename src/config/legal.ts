/**
 * Textos legais — ESTRUTURA BASE, a ser revisada por quem responde juridicamente pelo produto.
 * Descreve apenas o que o site realmente faz. Campos [PENDENTE] precisam ser preenchidos
 * antes da publicação (o build avisa enquanto existirem).
 * Linguagem de bem-estar, sem termos clínicos: o domínio teve restrição do Meta por
 * possível tema de saúde (ver lib/analytics.ts). Links (https://…) viram clicáveis.
 */
import { brand, guarantee, tracking } from "./site";

const responsavel = brand.legalEntity || brand.name;
const contato = brand.contactEmail || "nosso suporte (ver rodapé)";

export interface LegalDoc {
  title: string;
  updated: string;
  sections: { h: string; p: string[] }[];
}

export const privacy: LegalDoc = {
  title: "Política de Privacidade",
  updated: "04/11/2026",
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
        "O resultado é apenas uma reflexão baseada nas respostas.",
      ],
    },
    {
      h: "Cookies e medição de anúncios",
      p: [
        `${tracking.requireConsent ? "Com o seu consentimento, usamos" : "Usamos"} o Meta Pixel (Meta Platforms) para medir o desempenho dos nossos anúncios: visitas às páginas e cliques para o checkout. Essa ferramenta pode usar cookies e identificadores do seu navegador.`,
        "Nenhuma resposta do quiz é compartilhada com essa ferramenta.",
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
        "O pagamento é feito na plataforma de checkout Wiapy, que trata seus dados de compra conforme a própria política de privacidade: https://wiapy.com/app/politica-privacidade",
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
  updated: "04/11/2026",
  sections: [
    {
      h: "Sobre o produto",
      p: [
        "O Mente em Paz é um produto digital de relaxamento e bem-estar, com áudios guiados e materiais de apoio para a rotina da noite.",
        "É um conteúdo de uso complementar: não é um tratamento, não garante resultados específicos e não substitui orientação especializada.",
      ],
    },
    {
      h: "Acesso",
      p: [
        "O pagamento é único e o acesso é vitalício. O acesso é enviado por e-mail logo após a confirmação do pagamento e funciona pelo navegador, sem instalar aplicativo.",
      ],
    },
    {
      h: "Garantia e reembolso",
      p: [
        `Você pode solicitar o reembolso em até ${guarantee.days} dias após a compra, pelo link enviado no e-mail da compra, sem precisar explicar o motivo.`,
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

/**
 * Conteúdo do quiz e matriz de pontuação dos resultados.
 * O motor (src/lib/classifier.ts) só lê este arquivo — mudar textos ou pesos
 * aqui não exige mexer na lógica. Depois de mudar pesos, rode `npm test`.
 */

export type ProfileId = "acelerada" | "preocupacao" | "sobrecarga" | "relaxar";

export interface QuizOption {
  id: string; // "A" | "B" | "C" | "D"
  label: string;
  /** Pontos somados a cada perfil. */
  weights?: Partial<Record<ProfileId, number>>;
  /** Sinal de que a visitante está bem nesse aspecto (resposta "positiva"). */
  calm?: boolean;
  /** Frase espelho exibida no resultado ("Você contou que…"). */
  mirror: string;
}

export interface QuizQuestion {
  id: string;
  title: string;
  options: QuizOption[];
}

/** O quiz começa direto na pergunta 1; esta linha aparece acima dela. */
export const quizIntro = {
  info: "Leva menos de 2 min",
};

export const quizLoading = "Organizando suas respostas…";

/**
 * 3 perguntas: 1. a cena (o que acontece ao deitar) → 2. a causa (o que mais
 * dificulta) → 3. o desejo (o que mais quer ao fim do dia).
 *
 * MATRIZ DE PONTUAÇÃO (documentada)
 *
 *            acelerada  preocup.  sobrec.  relaxar
 * Q1 A          3
 * Q1 B                     3
 * Q1 C                     1         2
 * Q1 D                                              (nenhum peso: Q2 e Q3 decidem)
 * Q2 A          3
 * Q2 B                     3
 * Q2 C                               3
 * Q2 D                                        3
 * Q3 A          2
 * Q3 B                     2
 * Q3 C                               2
 * Q3 D                                        2
 *
 * Regras do motor (ver classifier.ts):
 * 1. Vence a maior pontuação.
 * 2. Empate: vence o perfil mais forte da Q2 (a causa que ela escolheu); persistindo,
 *    a ordem fixa acelerada → preocupação → sobrecarga → relaxar.
 * Sem respostas "calm": o tom preventivo (`preventiveContent`) fica desligado.
 */
export const questions: QuizQuestion[] = [
  {
    id: "ao_deitar",
    title: "Quando você finalmente deita, o que acontece?",
    options: [
      { id: "A", label: "Minha cabeça não para.", weights: { acelerada: 3 }, mirror: "ao deitar, sua cabeça não para" },
      { id: "B", label: "Fico pensando nas preocupações.", weights: { preocupacao: 3 }, mirror: "ao deitar, você fica pensando nas preocupações" },
      { id: "C", label: "Sinto que deixei coisas por fazer.", weights: { sobrecarga: 2, preocupacao: 1 }, mirror: "ao deitar, fica a sensação de ter deixado coisas por fazer" },
      { id: "D", label: "Geralmente consigo relaxar.", mirror: "geralmente consegue relaxar ao deitar" },
    ],
  },
  {
    id: "dificuldade",
    title: "O que mais dificulta seu descanso?",
    options: [
      { id: "A", label: "Pensamentos que não param.", weights: { acelerada: 3 }, mirror: "os pensamentos que não param dificultam seu descanso" },
      { id: "B", label: "Preocupações com o amanhã.", weights: { preocupacao: 3 }, mirror: "as preocupações com o amanhã dificultam seu descanso" },
      { id: "C", label: "O peso das responsabilidades.", weights: { sobrecarga: 3 }, mirror: "o peso das responsabilidades dificulta seu descanso" },
      { id: "D", label: "A dificuldade de relaxar.", weights: { relaxar: 3 }, mirror: "relaxar é o que mais custa" },
    ],
  },
  {
    id: "desejo",
    title: "O que você mais deseja ao fim do dia?",
    options: [
      { id: "A", label: "Desacelerar meus pensamentos.", weights: { acelerada: 2 }, mirror: "deseja desacelerar os pensamentos" },
      { id: "B", label: "Deixar as preocupações de lado.", weights: { preocupacao: 2 }, mirror: "deseja deixar as preocupações de lado" },
      { id: "C", label: "Aliviar o peso do dia.", weights: { sobrecarga: 2 }, mirror: "deseja aliviar o peso do dia" },
      { id: "D", label: "Conseguir relaxar de verdade.", weights: { relaxar: 2 }, mirror: "deseja relaxar de verdade" },
    ],
  },
];

/** Índice da pergunta usada no desempate (a causa: "o que mais dificulta"). */
export const tieBreakQuestion = 1;

/** Desempate final (ordem fixa). */
export const profilePriority: ProfileId[] = ["acelerada", "preocupacao", "sobrecarga", "relaxar"];

/**
 * Conteúdo do resultado. Regras de texto (a página não tem rolagem):
 * • title: até 2 linhas no mobile (~34 caracteres), direto e incisivo — sem diagnóstico.
 * • solution: até 3 linhas no card, inclusive em 320 px (≤ 90 caracteres), sem promessa de cura.
 */
export interface ProfileContent {
  title: string;
  solution: string;
}

export const profiles: Record<ProfileId, ProfileContent> = {
  acelerada: {
    title: "Sua mente parece não desligar.",
    solution: "Áudios guiados para desacelerar os pensamentos quando o dia termina.",
  },
  preocupacao: {
    title: "Suas preocupações deitam com você.",
    solution: "Áudios guiados para deixar o amanhã de lado e relaxar antes de dormir.",
  },
  sobrecarga: {
    title: "Você leva o peso do dia para a cama.",
    solution: "Áudios guiados para soltar o peso do dia e descansar sem culpa.",
  },
  relaxar: {
    title: "Seu corpo para. Relaxar é difícil.",
    solution: "Áudios guiados para o corpo e a mente encontrarem a calma à noite.",
  },
};

/** Tom preventivo (só com respostas "calm" — desligado nas perguntas atuais). */
export const preventiveContent: ProfileContent = {
  title: "Proteja o descanso que você tem.",
  solution: "Áudios guiados para manter suas noites tranquilas, mesmo nos dias mais cheios.",
};

export const resultCopy = {
  eyebrow: "Seu resultado",
  solutionTitle: "Como o Mente em Paz pode ajudar",
  cta: "Conhecer o Mente em Paz",
  disclaimer: "Reflexão baseada nas suas respostas.",
};

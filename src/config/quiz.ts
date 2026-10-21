/**
 * Conteúdo do quiz e matriz de pontuação dos resultados.
 * O motor (src/lib/classifier.ts) só lê este arquivo — mudar textos ou pesos
 * aqui não exige mexer na lógica. Depois de mudar pesos, rode `npm test`.
 */

export type ProfileId = "pais" | "culpa" | "pensamentos" | "sobrecarga";

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
  info: "3 perguntas",
};

export const quizLoading = "Organizando suas respostas…";

/**
 * 3 perguntas em ordem crescente de profundidade da dor:
 * 1. a cena (o que acontece ao deitar) → 2. a causa (o que mais pesa) → 3. a culpa.
 *
 * MATRIZ DE PONTUAÇÃO (documentada)
 *
 *            pais  culpa  pensam.  sobrec.   calm
 * Q1 A        3
 * Q1 B                     3
 * Q1 C              1               2
 * Q1 D                                        ✓
 * Q2 A        3
 * Q2 B                     2        1
 * Q2 C                              3
 * Q2 D                     2
 * Q3 A              4
 * Q3 B        1     2
 * Q3 C                     2
 * Q3 D                                        ✓
 *
 * Regras do motor (ver classifier.ts):
 * 1. 2 respostas "calm" (Q1 D e Q3 D) → perfil "sobrecarga" em tom preventivo.
 * 2. Caso contrário vence a maior pontuação.
 * 3. Empate: vence o perfil mais forte da Q2 (a causa que ela escolheu); persistindo,
 *    a ordem fixa pais → culpa → pensamentos → sobrecarga.
 * Tom preventivo usa `preventiveContent` no lugar do perfil.
 */
export const questions: QuizQuestion[] = [
  {
    id: "ao_deitar",
    title: "Quando você finalmente deita, o que acontece?",
    options: [
      { id: "A", label: "Continuo pensando nos meus pais.", weights: { pais: 3 }, mirror: "ao deitar, seus pensamentos continuam nos seus pais" },
      { id: "B", label: "Minha cabeça não para de pensar.", weights: { pensamentos: 3 }, mirror: "ao deitar, sua cabeça não para de pensar" },
      { id: "C", label: "Sinto que deixei coisas por fazer.", weights: { sobrecarga: 2, culpa: 1 }, mirror: "ao deitar, fica a sensação de ter deixado coisas por fazer" },
      { id: "D", label: "Geralmente consigo relaxar.", calm: true, mirror: "geralmente consegue relaxar ao deitar" },
    ],
  },
  {
    id: "preocupacao",
    title: "O que mais tira sua tranquilidade à noite?",
    options: [
      { id: "A", label: "Medo de acontecer algo com meus pais.", weights: { pais: 3 }, mirror: "o medo de acontecer algo com seus pais é o que mais pesa à noite" },
      { id: "B", label: "Preocupação com o dia seguinte.", weights: { pensamentos: 2, sobrecarga: 1 }, mirror: "a preocupação com o dia seguinte costuma aparecer à noite" },
      { id: "C", label: "Sensação de ter responsabilidades demais.", weights: { sobrecarga: 3 }, mirror: "a sensação de ter responsabilidades demais pesa à noite" },
      { id: "D", label: "Nada específico, só não consigo desacelerar.", weights: { pensamentos: 2 }, mirror: "mesmo sem um motivo específico, é difícil desacelerar" },
    ],
  },
  {
    id: "culpa",
    title: "Quando tenta tirar um tempo para você, o que sente?",
    options: [
      { id: "A", label: "Culpa por não estar ajudando.", weights: { culpa: 4 }, mirror: "sente culpa quando tira um tempo para você" },
      { id: "B", label: "Preocupação de alguém precisar de mim.", weights: { culpa: 2, pais: 1 }, mirror: "fica preocupada que alguém precise de você quando tira um tempo para si" },
      { id: "C", label: "Dificuldade de desligar os pensamentos.", weights: { pensamentos: 2 }, mirror: "tem dificuldade de desligar os pensamentos mesmo no seu tempo" },
      { id: "D", label: "Consigo aproveitar esse momento.", calm: true, mirror: "consegue aproveitar o tempo que reserva para si" },
    ],
  },
];

/** Índice da pergunta usada no desempate (a causa: "o que mais pesa"). */
export const tieBreakQuestion = 1;

/** Desempate final (ordem fixa). */
export const profilePriority: ProfileId[] = ["pais", "culpa", "pensamentos", "sobrecarga"];

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
  pais: {
    title: "Seus pais dormem. Sua mente, não.",
    solution: "Áudios guiados para desligar o alerta e descansar sem deixar de cuidar de quem ama.",
  },
  culpa: {
    title: "Você cuida de todos. Menos de você.",
    solution: "Áudios guiados para criar, à noite, um momento só seu. Sem culpa.",
  },
  pensamentos: {
    title: "Seu corpo deita. Sua mente, não.",
    solution: "Áudios guiados para tirar as tarefas da cabeça e voltar a atenção ao descanso.",
  },
  sobrecarga: {
    title: "O dia acaba. O peso, não.",
    solution: "Áudios guiados para soltar o peso do dia e criar um descanso que é só seu.",
  },
};

/** Respostas positivas (já consegue relaxar): não força um problema. */
export const preventiveContent: ProfileContent = {
  title: "Proteja o descanso que você tem.",
  solution: "Áudios guiados para manter suas noites tranquilas, mesmo nos dias mais cheios.",
};

export const resultCopy = {
  eyebrow: "Seu resultado",
  solutionTitle: "Como o Mente em Paz pode ajudar",
  cta: "Conhecer o Mente em Paz",
  disclaimer: "Reflexão baseada nas suas respostas, não um diagnóstico.",
};

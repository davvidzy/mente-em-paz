/**
 * Conteúdo do quiz e matriz de pontuação dos resultados.
 * O motor (src/lib/classifier.ts) só lê este arquivo — mudar textos ou pesos
 * aqui não exige mexer na lógica. Depois de mudar pesos, rode `npm test`.
 */

export type ProfileId = "pais" | "culpa" | "pensamentos" | "sobrecarga";
export type DesireId = "fiz_o_possivel" | "menos_pensamentos" | "sem_culpa" | "rotina_leve";

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
  /** Linha curta abaixo da pergunta que convida à reflexão. */
  hint: string;
  options: QuizOption[];
}

/** O quiz começa direto na pergunta 1; esta linha aparece acima dela. */
export const quizIntro = {
  info: "3 perguntas • sem cadastro",
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
 * O "desejo" exibido no resultado deriva do perfil (profileDesire).
 */
export const questions: QuizQuestion[] = [
  {
    id: "ao_deitar",
    title: "Quando você finalmente deita, o que acontece?",
    hint: "Pense nas últimas noites.",
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
    hint: "Escolha o que mais pesa.",
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
    hint: "Seja sincera: só você vê esta resposta.",
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

/** Perfil → o que pode mudar (exibido no resultado). */
export const profileDesire: Record<ProfileId, DesireId> = {
  pais: "fiz_o_possivel",
  pensamentos: "menos_pensamentos",
  culpa: "sem_culpa",
  sobrecarga: "rotina_leve",
};

export interface ProfileContent {
  title: string;
  description: string[];
  solution: string;
}

export const profiles: Record<ProfileId, ProfileContent> = {
  pais: {
    title: "Seu dia termina, mas suas preocupações continuam.",
    description: [
      "Cuidar dos pais pode fazer com que sua atenção permaneça voltada para eles, mesmo quando você já fez tudo o que podia naquele dia.",
      "Essa sensação de precisar estar sempre alerta pode dificultar o descanso.",
    ],
    solution:
      "O Mente em Paz ajuda você a construir uma pausa noturna com orientações guiadas para desacelerar e encontrar momentos de tranquilidade, sem deixar de cuidar de quem ama.",
  },
  culpa: {
    title: "Você também merece descansar sem culpa.",
    description: [
      "Estar presente para quem você ama não significa precisar estar disponível a cada minuto.",
      "Se até o seu momento de descanso vem acompanhado de culpa ou preocupação, talvez esteja faltando um espaço de cuidado voltado para você.",
    ],
    solution:
      "O Mente em Paz oferece áudios guiados e pequenos exercícios para ajudar você a encerrar o dia com mais acolhimento e criar um momento só seu.",
  },
  pensamentos: {
    title: "Seu corpo está cansado, mas sua mente continua ocupada.",
    description: [
      "Deitar e continuar repassando tarefas, decisões e preocupações pode transformar a noite em uma extensão do dia.",
      "Você merece ter um momento em que não precisa resolver tudo.",
    ],
    solution:
      "Com o Mente em Paz, você encontra áudios guiados e exercícios simples para deixar as tarefas do dia de lado por alguns minutos e direcionar a atenção ao seu descanso.",
  },
  sobrecarga: {
    title: "Seu descanso também merece um lugar na sua rotina.",
    description: [
      "Entre compromissos e cuidados com outras pessoas, pode ser difícil reservar um momento de tranquilidade.",
      "Mesmo quando as noites são boas, criar um momento de autocuidado pode ajudar você a preservar esse espaço.",
    ],
    solution:
      "O Mente em Paz reúne recursos práticos e reutilizáveis para ajudar você a construir uma pequena rotina de descanso no seu próprio ritmo.",
  },
};

/** O que pode mudar — descrito como possibilidade, sem afirmar o que ela deseja. */
export const desires: Record<DesireId, { label: string; text: string }> = {
  fiz_o_possivel: {
    label: "Terminar o dia sabendo que fez o possível",
    text: "Imagine encerrar o dia com a certeza de que o cuidado de hoje está feito, e que agora o espaço é seu. Uma pausa guiada de fechamento ajuda a marcar esse momento.",
  },
  menos_pensamentos: {
    label: "Chegar à noite com a mente mais leve",
    text: "Imagine deitar sem repassar o dia inteiro na cabeça. Os áudios guiados ajudam a direcionar a atenção para o agora, um passo de cada vez.",
  },
  sem_culpa: {
    label: "Descansar sem culpa",
    text: "Imagine tirar alguns minutos para você sem sentir que está deixando alguém de lado. Cuidar de si também é uma forma de cuidar, e a prática guiada ajuda a tornar isso um hábito.",
  },
  rotina_leve: {
    label: "Uma noite mais leve",
    text: "Com passos simples e reutilizáveis, a prática se encaixa no seu tempo e ajuda a proteger um espaço de descanso, sem exigir uma rotina perfeita.",
  },
};

export const resultCopy = {
  eyebrow: "Seu resultado",
  mirrorTitle: "Pelo que você contou",
  desireTitle: "O que pode mudar",
  solutionTitle: "Como o Mente em Paz pode ajudar",
  cta: "Conhecer o Mente em Paz",
  retake: "Refazer o quiz",
  disclaimer:
    "Este resultado é uma reflexão baseada nas suas respostas, não um diagnóstico médico ou psicológico.",
};

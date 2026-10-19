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
  /** Só na pergunta 5: desejo principal identificado. */
  desire?: DesireId;
}

export interface QuizQuestion {
  id: string;
  title: string;
  options: QuizOption[];
}

export const quizIntro = {
  title: "Você cuida de quem ama. Mas como fica sua mente no fim do dia?",
  text: "Descubra o que pode estar dificultando seus momentos de descanso.",
  info: "5 perguntas rápidas • Menos de 1 minuto",
  cta: "Descobrir agora",
  privacy: "Sem cadastro. Suas respostas ficam apenas neste aparelho.",
};

export const quizLoading = "Organizando suas respostas…";

/**
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
 * Q3 A/B/C   (sem pontos de perfil — Q3 C conta como "calm")
 * Q4 A              3
 * Q4 B        2     1
 * Q4 C                     2
 * Q4 D                                        ✓
 * Q5 A        1                                desejo: fiz_o_possivel
 * Q5 B                     1                   desejo: menos_pensamentos
 * Q5 C              1                          desejo: sem_culpa
 * Q5 D                              1          desejo: rotina_leve
 *
 * Regras do motor (ver classifier.ts):
 * 1. 3 respostas "calm" (Q1 D, Q3 C, Q4 D) → perfil "sobrecarga" em tom preventivo.
 * 2. Sem nenhum perfil com ≥ 3 pontos e ≥ 2 respostas calm → idem.
 * 3. Caso contrário vence a maior pontuação.
 * 4. Empate: vence o perfil apontado pelo desejo da Q5; persistindo,
 *    a ordem fixa pais → culpa → pensamentos → sobrecarga.
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
    id: "descanso",
    title: "Mesmo cansada, você consegue descansar de verdade?",
    options: [
      { id: "A", label: "Quase nunca.", mirror: "quase nunca consegue descansar de verdade" },
      { id: "B", label: "Só em algumas noites.", mirror: "só consegue descansar de verdade em algumas noites" },
      { id: "C", label: "Na maioria das vezes, sim.", calm: true, mirror: "na maioria das vezes consegue descansar" },
    ],
  },
  {
    id: "culpa",
    title: "Quando tenta tirar um tempo para você, o que sente?",
    options: [
      { id: "A", label: "Culpa por não estar ajudando.", weights: { culpa: 3 }, mirror: "sente culpa quando tira um tempo para você" },
      { id: "B", label: "Preocupação de alguém precisar de mim.", weights: { pais: 2, culpa: 1 }, mirror: "fica preocupada que alguém precise de você quando tira um tempo para si" },
      { id: "C", label: "Dificuldade de desligar os pensamentos.", weights: { pensamentos: 2 }, mirror: "tem dificuldade de desligar os pensamentos mesmo no seu tempo" },
      { id: "D", label: "Consigo aproveitar esse momento.", calm: true, mirror: "consegue aproveitar o tempo que reserva para si" },
    ],
  },
  {
    id: "sensacao_desejada",
    title: "O que você mais gostaria de sentir ao terminar o dia?",
    options: [
      { id: "A", label: "Tranquilidade por saber que fiz o possível.", weights: { pais: 1 }, desire: "fiz_o_possivel", mirror: "" },
      { id: "B", label: "Menos pensamentos e preocupações.", weights: { pensamentos: 1 }, desire: "menos_pensamentos", mirror: "" },
      { id: "C", label: "Liberdade para descansar sem culpa.", weights: { culpa: 1 }, desire: "sem_culpa", mirror: "" },
      { id: "D", label: "Uma rotina noturna mais leve.", weights: { sobrecarga: 1 }, desire: "rotina_leve", mirror: "" },
    ],
  },
];

/** Desempate quando o desejo não resolve. */
export const profilePriority: ProfileId[] = ["pais", "culpa", "pensamentos", "sobrecarga"];

/** Qual perfil cada desejo "puxa" no desempate. */
export const desireProfile: Record<DesireId, ProfileId> = {
  fiz_o_possivel: "pais",
  menos_pensamentos: "pensamentos",
  sem_culpa: "culpa",
  rotina_leve: "sobrecarga",
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

/** Desejo da Q5 → frase de personalização exibida no resultado. */
export const desires: Record<DesireId, { label: string; text: string }> = {
  fiz_o_possivel: {
    label: "Terminar o dia sabendo que fez o possível",
    text: "Você quer encerrar o dia com a tranquilidade de saber que fez o possível. Uma pausa de fechamento ajuda a marcar esse momento: o cuidado de hoje está feito, e agora o espaço é seu.",
  },
  menos_pensamentos: {
    label: "Menos pensamentos e preocupações",
    text: "Você quer chegar à noite com menos pensamentos e preocupações. Os áudios guiados ajudam a direcionar a atenção para o agora, um passo de cada vez.",
  },
  sem_culpa: {
    label: "Liberdade para descansar sem culpa",
    text: "Você quer se sentir livre para descansar sem culpa. Reservar alguns minutos para si também é uma forma de cuidar, e a prática guiada ajuda a tornar isso um hábito.",
  },
  rotina_leve: {
    label: "Uma rotina noturna mais leve",
    text: "Você quer uma rotina noturna mais leve. Com passos simples e reutilizáveis, a prática se encaixa no seu tempo, sem exigir uma rotina perfeita.",
  },
};

export const resultCopy = {
  eyebrow: "Seu resultado",
  mirrorTitle: "Pelo que você contou",
  desireTitle: "O que você deseja",
  solutionTitle: "Como o Mente em Paz pode ajudar",
  cta: "Conhecer o Mente em Paz",
  retake: "Refazer o quiz",
  disclaimer:
    "Este resultado é uma reflexão baseada nas suas respostas, não um diagnóstico médico ou psicológico.",
};

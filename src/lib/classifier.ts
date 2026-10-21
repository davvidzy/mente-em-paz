/**
 * Motor determinístico de resultados do quiz.
 * Não contém textos — lê pesos e conteúdos de src/config/quiz.ts.
 */
import {
  profileDesire,
  profilePriority,
  questions,
  tieBreakQuestion,
  type DesireId,
  type ProfileId,
} from "../config/quiz";

/** Respostas indexadas pela ordem das perguntas: ["A", "C", "B"]. */
export type Answers = (string | undefined)[];

export interface QuizResult {
  profile: ProfileId;
  desire: DesireId;
  /** true quando as respostas indicam que ela já consegue descansar → mensagem preventiva. */
  preventive: boolean;
  scores: Record<ProfileId, number>;
  /** Frases-espelho (ordem de exibição) já filtradas para o perfil. */
  mirrors: string[];
}

/** Todas as respostas "calm" possíveis → tom preventivo. */
const CALM_FOR_PREVENTIVE = questions.filter((q) => q.options.some((o) => o.calm)).length;

export function isComplete(answers: Answers): answers is string[] {
  return (
    answers.length === questions.length &&
    answers.every((a, i) => questions[i].options.some((o) => o.id === a))
  );
}

function option(qIndex: number, id: string) {
  const opt = questions[qIndex].options.find((o) => o.id === id);
  if (!opt) throw new Error(`Resposta inválida "${id}" na pergunta ${qIndex + 1}`);
  return opt;
}

/** Perfil com maior peso numa opção (para desempate). */
function strongestProfile(weights: Partial<Record<ProfileId, number>> | undefined): ProfileId | null {
  let best: ProfileId | null = null;
  for (const p of profilePriority) {
    if ((weights?.[p] ?? 0) > (best ? weights?.[best] ?? 0 : 0)) best = p;
  }
  return best;
}

export function classify(answers: Answers): QuizResult {
  if (!isComplete(answers)) throw new Error("Quiz incompleto: não é possível gerar resultado");

  const scores: Record<ProfileId, number> = { pais: 0, culpa: 0, pensamentos: 0, sobrecarga: 0 };
  let calm = 0;

  answers.forEach((id, qi) => {
    const opt = option(qi, id);
    for (const [p, w] of Object.entries(opt.weights ?? {})) scores[p as ProfileId] += w ?? 0;
    if (opt.calm) calm++;
  });

  const preventive = calm >= CALM_FOR_PREVENTIVE;

  let profile: ProfileId;
  if (preventive) {
    profile = "sobrecarga";
  } else {
    const top = Math.max(...Object.values(scores));
    const tied = profilePriority.filter((p) => scores[p] === top);
    const byCause = strongestProfile(option(tieBreakQuestion, answers[tieBreakQuestion]).weights);
    profile = byCause && tied.includes(byCause) ? byCause : tied[0];
  }

  return {
    profile,
    desire: profileDesire[profile],
    preventive,
    scores,
    mirrors: pickMirrors(answers, profile, preventive),
  };
}

/**
 * Frases-espelho, sempre literais às respostas dadas (nunca afirma algo que ela não disse):
 * Q1 (a cena) + as demais respostas que sustentam o perfil (ou as "calm", no tom preventivo).
 */
function pickMirrors(answers: string[], profile: ProfileId, preventive: boolean): string[] {
  const [first, ...rest] = answers.map((id, qi) => option(qi, id));
  const supporting = rest.filter((o) => (preventive ? o.calm : (o.weights?.[profile] ?? 0) > 0));
  return [first.mirror, ...supporting.map((o) => o.mirror)].filter(Boolean);
}

/** "a", "a e que b", "a, que b e que c" */
export function joinPt(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", que ")} e que ${items[items.length - 1]}`;
}

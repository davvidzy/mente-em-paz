/**
 * Motor determinístico de resultados do quiz.
 * Não contém textos — lê pesos e conteúdos de src/config/quiz.ts.
 */
import {
  desireProfile,
  profilePriority,
  questions,
  type DesireId,
  type ProfileId,
} from "../config/quiz";

/** Respostas indexadas pela ordem das perguntas: ["A", "C", "B", "D", "A"]. */
export type Answers = (string | undefined)[];

export interface QuizResult {
  profile: ProfileId;
  desire: DesireId;
  /** true quando as respostas indicam boas noites → mensagem preventiva. */
  preventive: boolean;
  scores: Record<ProfileId, number>;
  /** Frases-espelho (ordem de exibição) já filtradas para o perfil. */
  mirrors: string[];
}

const PROFILE_MIN_SIGNAL = 3;
const MAX_MIRRORS = 3;

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

export function classify(answers: Answers): QuizResult {
  if (!isComplete(answers)) throw new Error("Quiz incompleto: não é possível gerar resultado");

  const scores: Record<ProfileId, number> = { pais: 0, culpa: 0, pensamentos: 0, sobrecarga: 0 };
  let calm = 0;
  let desire: DesireId = "rotina_leve";

  answers.forEach((id, qi) => {
    const opt = option(qi, id);
    for (const [p, w] of Object.entries(opt.weights ?? {})) scores[p as ProfileId] += w ?? 0;
    if (opt.calm) calm++;
    if (opt.desire) desire = opt.desire;
  });

  const top = Math.max(...Object.values(scores));
  const preventive = calm >= 3 || (calm >= 2 && top < PROFILE_MIN_SIGNAL);

  let profile: ProfileId;
  if (preventive) {
    profile = "sobrecarga";
  } else {
    const tied = profilePriority.filter((p) => scores[p] === top);
    const byDesire = desireProfile[desire];
    profile = tied.includes(byDesire) ? byDesire : tied[0];
  }

  return { profile, desire, preventive, scores, mirrors: pickMirrors(answers, profile, preventive) };
}

/**
 * Escolhe até 3 frases-espelho, sempre literais às respostas dadas
 * (nunca afirma algo que a visitante não disse):
 * Q1 (ao deitar) → respostas de Q2/Q4 que sustentam o perfil → Q3 (descanso).
 */
function pickMirrors(answers: string[], profile: ProfileId, preventive: boolean): string[] {
  const q1 = option(0, answers[0]);
  const q3 = option(2, answers[2]);
  const supporting = [1, 3]
    .map((qi) => option(qi, answers[qi]))
    .filter((o) => preventive ? o.calm : (o.weights?.[profile] ?? 0) > 0);

  const list = [q1.mirror, ...supporting.map((o) => o.mirror), q3.mirror].filter(Boolean);
  if (list.length > MAX_MIRRORS) list.splice(MAX_MIRRORS - 1, list.length - MAX_MIRRORS);
  return list;
}

/** "a", "a e b", "a, b e c" */
export function joinPt(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", que ")} e que ${items[items.length - 1]}`;
}

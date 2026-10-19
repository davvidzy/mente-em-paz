/**
 * Estado do quiz entre as etapas.
 * • Respostas: sessionStorage (apenas neste aparelho/aba; apagadas ao fechar).
 *   Usadas só para remontar o resultado se a página for recarregada.
 * • Perfil: único dado que a Landing lê, para uma frase discreta de acolhimento.
 *   Nunca vai para URL, UTMs ou pixels.
 */
import type { Answers } from "./classifier";
import type { ProfileId } from "../config/quiz";
import { read, remove, write } from "./storage";

const ANSWERS = "mp_quiz_answers";
const PROFILE = "mp_profile";

export const quizSession = {
  getAnswers: (): Answers => read<Answers>(ANSWERS) ?? [],
  setAnswers: (a: Answers) => write(ANSWERS, a),
  clear: () => {
    remove(ANSWERS);
    remove(PROFILE);
  },
  setProfile: (p: ProfileId) => write(PROFILE, p),
  getProfile: (): ProfileId | null => {
    const p = read<string>(PROFILE);
    return p === "pais" || p === "culpa" || p === "pensamentos" || p === "sobrecarga" ? p : null;
  },
};

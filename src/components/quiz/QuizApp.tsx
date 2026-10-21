import { useCallback, useEffect, useRef, useState } from "react";
import { questions } from "../../config/quiz";
import { classify, isComplete, type Answers } from "../../lib/classifier";
import { track } from "../../lib/analytics";
import { routes } from "../../lib/routes";
import { quizSession } from "../../lib/session";
import { ConsentBanner } from "../ui/ConsentBanner";
import { QuizQuestion } from "./QuizQuestion";
import { QuizLoading } from "./QuizLoading";
import { QuizResult } from "./QuizResult";

export type View =
  | { kind: "question"; index: number }
  | { kind: "loading" }
  | { kind: "result" };

interface HistState {
  mp: true;
  view: View;
  depth: number;
}

const AUTO_ADVANCE_MS = 220;
const LOADING_MS = 1100;
/** O quiz começa direto na primeira pergunta (sem tela inicial). */
const FIRST: View = { kind: "question", index: 0 };

function initialView(): View {
  const page = document.documentElement.dataset.page;
  if (page === "result") return { kind: "result" };
  const st = history.state as HistState | null;
  if (st?.mp && st.view.kind === "question") return st.view;
  return FIRST;
}

/**
 * Quiz + resultado numa única aplicação: as etapas usam a History API
 * (voltar/avançar do navegador funcionam, sem recarregar a página) e
 * o resultado ganha a URL /resultado/.
 */
export function QuizApp() {
  const [answers, setAnswers] = useState<Answers>(() => quizSession.getAnswers());
  const [view, setView] = useState<View>(initialView);
  const depth = useRef((history.state as HistState | null)?.depth ?? 0);
  const busy = useRef(false);

  // Resultado acessado sem quiz completo → volta ao início do quiz
  const invalidResult = view.kind === "result" && !isComplete(answers);
  useEffect(() => {
    if (invalidResult) window.location.replace(routes.quiz());
  }, [invalidResult]);

  // Registra o estado atual na entrada
  useEffect(() => {
    history.replaceState({ mp: true, view, depth: depth.current } satisfies HistState, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Voltar/avançar do navegador
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const st = e.state as HistState | null;
      busy.current = false;
      if (!st?.mp) {
        setView(FIRST);
        depth.current = 0;
        return;
      }
      depth.current = st.depth;
      const saved = quizSession.getAnswers();
      setAnswers(saved);
      if (st.view.kind === "result" && !isComplete(saved)) setView(FIRST);
      else setView(st.view);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const go = useCallback((next: View, url?: string) => {
    depth.current += 1;
    history.pushState({ mp: true, view: next, depth: depth.current } satisfies HistState, "", url);
    setView(next);
  }, []);

  const back = useCallback(() => {
    if (depth.current > 0) {
      history.back();
      return;
    }
    // entrada direta (ex.: recarregou na pergunta 3): volta sem sair do site
    const prev: View =
      view.kind === "question" && view.index > 0 ? { kind: "question", index: view.index - 1 } : FIRST;
    history.replaceState({ mp: true, view: prev, depth: 0 } satisfies HistState, "", routes.quiz());
    setView(prev);
  }, [view]);

  const answer = (index: number, optionId: string) => {
    if (busy.current) return;
    busy.current = true;
    // sem tela inicial: o quiz "começa" na primeira interação real
    if (index === 0 && !answers.some(Boolean)) track("quiz_started");
    const next = [...answers];
    next[index] = optionId;
    next.length = Math.max(next.length, index + 1);
    setAnswers(next);
    quizSession.setAnswers(next);
    track("quiz_question_answered", { question_number: index + 1 });

    window.setTimeout(() => {
      busy.current = false;
      if (index < questions.length - 1) {
        go({ kind: "question", index: index + 1 });
        return;
      }
      if (!isComplete(next)) {
        // segurança: nunca gerar resultado incompleto
        const missing = next.findIndex((a, i) => !questions[i].options.some((o) => o.id === a));
        go({ kind: "question", index: Math.max(0, missing) });
        return;
      }
      track("quiz_completed");
      setView({ kind: "loading" });
      busy.current = true;
      window.setTimeout(() => {
        busy.current = false;
        quizSession.setProfile(classify(next).profile);
        go({ kind: "result" }, routes.result());
      }, LOADING_MS);
    }, AUTO_ADVANCE_MS);
  };

  // Foco no título e topo da página a cada etapa (acessibilidade)
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    window.scrollTo({ top: 0 });
    // na entrada (primeira pergunta, sem navegação ainda) não rouba o foco
    if (depth.current > 0 || view.kind !== "question" || view.index > 0) heading.current?.focus({ preventScroll: true });
  }, [view]);

  if (invalidResult) return null;

  return (
    <>
      {view.kind === "question" && (
        <QuizQuestion
          key={view.index}
          index={view.index}
          selected={answers[view.index]}
          onAnswer={(id) => answer(view.index, id)}
          onBack={back}
          headingRef={heading}
        />
      )}
      {view.kind === "loading" && <QuizLoading headingRef={heading} />}
      {view.kind === "result" && isComplete(answers) && (
        <QuizResult result={classify(answers)} headingRef={heading} />
      )}
      <ConsentBanner />
    </>
  );
}

import { useEffect, useRef, type RefObject } from "react";
import { Sparkles } from "lucide-react";
import { preventiveContent, profiles, resultCopy } from "../../config/quiz";
import type { QuizResult as Result } from "../../lib/classifier";
import { track } from "../../lib/analytics";
import { withParams } from "../../lib/params";
import { routes } from "../../lib/routes";
import { Button } from "../ui/Button";
import { QuizShell } from "./QuizShell";

/**
 * Resultado em uma tela só (100dvh, sem rolagem):
 * "Seu resultado" → título em 2 linhas → card "Como o Mente em Paz pode ajudar" + CTA.
 */
export function QuizResult({
  result,
  headingRef,
}: {
  result: Result;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const content = result.preventive ? preventiveContent : profiles[result.profile];
  // cada frase do título em sua própria linha
  const lines = content.title.split(/(?<=\.)\s+/);

  // ref evita disparo duplo (StrictMode/re-render)
  const viewed = useRef(false);
  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    track("quiz_result_viewed");
  }, []);

  const goLanding = () => {
    track("quiz_result_cta_clicked");
    window.location.assign(withParams(routes.landing()));
  };

  return (
    <QuizShell fit>
      <article className="flex flex-1 flex-col justify-center py-4" data-result>
        <p className="t-eyebrow">{resultCopy.eyebrow}</p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-3 font-serif text-[clamp(26px,8.2vw,44px)] font-semibold leading-[1.15] tracking-[-0.01em]"
          data-result-title
        >
          {lines.map((l, i) => (
            <span key={l} className={`block ${i > 0 ? "text-sage-deep" : ""}`}>
              {l}
            </span>
          ))}
        </h1>

        <section
          aria-labelledby="solucao"
          className="card mt-[clamp(24px,5dvh,44px)] p-4 shadow-(--shadow-soft) min-[360px]:p-5 sm:p-7"
        >
          <h2 id="solucao" className="flex items-center gap-2 whitespace-nowrap font-sans text-[13.5px] font-semibold text-sage-deep min-[360px]:text-[15px]">
            <Sparkles aria-hidden className="hidden size-4 min-[360px]:block" strokeWidth={1.8} />
            {resultCopy.solutionTitle}
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed min-[360px]:text-[16.5px] sm:text-[17px]" data-result-solution>
            {content.solution}
          </p>
          <div className="mt-5 sm:mt-6">
            {/* abaixo de 360 px: sem seta e um pouco menor, para caber em 1 linha */}
            <Button
              size="lg"
              arrow
              full
              onClick={goLanding}
              className="whitespace-nowrap px-3 text-[15px] max-[359px]:[&>svg]:hidden min-[360px]:px-5 min-[360px]:text-base"
            >
              {resultCopy.cta}
            </Button>
          </div>
        </section>
      </article>
      <p className="shrink-0 text-center text-[12px] leading-snug text-sage-deep">{resultCopy.disclaimer}</p>
    </QuizShell>
  );
}

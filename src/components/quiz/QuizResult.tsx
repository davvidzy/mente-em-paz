import { useEffect, useRef, type RefObject } from "react";
import { Check, Heart, RotateCcw, Sparkles } from "lucide-react";
import { desires, profiles, resultCopy } from "../../config/quiz";
import { joinPt, type QuizResult as Result } from "../../lib/classifier";
import { track } from "../../lib/analytics";
import { withParams } from "../../lib/params";
import { routes } from "../../lib/routes";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { QuizShell } from "./QuizShell";

const productBenefits = [
  "Áudios guiados para desacelerar à noite",
  "Exercícios simples e reutilizáveis",
  "No seu ritmo, sempre que precisar",
];

export function QuizResult({
  result,
  onRetake,
  headingRef,
}: {
  result: Result;
  onRetake: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const content = profiles[result.profile];
  const desire = desires[result.desire];

  // ref evita disparo duplo (StrictMode/re-render); refazer o quiz monta outro componente → conta de novo
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
    <QuizShell>
      <article className="anim-enter pt-8 sm:pt-12">
        <p className="t-eyebrow">{resultCopy.eyebrow}</p>
        <h1 ref={headingRef} tabIndex={-1} className="t-h1 mt-4">
          {content.title}
        </h1>
        <div className="mt-6 space-y-4 text-[17px] sm:text-lg">
          {content.description.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        {/* O que ela respondeu (literal às respostas) */}
        <div className="mt-8 rounded-(--radius-card) bg-surface px-5 py-5 sm:px-6">
          <p className="t-small font-semibold text-sage-deep">{resultCopy.mirrorTitle}</p>
          <p className="mt-1.5 text-[15.5px] leading-relaxed">
            Você contou que {joinPt(result.mirrors)}.
          </p>
        </div>

        <Divider />

        <section aria-labelledby="desejo">
          <h2 id="desejo" className="flex items-center gap-2 font-sans text-[15px] font-semibold text-sage-deep">
            <Heart aria-hidden className="size-4" strokeWidth={1.8} />
            {resultCopy.desireTitle}
          </h2>
          <p className="t-h3 mt-3">{desire.label}</p>
          <p className="mt-3">{desire.text}</p>
        </section>

        <section aria-labelledby="solucao" className="card mt-10 p-5 shadow-(--shadow-soft) sm:p-8">
          <h2 id="solucao" className="flex items-center gap-2 font-sans text-[15px] font-semibold text-sage-deep">
            <Sparkles aria-hidden className="size-4" strokeWidth={1.8} />
            {resultCopy.solutionTitle}
          </h2>
          <div className="mt-4 flex items-center gap-3">
            <Logo variant="symbol" height={36} decorative className="size-9" />
            <p className="t-h3">Mente em Paz</p>
          </div>
          <p className="mt-4">{content.solution}</p>
          <ul className="mt-5 space-y-2.5">
            {productBenefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[16px]">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-sage/35 text-brand">
                  <Check aria-hidden className="size-3" strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <Button size="lg" arrow full onClick={goLanding}>
              {resultCopy.cta}
            </Button>
          </div>
        </section>

        <div className="mt-8 flex flex-col items-center gap-5 text-center">
          <button
            type="button"
            onClick={onRetake}
            className="inline-flex min-h-11 items-center gap-2 px-2 text-[15px] font-medium text-sage-deep underline-offset-4 hover:text-brand hover:underline"
          >
            <RotateCcw aria-hidden className="size-4" strokeWidth={1.8} />
            {resultCopy.retake}
          </button>
          <p className="max-w-[40ch] text-[13px] leading-relaxed text-sage-deep">{resultCopy.disclaimer}</p>
        </div>
      </article>
    </QuizShell>
  );
}

function Divider() {
  return (
    <div aria-hidden className="my-10 flex items-center gap-4 sm:my-12">
      <span className="h-px flex-1 bg-line" />
      <Logo variant="symbol" height={22} decorative className="size-[22px] opacity-70" />
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

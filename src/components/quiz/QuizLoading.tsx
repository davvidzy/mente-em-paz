import type { RefObject } from "react";
import { quizLoading } from "../../config/quiz";
import { Logo } from "../ui/Logo";
import { QuizShell } from "./QuizShell";

export function QuizLoading({ headingRef }: { headingRef: RefObject<HTMLHeadingElement | null> }) {
  return (
    <QuizShell>
      <section className="anim-fade flex flex-1 flex-col items-center justify-center gap-7 py-16 text-center" aria-busy="true">
        <div className="relative grid size-24 place-items-center">
          <span aria-hidden className="anim-breathe absolute inset-0 rounded-full bg-sage/25" />
          <Logo variant="symbol" height={56} decorative className="relative size-14" />
        </div>
        <h1 ref={headingRef} tabIndex={-1} className="t-h3" role="status">
          {quizLoading}
        </h1>
      </section>
    </QuizShell>
  );
}

import type { RefObject } from "react";
import { Clock, ShieldCheck } from "lucide-react";
import { quizIntro } from "../../config/quiz";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { QuizShell } from "./QuizShell";

export function QuizStart({
  onStart,
  headingRef,
}: {
  onStart: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const [count, time] = quizIntro.info.split("•").map((s) => s.trim());
  return (
    <QuizShell>
      <section className="anim-enter flex flex-1 flex-col justify-center py-10 text-center sm:py-16">
        <Logo variant="symbol" height={64} decorative className="mx-auto mb-8 size-16 sm:mb-10 sm:size-[72px]" />
        <h1 ref={headingRef} tabIndex={-1} className="t-h1 mx-auto max-w-[17ch] sm:max-w-[20ch]">
          {quizIntro.title}
        </h1>
        <p className="t-muted mx-auto mt-5 max-w-[34ch] text-[17px] sm:mt-6 sm:text-lg">{quizIntro.text}</p>

        <div className="mx-auto mt-9 w-full max-w-[360px] sm:mt-11">
          <Button size="lg" arrow full onClick={onStart}>
            {quizIntro.cta}
          </Button>
        </div>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[14px] text-sage-deep">
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            {count}
          </li>
          <li className="flex items-center gap-1.5">
            <Clock aria-hidden className="size-4" strokeWidth={1.7} />
            {time}
          </li>
        </ul>
        <p className="mx-auto mt-10 max-w-[34ch] text-[13px] leading-relaxed text-sage-deep sm:mt-12">
          <ShieldCheck aria-hidden className="mr-1.5 inline size-4 -translate-y-px align-middle" strokeWidth={1.7} />
          {quizIntro.privacy}
        </p>
      </section>
    </QuizShell>
  );
}

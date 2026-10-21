import { useState, type RefObject } from "react";
import { ChevronLeft, Check } from "lucide-react";
import { questions, quizIntro } from "../../config/quiz";
import { QuizShell } from "./QuizShell";

interface Props {
  index: number;
  selected?: string;
  onAnswer: (optionId: string) => void;
  onBack: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
}

export function QuizQuestion({ index, selected, onAnswer, onBack, headingRef }: Props) {
  const q = questions[index];
  const total = questions.length;
  const [picked, setPicked] = useState<string | undefined>(selected);
  const progress = ((index + (picked ? 1 : 0)) / total) * 100;

  const top = (
    <div className="container-page">
      <div className="mx-auto flex min-h-11 w-full max-w-[560px] items-center justify-between gap-4">
        {index > 0 ? (
          <button
            type="button"
            onClick={onBack}
            className="-ml-2 inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-[15px] font-medium text-sage-deep transition-colors hover:text-brand"
          >
            <ChevronLeft aria-hidden className="size-[18px]" strokeWidth={2} />
            Voltar
          </button>
        ) : (
          <p className="whitespace-nowrap text-[14px] font-medium text-sage-deep">{quizIntro.info}</p>
        )}
        <p className="whitespace-nowrap text-[14px] font-medium tabular-nums text-sage-deep" aria-live="polite">
          <span className="sr-only">Pergunta </span>
          {index + 1} de {total}
        </p>
      </div>
      <div
        className="mx-auto mt-2 h-1 w-full max-w-[560px] overflow-hidden rounded-full bg-line/80"
        role="progressbar"
        aria-label="Progresso do quiz"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={index + (picked ? 1 : 0)}
      >
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-500 ease-(--ease-calm)"
          style={{ width: `${Math.max(progress, 4)}%` }}
        />
      </div>
    </div>
  );

  return (
    <QuizShell top={top}>
      <section className="anim-enter flex flex-1 flex-col pt-10 sm:justify-center sm:pb-10 sm:pt-12">
        <h1 ref={headingRef} tabIndex={-1} className="t-h2 max-w-[22ch]">
          {q.title}
        </h1>
        <p className="mt-3 text-[15px] text-sage-deep">{q.hint}</p>
        <fieldset className="mt-7 sm:mt-9">
          <legend className="sr-only">{q.title}</legend>
          <ul className="flex flex-col gap-3">
            {q.options.map((o) => {
              const active = picked === o.id;
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setPicked(o.id);
                      onAnswer(o.id);
                    }}
                    className={`group flex min-h-16 w-full items-center gap-4 rounded-(--radius-card) border px-5 py-4 text-left text-[16.5px] leading-snug transition-[background-color,border-color,box-shadow,transform] duration-200 active:scale-[0.99] sm:text-[17px] ${
                      active
                        ? "border-brand bg-white shadow-(--shadow-soft)"
                        : "border-line bg-white/70 hover:border-sage-deep/60 hover:bg-white"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`grid size-6 shrink-0 place-items-center rounded-full border transition-colors duration-200 ${
                        active ? "border-brand bg-brand text-white" : "border-line bg-canvas group-hover:border-sage-deep/60"
                      }`}
                    >
                      {active && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                    <span className={active ? "font-medium text-brand" : "text-brand"}>{o.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </section>
    </QuizShell>
  );
}

import { landing } from "../../../config/landing";
import { program } from "../../../config/site";
import { Reveal, Section, SectionHead, type Tone } from "../shared";

/** "Suas 7 noites": título e duração de cada áudio, marcando as que vêm no Essencial. */
export function Program({ tone }: { tone: Tone }) {
  const c = landing.program;
  return (
    <Section id="programa" tone={tone} labelledBy="programa-title">
      <div className="container-page">
        <div className="mx-auto max-w-[760px]">
          <SectionHead id="programa-title" center title={c.title} text={c.text} />
          <ol className="mt-9 space-y-3 md:mt-11">
            {program.nights.map((n, i) => (
              <Reveal as="li" key={n.title} className="card flex items-center gap-4 px-4 py-3.5 sm:px-5 sm:py-4">
                <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-sage/30 font-serif text-[17px] font-semibold text-brand">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-serif text-[17px] font-semibold leading-snug text-brand sm:text-[18px]">{n.title}</p>
                  <p className="mt-0.5 text-[14px] text-sage-ink">
                    {n.minutes} min
                    {i < program.essencialNights && <span> · {c.essencialTag}</span>}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

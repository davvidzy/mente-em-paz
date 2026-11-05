import { Headphones, Play, Sparkles } from "lucide-react";
import { landing } from "../../../config/landing";
import { program } from "../../../config/site";
import { fill } from "../../../lib/format";
import { ButtonLink } from "../../ui/Button";
import { jumpTo, Reveal, Section, SectionHead, type Tone } from "../shared";

const stepIcons = [Sparkles, Play, Headphones];

/**
 * Biblioteca: título, 3 passos de uso (o antigo "Como funciona"), a lista de áudios
 * (marcando os que vêm no Essencial) e o CTA para os planos.
 */
export function Program({ tone }: { tone: Tone }) {
  const c = landing.program;
  return (
    <Section id="biblioteca" tone={tone} labelledBy="biblioteca-title">
      <div className="container-page">
        <div className="mx-auto max-w-[760px]">
          <SectionHead id="biblioteca-title" center title={fill(c.title, { n: program.nights.length })} text={c.text} />

          <ol className="mt-8 grid grid-cols-3 gap-2 md:mt-10 md:gap-4" aria-label="Como funciona">
            {c.steps.map((s, i) => {
              const Icon = stepIcons[i % stepIcons.length];
              return (
                <li key={s} className="flex flex-col items-center gap-2 text-center">
                  <span className="relative grid size-11 place-items-center rounded-full bg-sage/30 text-brand">
                    <Icon aria-hidden className="size-[18px]" strokeWidth={1.6} />
                    {/* número só visual: a lista ordenada (<ol>) já anuncia a posição */}
                    <span aria-hidden className="absolute -right-1.5 -top-1.5 grid size-[20px] place-items-center rounded-full bg-brand text-[11px] font-semibold text-white">
                      {i + 1}
                    </span>
                  </span>
                  <span className="text-[14px] font-medium leading-snug text-brand md:text-[15.5px]">{s}</span>
                </li>
              );
            })}
          </ol>

          <ol className="mt-9 space-y-3 md:mt-11" data-library>
            {program.nights.map((n, i) => {
              const essencial = i < program.essencialNights;
              const meta = [n.minutes ? `${n.minutes} min` : "", essencial ? c.essencialTag : ""].filter(Boolean).join(" · ");
              return (
                <Reveal as="li" key={n.title} className="card flex items-center gap-4 px-4 py-3.5 sm:px-5 sm:py-4">
                  <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-sage/30 font-serif text-[17px] font-semibold text-brand">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-serif text-[17px] font-semibold leading-snug text-brand sm:text-[18px]">{n.title}</p>
                    {meta && <p className="mt-0.5 text-[14px] text-sage-ink">{meta}</p>}
                  </div>
                </Reveal>
              );
            })}
          </ol>

          <Reveal className="mt-9 flex justify-center md:mt-12">
            <ButtonLink href="#planos" arrow size="lg" onClick={jumpTo("planos")} className="w-full sm:w-auto">
              {c.cta}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

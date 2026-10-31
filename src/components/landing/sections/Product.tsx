import { Check, Mail, Play, Repeat } from "lucide-react";
import { landing } from "../../../config/landing";
import { ButtonLink } from "../../ui/Button";
import { jumpTo, Reveal, Section, type Tone } from "../shared";

const stepIcons = [Mail, Play, Repeat];

/** "Como funciona?" — título, 3 passos, dúvidas rápidas da rotina e CTA. */
export function Product({ tone }: { tone: Tone }) {
  const c = landing.product;
  return (
    <Section id="produto" tone={tone} labelledBy="produto-title">
      <div className="container-page">
        <Reveal>
          <h2 id="produto-title" className="t-h2 text-center md:text-left">
            {c.title}
          </h2>
        </Reveal>
        <ol className="mt-8 grid gap-3 md:mt-10 md:grid-cols-3 md:gap-5">
          {c.steps.map((s, i) => {
            const Icon = stepIcons[i % stepIcons.length];
            return (
              <Reveal as="li" key={s} className="card flex items-center gap-4 p-5 md:flex-col md:items-start md:gap-5 md:p-7">
                <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-sage/30 text-brand">
                  <Icon aria-hidden className="size-5" strokeWidth={1.6} />
                  {/* número só visual: a lista ordenada (<ol>) já anuncia "1 de 3" */}
                  <span aria-hidden className="absolute -right-1.5 -top-1.5 grid size-[22px] place-items-center rounded-full bg-brand text-[12px] font-semibold text-white">
                    {i + 1}
                  </span>
                </span>
                <p className="text-[16.5px] font-medium leading-snug md:text-lg">{s}</p>
              </Reveal>
            );
          })}
        </ol>

        {/* Dúvidas rápidas: respondidas aqui, antes dos planos (o FAQ detalha) */}
        <Reveal className="mt-10 rounded-[20px] border border-line bg-white/60 p-6 md:mt-12 md:p-8">
          <h3 className="font-serif text-[21px] font-semibold leading-snug text-brand md:text-[24px]">{c.routine.title}</h3>
          <ul className="mt-5 grid gap-3 md:grid-cols-3 md:gap-6" data-routine>
            {c.routine.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[16px] leading-snug">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-sage/40 text-brand">
                  <Check aria-hidden className="size-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-9 flex justify-center md:mt-12">
          <ButtonLink href="#planos" arrow size="lg" onClick={jumpTo("planos")} className="w-full sm:w-auto">
            {c.cta}
          </ButtonLink>
        </Reveal>
      </div>
    </Section>
  );
}

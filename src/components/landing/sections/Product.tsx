import { Headphones, MoonStar, Repeat } from "lucide-react";
import { landing } from "../../../config/landing";
import { ButtonLink } from "../../ui/Button";
import { jumpTo, Reveal, Section, type Tone } from "../shared";

const stepIcons = [MoonStar, Headphones, Repeat];

/** "Como funciona?" — título, 3 passos e CTA. */
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

        <Reveal className="mt-9 flex justify-center md:mt-12">
          <ButtonLink href="#planos" arrow size="lg" onClick={jumpTo("planos")} className="w-full sm:w-auto">
            {c.cta}
          </ButtonLink>
        </Reveal>
      </div>
    </Section>
  );
}

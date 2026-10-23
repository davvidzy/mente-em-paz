import { Gift } from "lucide-react";
import { landing } from "../../../config/landing";
import { bonuses, plans, type Bonus as BonusItem } from "../../../config/site";
import { fill, formatBRL } from "../../../lib/format";
import { Reveal, Section, SectionHead, type Tone } from "../shared";

/**
 * Bônus exclusivos do Completo: cabeçalho, aviso "incluídos no Completo",
 * 5 cards empilhados e o box de valor total.
 * Preços riscados só com `bonuses.showValues` (ver site.ts) — nunca valores fictícios.
 */
export function Bonus({ tone }: { tone: Tone }) {
  const c = landing.bonus;
  const items = bonuses.items;
  const values = { n: items.length, plano: plans.completo.name };
  const total = items.reduce((sum, b) => sum + b.valueCents, 0);

  return (
    <Section id="bonus" tone={tone} labelledBy="bonus-title">
      <div className="container-page">
        <div className="mx-auto max-w-[760px]">
          <SectionHead
            id="bonus-title"
            center
            title={
              <>
                {fill(c.title, values)} <span aria-hidden>🎁</span>
              </>
            }
            text={c.text}
          />

          <Reveal className="mt-7 flex justify-center">
            <p className="inline-flex items-center gap-2.5 rounded-(--radius-card) border border-line bg-white/70 px-4 py-3 text-left text-[15px] font-medium leading-snug text-brand">
              <Gift aria-hidden className="size-5 shrink-0 text-sage-deep" strokeWidth={1.7} />
              {fill(c.includedNote, values)}
            </p>
          </Reveal>

          <ul className="mt-9 space-y-3.5 md:mt-11 md:space-y-4">
            {items.map((b, i) => (
              <Reveal as="li" key={b.name}>
                <BonusCard bonus={b} number={i + 1} tag={c.tag} />
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-8 rounded-[20px] border-2 border-dashed border-sage bg-white/60 px-6 py-8 text-center md:mt-10 md:py-10">
            {bonuses.showValues ? (
              <>
                <p className="text-[15px] text-sage-deep">
                  {fill(c.totalLabel, values)} <s>{formatBRL(total)}</s>
                </p>
                <p className="mt-2 font-serif text-[44px] font-semibold leading-none tracking-tight text-brand md:text-[52px]">
                  {formatBRL(0)}
                </p>
                <p className="mx-auto mt-4 max-w-[34ch] text-[16px] font-medium text-brand">{fill(c.totalNote, values)}</p>
              </>
            ) : (
              <>
                <p className="mx-auto max-w-[20ch] font-serif text-[26px] font-semibold leading-tight text-brand md:text-[30px]">
                  {fill(c.noValuesHighlight, values)}
                </p>
                <p className="mt-3 text-[16px] text-sage-deep">{fill(c.noValuesNote, values)}</p>
              </>
            )}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function BonusCard({ bonus, number, tag }: { bonus: BonusItem; number: number; tag: string }) {
  return (
    <article className="card flex gap-4 p-4 shadow-(--shadow-soft) transition-[transform,box-shadow] duration-300 ease-(--ease-calm) sm:gap-5 sm:p-5 md:hover:-translate-y-0.5 md:hover:shadow-(--shadow-lift)">
      <div className="grid size-[72px] shrink-0 content-center justify-items-center gap-1 rounded-xl bg-sage/20 sm:size-20">
        <Gift aria-hidden className="size-6 text-sage-deep" strokeWidth={1.6} />
        <span className="text-[12.5px] font-semibold text-brand">Bônus {number}</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="inline-flex rounded-full border border-sage px-2.5 py-0.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-brand">
          {tag}
        </p>
        <h3 className="mt-2 font-serif text-[19px] font-semibold leading-snug text-brand sm:text-[20px]">{bonus.name}</h3>
        <p className="t-muted mt-1 text-[15.5px] leading-snug">{bonus.description}</p>
        {bonuses.showValues && (
          <p className="mt-2.5 flex flex-wrap items-baseline gap-x-2.5 text-[15px]">
            <span className="text-sage-deep">
              <span className="sr-only">Valor individual: </span>
              <s>{formatBRL(bonus.valueCents)}</s>
            </span>
            <span className="rounded-full bg-brand px-2.5 py-0.5 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-white">
              Grátis
            </span>
          </p>
        )}
      </div>
    </article>
  );
}

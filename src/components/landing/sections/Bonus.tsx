import { useState } from "react";
import { Clock, Gift } from "lucide-react";
import { landing } from "../../../config/landing";
import { bonuses, plans, type Bonus as BonusItem } from "../../../config/site";
import { fill, formatBRL } from "../../../lib/format";
import { routes } from "../../../lib/routes";
import { Reveal, Section, SectionHead, type Tone } from "../shared";

/**
 * Bônus exclusivos do Completo: cabeçalho, cards empilhados e o box de valor total
 * (com prazo opcional). Valor riscado só com `bonuses.showValues` (ver site.ts).
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
          <SectionHead id="bonus-title" center title={fill(c.title, values)} text={c.text} />

          <ul className="mt-9 space-y-5 md:mt-11 md:space-y-6">
            {items.map((b, i) => (
              <Reveal as="li" key={b.name}>
                <BonusCard bonus={b} number={i + 1} tag={c.tag} />
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-9 rounded-[20px] border-2 border-dashed border-sage bg-white/60 px-6 py-8 text-center md:mt-11 md:py-10">
            {bonuses.showValues ? (
              <>
                <p className="text-[15px] text-sage-deep">
                  {fill(c.totalLabel, values)} <s>{formatBRL(total)}</s>
                </p>
                <p className="mt-2 font-serif text-[44px] font-semibold leading-none tracking-tight text-brand md:text-[52px]">
                  <span className="sr-only">por </span>
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
            {bonuses.deadlineDaysAhead > 0 && <Deadline days={bonuses.deadlineDaysAhead} label={c.deadlineLabel} />}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/**
 * Mobile: capa à esquerda do título; descrição (uma frase) na largura toda, abaixo (≤ 2 linhas).
 * ≥ 640px: capa ocupa as duas linhas à esquerda.
 */
function BonusCard({ bonus, number, tag }: { bonus: BonusItem; number: number; tag: string }) {
  return (
    <article className="card grid grid-cols-[88px_minmax(0,1fr)] gap-x-3.5 gap-y-4 p-4 shadow-(--shadow-soft) transition-[transform,box-shadow] duration-300 ease-(--ease-calm) [grid-template-areas:'cover_head'_'desc_desc'] min-[380px]:grid-cols-[96px_minmax(0,1fr)] sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-x-5 sm:gap-y-1 sm:p-5 sm:[grid-template-areas:'cover_head'_'cover_desc'] md:hover:-translate-y-0.5 md:hover:shadow-(--shadow-lift)">
      <div className="relative self-start [grid-area:cover]">
        {bonus.image ? (
          // capa repete o nome do título ao lado → decorativa para leitores de tela
          <img
            src={routes.asset(`${bonus.image}-400.webp`)}
            srcSet={`${routes.asset(`${bonus.image}-400.webp`)} 400w, ${routes.asset(`${bonus.image}-800.webp`)} 800w`}
            sizes="(min-width: 640px) 128px, 96px"
            width={400}
            height={400}
            alt=""
            loading="lazy"
            decoding="async"
            className="aspect-square w-full rounded-xl border border-line object-cover"
          />
        ) : (
          <div className="grid aspect-square w-full place-items-center rounded-xl bg-sage/20">
            <Gift aria-hidden className="size-7 text-sage-deep" strokeWidth={1.6} />
          </div>
        )}
        <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-2.5 py-0.5 text-[12px] font-semibold text-white">
          Bônus {number}
        </span>
      </div>

      <div className="min-w-0 self-center [grid-area:head] sm:self-end">
        <p className="inline-flex rounded-full border border-sage px-2.5 py-0.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-brand">
          {tag}
        </p>
        <h3 className="mt-2 font-serif text-[19px] font-semibold leading-snug text-brand sm:text-[20px]">{bonus.name}</h3>
      </div>
      <p className="text-[15px] leading-normal text-brand/85 [grid-area:desc] sm:self-start" data-bonus-desc>
        {bonus.description}
      </p>
    </article>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Hoje + `days`, como DD/MM, no relógio do aparelho. */
function deadline(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
}

/**
 * "Bônus grátis no Completo até DD/MM". O HTML pré-renderizado sai com a data do build;
 * um script do pré-render (entries/server.tsx) troca pela data de hoje assim que o HTML
 * chega (antes do JavaScript do site, que em 3G demora), e a hidratação mantém o texto.
 */
function Deadline({ days, label }: { days: number; label: string }) {
  const [date] = useState(() => deadline(days));
  const [before, after = ""] = label.split("{data}");

  return (
    <p className="mx-auto mt-7 flex max-w-[340px] items-center justify-center gap-2 border-t border-line pt-6 text-[16px] font-medium text-brand">
      <Clock aria-hidden className="size-[18px] shrink-0 text-sage-deep" strokeWidth={1.8} />
      <span>
        {before}
        <strong data-deadline suppressHydrationWarning>
          {date}
        </strong>
        {after}
      </span>
    </p>
  );
}

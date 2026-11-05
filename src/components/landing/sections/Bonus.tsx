import { useState } from "react";
import { Clock, Gift } from "lucide-react";
import { landing } from "../../../config/landing";
import { bonuses, plans, type Bonus as BonusItem } from "../../../config/site";
import { fill, formatBRL } from "../../../lib/format";
import { routes } from "../../../lib/routes";
import { Reveal, Section, SectionHead, type Tone } from "../shared";

/**
 * Bônus exclusivos do Completo em um bloco só, no formato de recibo: faixa "Incluso no
 * Completo", uma linha por bônus (capa redonda numerada, nome, preço riscado + GRÁTIS e
 * descrição) e o valor total no rodapé, com prazo opcional. Compacto de propósito: os
 * cards grandes ocupavam ~3.400px no celular. Valor riscado só com `bonuses.showValues`.
 */
export function Bonus({ tone }: { tone: Tone }) {
  const c = landing.bonus;
  const items = bonuses.items;
  const values = { n: items.length, plano: plans.completo.name };
  const total = items.reduce((sum, b) => sum + b.valueCents, 0);

  return (
    <Section id="bonus" tone={tone} labelledBy="bonus-title">
      <div className="container-page">
        <div className="mx-auto max-w-[640px]">
          <SectionHead id="bonus-title" center title={fill(c.title, values)} text={c.text} />

          <Reveal className="card mt-8 overflow-hidden shadow-(--shadow-soft) md:mt-10">
            <p className="flex items-center justify-center gap-2 border-b border-line px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-sage-ink">
              <Gift aria-hidden className="size-4 shrink-0" strokeWidth={1.8} />
              {c.tag}
            </p>

            <ul className="divide-y divide-line">
              {items.map((b, i) => (
                <li key={b.name}>
                  <BonusRow bonus={b} number={i + 1} />
                </li>
              ))}
            </ul>

            <div className="border-t-2 border-dashed border-sage bg-sage/10 px-5 py-6 text-center md:py-7">
              {bonuses.showValues ? (
                <>
                  <p className="text-[15px] text-sage-ink">
                    {fill(c.totalLabel, values)} <s data-bonus-total>{formatBRL(total)}</s>
                  </p>
                  <p className="mt-1.5 font-serif text-[40px] font-semibold leading-none tracking-tight text-brand md:text-[46px]">
                    <span className="sr-only">por </span>
                    {formatBRL(0)}
                  </p>
                  <p className="mx-auto mt-3 max-w-[34ch] text-[15px] font-medium leading-snug text-brand">{fill(c.totalNote, values)}</p>
                </>
              ) : (
                <>
                  <p className="mx-auto max-w-[20ch] font-serif text-[24px] font-semibold leading-tight text-brand md:text-[28px]">
                    {fill(c.noValuesHighlight, values)}
                  </p>
                  <p className="mt-2 text-[15px] text-sage-ink">{fill(c.noValuesNote, values)}</p>
                </>
              )}
              {bonuses.deadlineDaysAhead > 0 && <Deadline days={bonuses.deadlineDaysAhead} label={c.deadlineLabel} />}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/**
 * Uma linha do recibo. Celular: capa à esquerda do nome e do preço; descrição na largura
 * toda, abaixo (cabe em 2 linhas até em 320px). A partir de 640px: capa | nome e
 * descrição | preço à direita.
 */
function BonusRow({ bonus, number }: { bonus: BonusItem; number: number }) {
  return (
    <article className="grid grid-cols-[56px_minmax(0,1fr)] gap-x-3.5 px-4 py-4 [grid-template-areas:'thumb_name'_'thumb_price'_'desc_desc'] sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:gap-x-5 sm:px-6 sm:[grid-template-areas:'thumb_name_price'_'thumb_desc_price']">
      <div aria-hidden className="relative size-14 self-center [grid-area:thumb] sm:size-[72px]">
        <div className="size-full overflow-hidden rounded-full border border-line bg-surface">
          {bonus.image ? (
            // só a ilustração de dentro do círculo da capa (o "BÔNUS N" da arte vira o selo numerado)
            <img
              src={routes.asset(`${bonus.image}-400.webp`)}
              width={400}
              height={400}
              alt=""
              loading="lazy"
              decoding="async"
              className="relative left-[-23.5%] top-[-13.5%] block w-[147%] max-w-none"
            />
          ) : (
            <span className="grid size-full place-items-center text-sage-deep">
              <Gift className="size-6" strokeWidth={1.6} />
            </span>
          )}
        </div>
        <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-brand text-[11px] font-semibold text-white">
          {number}
        </span>
      </div>

      <h3 className="self-end font-serif text-[17px] font-semibold leading-snug text-brand [grid-area:name] sm:text-[19px]">
        <span className="sr-only">Bônus {number}: </span>
        {bonus.name}
      </h3>
      <p
        className="mt-3 text-[14.5px] leading-normal text-brand/85 [grid-area:desc] sm:mt-1 sm:self-start sm:text-[15px]"
        data-bonus-desc
      >
        {bonus.description}
      </p>
      <p
        className="mt-1.5 flex items-center gap-2.5 self-start [grid-area:price] sm:mt-0 sm:flex-col sm:items-end sm:gap-1.5 sm:self-center sm:pl-2"
        data-bonus-price
      >
        {bonuses.showValues && (
          <s className="text-[14px] text-sage-ink">
            <span className="sr-only">De </span>
            {formatBRL(bonus.valueCents)}
          </s>
        )}
        <span className="rounded-full bg-sage-deep px-2.5 py-0.5 text-[12px] font-bold uppercase tracking-[0.08em] text-white">
          {bonuses.showValues && <span className="sr-only">por </span>}
          Grátis
        </span>
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
    <p className="mx-auto mt-5 flex max-w-[340px] items-center justify-center gap-2 border-t border-line pt-4 text-[15px] font-medium text-brand">
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

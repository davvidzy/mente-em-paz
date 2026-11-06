import { useState } from "react";
import { Clock, Gift } from "lucide-react";
import { landing } from "../../../config/landing";
import { bonuses, plans, type Bonus as BonusItem } from "../../../config/site";
import { fill, formatBRL } from "../../../lib/format";
import { routes } from "../../../lib/routes";
import { Reveal, Section, SectionHead, type Tone } from "../shared";

/**
 * Bônus exclusivos do Completo: "Incluso no Completo" uma vez (acima do título), grade de
 * cards com o mockup (o bônus aberto no portal — prova de que existe) junto do nome,
 * descrição e preço, e o box de valor total (com prazo opcional).
 * Grade: 2 colunas no celular (2+2+1), 3 no tablet (3+2), 5 numa fileira a partir de
 * 1280px; a última fileira incompleta fica centralizada. Valor riscado só com `bonuses.showValues`.
 */
export function Bonus({ tone }: { tone: Tone }) {
  const c = landing.bonus;
  const items = bonuses.items;
  const values = { n: items.length, plano: plans.completo.name };
  const total = items.reduce((sum, b) => sum + b.valueCents, 0);

  return (
    <Section id="bonus" tone={tone} labelledBy="bonus-title">
      <div className="container-page">
        <SectionHead
          id="bonus-title"
          center
          eyebrow={
            <>
              <Gift aria-hidden className="size-4 shrink-0" strokeWidth={1.8} />
              {c.tag}
            </>
          }
          title={fill(c.title, values)}
          text={c.text}
        />

        <ul className="mx-auto mt-8 flex max-w-[1040px] flex-wrap justify-center gap-3 sm:gap-4 md:mt-10">
          {items.map((b, i) => (
            <Reveal
              as="li"
              key={b.name}
              className="w-[calc((100%-12px)/2)] sm:w-[calc((100%-32px)/3)] xl:w-[calc((100%-64px)/5)]"
            >
              <BonusCard bonus={b} number={i + 1} />
            </Reveal>
          ))}
        </ul>

        <Reveal className="mx-auto mt-8 max-w-[520px] rounded-[20px] border-2 border-dashed border-sage bg-white/60 px-5 py-6 text-center md:mt-10">
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
        </Reveal>
      </div>
    </Section>
  );
}

/**
 * Mockup quadrado no topo (o "BÔNUS N" já vem na arte) e, abaixo, nome, descrição e o
 * preço individual riscado + GRÁTIS, sempre no rodapé do card (cards da fileira com a
 * mesma altura).
 */
function BonusCard({ bonus, number }: { bonus: BonusItem; number: number }) {
  return (
    <article className="card flex h-full flex-col overflow-hidden shadow-(--shadow-soft)">
      {bonus.image ? (
        // aproximado 10%: a arte tem margem larga em volta do celular e da capa
        <div className="overflow-hidden border-b border-line bg-canvas">
          <img
            src={routes.asset(`${bonus.image}-400.webp`)}
            srcSet={[400, 800, 1200].map((w) => `${routes.asset(`${bonus.image}-${w}.webp`)} ${w}w`).join(", ")}
            sizes="(min-width: 1280px) 220px, (min-width: 640px) 36vw, 55vw"
            width={400}
            height={400}
            alt={`Bônus ${number} aberto no portal, no celular, ao lado da capa.`}
            loading="lazy"
            decoding="async"
            className="block aspect-square w-full scale-110 object-cover"
          />
        </div>
      ) : (
        <div className="grid aspect-square w-full place-items-center border-b border-line bg-sage/20">
          <Gift aria-hidden className="size-10 text-sage-deep" strokeWidth={1.6} />
        </div>
      )}

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="font-serif text-[15px] font-semibold leading-snug text-brand min-[360px]:text-[16px] sm:text-[17px]">
          <span className="sr-only">Bônus {number}: </span>
          {bonus.name}
        </h3>
        <p className="mt-1 text-[13px] leading-snug text-brand/80 sm:text-[14px]" data-bonus-desc>
          {bonus.description}
        </p>
        <p className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-3" data-bonus-price>
          {bonuses.showValues && (
            <s className="text-[13px] text-sage-ink">
              <span className="sr-only">De </span>
              {formatBRL(bonus.valueCents)}
            </s>
          )}
          <span className="rounded-full bg-sage-deep px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
            {bonuses.showValues && <span className="sr-only">por </span>}
            Grátis
          </span>
        </p>
      </div>
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

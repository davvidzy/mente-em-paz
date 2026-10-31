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

          {/* 1 coluna no celular; 2 a partir de 640px (o último, ímpar, fica centralizado) */}
          <ul className="mt-9 flex flex-wrap justify-center gap-5 md:mt-11 md:gap-6">
            {items.map((b, i) => (
              <Reveal as="li" key={b.name} className="w-full max-w-[400px] sm:w-[calc(50%-10px)] md:w-[calc(50%-12px)]">
                <BonusCard bonus={b} number={i + 1} tag={c.tag} />
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-9 rounded-[20px] border-2 border-dashed border-sage bg-white/60 px-6 py-8 text-center md:mt-11 md:py-10">
            {bonuses.showValues ? (
              <>
                <p className="text-[15px] text-sage-deep">
                  {fill(c.totalLabel, values)} <s data-bonus-total>{formatBRL(total)}</s>
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
 * Capa quadrada ocupando a largura do card (só com a margem interna), selo "Bônus N"
 * metade sobre a capa, metade fora; abaixo: etiqueta, nome, descrição e o preço
 * individual riscado (com `bonuses.showValues`) seguido de "GRÁTIS" em destaque.
 */
function BonusCard({ bonus, number, tag }: { bonus: BonusItem; number: number; tag: string }) {
  return (
    <article className="card flex h-full flex-col p-3 shadow-(--shadow-soft) transition-[transform,box-shadow] duration-300 ease-(--ease-calm) sm:p-3.5 md:hover:-translate-y-0.5 md:hover:shadow-(--shadow-lift)">
      <div className="relative">
        {bonus.image ? (
          // capa repete o nome do título abaixo → decorativa para leitores de tela
          <img
            src={routes.asset(`${bonus.image}-400.webp`)}
            srcSet={`${routes.asset(`${bonus.image}-400.webp`)} 400w, ${routes.asset(`${bonus.image}-800.webp`)} 800w`}
            sizes="(min-width: 640px) 360px, calc(100vw - 56px)"
            width={400}
            height={400}
            alt=""
            loading="lazy"
            decoding="async"
            className="aspect-square w-full rounded-[14px] border border-line object-cover"
          />
        ) : (
          <div className="grid aspect-square w-full place-items-center rounded-[14px] bg-sage/20">
            <Gift aria-hidden className="size-10 text-sage-deep" strokeWidth={1.6} />
          </div>
        )}
        <span className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-4 py-1 text-[14px] font-semibold text-white shadow-(--shadow-soft)">
          Bônus {number}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-7 sm:px-2.5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-sage-ink">{tag}</p>
        <h3 className="mt-1.5 font-serif text-[21px] font-semibold leading-snug text-brand">{bonus.name}</h3>
        <p className="mt-1.5 text-[15px] leading-normal text-brand/85" data-bonus-desc>
          {bonus.description}
        </p>
        <p className="mt-auto flex items-center gap-3 pt-4" data-bonus-price>
          {bonuses.showValues && (
            <s className="text-[16px] text-sage-ink">
              <span className="sr-only">De </span>
              {formatBRL(bonus.valueCents)}
            </s>
          )}
          <span className="rounded-full bg-sage-deep px-4 py-1 text-[15px] font-bold uppercase tracking-[0.08em] text-white">
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

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Gift } from "lucide-react";
import { landing } from "../../../config/landing";
import { bonuses, plans, type Bonus as BonusItem } from "../../../config/site";
import { fill, formatBRL } from "../../../lib/format";
import { routes } from "../../../lib/routes";
import { Reveal, Section, SectionHead, type Tone } from "../shared";

/**
 * Bônus exclusivos do Completo: galeria de mockups (o bônus aberto no portal — prova de que
 * existe) + bloco no formato de recibo (faixa "Incluso no Completo", uma linha por bônus com
 * preço riscado + GRÁTIS e o valor total no rodapé, com prazo opcional).
 * Celular: galeria acima do recibo. Desktop: lado a lado. A linha do bônus em exibição na
 * galeria fica destacada. Valor riscado só com `bonuses.showValues`.
 */
export function Bonus({ tone }: { tone: Tone }) {
  const c = landing.bonus;
  const items = bonuses.items;
  const values = { n: items.length, plano: plans.completo.name };
  const total = items.reduce((sum, b) => sum + b.valueCents, 0);
  const [active, setActive] = useState(0);

  return (
    <Section id="bonus" tone={tone} labelledBy="bonus-title">
      <div className="container-page">
        <SectionHead id="bonus-title" center title={fill(c.title, values)} text={c.text} />

        <div className="mx-auto mt-8 grid max-w-[640px] gap-6 md:mt-10 lg:max-w-[1040px] lg:grid-cols-2 lg:items-start lg:gap-12">
          <BonusGallery items={items} active={active} onActive={setActive} />

          <Reveal className="card overflow-hidden shadow-(--shadow-soft)">
            <p className="flex items-center justify-center gap-2 border-b border-line px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-sage-ink">
              <Gift aria-hidden className="size-4 shrink-0" strokeWidth={1.8} />
              {c.tag}
            </p>

            <ul className="divide-y divide-line">
              {items.map((b, i) => (
                <li key={b.name}>
                  <BonusRow bonus={b} number={i + 1} active={i === active} />
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
 * Um mockup por vez, com rolagem lateral nativa (arrastar no celular, setas e pontos);
 * o próximo aparece na borda para indicar que há mais. No celular a faixa vai até a borda
 * da tela. Sem JavaScript, continua rolando pelo próprio navegador.
 */
function BonusGallery({ items, active, onActive }: { items: BonusItem[]; active: number; onActive: (i: number) => void }) {
  const track = useRef<HTMLUListElement>(null);

  // o mockup que ocupa a maior parte da faixa é o "ativo" (pontos e linha do recibo)
  useEffect(() => {
    const el = track.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) onActive(Number((e.target as HTMLElement).dataset.index));
      },
      { root: el, threshold: 0.6 },
    );
    for (const li of el.children) io.observe(li);
    return () => io.disconnect();
  }, [onActive]);

  const go = (i: number) => {
    const el = track.current;
    const li = el?.children[(i + items.length) % items.length] as HTMLElement | undefined;
    if (!el || !li) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: li.offsetLeft - parseFloat(getComputedStyle(el).scrollPaddingLeft || "0"), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="lg:sticky lg:top-24" data-bonus-gallery>
      {/* focável: pelo teclado, as setas rolam a galeria */}
      <ul
        ref={track}
        tabIndex={0}
        aria-label="Os bônus por dentro do portal"
        className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain [scrollbar-width:none] max-sm:mx-[calc(var(--page-gutter)*-1)] max-sm:scroll-px-(--page-gutter) max-sm:px-(--page-gutter) [&::-webkit-scrollbar]:hidden"
      >
        {items.map((b, i) => (
          <li key={b.name} data-index={i} className="w-[86%] shrink-0 snap-start sm:w-[64%] lg:w-full">
            {b.image ? (
              <img
                src={routes.asset(`${b.image}-800.webp`)}
                srcSet={[400, 800, 1200].map((w) => `${routes.asset(`${b.image}-${w}.webp`)} ${w}w`).join(", ")}
                sizes="(min-width: 1024px) 500px, (min-width: 640px) 410px, 86vw"
                width={800}
                height={800}
                alt={`Bônus ${i + 1}, ${b.name}: o bônus aberto no portal, no celular, ao lado da capa.`}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="block aspect-square w-full rounded-[20px] border border-line bg-canvas object-cover"
              />
            ) : (
              <div className="grid aspect-square w-full place-items-center rounded-[20px] border border-line bg-canvas text-sage-deep">
                <Gift aria-hidden className="size-10" strokeWidth={1.6} />
                <span className="sr-only">Bônus {i + 1}</span>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-2 flex items-center justify-center">
        <button
          type="button"
          onClick={() => go(active - 1)}
          aria-label="Bônus anterior"
          className="grid size-11 place-items-center rounded-full text-sage-deep transition-colors hover:text-brand"
        >
          <ChevronLeft aria-hidden className="size-5" strokeWidth={1.8} />
        </button>
        {items.map((b, i) => (
          <button
            key={b.name}
            type="button"
            onClick={() => go(i)}
            aria-label={`Ver o bônus ${i + 1}`}
            aria-current={i === active || undefined}
            className="grid h-11 w-6 place-items-center"
          >
            <span className={`block h-2 rounded-full transition-all duration-300 ${i === active ? "w-5 bg-brand" : "w-2 bg-sage"}`} />
          </button>
        ))}
        <button
          type="button"
          onClick={() => go(active + 1)}
          aria-label="Próximo bônus"
          className="grid size-11 place-items-center rounded-full text-sage-deep transition-colors hover:text-brand"
        >
          <ChevronRight aria-hidden className="size-5" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}

/**
 * Uma linha do recibo. Celular: número à esquerda do nome e do preço; descrição na largura
 * toda, abaixo (cabe em 2 linhas até em 320px). A partir de 640px: número | nome e
 * descrição | preço à direita. `active` = bônus em exibição na galeria.
 */
function BonusRow({ bonus, number, active }: { bonus: BonusItem; number: number; active: boolean }) {
  return (
    <article
      className={`grid grid-cols-[32px_minmax(0,1fr)] gap-x-3.5 px-4 py-3.5 transition-colors sm:py-4 duration-300 [grid-template-areas:'num_name'_'num_price'_'desc_desc'] sm:grid-cols-[36px_minmax(0,1fr)_auto] sm:gap-x-4 sm:px-6 sm:[grid-template-areas:'num_name_price'_'num_desc_price'] ${
        active ? "bg-sage/10" : ""
      }`}
    >
      <span
        aria-hidden
        className={`grid size-8 place-items-center self-center rounded-full font-serif text-[15px] font-semibold transition-colors duration-300 [grid-area:num] sm:size-9 ${
          active ? "bg-brand text-white" : "bg-sage/30 text-brand"
        }`}
      >
        {number}
      </span>

      <h3 className="self-end font-serif text-[17px] font-semibold leading-snug text-brand [grid-area:name] sm:text-[19px]">
        <span className="sr-only">Bônus {number}: </span>
        {bonus.name}
      </h3>
      <p
        className="mt-2.5 text-[14.5px] leading-normal text-brand/85 [grid-area:desc] sm:mt-1 sm:self-start sm:text-[15px]"
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

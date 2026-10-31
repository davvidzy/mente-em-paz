import { BadgeCheck, BedDouble, Clock, Feather, Infinity as InfinityIcon, ShieldCheck, type LucideIcon } from "lucide-react";
import { landing } from "../../../config/landing";
import { guarantee, media } from "../../../config/site";
import { fill } from "../../../lib/format";
import { routes } from "../../../lib/routes";
import { ButtonLink } from "../../ui/Button";
import { Emphasis } from "../../ui/Emphasis";
import { jumpTo } from "../shared";

const benefitIcons: Record<(typeof landing.hero.benefits)[number]["icon"], LucideIcon> = {
  guarantee: ShieldCheck,
  lying: BedDouble,
  easy: Feather,
  lifetime: InfinityIcon,
  once: BadgeCheck,
  duration: Clock,
};

export function Hero() {
  const h = landing.hero;
  const m = media.mockup;
  const benefits = h.benefits.filter((b) => b.enabled);

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-canvas" data-hero>
      <HeroArt />
      {/* topo um pouco menor que o antigo (respiro + eyebrow); o espaço vai para entre título e descrição */}
      <div className="container-page pb-[clamp(72px,9vw,128px)] pt-[84px] sm:pt-[clamp(88px,9vw,132px)]">
        <div className="anim-enter mx-auto max-w-[680px] text-center">
          <h1 id="hero-title" className="t-h1 t-hero hero-title mx-auto max-w-[15ch] md:max-w-[17ch]">
            <Emphasis text={h.title} markClass="hero-accent" />
          </h1>

          {/* descrição discreta: sans menor, entrelinha aberta, coluna estreita */}
          <p className="mx-auto mt-9 max-w-[32ch] text-[16px] leading-[1.7] text-sage-ink md:mt-11 md:max-w-[42ch] md:text-[17px]">
            <Emphasis text={h.body} markClass="font-semibold text-brand" />
          </p>

          {/* Mockup do portal (celular, tablet e computador) entre a descrição e o CTA */}
          <img
            src={routes.asset(`${m.image}-800.webp`)}
            srcSet={[400, 800, 1200].map((w) => `${routes.asset(`${m.image}-${w}.webp`)} ${w}w`).join(", ")}
            sizes="(min-width: 768px) 680px, calc(100vw - 32px)"
            width={1536}
            height={1024}
            alt={m.alt}
            decoding="async"
            className="mx-auto mt-8 aspect-[3/2] w-full md:mt-10"
            data-hero-mockup
          />

          <div className="mx-auto mt-8 w-full max-w-[400px] md:mt-10">
            <ButtonLink href="#planos" size="lg" arrow full onClick={jumpTo("planos")}>
              {h.cta}
            </ButtonLink>
          </div>

          {benefits.length > 0 && (
            <ul
              className="mx-auto mt-9 grid max-w-[460px] grid-cols-2 gap-x-4 gap-y-5 sm:max-w-[600px] sm:grid-cols-4 sm:gap-3"
              aria-label="Benefícios"
            >
              {benefits.map((b) => {
                const Icon = benefitIcons[b.icon];
                return (
                  <li
                    key={b.icon}
                    className="flex items-center gap-2.5 text-left text-[13.5px] font-medium leading-tight text-brand sm:flex-col sm:gap-1.5 sm:px-1 sm:text-center sm:text-[14px] sm:[text-wrap:balance]"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sage/30">
                      <Icon aria-hidden className="size-[18px]" strokeWidth={1.7} />
                    </span>
                    {fill(b.label, { dias: guarantee.days })}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/** Arte do hero: lua em linha fina — leve, sem imagens pesadas. */
function HeroArt() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <svg
        className="absolute left-1/2 top-[-140px] h-[600px] w-[600px] -translate-x-1/2 text-line/70 sm:top-[-180px] sm:h-[860px] sm:w-[860px]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="98" stroke="currentColor" strokeWidth="0.35" />
        <circle cx="100" cy="100" r="78" stroke="currentColor" strokeWidth="0.3" opacity="0.8" />
      </svg>
      <svg className="absolute right-[6%] top-10 hidden h-28 w-28 text-sage md:block" viewBox="0 0 128 128" fill="none">
        <path d="M70.31 10.38A54 54 0 1 0 117.89 67.46A44 44 0 1 1 70.31 10.38Z" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

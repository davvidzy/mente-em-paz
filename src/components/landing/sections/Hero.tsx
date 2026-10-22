import { BadgeCheck, Infinity as InfinityIcon, MonitorSmartphone, Repeat, ShieldCheck, type LucideIcon } from "lucide-react";
import type { ProfileId } from "../../../config/quiz";
import { landing } from "../../../config/landing";
import { guarantee, media } from "../../../config/site";
import { fill } from "../../../lib/format";
import { ButtonLink } from "../../ui/Button";
import { DevPlaceholder } from "../../ui/DevPlaceholder";
import { Emphasis } from "../../ui/Emphasis";
import { VideoPlayer } from "../../ui/VideoPlayer";
import { jumpTo } from "../shared";

const benefitIcons: Record<(typeof landing.hero.benefits)[number]["icon"], LucideIcon> = {
  guarantee: ShieldCheck,
  repeat: Repeat,
  digital: MonitorSmartphone,
  lifetime: InfinityIcon,
  once: BadgeCheck,
};

export function Hero({ profile }: { profile: ProfileId | null }) {
  const h = landing.hero;
  const v = media.video;
  const benefits = h.benefits.filter((b) => b.enabled);

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-canvas" data-hero>
      <HeroArt />
      <div className="container-page pb-[clamp(72px,9vw,128px)] pt-14 sm:pt-[clamp(64px,7vw,104px)]">
        <div className="anim-enter mx-auto max-w-[680px] text-center">
          {/* Cabe em uma linha no mobile; com zoom ou fonte grande quebra em vez de cortar o texto */}
          <p className="t-eyebrow text-balance text-[12px] tracking-[0.08em] sm:text-[13px] sm:tracking-[0.12em]" data-eyebrow>
            {profile ? landing.heroWelcome[profile] : h.eyebrow}
          </p>

          <h1 id="hero-title" className="t-h1 t-hero mx-auto mt-6 max-w-[17ch] md:mt-7 md:max-w-[20ch]">
            <Emphasis text={h.title} markClass="hero-accent" />
          </h1>

          <p className="t-muted mx-auto mt-7 max-w-[34ch] text-[17px] leading-relaxed md:mt-8 md:max-w-[44ch] md:text-lg">
            <Emphasis text={h.body} markClass="font-semibold text-brand" />
          </p>

          <div className="mx-auto mt-10 w-full max-w-[400px] md:mt-12">
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

          {/* Vídeo de apresentação logo abaixo dos benefícios */}
          {v.sources.length > 0 ? (
            <div className="mt-14 md:mt-16" id="video">
              <VideoPlayer
                sources={v.sources}
                poster={v.poster}
                aspect={v.aspect}
                preventSeekForward={v.preventSeekForward}
                captionsSrc={v.captionsSrc}
                label="Vídeo de apresentação do Mente em Paz"
              />
            </div>
          ) : (
            <div className={`mx-auto mt-14 md:mt-16 ${v.aspect === "9/16" ? "max-w-[360px]" : ""}`}>
              <DevPlaceholder
                title="Vídeo de apresentação (hero)"
                hint="Adicione os arquivos em public/video/ e preencha media.video em src/config/site.ts. Em produção o espaço fica oculto até lá."
                className={v.aspect === "9/16" ? "aspect-[9/16]" : "aspect-video"}
              />
            </div>
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

import { useState } from "react";
import { ImageIcon, Pause, Play, UserRound } from "lucide-react";
import { landing } from "../../../config/landing";
import { publishedTestimonials, type Testimonial } from "../../../config/site";
import { fill } from "../../../lib/format";
import { routes } from "../../../lib/routes";
import { Reveal, Section, SectionHead, type Tone } from "../shared";

const DEV = import.meta.env.DEV;

/** Placeholders SOMENTE em desenvolvimento — nunca vão para produção. */
const DEV_PLACEHOLDERS: (Testimonial & { placeholder: true })[] = [7, 15, 30, 45].map((d, i) => ({
  name: `Nome da cliente ${i + 1}`,
  consent: true,
  daysAsClient: d,
  placeholder: true,
}));

/**
 * Depoimentos em carrossel infinito lateral (marquee).
 * Pausa ao passar o mouse/focar ou ao tocar um vídeo; com movimento reduzido vira rolagem manual.
 * Lista vazia → seção oculta em produção (LandingApp).
 */
export function Testimonials({ tone }: { tone: Tone }) {
  const c = landing.testimonials;
  const [paused, setPaused] = useState(false);
  const items: (Testimonial & { placeholder?: true })[] = publishedTestimonials.length ? publishedTestimonials : DEV ? DEV_PLACEHOLDERS : [];
  if (!items.length) return null;

  const duration = Math.max(24, items.length * 8);

  return (
    <Section id="depoimentos" tone={tone} labelledBy="depo-title" className="overflow-hidden">
      <div className="container-page">
        <SectionHead id="depo-title" title={c.title} text={c.text} center />
        {/* Movimento automático precisa poder ser pausado (WCAG 2.2.2) — no celular não há hover */}
        <div className="mp-marquee-control mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-[15px] font-medium text-brand hover:border-brand"
          >
            {paused ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
            {paused ? "Continuar movimento" : "Pausar movimento"}
          </button>
        </div>
      </div>

      <Reveal className="mp-marquee mt-6 md:mt-8">
        <ul className="mp-marquee-track" data-paused={paused || undefined} style={{ ["--marquee-duration" as string]: `${duration}s` }} aria-label="Depoimentos de clientes">
          {[0, 1].map((copy) =>
            items.map((t, i) => (
              <li key={`${copy}-${i}`} aria-hidden={copy === 1 || undefined} className="mp-marquee-item">
                <TestimonialCard t={t} hidden={copy === 1} onPlay={() => setPaused(true)} />
              </li>
            )),
          )}
        </ul>
      </Reveal>
    </Section>
  );
}

function TestimonialCard({ t, hidden, onPlay }: { t: Testimonial & { placeholder?: true }; hidden: boolean; onPlay: () => void }) {
  return (
    <figure className="card flex w-[264px] flex-col overflow-hidden sm:w-[288px]" data-testimonial={t.placeholder ? "placeholder" : "real"}>
      <figcaption className="flex items-center gap-3 px-4 py-3.5">
        {t.avatar ? (
          <img src={routes.asset(t.avatar)} alt="" width={44} height={44} loading="lazy" className="size-11 shrink-0 rounded-full object-cover" />
        ) : (
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sage/30 text-sage-deep">
            <UserRound aria-hidden className="size-5" strokeWidth={1.6} />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-brand">{t.name}</p>
          {t.daysAsClient !== undefined && (
            <p className="text-[13px] text-sage-deep">{fill(landing.testimonials.since, { dias: t.daysAsClient })}</p>
          )}
        </div>
      </figcaption>

      {t.placeholder ? (
        <div className="mx-3 mb-3 flex aspect-[3/4] flex-col gap-2 rounded-xl border-2 border-dashed border-sage-deep/35 bg-[#ECE5DA] p-3">
          <span className="w-[72%] rounded-lg rounded-tl-none bg-white/80 px-3 py-2"><span className="block h-2 rounded bg-line" /><span className="mt-1.5 block h-2 w-2/3 rounded bg-line" /></span>
          <span className="ml-auto w-[64%] rounded-lg rounded-tr-none bg-[#D9F2CF]/80 px-3 py-2"><span className="block h-2 rounded bg-sage/50" /></span>
          <span className="w-[80%] rounded-lg rounded-tl-none bg-white/80 px-3 py-2"><span className="block h-2 rounded bg-line" /><span className="mt-1.5 block h-2 rounded bg-line" /><span className="mt-1.5 block h-2 w-1/2 rounded bg-line" /></span>
          <span className="mt-auto flex flex-col items-center gap-1 pb-2 text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-sage-deep">
            <ImageIcon aria-hidden className="size-5" strokeWidth={1.6} />
            Placeholder · print do WhatsApp
          </span>
        </div>
      ) : (
        <>
          {t.video && (
            // a cópia duplicada do carrossel (hidden) não recebe foco nem toca
            <video
              src={routes.asset(t.video)}
              poster={t.videoPoster ? routes.asset(t.videoPoster) : undefined}
              controls={!hidden}
              tabIndex={hidden ? -1 : undefined}
              preload="none"
              playsInline
              onPlay={onPlay}
              aria-label={`Vídeo de depoimento de ${t.name}`}
              className="mx-3 mb-3 aspect-[9/16] w-[calc(100%-1.5rem)] rounded-xl border border-line bg-brand-deep object-cover"
            />
          )}
          {t.text && (
            <blockquote className="px-4 pb-4 text-[15px] leading-relaxed text-brand">
              <p>“{t.text}”</p>
            </blockquote>
          )}
          {t.print && (
            <img
              src={routes.asset(t.print)}
              alt={hidden ? "" : (t.printAlt ?? "")}
              loading="lazy"
              className="mx-3 mb-3 w-[calc(100%-1.5rem)] rounded-xl border border-line"
            />
          )}
        </>
      )}
    </figure>
  );
}

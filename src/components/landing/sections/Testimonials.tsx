import { ImageIcon } from "lucide-react";
import { landing } from "../../../config/landing";
import { publishedTestimonials, testimonials, type Testimonial } from "../../../config/site";
import { routes } from "../../../lib/routes";
import { Section, SectionHead, type Tone } from "../shared";

/**
 * Depoimentos: título, descrição e um carrossel infinito só de imagens, sem interação.
 * A lista é renderizada duas vezes (a cópia fica oculta para leitores de tela) para o
 * loop em -50% não ter emenda. Com movimento reduzido no aparelho, vira uma fileira parada.
 * Sem imagens: espaços reservados vazios (testimonials.showPlaceholders) ou seção oculta.
 */
export function Testimonials({ tone }: { tone: Tone }) {
  const c = landing.testimonials;
  const items: (Testimonial | null)[] = publishedTestimonials.length
    ? publishedTestimonials
    : testimonials.showPlaceholders
      ? Array.from({ length: testimonials.placeholderCount }, () => null)
      : [];
  if (!items.length) return null;

  return (
    <Section id="depoimentos" tone={tone} labelledBy="depo-title" className="overflow-hidden">
      <div className="container-page">
        <SectionHead id="depo-title" title={c.title} text={c.text} center />
      </div>

      <div className="mp-marquee mt-8 md:mt-10">
        <ul className="mp-marquee-track" style={{ ["--marquee-duration" as string]: `${Math.max(30, items.length * 7)}s` }} aria-label="Depoimentos de clientes">
          {[0, 1].map((copy) =>
            items.map((t, i) => (
              <li key={`${copy}-${i}`} aria-hidden={copy === 1 || undefined} className="mp-marquee-item">
                {t ? (
                  <img
                    src={routes.asset(`${t.image}-400.webp`)}
                    srcSet={`${routes.asset(`${t.image}-400.webp`)} 400w, ${routes.asset(`${t.image}-800.webp`)} 800w`}
                    sizes="260px"
                    alt={copy === 1 ? "" : t.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-[400px] w-auto max-w-none rounded-[18px] border border-line bg-white md:h-[440px]"
                    data-testimonial="real"
                  />
                ) : (
                  <div
                    className="grid h-[400px] w-[225px] place-items-center rounded-[18px] border-2 border-dashed border-sage bg-white/60 text-sage md:h-[440px] md:w-[248px]"
                    data-testimonial="placeholder"
                  >
                    <ImageIcon aria-hidden className="size-8" strokeWidth={1.4} />
                  </div>
                )}
              </li>
            )),
          )}
        </ul>
      </div>
    </Section>
  );
}

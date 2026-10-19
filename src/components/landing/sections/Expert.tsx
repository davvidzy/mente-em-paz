import { UserRound } from "lucide-react";
import { expert } from "../../../config/site";
import { routes } from "../../../lib/routes";
import { Reveal, Section, type Tone } from "../shared";

/**
 * Quem está por trás do Mente em Paz — só o essencial para gerar confiança:
 * foto, nome, profissão (+ registro) e uma frase.
 * Mobile: foto compacta ao lado do nome; frase abaixo. Desktop: foto grande à esquerda.
 * Visível em produção somente com `expert.verified === true` (ver LandingApp).
 */
export function Expert({ tone }: { tone: Tone }) {
  const showPhoto = Boolean(expert.photo) || import.meta.env.DEV;

  return (
    <Section id="especialista" tone={tone} labelledBy="expert-title">
      <div className="container-page">
        <Reveal
          className={`mx-auto grid max-w-[880px] items-center gap-x-5 gap-y-6 md:gap-x-14 ${
            showPhoto
              ? "grid-cols-[104px_minmax(0,1fr)] [grid-template-areas:'photo_head'_'bio_bio'] md:grid-cols-[300px_minmax(0,1fr)] md:[grid-template-areas:'photo_head'_'photo_bio']"
              : "grid-cols-1 text-center [grid-template-areas:'head'_'bio']"
          }`}
        >
          {showPhoto && (
            <div className="relative [grid-area:photo] md:self-center">
              {expert.photo ? (
                <img
                  src={routes.asset(expert.photo)}
                  alt={`Foto de ${expert.name}`}
                  width={600}
                  height={750}
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-[18px] object-cover md:rounded-[24px]"
                />
              ) : (
                <div
                  data-dev-placeholder
                  className="grid aspect-[4/5] w-full place-items-center rounded-[18px] border-2 border-dashed border-sage-deep/40 bg-sage/15 text-sage-deep md:rounded-[24px]"
                >
                  <UserRound aria-hidden className="size-8 md:size-12" strokeWidth={1.4} />
                </div>
              )}
              {!expert.verified && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white md:text-[11px]">
                  Provisório
                </span>
              )}
            </div>
          )}

          <div className="[grid-area:head] md:self-end">
            <h2 id="expert-title" className="t-h2">
              {expert.name}
            </h2>
            <p className="mt-1.5 text-[15px] font-medium leading-snug text-sage-deep md:text-[16px]">{expert.role}</p>
            {expert.credential && <p className="mt-0.5 text-[14px] text-sage-deep">{expert.credential}</p>}
          </div>

          <p className="text-[17px] leading-relaxed [grid-area:bio] md:self-start md:text-lg">{expert.bio}</p>
        </Reveal>
      </div>
    </Section>
  );
}

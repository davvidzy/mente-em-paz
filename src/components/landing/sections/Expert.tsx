import { UserRound } from "lucide-react";
import { expert, expertPublished } from "../../../config/site";
import { routes } from "../../../lib/routes";
import { Reveal, Section, type Tone } from "../shared";

/**
 * Quem apresenta o Mente em Paz: foto, nome e uma apresentação curta e transparente
 * (persona virtual + equipe real por trás). Sem profissão, registro ou formação.
 * Mobile: foto compacta ao lado do nome; texto abaixo. Desktop: foto grande à esquerda.
 * Visível em produção somente com `expertPublished` (ver LandingApp e site.ts).
 */
export function Expert({ tone }: { tone: Tone }) {
  return (
    <Section id="especialista" tone={tone} labelledBy="expert-title">
      <div className="container-page">
        <Reveal className="mx-auto grid max-w-[880px] grid-cols-[112px_minmax(0,1fr)] items-center gap-x-5 gap-y-7 [grid-template-areas:'photo_head'_'body_body'] md:grid-cols-[300px_minmax(0,1fr)] md:gap-x-14 md:[grid-template-areas:'photo_head'_'photo_body']">
          <div className="relative [grid-area:photo] md:self-center">
            {expert.photo ? (
              <img
                src={routes.asset(`${expert.photo}-400.webp`)}
                srcSet={`${routes.asset(`${expert.photo}-400.webp`)} 400w, ${routes.asset(`${expert.photo}-800.webp`)} 800w`}
                sizes="(min-width: 768px) 300px, 112px"
                alt={`Foto de ${expert.name}`}
                width={400}
                height={500}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full rounded-[18px] object-cover md:rounded-[24px]"
              />
            ) : (
              // espaço reservado até a foto chegar (sem texto: nada a ler aqui)
              <div
                data-expert-photo-placeholder
                className="grid aspect-[4/5] w-full place-items-center rounded-[18px] border border-line bg-sage/20 text-sage-deep md:rounded-[24px]"
              >
                <UserRound aria-hidden className="size-9 md:size-14" strokeWidth={1.3} />
              </div>
            )}
            {!expertPublished && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white md:text-[11px]">
                Prévia · não publicada
              </span>
            )}
          </div>

          <div className="[grid-area:head] md:self-end">
            <p className="t-eyebrow text-[12px] tracking-[0.08em] md:text-[13px]">{expert.eyebrow}</p>
            <h2 id="expert-title" className="t-h2 mt-2">
              {expert.name}
            </h2>
          </div>

          <div className="space-y-3.5 text-[16px] leading-relaxed text-brand [grid-area:body] md:self-start md:text-[17px]">
            {expert.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="text-[14px] leading-snug text-sage-ink md:text-[15px]" data-expert-disclosure>
              {expert.disclosure}
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

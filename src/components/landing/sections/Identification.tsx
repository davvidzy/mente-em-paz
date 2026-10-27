import { landing } from "../../../config/landing";
import { profiles, type ProfileId } from "../../../config/quiz";
import { Reveal, Section, type Tone } from "../shared";

/** Quem vem do quiz vê o título do próprio resultado; os demais, o título padrão. */
export function Identification({ tone, profile }: { tone: Tone; profile: ProfileId | null }) {
  const c = landing.identification;
  return (
    <Section id="identificacao" tone={tone} labelledBy="ident-title">
      <div className="container-page">
        <div className="mx-auto max-w-[760px]">
          <Reveal>
            <h2 id="ident-title" className="t-h2 max-w-[20ch]">
              {profile ? profiles[profile].title : c.title}
            </h2>
          </Reveal>

          <ul className="mt-8 space-y-3">
            {c.thoughts.map((t, i) => (
              <Reveal
                as="li"
                key={t}
                className={`flex items-center gap-4 rounded-(--radius-card) border border-line bg-white/75 px-5 py-4 md:px-6 md:py-5 ${i === 1 ? "md:ml-10" : i === 2 ? "md:ml-20" : ""}`}
              >
                <span aria-hidden className="font-serif text-[34px] leading-none text-accent">
                  “
                </span>
                <span className="font-serif text-[18px] italic leading-snug md:text-[20px]">{t}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal>
            <p className="mt-8 text-[17px] font-medium leading-relaxed md:text-lg">{c.after}</p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

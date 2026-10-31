import { landing } from "../../../config/landing";
import { media } from "../../../config/site";
import { routes } from "../../../lib/routes";
import { AudioPlayer } from "../../ui/AudioPlayer";
import { DevPlaceholder } from "../../ui/DevPlaceholder";
import { Reveal, Section, type Tone } from "../shared";

export function AudioDemo({ tone }: { tone: Tone }) {
  const c = landing.audioDemo;
  const audio = media.audioPreview;
  return (
    <Section id="demonstracao" tone={tone} labelledBy="demo-title">
      <div className="container-page">
        <Reveal className="mx-auto max-w-[560px] text-center">
          <h2 id="demo-title" className="t-h2 mx-auto max-w-[22ch]">
            {c.title}
          </h2>
          <p className="t-muted mx-auto mt-5 max-w-[46ch] text-[16.5px] leading-relaxed md:text-[17px]">{c.text}</p>
          <div className="mt-8 text-left">
            {audio.src ? (
              <AudioPlayer src={routes.asset(audio.src)} title={audio.title} />
            ) : (
              <DevPlaceholder
                title="Trecho de áudio não configurado"
                hint="Coloque o arquivo em public/audio/ e preencha media.audioPreview.src em src/config/site.ts. Em produção esta seção fica oculta até lá."
                className="min-h-[160px]"
              />
            )}
          </div>
          {audio.src && <p className="mt-3.5 text-[14px] text-sage-ink">{c.caption}</p>}
        </Reveal>
      </div>
    </Section>
  );
}

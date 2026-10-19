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
          <h2 id="demo-title" className="t-h2 mx-auto max-w-[18ch]">
            {c.title}
          </h2>
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
        </Reveal>
      </div>
    </Section>
  );
}

import { landing } from "../../../config/landing";
import { media } from "../../../config/site";
import { routes } from "../../../lib/routes";
import { Reveal, Section, type Tone } from "../shared";

/** Vídeo do portal (sem áudio). Controles nativos: tempo, velocidade e tela cheia. */
export function Video({ tone }: { tone: Tone }) {
  const v = media.video;
  return (
    <Section id="video" tone={tone} labelledBy="video-title">
      <div className="container-page">
        <Reveal className="mx-auto max-w-[560px] text-center">
          <h2 id="video-title" className="t-h2 mx-auto max-w-[20ch]">
            {landing.video.title}
          </h2>
          <video
            src={routes.asset(v.src)}
            poster={routes.asset(v.poster)}
            width={720}
            height={1280}
            controls
            playsInline
            muted
            preload="metadata"
            controlsList="nodownload"
            aria-label={v.label}
            className="mx-auto mt-7 aspect-[9/16] w-full max-w-[340px] rounded-[22px] border border-line bg-brand shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)] md:mt-9"
            data-hero-video
          />
        </Reveal>
      </div>
    </Section>
  );
}

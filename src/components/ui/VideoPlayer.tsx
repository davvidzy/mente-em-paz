import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import type { VideoSource } from "../../config/site";
import { track, trackOnce } from "../../lib/analytics";
import { routes } from "../../lib/routes";

function time(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

interface Props {
  sources: VideoSource[];
  poster?: string;
  aspect: "9/16" | "16/9";
  preventSeekForward: boolean;
  captionsSrc?: string;
  label: string;
}

/**
 * Player de VSL: começa pausado com capa; toque alterna play/pausa;
 * barra apenas de leitura; bloqueia avanço além do ponto já assistido,
 * menu de contexto, PiP e download; replay no fim.
 */
export function VideoPlayer({ sources, poster, aspect, preventSeekForward, captionsSrc, label }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const maxWatched = useRef(0);
  const milestones = useRef(new Set<number>());
  const [state, setState] = useState<"idle" | "playing" | "paused" | "ended">("idle");
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const onTime = () => {
      if (preventSeekForward && v.currentTime > maxWatched.current + 1.25 && !v.seeking) return;
      maxWatched.current = Math.max(maxWatched.current, v.currentTime);
      setCurrent(v.currentTime);
      if (v.duration) {
        const pct = (v.currentTime / v.duration) * 100;
        for (const m of [25, 50, 75]) {
          if (pct >= m && !milestones.current.has(m)) {
            milestones.current.add(m);
            track("video_progress", { percent: m });
          }
        }
      }
    };
    const onSeeking = () => {
      if (preventSeekForward && v.currentTime > maxWatched.current + 0.5) {
        v.currentTime = maxWatched.current;
      }
    };
    const onMeta = () => setDuration(v.duration);
    const onPlay = () => {
      setState("playing");
      trackOnce("video_started");
    };
    const onPause = () => setState((s) => (s === "ended" ? s : "paused"));
    const onEnded = () => {
      setState("ended");
      trackOnce("video_completed");
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("seeking", onSeeking);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("durationchange", onMeta);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("seeking", onSeeking);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("durationchange", onMeta);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
    };
  }, [preventSeekForward]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (state === "ended") {
      v.currentTime = 0;
      setState("playing");
      void v.play();
    } else if (v.paused) void v.play();
    else v.pause();
  };

  const pct = duration ? Math.min(100, (current / duration) * 100) : 0;
  const vertical = aspect === "9/16";

  return (
    <figure
      className={`relative mx-auto overflow-hidden rounded-[20px] bg-brand-deep shadow-(--shadow-lift) ${vertical ? "w-full max-w-[360px]" : "w-full"}`}
      style={{ aspectRatio: aspect }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        ref={video}
        className="absolute inset-0 size-full object-cover"
        poster={poster ? routes.asset(poster) : undefined}
        playsInline
        preload="none"
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
        aria-label={label}
      >
        {sources.map((s) => (
          <source key={s.src} src={routes.asset(s.src)} type={s.type} />
        ))}
        {captionsSrc && (
          <track kind="captions" src={routes.asset(captionsSrc)} srcLang="pt-BR" label="Português" default />
        )}
      </video>

      {/* Camada de toque: alterna play/pausa */}
      <button
        type="button"
        onClick={toggle}
        aria-label={state === "playing" ? "Pausar vídeo" : state === "ended" ? "Assistir novamente" : "Reproduzir vídeo"}
        className="absolute inset-0 z-10 grid place-items-center"
      >
        {state !== "playing" && (
          <span className="anim-fade grid size-18 place-items-center rounded-full bg-canvas/95 text-brand shadow-(--shadow-lift) transition-transform duration-300 hover:scale-105">
            {state === "ended" ? (
              <RotateCcw aria-hidden className="size-7" strokeWidth={1.8} />
            ) : (
              <Play aria-hidden className="ml-1 size-7" fill="currentColor" strokeWidth={0} />
            )}
          </span>
        )}
      </button>

      {/* Barra somente leitura + tempos */}
      {state !== "idle" && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-black/55 to-transparent px-4 pb-3 pt-10">
          <div className="flex justify-between text-[12px] font-medium tabular-nums text-white/90">
            <span>{time(current)}</span>
            <span>-{time(Math.max(0, duration - current))}</span>
          </div>
          <div
            className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/25"
            role="progressbar"
            aria-label="Progresso do vídeo"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pct)}
          >
            <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}
    </figure>
  );
}

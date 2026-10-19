import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { trackOnce } from "../../lib/analytics";

function time(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

/** Player de áudio próprio: play/pausa, progresso navegável, tempo e duração. */
export function AudioPlayer({ src, title }: { src: string; title: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    const onTime = () => setCurrent(a.currentTime);
    const onMeta = () => setDuration(a.duration);
    const onPlay = () => {
      setPlaying(true);
      trackOnce("audio_preview_started");
    };
    const onPause = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("durationchange", onMeta);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onPause);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("durationchange", onMeta);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onPause);
    };
  }, []);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) void a.play();
    else a.pause();
  };

  const pct = duration ? (current / duration) * 100 : 0;

  return (
    <div className="card flex items-center gap-4 p-4 sm:gap-5 sm:p-5">
      <audio ref={audio} src={src} preload="metadata" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pausar áudio" : "Reproduzir áudio"}
        className="relative grid size-14 shrink-0 place-items-center rounded-full bg-brand text-white transition-colors hover:bg-brand-deep"
      >
        {playing ? (
          <Pause aria-hidden className="size-5" fill="currentColor" strokeWidth={0} />
        ) : (
          <Play aria-hidden className="ml-0.5 size-5" fill="currentColor" strokeWidth={0} />
        )}
        {playing && (
          <span aria-hidden className="anim-breathe absolute -inset-1.5 rounded-full border border-sage" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium text-brand">{title}</p>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={current}
          aria-label="Progresso do áudio"
          aria-valuetext={`${time(current)} de ${time(duration)}`}
          onChange={(e) => {
            if (audio.current) audio.current.currentTime = Number(e.target.value);
          }}
          className="mp-range mt-2 w-full"
          style={{ ["--pct" as string]: `${pct}%` }}
        />
        <div className="mt-1 flex justify-between text-[13px] tabular-nums text-sage-deep">
          <span>{time(current)}</span>
          <span>{time(duration)}</span>
        </div>
      </div>
    </div>
  );
}

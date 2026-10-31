import { useEffect, useState } from "react";

/** Segundos restantes até `endsAt` (ms), atualizado a cada segundo. null = sem prazo. */
export function useCountdown(endsAt: number | null) {
  const left = () => (endsAt === null ? null : Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)));
  const [seconds, setSeconds] = useState(left);

  useEffect(() => {
    setSeconds(left());
    if (endsAt === null) return;
    const id = window.setInterval(() => {
      const s = left();
      setSeconds(s);
      if (s === 0) window.clearInterval(id);
    }, 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endsAt]);

  return seconds;
}

/** 300 → "05:00". */
export const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Gift } from "lucide-react";
import { landing } from "../../config/landing";
import { coupon } from "../../config/site";
import { track } from "../../lib/analytics";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { scrollToId } from "./shared";

const SPIN_MS = 4200;

/**
 * Roleta de cupom, suspensa no centro da tela (LandingApp controla quando abre).
 * Para sempre na casa `coupon.winningSlice` (5%: único cupom aceito pelo checkout).
 * Com `won`, abre direto no resultado (botão flutuante que reabre o cupom).
 */
export function CouponWheel({ open, won, onClose, onWin }: { open: boolean; won: boolean; onClose: () => void; onWin: () => void }) {
  const c = landing.couponWheel;
  const [rotation, setRotation] = useState(0);
  const [phase, setPhase] = useState<"idle" | "spinning" | "won">("idle");
  const timer = useRef<number>(undefined);
  const showWon = won || phase === "won";

  useEffect(() => {
    if (open && !won) track("coupon_wheel_opened");
  }, [open, won]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const spin = () => {
    if (phase !== "idle") return;
    const step = 360 / coupon.slices.length;
    // 6 voltas + para dentro da casa vencedora, sob o ponteiro (no topo), num ponto variado dela
    const jitter = (Math.random() - 0.5) * (step - 12);
    setRotation(360 * 6 + (360 - (coupon.winningSlice * step + step / 2)) + jitter);
    setPhase("spinning");
    track("coupon_wheel_spun");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = window.setTimeout(() => {
      setPhase("won");
      onWin();
    }, reduce ? 0 : SPIN_MS + 200);
  };

  const useCoupon = () => {
    track("coupon_cta_clicked");
    onClose();
    window.setTimeout(() => scrollToId("planos"), 0);
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="coupon-title" center>
      <div className="px-6 pb-7 pt-8 text-center sm:px-9 sm:pb-9 sm:pt-10 [@media(max-height:680px)]:pb-5 [@media(max-height:680px)]:pt-6" data-coupon-wheel>
        {!showWon ? (
          <>
            <p className="inline-flex rounded-full border border-sage px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-sage-ink">
              {c.badge}
            </p>
            <h2 id="coupon-title" className="t-h3 mt-4 text-[24px] leading-tight sm:text-[27px]">
              {c.title} <span className="font-serif italic text-sage-deep">{c.titleAccent}</span>
            </h2>
            <p className="mt-2 text-[15px] text-sage-ink">{c.text}</p>

            <Wheel rotation={rotation} />

            <Button size="lg" full onClick={spin} disabled={phase === "spinning"} data-autofocus>
              {phase === "spinning" ? c.spinning : c.spin}
            </Button>
          </>
        ) : (
          <div aria-live="polite">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-sage/30 text-brand">
              <Gift aria-hidden className="size-6" strokeWidth={1.7} />
            </span>
            <h2 id="coupon-title" className="t-h3 mt-4 text-[23px] leading-tight sm:text-[26px]">
              {c.wonTitle} <span className="font-serif italic text-sage-deep">{coupon.prize}</span>
            </h2>
            <p className="mt-2 text-[15px] text-sage-ink">{c.wonText}</p>
            <CouponCode className="mt-6" />
            <Button size="lg" full arrow onClick={useCoupon} className="mt-6">
              {c.cta}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

/** Roleta em SVG: casas alternando petróleo e creme (valores em `coupon.slices`). */
function Wheel({ rotation }: { rotation: number }) {
  const n = coupon.slices.length;
  const r = 100;
  const step = (2 * Math.PI) / n;
  const point = (a: number, radius = r) => [r + radius * Math.sin(a), r - radius * Math.cos(a)];

  return (
    // em telas baixas a roleta encolhe para tudo caber sem rolagem
    <div className="relative mx-auto my-6 aspect-square w-full max-w-[min(280px,40dvh)] sm:max-w-[min(300px,42dvh)] [@media(max-height:680px)]:my-4" aria-hidden>
      {/* ponteiro fixo no topo */}
      <svg viewBox="0 0 24 20" className="absolute left-1/2 top-[-6px] z-10 w-7 -translate-x-1/2 drop-shadow-sm">
        <path d="M12 20 L0 0 H24 Z" fill="var(--color-accent)" stroke="var(--color-brand-deep)" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <svg
        viewBox="-4 -4 208 208"
        className="size-full"
        style={{ transform: `rotate(${rotation}deg)`, transition: `transform ${SPIN_MS}ms cubic-bezier(0.15, 0.7, 0.15, 1)` }}
        data-wheel
      >
        {Array.from({ length: n }, (_, i) => {
          const [x1, y1] = point(i * step);
          const [x2, y2] = point((i + 1) * step);
          const dark = i % 2 === 0;
          const mid = (i + 0.5) * step;
          const [tx, ty] = point(mid, r * 0.64);
          return (
            <g key={i}>
              <path d={`M${r} ${r} L${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2} Z`} fill={dark ? "var(--color-brand)" : "var(--color-canvas)"} />
              <text
                x={tx}
                y={ty}
                fill={dark ? "#fff" : "var(--color-brand)"}
                fontSize="16"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${(mid * 180) / Math.PI} ${tx} ${ty})`}
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {coupon.slices[i]}
              </text>
            </g>
          );
        })}
        <circle cx={r} cy={r} r={r} fill="none" stroke="var(--color-brand-deep)" strokeWidth="4" />
        <circle cx={r} cy={r} r="15" fill="#fff" stroke="var(--color-brand-deep)" strokeWidth="3" />
      </svg>
    </div>
  );
}

/** Botão flutuante (só ícone) no canto inferior: reabre o cupom depois de ganho. */
export function CouponButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={landing.couponWheel.reopen}
      title={landing.couponWheel.reopen}
      className="fixed bottom-[max(16px,env(safe-area-inset-bottom))] right-4 z-40 grid size-14 place-items-center rounded-full bg-brand text-white shadow-(--shadow-lift) hover:bg-brand-deep sm:bottom-6 sm:right-6"
      data-coupon-button
    >
      <Gift aria-hidden className="size-6" strokeWidth={1.8} />
    </button>
  );
}

/** Código do cupom com botão de copiar. */
export function CouponCode({ className = "" }: { className?: string }) {
  const c = landing.couponWheel;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
    } catch {
      // sem permissão de área de transferência: seleciona o código para copiar manualmente
      const el = document.querySelector<HTMLElement>("[data-coupon-code]");
      if (el) window.getSelection()?.selectAllChildren(el);
    }
    setCopied(true);
    track("coupon_copied");
    window.setTimeout(() => setCopied(false), 2500);
  };

  return (
    // telas estreitas (< 360px): botão abaixo do código, para o código não quebrar no meio
    <div className={`flex flex-col items-stretch gap-2 rounded-[18px] border-2 border-dashed border-sage bg-white p-2 min-[360px]:flex-row ${className}`}>
      <div className="min-w-0 flex-1 rounded-xl bg-canvas px-4 py-3 text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-sage-ink">{c.codeLabel}</p>
        <p
          className="whitespace-nowrap text-[19px] font-semibold tracking-[0.04em] text-brand select-all sm:text-[22px]"
          data-coupon-code
        >
          {coupon.code}
        </p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-11 min-w-[92px] shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-3 text-[14px] font-semibold text-white hover:bg-brand-deep min-[360px]:flex-col min-[360px]:gap-1"
      >
        {copied ? <Check aria-hidden className="size-4" strokeWidth={2.4} /> : <Copy aria-hidden className="size-4" strokeWidth={2} />}
        <span aria-live="polite">{copied ? c.copied : c.copy}</span>
      </button>
    </div>
  );
}

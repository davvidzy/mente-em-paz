import { useEffect, useState } from "react";
import { getConsent, hasTrackingTools, setConsent } from "../../lib/consent";
import { routes } from "../../lib/routes";

/**
 * Aviso de cookies discreto. Só aparece se houver ferramenta de rastreamento
 * configurada e a visitante ainda não tiver escolhido.
 */
export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hasTrackingTools() && getConsent() === null) {
      const t = window.setTimeout(() => setOpen(true), 900);
      return () => window.clearTimeout(t);
    }
  }, []);

  if (!open) return null;

  const choose = (v: "granted" | "denied") => {
    setConsent(v);
    setOpen(false);
  };

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-40 p-3 sm:p-5"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-(--radius-card) border border-line bg-white/95 p-4 shadow-(--shadow-lift) backdrop-blur sm:flex-row sm:items-center sm:gap-5 sm:p-5">
        <p className="t-small text-brand">
          Usamos cookies para medir o alcance dos nossos anúncios. Suas respostas do quiz não são
          compartilhadas.{" "}
          <a href={routes.privacy()} className="font-medium underline underline-offset-2">
            Saiba mais
          </a>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="min-h-11 flex-1 rounded-(--radius-btn) border border-line px-4 text-[15px] font-medium text-brand hover:border-brand sm:flex-none"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="min-h-11 flex-1 rounded-(--radius-btn) bg-brand px-5 text-[15px] font-semibold text-white hover:bg-brand-deep sm:flex-none"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}

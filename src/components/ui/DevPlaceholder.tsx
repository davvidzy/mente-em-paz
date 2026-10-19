import type { ReactNode } from "react";
import { Construction } from "lucide-react";

/**
 * Placeholder visível SOMENTE em desenvolvimento (npm run dev).
 * Na versão publicada, o chamador oculta o bloco — nunca simula conteúdo real.
 */
export function DevPlaceholder({
  title,
  hint,
  className = "",
  children,
}: {
  title: string;
  hint: string;
  className?: string;
  children?: ReactNode;
}) {
  if (!import.meta.env.DEV) return null;
  return (
    <div
      role="note"
      data-dev-placeholder
      className={`flex flex-col items-center justify-center gap-2 rounded-(--radius-card) border-2 border-dashed border-sage-deep/45 bg-[repeating-linear-gradient(135deg,transparent_0_14px,rgb(165_185_169/0.12)_14px_28px)] p-6 text-center ${className}`}
    >
      <Construction aria-hidden className="size-6 text-sage-deep" strokeWidth={1.6} />
      <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-sage-deep">
        Placeholder de desenvolvimento
      </p>
      <p className="font-medium text-brand">{title}</p>
      <p className="t-small t-muted max-w-sm [overflow-wrap:anywhere]">{hint}</p>
      {children}
    </div>
  );
}

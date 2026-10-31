import { useEffect } from "react";
import { Construction, X } from "lucide-react";

export interface NoticeMessage {
  title: string;
  text: string;
}

/** Aviso flutuante (usado em desenvolvimento para "integração pendente"). */
export function Notice({ message, onClose }: { message: NoticeMessage | null; onClose: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(onClose, 7000);
    return () => window.clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div role="status" className="fixed inset-x-3 top-20 z-[60] mx-auto max-w-md sm:top-24" data-notice>
      <div className="flex gap-3 rounded-(--radius-card) border border-accent bg-white p-4 shadow-(--shadow-lift)">
        <Construction aria-hidden className="mt-0.5 size-5 shrink-0 text-sage-deep" strokeWidth={1.7} />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold">{message.title}</p>
          <p className="t-small t-muted mt-1 break-words">{message.text}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Fechar aviso" className="-m-1 grid size-9 shrink-0 place-items-center rounded-full text-sage-deep hover:bg-surface">
          <X aria-hidden className="size-4" />
        </button>
      </div>
    </div>
  );
}

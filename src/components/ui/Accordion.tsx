import { useId, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";

/** Accordion acessível — uma pergunta aberta por vez. */
export function Accordion({ items }: { items: { q: string; a: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const base = useId();

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btn = `${base}-b${i}`;
        const panel = `${base}-p${i}`;
        return (
          <div key={item.q}>
            <h3 className="font-sans">
              <button
                id={btn}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-medium leading-snug text-brand transition-colors hover:text-brand-deep md:text-lg"
              >
                <span>{item.q}</span>
                <span
                  aria-hidden
                  className={`grid size-8 shrink-0 place-items-center rounded-full border ${isOpen ? "rotate-45 border-brand bg-brand text-white" : "border-line text-brand"}`}
                >
                  <Plus className="size-4" strokeWidth={2} />
                </span>
              </button>
            </h3>
            <div
              id={panel}
              role="region"
              aria-labelledby={btn}
              className={`grid ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              inert={!isOpen}
            >
              <div className="overflow-hidden">
                <p className="t-muted pb-6 pr-12">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

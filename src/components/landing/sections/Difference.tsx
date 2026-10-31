import { HeartHandshake, ListOrdered, MonitorSmartphone, type LucideIcon } from "lucide-react";
import { landing } from "../../../config/landing";
import { Reveal, Section, type Tone } from "../shared";

const icons: Record<(typeof landing.difference.items)[number]["icon"], LucideIcon> = {
  sequence: ListOrdered,
  care: HeartHandshake,
  portal: MonitorSmartphone,
};

/**
 * Por que não ouvir áudios aleatórios: título, texto curto, 3 diferenciais e uma frase final.
 * Compacto de propósito — lista simples com ícones lineares, sem cards grandes.
 */
export function Difference({ tone }: { tone: Tone }) {
  const c = landing.difference;
  return (
    <Section id="diferencial" tone={tone} labelledBy="diferencial-title">
      <div className="container-page">
        <Reveal className="mx-auto max-w-[760px]">
          <h2 id="diferencial-title" className="t-h2 max-w-[24ch]">
            {c.title}
          </h2>
          <p className="t-muted mt-5 max-w-[60ch] text-[16.5px] leading-relaxed md:text-[17px]">{c.text}</p>

          <ul className="mt-8 grid gap-3 md:grid-cols-3 md:gap-4">
            {c.items.map((item) => {
              const Icon = icons[item.icon];
              return (
                <li key={item.text} className="flex items-center gap-3.5 rounded-(--radius-card) border border-line bg-white/75 px-4 py-3.5 md:flex-col md:items-start md:gap-3 md:p-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sage/30 text-brand">
                    <Icon aria-hidden className="size-[18px]" strokeWidth={1.6} />
                  </span>
                  <span className="text-[15.5px] font-medium leading-snug text-brand md:text-[16px]">{item.text}</span>
                </li>
              );
            })}
          </ul>

          <p className="mt-7 font-serif text-[19px] italic leading-snug text-brand md:text-[21px]">{c.closing}</p>
        </Reveal>
      </div>
    </Section>
  );
}

import { ShieldCheck } from "lucide-react";
import { guarantee } from "../../../config/site";
import { fill } from "../../../lib/format";
import { Reveal, Section, type Tone } from "../shared";

export function Guarantee({ tone }: { tone: Tone }) {
  return (
    <Section id="garantia" tone={tone} labelledBy="garantia-title">
      <div className="container-page">
        <Reveal className="mx-auto flex max-w-[760px] flex-col items-center gap-7 text-center md:flex-row md:items-center md:gap-10 md:text-left">
          <div className="relative grid size-24 shrink-0 place-items-center rounded-full border border-line bg-white">
            <ShieldCheck aria-hidden className="size-10 text-brand" strokeWidth={1.3} />
            <span className="absolute -bottom-2 rounded-full bg-brand px-3 py-1 text-[12.5px] font-semibold text-white">
              {guarantee.days} dias
            </span>
          </div>
          <div>
            <h2 id="garantia-title" className="t-h2">
              {guarantee.title}
            </h2>
            <p className="mt-4 text-[17px] md:text-lg">{fill(guarantee.text, { dias: guarantee.days })}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

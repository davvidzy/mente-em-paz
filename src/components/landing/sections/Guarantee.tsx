import { CreditCard, Infinity as InfinityIcon, Mail, MessageCircle, ShieldCheck, type LucideIcon } from "lucide-react";
import { guarantee } from "../../../config/site";
import { whatsappUrl } from "../../../lib/contact";
import { fill } from "../../../lib/format";
import { Reveal, Section, type Tone } from "../shared";

/** Na ordem de `guarantee.notes`: pagamento, entrega, acesso, suporte. */
const noteIcons: LucideIcon[] = [CreditCard, Mail, InfinityIcon, MessageCircle];

export function Guarantee({ tone }: { tone: Tone }) {
  const values = { dias: guarantee.days };
  const support = whatsappUrl();
  return (
    <Section id="garantia" tone={tone} labelledBy="garantia-title">
      <div className="container-page">
        <Reveal className="mx-auto flex max-w-[760px] flex-col items-center gap-7 text-center md:flex-row md:items-start md:gap-10 md:text-left">
          <div className="relative grid size-24 shrink-0 place-items-center rounded-full border border-line bg-white">
            <ShieldCheck aria-hidden className="size-10 text-brand" strokeWidth={1.3} />
            <span className="absolute -bottom-2 rounded-full bg-brand px-3 py-1 text-[12.5px] font-semibold text-white">
              {guarantee.days} dias
            </span>
          </div>
          <div>
            <h2 id="garantia-title" className="t-h2">
              {fill(guarantee.title, values)}
            </h2>
            <p className="mt-4 text-[17px] md:text-lg">{fill(guarantee.text, values)}</p>
            <ul className="mt-6 grid gap-2.5 text-left text-[15px] font-medium text-brand sm:grid-cols-2 sm:gap-x-6" data-guarantee-notes>
              {guarantee.notes.map((note, i) => {
                const Icon = noteIcons[i % noteIcons.length];
                const isSupport = i === noteIcons.length - 1 && support;
                return (
                  <li key={note} className="flex items-start gap-2.5 leading-snug">
                    <Icon aria-hidden className="mt-0.5 size-[18px] shrink-0 text-sage-deep" strokeWidth={1.7} />
                    {isSupport ? (
                      <a href={support} target="_blank" rel="noopener noreferrer" className="-mt-0.5 inline-flex min-h-6 items-center underline underline-offset-2 hover:text-brand-deep">
                        {note}
                      </a>
                    ) : (
                      note
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

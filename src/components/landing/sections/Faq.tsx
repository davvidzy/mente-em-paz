import type { ReactNode } from "react";
import { faq } from "../../../config/site";
import { whatsappUrl } from "../../../lib/contact";
import { Accordion } from "../../ui/Accordion";
import { Reveal, Section, type Tone } from "../shared";

/** Troca {whatsapp} pelo link do suporte (ou por "suporte", sem WhatsApp configurado). */
function answer(text: string): ReactNode {
  const [before, after] = text.split("{whatsapp}");
  if (after === undefined) return text;
  const url = whatsappUrl();
  return (
    <>
      {before}
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline underline-offset-2">
          WhatsApp
        </a>
      ) : (
        "suporte"
      )}
      {after}
    </>
  );
}

export function Faq({ tone }: { tone: Tone }) {
  return (
    <Section id="faq" tone={tone} labelledBy="faq-title">
      <div className="container-page grid gap-8 md:grid-cols-[0.8fr_1.4fr] md:gap-16">
        <Reveal>
          <h2 id="faq-title" className="t-h2">
            Perguntas frequentes
          </h2>
        </Reveal>
        <Reveal>
          <Accordion items={faq.map((f) => ({ q: f.q, a: answer(f.a) }))} />
        </Reveal>
      </div>
    </Section>
  );
}

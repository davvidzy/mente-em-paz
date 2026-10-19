import { faq } from "../../../config/site";
import { Accordion } from "../../ui/Accordion";
import { Reveal, Section, type Tone } from "../shared";

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
          <Accordion items={faq} />
        </Reveal>
      </div>
    </Section>
  );
}

import { landing } from "../../../config/landing";
import { ButtonLink } from "../../ui/Button";
import { Logo } from "../../ui/Logo";
import { jumpTo, Reveal, Section } from "../shared";

export function FinalCta() {
  const c = landing.finalCta;
  return (
    <Section id="cta-final" tone="dark" labelledBy="cta-final-title" className="overflow-hidden">
      <svg
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 text-white/[0.06]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="98" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="74" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      <div className="container-page relative">
        <Reveal className="mx-auto max-w-[720px] text-center">
          <Logo variant="symbol" height={56} inverse decorative className="mx-auto size-14" />
          <h2 id="cta-final-title" className="t-h2 mx-auto mt-8 max-w-[22ch] text-white">
            {c.title}
          </h2>
          <div className="mx-auto mt-9 w-full max-w-[400px]">
            <ButtonLink href="#planos" variant="light" size="lg" arrow full onClick={jumpTo("planos")}>
              {c.cta}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

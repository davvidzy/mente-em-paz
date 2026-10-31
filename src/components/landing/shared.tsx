import type { MouseEvent, ReactNode } from "react";

export type Tone = "canvas" | "surface" | "dark";

const tones: Record<Tone, string> = {
  canvas: "bg-canvas text-brand",
  surface: "bg-surface text-brand",
  dark: "bg-brand text-white",
};

/** Seção da landing: ritmo vertical do design system + fundo alternado. */
export function Section({
  id,
  tone = "canvas",
  labelledBy,
  className = "",
  children,
}: {
  id?: string;
  tone?: Tone;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-section={id}
      className={`section relative scroll-mt-16 ${tones[tone]} ${className}`}
    >
      {children}
    </section>
  );
}

/** Bloco de conteúdo (site estático: sem animação de entrada ao rolar). */
export function Reveal({ children, className = "", as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" }) {
  return <Tag className={className}>{children}</Tag>;
}

/** Cabeçalho de seção (título + texto de apoio). */
export function SectionHead({
  id,
  title,
  text,
  center = false,
  light = false,
}: {
  id: string;
  title: ReactNode;
  text?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <Reveal className={`reading ${center ? "mx-auto text-center" : ""}`}>
      <h2 id={id} className="t-h2">
        {title}
      </h2>
      {text && (
        <p className={`mt-5 text-[17px] md:text-lg ${light ? "text-white/80" : "t-muted"} ${center ? "mx-auto max-w-[56ch]" : "max-w-[60ch]"}`}>
          {text}
        </p>
      )}
    </Reveal>
  );
}

/**
 * onClick de um link-âncora (href="#id"): sem JavaScript o navegador pula até a seção;
 * com JavaScript, rola suave e move o foco para o título.
 */
export const jumpTo = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  scrollToId(id);
};

/** Rola suavemente até uma seção (respeita prefers-reduced-motion via CSS). */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  // move o foco para o título da seção sem rolar de novo (leitores de tela)
  const heading = el.querySelector<HTMLElement>("h2");
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    window.setTimeout(() => heading.focus({ preventScroll: true }), reduce ? 0 : 500);
  }
}

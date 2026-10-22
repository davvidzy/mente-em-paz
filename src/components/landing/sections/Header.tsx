import { useEffect, useState } from "react";
import { landing } from "../../../config/landing";
import { routes } from "../../../lib/routes";
import { Logo } from "../../ui/Logo";
import { jumpTo } from "../shared";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled ? "border-b border-line/80 bg-canvas/90 backdrop-blur-md" : "border-b border-transparent bg-canvas"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <a href={routes.landing()} aria-label="Mente em Paz — início" className="-m-1 inline-flex min-h-11 items-center rounded-md p-1">
          <Logo height={28} decorative className="h-7 w-auto" />
        </a>
        <a
          href="#planos"
          onClick={jumpTo("planos")}
          className="inline-flex min-h-11 items-center rounded-(--radius-btn) border border-brand/80 px-4 text-[15px] font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
        >
          {landing.header.cta}
        </a>
      </div>
    </header>
  );
}

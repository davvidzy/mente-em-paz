import type { ReactNode } from "react";
import { Logo } from "../ui/Logo";

/** Moldura das telas do quiz: logo no topo, conteúdo centralizado, fundo sereno. */
export function QuizShell({ children, top }: { children: ReactNode; top?: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden">
      <Backdrop />
      <header className="container-page flex h-[72px] items-center justify-center sm:h-20">
        <Logo height={30} className="h-[30px] w-auto sm:h-8" />
      </header>
      {top}
      <main className="container-page flex flex-1 flex-col pb-12 sm:pb-16">
        <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col">{children}</div>
      </main>
    </div>
  );
}

/** Formas orgânicas muito suaves (linhas finas de lua), sem brilhos ou gradientes chamativos. */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <svg
        className="absolute -right-40 -top-36 h-[520px] w-[520px] text-line sm:-right-24 sm:-top-28 sm:h-[640px] sm:w-[640px]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="96" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="100" cy="100" r="72" stroke="currentColor" strokeWidth="0.5" opacity="0.7" />
      </svg>
      <svg
        className="absolute -bottom-48 -left-44 h-[460px] w-[460px] text-accent/45 sm:-bottom-40 sm:-left-28"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M118 8a92 92 0 1 0 74 110"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

import { ArrowLeft } from "lucide-react";
import { privacy, terms } from "../../config/legal";
import { routes } from "../../lib/routes";
import { Logo } from "../ui/Logo";

export function LegalPage({ page }: { page: "privacy" | "terms" }) {
  const doc = page === "terms" ? terms : privacy;
  return (
    <div className="min-h-dvh">
      <header className="border-b border-line">
        <div className="container-page flex h-16 items-center justify-between">
          <a href={routes.landing()} aria-label="Mente em Paz — página inicial">
            <Logo height={28} decorative className="h-7 w-auto" />
          </a>
          <a href={routes.landing()} className="inline-flex min-h-11 items-center gap-1.5 text-[15px] text-sage-deep hover:text-brand">
            <ArrowLeft aria-hidden className="size-4" /> Voltar
          </a>
        </div>
      </header>
      <main className="container-page section">
        <article className="reading mx-auto">
          <h1 className="t-h1">{doc.title}</h1>
          <p className="t-small t-muted mt-3">Última atualização: {doc.updated}</p>
          {doc.sections.map((s) => (
            <section key={s.h} className="mt-10">
              <h2 className="t-h3">{s.h}</h2>
              {s.p.map((p) => (
                <p key={p} className="mt-3">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </article>
      </main>
    </div>
  );
}

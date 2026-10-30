import { landing } from "../../../config/landing";
import { brand, expert, expertPublished } from "../../../config/site";
import { whatsappUrl } from "../../../lib/contact";
import { routes } from "../../../lib/routes";
import { Logo } from "../../ui/Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-deep text-white/75">
      <div className="container-page py-14 md:py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <Logo height={30} inverse className="h-[30px] w-auto" />
          <nav aria-label="Links legais">
            <ul className="flex flex-wrap gap-x-7 gap-y-2 text-[15px]">
              <li>
                <a className="inline-flex min-h-11 items-center hover:text-white" href={routes.privacy()}>
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a className="inline-flex min-h-11 items-center hover:text-white" href={routes.terms()}>
                  Termos de Uso
                </a>
              </li>
              {whatsappUrl() && (
                <li>
                  <a className="inline-flex min-h-11 items-center hover:text-white" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                    Suporte no WhatsApp
                  </a>
                </li>
              )}
              {brand.contactEmail && (
                <li>
                  <a className="inline-flex min-h-11 items-center hover:text-white" href={`mailto:${brand.contactEmail}`}>
                    Contato
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>
        <p className="mt-10 max-w-[72ch] text-[13.5px] leading-relaxed text-white/60">{landing.footer.disclaimer}</p>
        {expertPublished && <p className="mt-3 text-[12.5px] text-white/50">{expert.disclosure}</p>}
        {/* o ano vem do pré-render; numa virada de ano o navegador corrige sem aviso */}
        <p className="mt-6 border-t border-white/10 pt-6 text-[13px] text-white/50" suppressHydrationWarning>
          © {year} {brand.name}
          {brand.legalEntity && ` · ${brand.legalEntity}`}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

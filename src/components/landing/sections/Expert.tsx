import { UserRound } from "lucide-react";
import { expert, expertPublished } from "../../../config/site";
import { routes } from "../../../lib/routes";

/**
 * Quem apresenta o Mente em Paz, em formato compacto (dentro da demonstração de áudio):
 * foto pequena, nome e uma frase. Persona virtual: sem profissão, registro ou formação
 * (o aviso fica no rodapé). Visível em produção somente com `expertPublished`.
 */
export function Expert() {
  return (
    <>
    <p className="mt-8 text-left text-[13px] font-medium text-sage-deep">Criado por</p>
    <div className="mt-2.5 flex items-center gap-4 text-left" data-expert>
      <div className="relative w-16 shrink-0">
        {expert.photo ? (
          <img
            src={routes.asset(`${expert.photo}-400.webp`)}
            sizes="64px"
            alt={`Foto de ${expert.name}`}
            width={400}
            height={500}
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full rounded-[14px] object-cover"
          />
        ) : (
          <div data-expert-photo-placeholder className="grid aspect-[4/5] w-full place-items-center rounded-[14px] border border-line bg-sage/20 text-sage-deep">
            <UserRound aria-hidden className="size-7" strokeWidth={1.3} />
          </div>
        )}
        {!expertPublished && (
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-1.5 py-0.5 text-[9px] font-semibold uppercase text-white">
            Prévia
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="font-serif text-[18px] font-semibold leading-snug text-brand">{expert.name}</p>
        <p className="mt-0.5 text-[15px] leading-snug text-brand">{expert.about[0]}</p>
      </div>
    </div>
    </>
  );
}

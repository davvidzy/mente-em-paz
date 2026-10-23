import { Check } from "lucide-react";
import { plans, upgrade } from "../../config/site";
import { fill, formatBRL } from "../../lib/format";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { Modal } from "../ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

/** Popup de upgrade. Todos os valores são calculados a partir de `plans` e `upgrade`. */
export function UpgradeModal({ open, onClose, onAccept, onDecline }: Props) {
  const values = {
    diferenca: formatBRL(upgrade.priceCents - plans.essencial.priceCents),
    de: formatBRL(plans.completo.priceCents),
    por: formatBRL(upgrade.priceCents),
  };
  const extras = plans.completo.items.filter((i) => !/^tudo do|^acesso vital/i.test(i));

  return (
    <Modal open={open} onClose={onClose} labelledBy="upgrade-title" describedBy="upgrade-desc">
      <div className="px-6 pb-7 pt-9 sm:px-9 sm:pb-9 sm:pt-11">
        <Logo variant="symbol" height={44} decorative className="size-11" />
        <h2 id="upgrade-title" className="t-h3 mt-5 pr-6 text-[23px] sm:text-[26px]">
          {upgrade.title}
        </h2>
        <p id="upgrade-desc" className="t-muted mt-4 text-[16.5px]">
          {fill(upgrade.description, values)}
        </p>

        <div className="mt-6 rounded-(--radius-card) border border-line bg-white p-5">
          <p className="text-[14px] font-semibold text-sage-deep">{plans.completo.name}</p>
          <ul className="mt-3 space-y-2">
            {extras.map((e) => (
              <li key={e} className="flex items-center gap-2.5 text-[15.5px]">
                <Check aria-hidden className="size-4 text-sage-deep" strokeWidth={2.4} />
                {e}
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-line pt-4 text-[15.5px]">
            De <s className="text-sage-deep">{values.de}</s> por{" "}
            <strong className="font-serif text-[22px] font-semibold">{values.por}</strong>{" "}
            <span className="text-sage-deep">nesta oferta de upgrade.</span>
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-2">
          <Button size="lg" arrow full onClick={onAccept} data-autofocus>
            {fill(upgrade.acceptCta, values)}
          </Button>
          <Button variant="ghost" full onClick={onDecline}>
            {upgrade.declineCta}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

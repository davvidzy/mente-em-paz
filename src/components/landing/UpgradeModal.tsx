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

/**
 * Popup de upgrade. Todos os valores são calculados a partir de `plans` e `upgrade`.
 * No celular ocupa 80% da tela, sem rolagem: título, o que muda, preço e a decisão.
 */
export function UpgradeModal({ open, onClose, onAccept, onDecline }: Props) {
  const values = {
    diferenca: formatBRL(upgrade.priceCents - plans.essencial.priceCents),
    de: formatBRL(plans.completo.priceCents),
    por: formatBRL(upgrade.priceCents),
  };
  const extras = upgrade.extras;

  return (
    <Modal open={open} onClose={onClose} labelledBy="upgrade-title" describedBy="upgrade-price" tall>
      <div className="flex flex-1 flex-col justify-between gap-5 px-6 pb-[max(20px,env(safe-area-inset-bottom))] pt-7 [@media(max-height:680px)]:gap-3 [@media(max-height:680px)]:px-5 [@media(max-height:680px)]:pt-5 sm:px-9 sm:pb-9 sm:pt-10">
        <div>
          {/* em telas baixas o símbolo sai para tudo caber sem rolagem */}
          <Logo variant="symbol" height={40} decorative className="size-10 [@media(max-height:700px)]:hidden" />
          <h2 id="upgrade-title" className="t-h3 mt-4 pr-8 text-[22px] leading-tight sm:text-[26px] [@media(max-height:700px)]:mt-0 [@media(max-height:680px)]:text-[19px]">
            {fill(upgrade.title, values)}
          </h2>
        </div>

        <div className="rounded-(--radius-card) border border-line bg-white px-5 py-4 [@media(max-height:680px)]:px-4 [@media(max-height:680px)]:py-3">
          <p className="text-[13.5px] font-semibold text-sage-deep">{upgrade.extrasLabel}</p>
          <ul className="mt-2.5 space-y-2 [@media(max-height:680px)]:mt-1.5 [@media(max-height:680px)]:space-y-0.5">
            {extras.map((e) => (
              <li key={e} className="flex items-start gap-2.5 text-[15px] leading-snug [@media(max-height:680px)]:text-[14px]">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-sage-deep" strokeWidth={2.4} />
                {e}
              </li>
            ))}
          </ul>
          <p id="upgrade-price" className="mt-3.5 border-t border-line pt-3.5 text-[15px] [@media(max-height:680px)]:mt-2.5 [@media(max-height:680px)]:pt-2.5">
            De <s className="text-sage-deep">{values.de}</s> por{" "}
            <strong className="font-serif text-[24px] font-semibold [@media(max-height:680px)]:text-[21px]">{values.por}</strong>
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <Button size="lg" arrow full onClick={onAccept} data-autofocus className="whitespace-nowrap">
            {fill(upgrade.acceptCta, values)}
          </Button>
          <Button variant="ghost" full onClick={onDecline} className="underline">
            {upgrade.declineCta}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

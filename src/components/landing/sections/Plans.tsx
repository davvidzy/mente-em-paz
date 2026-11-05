import { useState, type MouseEvent } from "react";
import { Check, Gift, Lock, Mail, ShieldCheck } from "lucide-react";
import { landing } from "../../../config/landing";
import { bonuses, checkout, guarantee, payment, plans, upgrade, type Plan } from "../../../config/site";
import { checkoutBaseUrl, goToCheckout, hasCheckoutUrl, type CheckoutKind } from "../../../lib/checkout";
import { fill, formatBRL, priceParts } from "../../../lib/format";
import { read, write } from "../../../lib/storage";
import { Button, ButtonLink } from "../../ui/Button";
import type { NoticeMessage } from "../Notice";
import { Reveal, Section, SectionHead, type Tone } from "../shared";
import { UpgradeModal } from "../UpgradeModal";

const DEV = import.meta.env.DEV;
/** Dev ou modo de visualização: botões ativos mesmo sem link (clique mostra aviso). */
const PREVIEW = DEV || checkout.previewCheckout;
const DECLINED_KEY = "mp_upgrade_declined";

const CONFIG_FIELD: Record<CheckoutKind, string> = {
  essencial: "checkoutEssencialUrl",
  completo: "checkoutCompletoUrl",
  upgrade: "checkoutUpgradeUrl",
};

export function Plans({ tone, onNotice }: { tone: Tone; onNotice: (n: NoticeMessage) => void }) {
  const c = landing.plans;
  const [modalOpen, setModalOpen] = useState(false);

  /** Upgrade só é oferecido se habilitado, com URL real e ainda não recusado nesta visita. */
  const upgradeAvailable = upgrade.enabled && hasCheckoutUrl("upgrade");

  const go = (kind: CheckoutKind) => {
    if (goToCheckout(kind)) return;
    // URL pendente: nunca redireciona. Dev → aviso técnico; visualização publicada → aviso neutro
    onNotice(
      DEV
        ? {
            title: "Integração de checkout pendente",
            text: `Preencha checkout.${CONFIG_FIELD[kind]} em src/config/site.ts para ativar este botão.`,
          }
        : { title: "Checkout em configuração", text: "Em breve você poderá concluir sua compra por aqui." },
    );
  };

  const chooseEssencial = () => {
    const declined = read<boolean>(DECLINED_KEY) === true;
    if ((upgradeAvailable || (PREVIEW && upgrade.enabled)) && !declined) {
      setModalOpen(true);
      return;
    }
    go("essencial");
  };

  const chooseCompleto = () => go("completo");

  const accept = () => {
    setModalOpen(false);
    go("upgrade");
  };

  const decline = () => {
    write(DECLINED_KEY, true);
    setModalOpen(false);
    go("essencial");
  };

  /** Em produção, botão sem URL configurada fica desabilitado (nunca leva a endereço inexistente). */
  const ready = (kind: CheckoutKind) => PREVIEW || hasCheckoutUrl(kind);

  return (
    <Section id="planos" tone={tone} labelledBy="planos-title">
      <div className="container-page">
        <SectionHead id="planos-title" title={c.title} center />

        <div className="mx-auto mt-12 grid max-w-[920px] gap-5 md:mt-14 md:grid-cols-2 md:items-center md:gap-6">
          {/* Completo primeiro: em cima no celular, à esquerda no desktop. Alinhados pelo centro
              (não esticados): o Completo, mais alto, domina; o Essencial não fica com vazio. */}
          <PlanCard plan={plans.completo} href={checkoutBaseUrl("completo")} onChoose={chooseCompleto} enabled={ready("completo")} />
          <PlanCard plan={plans.essencial} href={checkoutBaseUrl("essencial")} onChoose={chooseEssencial} enabled={ready("essencial")} />
        </div>

        <ul className="mx-auto mt-8 flex max-w-[920px] flex-col items-center gap-2.5 text-center text-[14.5px] font-medium text-brand sm:flex-row sm:justify-center sm:gap-8">
          <li className="flex items-center gap-2">
            <Lock aria-hidden className="size-4 shrink-0 text-sage-deep" strokeWidth={1.8} />
            {payment.secureNote}
          </li>
          <li className="flex items-center gap-2">
            <Mail aria-hidden className="size-4 shrink-0 text-sage-deep" strokeWidth={1.8} />
            {payment.accessNote}
          </li>
        </ul>
      </div>

      <UpgradeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAccept={accept}
        onDecline={decline}
      />
    </Section>
  );
}

/** Soma dos valores dos bônus ({bonus} na frase de fechamento do plano). */
const bonusTotal = bonuses.items.reduce((sum, b) => sum + b.valueCents, 0);

function PlanCard({ plan, href, onChoose, enabled }: { plan: Plan; href: string | null; onChoose: () => void; enabled: boolean }) {
  const price = priceParts(plan.priceCents);
  const featured = plan.featured;
  const closing =
    plan.closing && (bonuses.showValues || !plan.closing.includes("{bonus}"))
      ? fill(plan.closing, { bonus: formatBRL(bonusTotal) })
      : null;
  return (
    <Reveal
      className={`relative flex flex-col overflow-hidden rounded-[20px] ${
        featured
          ? "border-2 border-brand bg-white shadow-(--shadow-lift)"
          : "border border-line bg-canvas/70"
      }`}
    >
      {/* faixa no topo do card em destaque (mais peso que uma etiqueta solta) */}
      {plan.tag && (
        <p className="bg-brand px-4 py-2 text-center text-[12.5px] font-semibold uppercase tracking-[0.1em] text-white">
          {plan.tag}
        </p>
      )}
      <div className="flex flex-1 flex-col p-7 sm:p-8 md:p-9">
        <h3 className="t-h3" aria-label={plan.name}>{plan.shortName}</h3>
        <p className="t-muted mt-1.5 text-[16px]">{plan.description}</p>

        {/* preço do Essencial um pouco menor: o do Completo é o maior número da seção */}
        <p className="mt-6 flex items-baseline gap-1 font-serif text-brand">
          {/* Leitores de tela ouvem o valor inteiro, não "R$ / 39 / ,90" em pedaços */}
          <span className="sr-only">{`${price.currency} ${price.int}${price.dec}`}</span>
          <span aria-hidden className={`font-medium ${featured ? "text-[20px]" : "text-[18px]"}`}>{price.currency}</span>
          <span aria-hidden className={`font-semibold leading-none tracking-tight ${featured ? "text-[52px]" : "text-[44px]"}`}>{price.int}</span>
          <span aria-hidden className={`font-semibold ${featured ? "text-[24px]" : "text-[21px]"}`}>{price.dec}</span>
        </p>
        {plan.installmentsNote && <p className="mt-2 text-[15px] font-semibold text-brand">{plan.installmentsNote}</p>}
        {payment.pixDiscountPercent > 0 && (
          <p className="mt-1 text-[14.5px] text-sage-ink">{fill(payment.pixNote, { pix: payment.pixDiscountPercent })}</p>
        )}
        {plan.paymentNote && <p className="mt-1 text-[14px] text-sage-deep">{plan.paymentNote}</p>}

        <div className="mt-6 border-t border-line pt-6" data-plan-items>
          {plan.itemsLead && <p className="mb-3.5 text-[16px] font-semibold text-brand">{plan.itemsLead}</p>}
          <ul className="space-y-3">
            {plan.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[16px] leading-snug">
                <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${featured ? "bg-brand text-white" : "bg-sage/40 text-brand"}`}>
                  <Check aria-hidden className="size-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
            {/* bônus: presente no lugar do check (o mesmo ícone da seção de bônus) */}
            {plan.bonusItems?.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[16px] leading-snug">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/60 text-brand">
                  <Gift aria-hidden className="size-3" strokeWidth={2.4} />
                </span>
                <span>
                  <span className="sr-only">Bônus: </span>
                  {item}
                </span>
              </li>
            ))}
          </ul>
          {closing && (
            <p className={`mt-5 rounded-xl px-4 py-3 text-center text-[15px] font-semibold leading-snug text-brand ${featured ? "bg-sage/20" : "bg-sage/10"}`} data-plan-closing>
              {closing}
            </p>
          )}
        </div>

        <div className="mt-auto pt-8">
          {href ? (
            // link de verdade: funciona antes da hidratação; depois, o clique passa pelo popup e pelo pixel
            <ButtonLink
              href={href}
              variant={featured ? "primary" : "secondary"}
              size="lg"
              arrow
              full
              onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                onChoose();
              }}
              data-plan={plan.id}
              suppressHydrationWarning // o script do pré-render (entries/server.tsx) completa o href com as UTMs
            >
              {plan.cta}
            </ButtonLink>
          ) : (
            <Button variant={featured ? "primary" : "secondary"} size="lg" arrow={enabled} full onClick={onChoose} disabled={!enabled} data-plan={plan.id}>
              {enabled ? plan.cta : landing.plans.pendingCta}
            </Button>
          )}
          <p className="mt-3.5 flex items-center justify-center gap-2 text-[14px] font-medium text-brand" data-guarantee>
            <ShieldCheck aria-hidden className="size-[18px] text-sage-deep" strokeWidth={1.7} />
            Garantia de {guarantee.days} dias
          </p>
        </div>
      </div>
    </Reveal>
  );
}

import { DevPlaceholder } from "../../ui/DevPlaceholder";
import { Section, type Tone } from "../shared";

/**
 * ▓▓ ESPAÇO RESERVADO — SEÇÃO DE BÔNUS ▓▓
 * Substitui a antiga "Pequenos cuidados que fazem a diferença".
 * Aguardando instruções da nova seção de bônus.
 * Visível apenas em desenvolvimento; em produção não renderiza nada.
 */
export function BonusSlot({ tone }: { tone: Tone }) {
  if (!import.meta.env.DEV) return null;
  return (
    <Section id="bonus-slot" tone={tone}>
      <div className="container-page">
        <DevPlaceholder
          title="BONUS-SLOT · Nova seção de bônus"
          hint="Espaço reservado (src/components/landing/sections/BonusSlot.tsx). Aguardando instruções."
          className="min-h-[200px]"
        />
      </div>
    </Section>
  );
}

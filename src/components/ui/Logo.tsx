import horizontal from "../../assets/brand/logo-horizontal.svg";
import horizontalInverse from "../../assets/brand/logo-horizontal-inverse.svg";
import vertical from "../../assets/brand/logo-vertical.svg";
import symbol from "../../assets/brand/logo-symbol.svg";
import symbolInverse from "../../assets/brand/logo-symbol-inverse.svg";

type Variant = "horizontal" | "vertical" | "symbol";

const FILES = {
  horizontal: { src: horizontal, inverse: horizontalInverse, w: 647, h: 128 },
  vertical: { src: vertical, inverse: vertical, w: 224, h: 355 },
  symbol: { src: symbol, inverse: symbolInverse, w: 128, h: 128 },
} as const;

interface Props {
  variant?: Variant;
  /** Altura em px; a largura acompanha a proporção. */
  height: number;
  inverse?: boolean;
  className?: string;
  /** Logo decorativa (quando o nome já está escrito ao lado). */
  decorative?: boolean;
}

export function Logo({ variant = "horizontal", height, inverse, className, decorative }: Props) {
  const f = FILES[variant];
  return (
    <img
      src={inverse ? f.inverse : f.src}
      width={Math.round((f.w / f.h) * height)}
      height={height}
      alt={decorative ? "" : "Mente em Paz"}
      className={className}
      decoding="async"
      draggable={false}
    />
  );
}

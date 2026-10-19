import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "light";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  arrow?: boolean;
  full?: boolean;
  size?: "md" | "lg";
  children: ReactNode;
}

const base =
  "group inline-flex items-center justify-center gap-2.5 text-center font-sans font-semibold leading-snug " +
  "transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-(--ease-calm) " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 disabled:cursor-not-allowed disabled:opacity-55 " +
  "active:scale-[0.985] select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-[0_10px_24px_-14px_rgb(25_47_51/0.7)] hover:bg-brand-deep hover:shadow-[0_14px_30px_-14px_rgb(25_47_51/0.75)] focus-visible:outline-brand",
  secondary:
    "bg-canvas text-brand border border-brand hover:bg-white focus-visible:outline-brand",
  ghost: "text-brand underline-offset-4 hover:underline focus-visible:outline-brand",
  light:
    "bg-canvas text-brand hover:bg-white shadow-[0_10px_24px_-14px_rgb(0_0_0/0.5)] focus-visible:outline-canvas",
};

const sizes = {
  md: "min-h-12 px-6 py-3 text-base rounded-(--radius-btn)",
  lg: "min-h-14 px-5 py-3.5 text-base rounded-[14px] sm:px-9",
};

export function Button({
  variant = "primary",
  arrow,
  full,
  size = "md",
  className = "",
  children,
  type = "button",
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${variant === "ghost" ? "min-h-11 px-2 text-[15px]" : sizes[size]} ${full ? "w-full" : ""} ${className}`}
      {...rest}
    >
      <span className="min-w-0">{children}</span>
      {arrow && (
        <ArrowRight
          aria-hidden
          className="size-[18px] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      )}
    </button>
  );
}

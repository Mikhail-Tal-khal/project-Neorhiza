import { cx } from "@/lib/cx";

/**
 * GlassButton class strings, kept free of tailwind-merge so client
 * components (such as the error boundary) can style a button without
 * shipping the merger. GlassButton itself merges caller overrides with `cn`.
 */

export type Variant = "primary" | "secondary" | "coral" | "ghost";
export type Size = "md" | "lg";

export const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-medium tracking-[0.01em] transition-[background-color,border-color,color,box-shadow] duration-200 ease-out focus-visible:outline-[3px] disabled:pointer-events-none disabled:opacity-60";

export const buttonVariants: Record<Variant, string> = {
  /* Solid brand teal with off-white text (light pill in dark mode).
     Hover shifts lightness only. */
  primary: "bg-primary text-primary-foreground shadow-soft hover:brightness-[1.18] dark:hover:brightness-90",
  /* Transparent with a hairline outline and teal text. */
  secondary:
    "border border-[color:var(--input)] bg-transparent text-heading hover:bg-tint",
  /* Coral is the pulse: dark text on coral, never white. */
  coral: "bg-coral-500 text-teal-950 shadow-soft hover:brightness-105",
  ghost: "text-heading underline-offset-4 hover:bg-tint hover:underline",
};

export const buttonSizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

/** Classes for a button with no overrides (safe without tailwind-merge). */
export function glassButtonClasses(variant: Variant = "primary", size: Size = "md") {
  return cx(buttonBase, buttonVariants[variant], buttonSizes[size]);
}

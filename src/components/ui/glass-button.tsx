import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "coral" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-medium tracking-[0.01em] transition-[background-color,border-color,color,box-shadow] duration-200 ease-out focus-visible:outline-[3px] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
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

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps & { href: string; external?: boolean };
type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type GlassButtonProps = ButtonAsLink | ButtonAsButton;

/**
 * Brand pill button. Hover states change lightness only, never hue.
 */
export function GlassButton(props: GlassButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.href !== undefined) {
    const { href, external } = props;
    if (external) {
      return (
        <a href={href} className={classes} rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

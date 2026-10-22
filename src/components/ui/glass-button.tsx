import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "coral" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-medium tracking-[0.01em] transition-all duration-300 ease-out focus-visible:outline-[3px] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  /* Light: solid brand teal with white text. Dark: mist glass pill. */
  primary: cn(
    "btn-sweep bg-teal-700 text-white shadow-[0_10px_28px_-12px_rgb(15_76_92/0.5)]",
    "hover:bg-teal-900 hover:shadow-[0_14px_34px_-12px_rgb(15_76_92/0.55)]",
    "dark:bg-white/90 dark:text-teal-950 dark:shadow-[0_10px_28px_-14px_rgb(0_0_0/0.5)] dark:hover:bg-coral-500 dark:hover:text-teal-950"
  ),
  /* Frosted outline pill in both themes. */
  secondary: cn(
    "glass text-teal-700 dark:text-mist-200",
    "hover:border-teal-400/50 hover:bg-white/80 dark:hover:bg-white/10"
  ),
  /* Coral is the pulse: dark text on coral, never white. */
  coral:
    "btn-sweep bg-coral-500 text-teal-950 shadow-[0_10px_28px_-12px_rgb(180_74_56/0.55)] hover:bg-coral-300",
  ghost:
    "text-teal-700 underline-offset-4 hover:bg-teal-50 hover:underline dark:text-mist-200 dark:hover:bg-white/10",
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
 * Brand pill button. `primary` performs the soft coral light sweep on hover.
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

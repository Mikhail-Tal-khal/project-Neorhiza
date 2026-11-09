import Link from "next/link";
import { cn } from "@/lib/utils";
import { trackAttrs, type AnalyticsEvent } from "@/lib/analytics-events";
import { buttonBase, buttonSizes, buttonVariants, type Size, type Variant } from "@/components/ui/glass-button-styles";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
  /** Reports a click as a conversion event (see AnalyticsClickTracker). */
  analytics?: { event: AnalyticsEvent; location?: string };
};
type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type GlassButtonProps = ButtonAsLink | ButtonAsButton;

/**
 * Brand pill button. Hover states change lightness only, never hue.
 */
export function GlassButton(props: GlassButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(buttonBase, buttonVariants[variant], buttonSizes[size], className);

  if (props.href !== undefined) {
    const { href, external, analytics } = props;
    const data = analytics ? trackAttrs(analytics.event, analytics.location) : undefined;
    if (external) {
      return (
        <a href={href} className={classes} rel="noopener noreferrer" {...data}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...data}>
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

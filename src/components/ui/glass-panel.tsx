import { cn } from "@/lib/utils";

type GlassSurfaceProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "article" | "section" | "li";
  /** Strength of the glass treatment. */
  tone?: "default" | "strong";
};

/**
 * Base frosted-glass surface. Provides an opaque fallback behind every
 * translucent panel so text contrast never depends on backdrop-filter
 * support (WCAG 2.2 AA).
 */
export function GlassPanel({
  as = "div",
  tone = "default",
  className,
  ...props
}: GlassSurfaceProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={cn(
        tone === "strong" ? "glass-strong" : "glass",
        "rounded-2xl md:rounded-3xl",
        className
      )}
      {...props}
    />
  );
}

type GlassCardProps = GlassSurfaceProps & {
  interactive?: boolean;
};

/** Elevated glass card with gentle hover elevation. */
export function GlassCard({
  interactive = false,
  className,
  ...props
}: GlassCardProps) {
  const Tag = props.as ?? "div";
  return (
    <GlassPanel
      as={Tag}
      className={cn(
        "p-6 md:p-8",
        interactive &&
          "transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_48px_-16px_rgb(15_76_92/0.28)]",
        className
      )}
      {...props}
    />
  );
}

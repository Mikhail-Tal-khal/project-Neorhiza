import { cx } from "@/lib/cx";
import {
  HORIZONTAL_LIGHT_SVG,
  HORIZONTAL_REVERSED_SVG,
  STACKED_LIGHT_SVG,
} from "@/components/ui/brand-lockups.generated";

type BrandMarkProps = {
  /** Lockup variant to render. */
  variant?: "horizontal" | "stacked" | "icon";
  /** Rendered height in px. Minimums are enforced by the brand system. */
  height?: number;
  className?: string;
  /** Decorative contexts (the wordmark is already visible nearby) may hide the image from AT. */
  decorative?: boolean;
  /**
   * Horizontal only. "auto" (default) follows the color scheme — teal
   * lockup in light, reversed lockup in dark. "reversed" always renders the
   * reversed lockup and is used on solid deep-teal surfaces (footer, final
   * CTA, 404) in both color schemes.
   */
  tone?: "auto" | "reversed";
};

const ALT = "Neorhiza: Patient-Specific Tissue Engineering";

/**
 * Renders an official, unaltered logo lockup.
 *
 * Horizontal and stacked lockups are inlined (markup generated verbatim from
 * the official files by scripts/generate-logos.mjs) so the wordmark renders
 * in Manrope; the icon is served as a static file.
 *
 * Placement rules:
 * - Never on translucent surfaces below 85% effective opacity.
 * - The stacked lockup has no official reversed version, so it always sits
 *   on its own solid light tile — in both color schemes.
 * - Use tone="reversed" (horizontal) on solid deep-teal surfaces.
 */
export function BrandMark({
  variant = "horizontal",
  height = 40,
  className,
  decorative = false,
  tone = "auto",
}: BrandMarkProps) {
  const h = height;
  const a11y = decorative
    ? { "aria-hidden": true as const }
    : { role: "img" as const, "aria-label": ALT };

  if (variant === "icon") {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static SVG; next/image adds no value for vector files
      <img
        src="/images/logo/neorhiza-icon.svg"
        alt={decorative ? "" : ALT}
        width={h}
        height={h}
        decoding="async"
        className={cx("block", className)}
      />
    );
  }

  const lockupSpan = "brand-lockup h-full [&>svg]:block [&>svg]:h-full [&>svg]:w-auto";

  if (variant === "stacked") {
    return (
      <span
        {...a11y}
        style={{ width: Math.round(h * (360 / 320)), height: h }}
        className={cx("block shrink-0", className)}
      >
        <span aria-hidden="true" className={cx(lockupSpan, "block")} dangerouslySetInnerHTML={{ __html: STACKED_LIGHT_SVG }} />
      </span>
    );
  }

  return (
    <span
      {...a11y}
      style={{ width: Math.round(h * (600 / 200)), height: h }}
      className={cx("block shrink-0", className)}
    >
      {tone === "auto" && (
        <span
          aria-hidden="true"
          className={cx(lockupSpan, "block dark:hidden")}
          dangerouslySetInnerHTML={{ __html: HORIZONTAL_LIGHT_SVG }}
        />
      )}
      <span
        aria-hidden="true"
        className={cx(lockupSpan, tone === "auto" ? "hidden dark:block" : "block")}
        dangerouslySetInnerHTML={{ __html: HORIZONTAL_REVERSED_SVG }}
      />
    </span>
  );
}

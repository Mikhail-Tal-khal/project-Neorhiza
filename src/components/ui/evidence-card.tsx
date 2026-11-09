import { cn } from "@/lib/utils";
import { FlaskConical, Microscope, Compass, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS = {
  established: FlaskConical,
  experimental: Microscope,
  explores: Compass,
  notClaiming: ShieldCheck,
} satisfies Record<string, LucideIcon>;

type IconName = keyof typeof ICONS;

/**
 * Defines the four row icons once per page as SVG symbols. A page that
 * renders many EvidenceCards (Our Science has 13) would otherwise repeat
 * every icon's markup in both its HTML and its RSC payload. Render exactly
 * once on any page that uses EvidenceCard.
 */
export function EvidenceIconSprite() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute size-0 overflow-hidden">
      {(Object.entries(ICONS) as [IconName, LucideIcon][]).map(([name, Icon]) => (
        <symbol key={name} id={`evidence-icon-${name}`} viewBox="0 0 24 24">
          <Icon />
        </symbol>
      ))}
    </svg>
  );
}

type Row = {
  label: string;
  text: string;
  icon: IconName;
  labelClass: string;
  /** Optional accent for the icon only (coral is never small text on light). */
  iconClass?: string;
};

/**
 * EvidenceCard — four clearly labeled rows separating established evidence,
 * open questions, Neorhiza's proposed exploration and explicit non-claims.
 * Status is carried by TEXT LABELS in addition to tint, so evidence status
 * never depends on color alone.
 */
export function EvidenceCard({
  established,
  experimental,
  explores,
  notClaiming,
  className,
}: {
  established: string;
  experimental: string;
  explores: string;
  notClaiming: string;
  className?: string;
}) {
  const rows: Row[] = [
    {
      label: "Established evidence",
      text: established,
      icon: "established",
      labelClass: "text-heading",
    },
    {
      label: "What remains experimental",
      text: experimental,
      icon: "experimental",
      labelClass: "text-heading",
    },
    {
      label: "What Neorhiza proposes to explore",
      text: explores,
      icon: "explores",
      labelClass: "text-teal-700 dark:text-coral-300",
      iconClass: "text-coral-700 dark:text-coral-300",
    },
    {
      label: "What Neorhiza is not yet claiming",
      text: notClaiming,
      icon: "notClaiming",
      labelClass: "text-muted",
    },
  ];

  return (
    <div
      className={cn(
        "glass overflow-hidden rounded-2xl md:rounded-3xl",
        className
      )}
    >
      <dl className="divide-y divide-border">
        {rows.map(({ label, text, icon, labelClass, iconClass }) => (
          <div key={label} className="flex flex-col gap-2 p-5 min-[370px]:flex-row min-[370px]:gap-4 md:gap-6 md:p-6">
            <dt className="shrink-0 min-[370px]:w-40 md:w-52">
              <span
                className={cn(
                  "flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em]",
                  labelClass
                )}
              >
                <svg aria-hidden="true" className={cn("size-4 shrink-0", iconClass)}>
                  <use href={`#evidence-icon-${icon}`} />
                </svg>
                <span>{label}</span>
              </span>
            </dt>
            <dd className="text-sm leading-relaxed text-ink">
              {text}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

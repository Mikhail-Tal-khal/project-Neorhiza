import { cn } from "@/lib/utils";
import { FlaskConical, Microscope, Compass, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Row = {
  label: string;
  text: string;
  Icon: LucideIcon;
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
      Icon: FlaskConical,
      labelClass: "text-heading",
    },
    {
      label: "What remains experimental",
      text: experimental,
      Icon: Microscope,
      labelClass: "text-heading",
    },
    {
      label: "What Neorhiza proposes to explore",
      text: explores,
      Icon: Compass,
      labelClass: "text-teal-700 dark:text-coral-300",
      iconClass: "text-coral-700 dark:text-coral-300",
    },
    {
      label: "What Neorhiza is not yet claiming",
      text: notClaiming,
      Icon: ShieldCheck,
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
        {rows.map(({ label, text, Icon, labelClass, iconClass }) => (
          <div key={label} className="flex gap-4 p-5 md:gap-6 md:p-6">
            <dt className="w-40 shrink-0 md:w-52">
              <span
                className={cn(
                  "flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em]",
                  labelClass
                )}
              >
                <Icon aria-hidden="true" className={cn("size-4 shrink-0", iconClass)} />
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

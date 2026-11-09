import { Info } from "lucide-react";
import { cx } from "@/lib/cx";

/**
 * ResearchDisclaimer — frosted panel carrying one of the required verbatim
 * disclaimers. Never reworded by callers; text is passed from lib/site.ts.
 */
export function ResearchDisclaimer({
  children,
  className,
  title = "Important notice",
}: {
  children: string;
  className?: string;
  title?: string;
}) {
  return (
    <aside
      className={cx(
        "glass flex items-start gap-3 rounded-2xl p-4 text-sm leading-relaxed text-muted md:items-center",
        className
      )}
      role="note"
      aria-label={title}
    >
      <Info
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-teal-400 md:mt-0"
      />
      <p className="text-pretty">{children}</p>
    </aside>
  );
}

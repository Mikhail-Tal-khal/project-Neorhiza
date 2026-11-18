import { GlassPanel } from "@/components/ui/glass-panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { projectStatus } from "@/content/organization";
import { cn } from "@/lib/utils";

/**
 * "Where Neorhiza stands today" — the public transparency status list
 * (corporate identity brief, section 9). Present facts only.
 */
export function ProjectStatus({
  headingId = "project-status-heading",
  eyebrow = "Public transparency",
  className,
  extra = [],
}: {
  headingId?: string;
  eyebrow?: string;
  className?: string;
  /** Page-specific present facts appended to the shared list. */
  extra?: readonly { label: string; value: string }[];
}) {
  return (
    <section aria-labelledby={headingId} className={cn("py-10", className)}>
      <SectionHeading
        id={headingId}
        eyebrow={eyebrow}
        title="Where Neorhiza Stands Today"
        lead="Current facts, not plans. Each status changes only when an actual development supports it."
      />
      <GlassPanel className="mx-auto mt-12 max-w-4xl overflow-hidden p-0">
        <dl className="divide-y divide-border">
          {[...projectStatus, ...extra].map((item) => (
            <div key={item.label} className="grid gap-1 p-5 sm:grid-cols-[16rem_1fr] sm:gap-6 md:px-7">
              <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-heading">
                {item.label}
              </dt>
              <dd className="text-[0.95rem] font-medium leading-relaxed text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
      </GlassPanel>
    </section>
  );
}

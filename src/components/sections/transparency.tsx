import { SectionHeading } from "@/components/ui/section-heading";
import { GlassPanel } from "@/components/ui/glass-panel";

const commitments = [
  "Development milestones",
  "Institutional relationships",
  "Research-stage updates",
  "Scientific limitations",
  "Changes to the roadmap",
  "Negative or inconclusive results when appropriate",
  "Publicly shareable research outputs",
  "Ethical and regulatory progress",
];

/**
 * Transparency commitments (section 11.10).
 */
export function Transparency() {
  return (
    <section
      aria-labelledby="transparency-heading"
      className="py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Transparency"
          title="Responsible Progress, Clearly Communicated"
          lead="Project Neorhiza commits to reporting the following — including when the honest report is that something did not work:"
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
          <ul className="grid gap-3 sm:grid-cols-2">
            {commitments.map((item) => (
              <li
                key={item}
                className="glass flex items-start gap-3 rounded-2xl p-4 text-[0.95rem] leading-relaxed text-ink"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.55rem] size-2 shrink-0 rounded-full bg-teal-400"
                />
                {item}
              </li>
            ))}
          </ul>

          <GlassPanel className="p-7 md:p-10">
            <blockquote>
              <p className="text-balance text-xl font-medium leading-relaxed text-heading md:text-2xl">
                “Scientific progress is not guaranteed. A carefully designed
                study that identifies a limitation may still provide an
                important scientific result.”
              </p>
              <footer className="mt-4 text-sm text-muted">
                A principle this project reports by
              </footer>
            </blockquote>
            <p className="mt-6 text-sm leading-relaxed text-muted">
              Updates are published on the Updates page as the project
              advances, including research-stage changes, governance
              developments and honest accounts of setbacks. Where results are
              negative or inconclusive, they will be described as such.
            </p>
          </GlassPanel>
        </div>
      </div>
    </section>
  );
}

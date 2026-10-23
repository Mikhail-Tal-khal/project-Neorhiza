import { SectionHeading } from "@/components/ui/section-heading";
import { GlassPanel } from "@/components/ui/glass-panel";

const challenges = [
  "Limited availability of donor organs",
  "Long transplant waiting periods",
  "Deteriorating health while waiting",
  "Immune rejection",
  "Lifelong medical management",
  "High treatment burdens",
  "Geographic inequality in access to advanced care",
  "Emotional and financial pressure on families",
];

/**
 * Human need — the urgent, human reality behind the research. Respectful,
 * human-centered language; statistics only appear with reliable sources,
 * so this section uses none.
 */
export function HumanNeed() {
  return (
    <section aria-labelledby="need-heading" className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <SectionHeading
        eyebrow="The human need"
        title="The Need Is Urgent"
        lead="Behind every waiting-list number is a person, a family and a future placed on hold. Project Neorhiza exists to help advance the scientific foundation for a different possibility."
        align="left"
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassPanel className="p-7 md:p-10">
          <h3 className="label-caps mb-6">
            What organ failure can mean for a person
          </h3>
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {challenges.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-ink"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-coral-500"
                />
                {item}
              </li>
            ))}
          </ul>
        </GlassPanel>

        <GlassPanel className="flex flex-col justify-center p-7 md:p-10">
          <blockquote className="relative">
            <p className="text-balance text-xl font-medium leading-relaxed tracking-[0.005em] text-heading md:text-2xl">
              “Behind every waiting-list number is a person, a family and a
              future placed on hold.”
            </p>
            <footer className="mt-4 text-sm text-muted">
              The conviction that motivates this project
            </footer>
          </blockquote>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            Transplantation saves lives every day, and donated organs remain
            precious and scarce. The World Health Organization has long
            recognized that the need for organs substantially exceeds their
            availability worldwide. This is not an argument against
            transplantation — it is the reason regenerative science is
            worth pursuing carefully, honestly and for the long term.
          </p>
        </GlassPanel>
      </div>
    </section>
  );
}

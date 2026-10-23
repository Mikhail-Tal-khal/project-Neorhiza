import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { GlassPanel } from "@/components/ui/glass-panel";
import { ResearchDisclaimer } from "@/components/ui/research-disclaimer";
import { disclaimers } from "@/lib/site";

const measurementCategories = [
  "Cell survival",
  "Tissue organization",
  "Protein production",
  "Metabolic activity",
  "Transport behavior",
  "Reproducibility",
  "Process consistency",
];

/**
 * First proposed program — a focused feasibility question. Public
 * measurement categories only; no exact assays, thresholds, process
 * conditions or experimental settings are published anywhere.
 */
export function ProgramFeature() {
  return (
    <section
      aria-labelledby="program-heading"
      className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8 md:py-28"
    >
      <SectionHeading
        eyebrow="First proposed program"
        title="Starting With a Focused Scientific Question"
        lead="Ambition is not an excuse for vagueness. The first proposed program is deliberately small, measurable and supervised."
      />

      <GlassPanel className="relative mt-12 overflow-hidden p-7 md:p-12">
        <div className="relative">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-semibold tracking-[0.01em] text-heading">
              Neorhiza Liver Tissue Program
            </h3>
            <StatusBadge>
              Proposed Program — Institutional Collaboration Required
            </StatusBadge>
          </div>

          <p className="mt-5 max-w-3xl text-pretty leading-relaxed text-ink">
            Project Neorhiza proposes to begin with a small perfused
            liver-tissue research model. The initial objective is{" "}
            <strong className="font-semibold">
              not to manufacture a transplantable liver
            </strong>
            . It is to investigate how defined cell populations, tissue
            organization and controlled perfusion may work together to
            support measurable tissue function.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="glass rounded-2xl p-6">
              <h4 className="label-caps mb-3">Proposed research question</h4>
              <p className="text-pretty text-lg font-medium leading-relaxed text-heading">
                Can controlled perfusion improve the sustained function and
                viability of a small multicellular liver-tissue construct
                compared with an equivalent non-perfused construct?
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <h4 className="label-caps mb-3">
                Public measurement categories
              </h4>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {measurementCategories.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.5rem] size-1.5 shrink-0 rounded-full bg-coral-500"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ResearchDisclaimer className="mt-8" title="Confidentiality note">
            {disclaimers.confidentialProcess}
          </ResearchDisclaimer>
        </div>
      </GlassPanel>
    </section>
  );
}

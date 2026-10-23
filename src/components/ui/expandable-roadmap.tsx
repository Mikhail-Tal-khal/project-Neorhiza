import { ChevronDown } from "lucide-react";

export type RoadmapStage = {
  number: number;
  name: string;
  purpose: string;
  expectedOutput: string;
  advancementRequirement: string;
  principalRisks: string;
  currentStatus: string;
};

function StageDetail({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <h4 className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-heading">
        {label}
      </h4>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        {text}
      </p>
    </div>
  );
}

/**
 * ExpandableRoadmap — the nine roadmap stages rendered as a vertical
 * branching vessel line with expandable stages. Built on native
 * <details>/<summary>: keyboard accessible and fully readable without
 * JavaScript. No executable laboratory instructions are provided anywhere.
 */
export function ExpandableRoadmap({ stages }: { stages: RoadmapStage[] }) {
  return (
    <ol className="relative space-y-6">
      <span
        aria-hidden="true"
        className="absolute bottom-6 left-[0.7rem] top-4 w-[2px] rounded-full bg-gradient-to-b from-teal-400/60 via-teal-400/35 to-teal-400/10"
      />
      {stages.map((stage) => (
        <li key={stage.number} className="relative">
          <details
            open={stage.number === 1}
            className="group glass overflow-hidden rounded-2xl open:shadow-lift md:rounded-3xl"
          >
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-4 p-5 text-left transition-colors hover:bg-white/40 md:gap-5 md:p-6 dark:hover:bg-white/5 [&::-webkit-details-marker]:hidden">
              <span
                aria-hidden="true"
                className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-teal-400 bg-background text-teal-700 transition-colors group-open:border-coral-500 group-open:bg-coral-500 group-open:text-teal-950 dark:text-muted dark:group-open:bg-coral-500 dark:group-open:text-teal-950"
              >
                <span className="text-[0.65rem] font-bold">{stage.number}</span>
              </span>
              <h3 className="flex-1 font-semibold tracking-[0.01em] text-heading">
                <span className="sr-only">Stage {stage.number}: </span>
                {stage.name}
              </h3>
              <ChevronDown
                aria-hidden="true"
                className="size-5 shrink-0 text-muted transition-transform duration-300 group-open:rotate-180"
              />
            </summary>
            <div className="border-t border-border px-5 py-6 md:px-6">
              <div className="grid gap-5 pl-0 sm:grid-cols-2 md:pl-11">
                <StageDetail label="Purpose" text={stage.purpose} />
                <StageDetail label="Expected output" text={stage.expectedOutput} />
                <StageDetail label="Advancement requirement" text={stage.advancementRequirement} />
                <StageDetail label="Principal risks" text={stage.principalRisks} />
                <StageDetail label="Current status" text={stage.currentStatus} />
              </div>
            </div>
          </details>
        </li>
      ))}
    </ol>
  );
}

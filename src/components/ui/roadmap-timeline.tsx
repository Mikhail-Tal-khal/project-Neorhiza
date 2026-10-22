import { cn } from "@/lib/utils";

export type RoadmapPhase = {
  name: string;
  description: string;
  current?: boolean;
};

/**
 * RoadmapTimeline — vertical vessel line with phase nodes. The current
 * phase is marked with a filled coral node and label; later phases use
 * outlined teal nodes.
 */
export function RoadmapTimeline({
  phases,
  className,
}: {
  phases: RoadmapPhase[];
  className?: string;
}) {
  return (
    <ol className={cn("relative space-y-8", className)}>
      <span
        aria-hidden="true"
        className="absolute bottom-5 left-[0.7rem] top-3 w-[2px] rounded-full bg-gradient-to-b from-coral-500/70 via-teal-400/50 to-teal-400/15"
      />
      {phases.map((phase) => (
        <li key={phase.name} className="relative flex gap-6 pl-0">
          <span
            aria-hidden="true"
            className="relative z-10 mt-1 flex size-6 shrink-0 items-center justify-center"
          >
            {phase.current ? (
              <span className="size-4 rounded-full border-2 border-coral-500 bg-coral-500 shadow-[0_0_0_5px_rgb(227_111_92/0.18)]" />
            ) : (
              <span className="size-4 rounded-full border-2 border-teal-400 bg-background" />
            )}
          </span>
          <div
            className={cn(
              "glass flex-1 rounded-2xl p-5",
              phase.current &&
                "border-coral-300/60 shadow-[0_12px_36px_-16px_rgb(227_111_92/0.35)]"
            )}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h3 className="font-semibold tracking-[0.01em] text-teal-700 dark:text-teal-50">
                {phase.name}
              </h3>
              {phase.current && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-100 px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-teal-700 dark:bg-coral-500/15 dark:text-coral-300">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-coral-500"
                  />
                  Current Position: Foundation Phase
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-mist-200">
              {phase.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

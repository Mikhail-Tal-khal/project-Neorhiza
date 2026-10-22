"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { ResearchDisclaimer } from "@/components/ui/research-disclaimer";
import { disclaimers } from "@/lib/site";

export type JourneyStage = {
  number: number;
  title: string;
  text: string;
};

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

/** Reads prefers-reduced-motion via useSyncExternalStore (no cascade). */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(reducedMotionQuery);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false
  );
}

/**
 * ScientificJourney — an interactive visual journey along a single teal
 * vessel line. Each stage carries a coral node that fills in as the user
 * scrolls or selects it. Under prefers-reduced-motion every stage is shown
 * statically (all nodes filled, no scroll observation).
 */
export function ScientificJourney({ stages }: { stages: JourneyStage[] }) {
  const [active, setActive] = useState(0);
  const staticAll = usePrefersReducedMotion();
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(
              (entry.target as HTMLElement).dataset.index ?? 0
            );
            setActive((current) => Math.max(current, index));
          }
        }
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
    );

    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <ol className="relative space-y-10 md:space-y-14">
        {/* The vessel line */}
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-[1.35rem] top-2 w-[2px] rounded-full bg-gradient-to-b from-teal-400/70 via-teal-400/45 to-teal-400/20 md:left-1/2 md:-translate-x-1/2"
        />

        {stages.map((stage, index) => {
          const isActive = staticAll || index <= active;
          const isCurrent = staticAll ? false : index === active;
          return (
            <li
              key={stage.number}
              data-index={index}
              ref={(el) => {
                refs.current[index] = el;
              }}
              className="relative grid grid-cols-[2.75rem_1fr] gap-x-4 md:grid-cols-[1fr_6.5rem_1fr] md:gap-x-0"
            >
              {/* Card — left column on odd rows (desktop) */}
              <div
                className={cn(
                  "col-start-2 row-start-1 md:col-start-1 md:pr-14 md:text-right",
                  index % 2 === 1 && "md:col-start-3 md:row-start-1 md:pl-14 md:text-left"
                )}
              >
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "glass block w-full rounded-2xl p-5 text-left transition-all duration-300",
                    "hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-16px_rgb(15_76_92/0.3)]",
                    isActive
                      ? "border-coral-300/60 shadow-[0_12px_36px_-16px_rgb(227_111_92/0.35)]"
                      : ""
                  )}
                >
                  <span className="label-caps mb-1.5 block">Stage {stage.number}</span>
                  <span className="block font-semibold tracking-[0.01em] text-teal-700 dark:text-teal-50">
                    {stage.title}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-slate-500 dark:text-mist-200">
                    {stage.text}
                  </span>
                </button>
              </div>

              {/* Node — center column */}
              <span
                aria-hidden="true"
                className="relative z-10 col-start-1 row-start-1 mt-1 flex size-11 items-center justify-center md:col-start-2 md:justify-center"
              >
                <span
                  className={cn(
                    "block rounded-full border-2 transition-all duration-500 ease-out",
                    isActive
                      ? "size-6 border-coral-700 bg-coral-500 shadow-[0_0_0_6px_rgb(227_111_92/0.18)] dark:border-coral-500"
                      : "size-5 border-teal-400 bg-background"
                  )}
                />
                {isCurrent && (
                  <span className="absolute inset-0 -z-10 motion-safe:animate-ping rounded-full bg-coral-500/20 [animation-duration:2.4s]" />
                )}
              </span>

              {/* Spacer — opposite column on desktop */}
              <div
                aria-hidden="true"
                className={cn(
                  "hidden md:col-start-3 md:row-start-1 md:block",
                  index % 2 === 1 && "md:col-start-1"
                )}
              />
            </li>
          );
        })}
      </ol>

      <ResearchDisclaimer className="mt-12">
        {disclaimers.journeyConfidentiality}
      </ResearchDisclaimer>
    </div>
  );
}

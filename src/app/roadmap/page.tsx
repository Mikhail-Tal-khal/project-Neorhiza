import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { ExpandableRoadmap } from "@/components/ui/expandable-roadmap";
import { ResearchDisclaimer } from "@/components/ui/research-disclaimer";
import { StatusBadge } from "@/components/ui/status-badge";
import { GlassPanel } from "@/components/ui/glass-panel";
import { roadmapStages } from "@/content/roadmap";
import { createMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = createMetadata({
  title: "Research Roadmap",
  description:
    "Nine stages from scientific foundation to long-term patient monitoring — each with its purpose, expected output, advancement requirement, principal risks and current status.",
  path: "/roadmap",
});

const breadcrumb = breadcrumbJsonLd([{ name: "Research Roadmap", path: "/roadmap" }]);

export default function RoadmapPage() {
  return (
    <>
      <section
        aria-labelledby="roadmap-page-heading"
        className="mx-auto w-full max-w-5xl px-4 py-16 md:px-8 lg:py-24"
      >
        <SectionHeading
          as="h1"
          eyebrow="Research roadmap"
          title="Every Stage Earns the Next"
          lead="The roadmap advances only when a stage's requirements are met and reviewed. Select any stage to see its purpose, expected output, advancement requirement, principal risks and current status."
        />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <StatusBadge>Current Position: Foundation Phase</StatusBadge>
        </div>

        {/* First proposed research programme — status stated explicitly */}
        <GlassPanel className="mt-12 p-6 md:p-8">
          <p className="label-caps mb-2">First proposed research programme</p>
          <h2 className="text-xl font-semibold tracking-[0.01em] text-heading md:text-2xl">
            Neorhiza Liver Tissue Program
          </h2>
          <p className="mt-2 text-sm font-medium text-ink">
            Status: Proposed research programme — institutional collaboration
            and qualified scientific supervision required.
          </p>
          <p className="mt-4 text-pretty leading-relaxed text-ink">
            Initial research question: can controlled perfusion improve the
            sustained function and viability of a small multicellular
            liver-tissue construct compared with an equivalent non-perfused
            construct?
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            No laboratory research has yet begun. Neorhiza has not produced a
            functional liver, replacement organ, transplantable tissue or
            clinical treatment.
          </p>
        </GlassPanel>
      </section>

      <div className="band">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 md:px-8 lg:py-24">
          <h2 className="sr-only">Roadmap stages</h2>
          <ExpandableRoadmap stages={roadmapStages} />

          <ResearchDisclaimer className="mt-12">
            This roadmap describes governance and development stages only. It
            does not contain — and will not contain — executable laboratory
            instructions, experimental parameters or proprietary process
            information.
          </ResearchDisclaimer>
        </div>
      </div>

      <JsonLd data={breadcrumb} />
    </>
  );
}

import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { ExpandableRoadmap } from "@/components/ui/expandable-roadmap";
import { ResearchDisclaimer } from "@/components/ui/research-disclaimer";
import { StatusBadge } from "@/components/ui/status-badge";
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
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 md:px-8">
      <section aria-labelledby="roadmap-page-heading" className="py-14 lg:py-20">
        <SectionHeading
          as="h1"
          eyebrow="Research roadmap"
          title="Every Stage Earns the Next"
          lead="The roadmap advances only when a stage's requirements are met and reviewed. Select any stage to see its purpose, expected output, advancement requirement, principal risks and current status."
        />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <StatusBadge>Current Position: Foundation Phase</StatusBadge>
        </div>
      </section>

      <h2 className="sr-only">Roadmap stages</h2>
      <ExpandableRoadmap stages={roadmapStages} />

      <ResearchDisclaimer className="mt-12">
        This roadmap describes governance and development stages only. It
        does not contain — and will not contain — executable laboratory
        instructions, experimental parameters or proprietary process
        information.
      </ResearchDisclaimer>

      <JsonLd data={breadcrumb} />
    </div>
  );
}

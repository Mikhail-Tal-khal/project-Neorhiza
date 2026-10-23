import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { HumanNeed } from "@/components/sections/human-need";
import { VisionFields } from "@/components/sections/vision-fields";
import { ScientificJourney } from "@/components/ui/scientific-journey";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProgramFeature } from "@/components/sections/program-feature";
import { ImpactPreview } from "@/components/sections/impact-preview";
import {
  WhyExists,
  RoadmapPreviewSection,
} from "@/components/sections/why-roadmap";
import { CollaborationInvite } from "@/components/sections/collaboration-invite";
import { Transparency } from "@/components/sections/transparency";
import { FinalCta } from "@/components/sections/final-cta";
import { journeyStages } from "@/content/journey";
import { createMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = createMetadata({
  title: "Engineering New Beginnings from Living Cells",
  description:
    "Project Neorhiza is an early-stage, patient-specific tissue engineering initiative — building scientific partnerships, an engineering framework and a responsible research foundation for the future of regenerative medicine.",
  path: "/",
});

/** Breadcrumb structured data for the home page. */
const breadcrumb = breadcrumbJsonLd([]);

export default function HomePage() {
  return (
    <>
      {/* Sections alternate between the page background and a neutral
          stone band for rhythm without color. */}
      <Hero />
      <div className="band">
        <HumanNeed />
      </div>
      <VisionFields />

      {/* Scientific journey (section 11.4) */}
      <div className="band">
        <section
          aria-labelledby="journey-heading"
          className="mx-auto w-full max-w-6xl px-4 py-20 md:px-8 md:py-28"
        >
          <SectionHeading
            eyebrow="The scientific pathway"
            title="From Living Cells to Functional Tissue"
            lead="Seven conceptual stages connect a patient's own cells to the long-term possibility of functional tissue. Select any stage to focus it — or simply scroll."
          />
          <div className="mt-14">
            <ScientificJourney stages={journeyStages} />
          </div>
        </section>
      </div>

      <ProgramFeature />
      <div className="band">
        <ImpactPreview />
      </div>
      <WhyExists />
      <div className="band">
        <RoadmapPreviewSection />
      </div>
      <CollaborationInvite />
      <div className="band">
        <Transparency />
      </div>
      <FinalCta />

      <JsonLd data={breadcrumb} />
    </>
  );
}

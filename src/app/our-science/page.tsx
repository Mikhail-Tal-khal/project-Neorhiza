import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { EvidenceCard } from "@/components/ui/evidence-card";
import { ResearchDisclaimer } from "@/components/ui/research-disclaimer";
import { GlassPanel } from "@/components/ui/glass-panel";
import { scienceTopics } from "@/content/science";
import { createMetadata } from "@/lib/metadata";
import { disclaimers } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = createMetadata({
  title: "Our Science",
  description:
    "Thirteen honest questions at the heart of tissue engineering — what science has demonstrated, what remains experimental, what Project Neorhiza proposes to explore, and what it is not yet claiming.",
  path: "/our-science",
});

const breadcrumb = breadcrumbJsonLd([{ name: "Our Science", path: "/our-science" }]);

const pathway =
  "Patient cells → induced pluripotent stem cells → specialized cells → organized tissue → vascular support → controlled maturation → functional and safety evaluation → future clinical translation";

export default function OurSciencePage() {
  return (
    <>
      {/* Intro + pathway */}
      <section
        aria-labelledby="science-heading"
        className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8 lg:py-24"
      >
        <SectionHeading
          as="h1"
          eyebrow="Our science"
          title="Careful Answers to Hard Questions"
          lead="Tissue engineering is one of the most promising and most demanding frontiers in medicine. This page explains the science at a high level — and, for every topic, separates what research has demonstrated from what remains experimental, what Neorhiza proposes to explore, and what it is not yet claiming."
        />

        <GlassPanel className="mt-12 p-6 md:p-8">
          <h2 className="label-caps mb-3">The high-level scientific concept</h2>
          <p className="text-pretty text-lg font-medium leading-relaxed text-heading md:text-xl">
            {pathway}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Each arrow represents a stage of dedicated research, with open
            questions at every step. The thirteen topics below explain why
            each stage is scientifically demanding — and honest about what
            is not yet known.
          </p>
        </GlassPanel>

        <ResearchDisclaimer className="mt-6">
          {disclaimers.confidentialProcess}
        </ResearchDisclaimer>
      </section>

      {/* Topics, on a neutral band */}
      <div className="band">
        <div className="mx-auto grid w-full max-w-7xl gap-16 px-4 py-16 md:px-8 lg:gap-20 lg:py-24">
          {scienceTopics.map((topic) => (
            <section
              key={topic.slug}
              aria-labelledby={`topic-${topic.slug}`}
              className="scroll-mt-32"
            >
              <h2
                id={`topic-${topic.slug}`}
                className="text-balance text-2xl font-semibold tracking-[0.01em] text-heading md:text-[1.7rem]"
              >
                {topic.question}
              </h2>
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-muted">
                {topic.title}
              </p>
              <EvidenceCard
                className="mt-6"
                established={topic.established}
                experimental={topic.experimental}
                explores={topic.explores}
                notClaiming={topic.notClaiming}
              />
            </section>
          ))}
        </div>
      </div>

      <JsonLd data={breadcrumb} />
    </>
  );
}

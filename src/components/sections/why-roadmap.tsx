import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-panel";
import { RoadmapTimeline } from "@/components/ui/roadmap-timeline";
import { GlassButton } from "@/components/ui/glass-button";
import { whyPanels } from "@/content/why";
import { roadmapPreview } from "@/content/roadmap";

/** Why the project exists — four glass panels (section 11.7). */
export function WhyExists() {
  return (
    <section
      aria-labelledby="why-heading"
      className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8 md:py-28"
    >
      <SectionHeading
        eyebrow="Why Neorhiza"
        title="Why Project Neorhiza Exists"
        lead="Four commitments shape every decision — from what gets measured to what gets promised."
      />
      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {whyPanels.map((panel, index) => (
          <GlassCard key={panel.title} interactive className="reveal-view">
            <span className="label-caps">0{index + 1}</span>
            <h3 className="mt-2 text-xl font-semibold tracking-[0.01em] text-heading">
              {panel.title}
            </h3>
            <p className="mt-3 leading-relaxed text-muted">
              {panel.text}
            </p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

/** Roadmap preview — six phases with the current position marked. */
export function RoadmapPreviewSection() {
  return (
    <section
      aria-labelledby="roadmap-heading"
      className="py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Research roadmap"
          title="A Staged Path, Honestly Labeled"
          lead="Every stage must earn the right to the next one. The current position is stated plainly — the Foundation Phase."
        />
        <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <GlassCard className="p-7 md:p-8">
              <h3 className="label-caps">Current position</h3>
              <p className="mt-3 text-2xl font-semibold tracking-[0.01em] text-heading">
                Foundation Phase
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                Project Neorhiza is building its evidence review, scientific
                advisory relationships and institutional foundation. No
                laboratory research has begun, and none will until qualified
                supervision is in place.
              </p>
              <GlassButton
                href="/roadmap"
                variant="secondary"
                size="md"
                className="mt-6"
              >
                See the full nine-stage roadmap
              </GlassButton>
            </GlassCard>
          </div>
          <RoadmapTimeline phases={roadmapPreview} />
        </div>
      </div>
    </section>
  );
}

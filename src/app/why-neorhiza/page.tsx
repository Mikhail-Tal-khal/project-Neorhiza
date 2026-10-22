import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard, GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { ResearchDisclaimer } from "@/components/ui/research-disclaimer";
import { VesselDivider } from "@/components/ui/vessel-divider";
import { AnnotatedMark } from "@/components/ui/annotated-mark";
import { BrandMark } from "@/components/ui/brand-mark";
import { ImageOff, UserRound } from "lucide-react";
import { notList, values } from "@/content/why";
import { createMetadata } from "@/lib/metadata";
import { disclaimers, site } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = createMetadata({
  title: "Why Neorhiza",
  description:
    "The story behind the name, the mission, the values and the governance of Project Neorhiza — an early-stage patient-specific tissue engineering initiative.",
  path: "/why-neorhiza",
});

const breadcrumb = breadcrumbJsonLd([{ name: "Why Neorhiza", path: "/why-neorhiza" }]);

function VerifiedPending({ label }: { label: string }) {
  return (
    <div className="glass flex items-start gap-3 rounded-2xl p-5">
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-white/5 dark:text-teal-100"
      >
        <ImageOff aria-hidden="true" className="size-4" />
      </span>
      <div>
        <p className="text-sm font-semibold text-teal-700 dark:text-teal-50">
          {label}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-mist-200">
          Verified profile in preparation. This section will be completed
          when verified content is available — nothing is invented here.
        </p>
      </div>
    </div>
  );
}

export default function WhyNeorhizaPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-24 md:px-8">
      {/* Name and mark */}
      <section aria-labelledby="name-heading" className="grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <p className="label-caps mb-3">Why Neorhiza</p>
          <h1
            id="name-heading"
            className="text-balance text-4xl font-semibold leading-[1.12] tracking-[0.01em] text-teal-700 md:text-5xl dark:text-teal-50"
          >
            A New Root, From Which Possibility May Grow
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink dark:text-teal-50/90">
            Neorhiza combines the idea of the new with the image of a
            root — a new biological foundation from which possibility may
            grow.
          </p>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-slate-500 dark:text-mist-200">
            The mark expresses this as one branching root system that is
            also a vascular tree: a thick trunk splitting into progressively
            thinner curved branches, each ending in a small coral circle —
            a living cell. One idea, drawn once, governs the visual
            language of everything you see on this site.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <StatusBadge>Early-Stage Research Initiative</StatusBadge>
            <StatusBadge>Foundation Phase</StatusBadge>
          </div>
        </div>
        <GlassPanel className="p-8 md:p-10">
          <div className="text-teal-700 dark:text-teal-100">
            <AnnotatedMark />
          </div>
          {/* The stacked lockup has no reversed version: it sits on a solid light tile in both themes. */}
          <div className="mt-6 rounded-2xl bg-white px-6 py-6 ring-1 ring-teal-100 dark:ring-white/10">
            <BrandMark variant="stacked" height={96} className="mx-auto" />
          </div>
        </GlassPanel>
      </section>

      <VesselDivider />

      {/* Mission, vision, governance */}
      <section aria-labelledby="mission-heading" className="grid gap-4 py-16 md:grid-cols-2 lg:grid-cols-3">
        <h2 id="mission-heading" className="sr-only">
          Mission, vision and governance
        </h2>
        <GlassCard>
          <h3 className="label-caps mb-3">Mission</h3>
          <p className="leading-relaxed text-ink dark:text-teal-50/90">
            To advance the scientific and engineering foundation of
            patient-specific tissue engineering through responsible,
            partnership-driven research — and to communicate that journey
            honestly with the public, the scientific community and the
            institutions whose supervision makes such work legitimate.
          </p>
        </GlassCard>
        <GlassCard>
          <h3 className="label-caps mb-3">Vision</h3>
          <p className="leading-relaxed text-ink dark:text-teal-50/90">
            A future in which living cells obtained from a patient may
            contribute to the development of functional replacement tissue
            designed for that same patient — developed through disciplined
            science, supervised institutions and ethical oversight.
          </p>
        </GlassCard>
        <GlassCard>
          <h3 className="label-caps mb-3">Governance status</h3>
          <p className="leading-relaxed text-ink dark:text-teal-50/90">
            Project Neorhiza is an early-stage initiative founded by REREU.
            It is not yet institutionally affiliated; establishing
            qualified institutional supervision and advisory structures is
            the explicit goal of the current Foundation Phase.
          </p>
        </GlassCard>
        <GlassCard>
          <h3 className="label-caps mb-3">Current development phase</h3>
          <p className="leading-relaxed text-ink dark:text-teal-50/90">
            Foundation Phase: evidence review, scientific advising,
            partnership building and project governance. No laboratory
            research has begun, and none will begin without institutional
            supervision, ethics review and appropriate agreements.
          </p>
        </GlassCard>
        <GlassCard>
          <h3 className="label-caps mb-3">Long-term ambition</h3>
          <p className="leading-relaxed text-ink dark:text-teal-50/90">
            To contribute — through decades of careful work — to patient-specific
            functional tissues and, ultimately, replacement-organ
            technologies, within fully authorized scientific and regulatory
            frameworks.
          </p>
        </GlassCard>
        <GlassCard>
          <h3 className="label-caps mb-3">How we speak</h3>
          <p className="leading-relaxed text-ink dark:text-teal-50/90">
            Every public statement distinguishes established evidence,
            proposed research and long-term objectives. Where methodology
            would normally appear, the project explains that detailed
            methodologies remain confidential and will be shared only with
            qualified institutional collaborators under appropriate
            agreements.
          </p>
        </GlassCard>
      </section>

      {/* Values */}
      <section aria-labelledby="values-heading" className="py-10">
        <SectionHeading
          eyebrow="What we hold to"
          title="Values"
          lead="Nine commitments that govern decisions, communications and conduct."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <GlassCard as="li" key={value.title} interactive>
              <h3 className="flex items-center gap-2.5 font-semibold tracking-[0.01em] text-teal-700 dark:text-teal-50">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-coral-500"
                />
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-mist-200">
                {value.text}
              </p>
            </GlassCard>
          ))}
        </ul>
      </section>

      {/* Founder */}
      <section aria-labelledby="founder-heading" className="py-16">
        <SectionHeading
          eyebrow="Founder"
          title="The Person Behind the Project"
          align="left"
        />
        <GlassPanel className="mt-10 p-7 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div
                aria-hidden="true"
                className="glass flex aspect-[4/5] max-w-xs flex-col items-center justify-center gap-3 rounded-2xl text-teal-400"
              >
                <UserRound className="size-10" strokeWidth={1.5} />
                <span className="label-caps">Professional photograph</span>
              </div>
              <p className="mt-4 text-lg font-semibold tracking-[0.01em] text-teal-700 dark:text-teal-50">
                REREU
              </p>
              <p className="text-sm text-slate-500 dark:text-mist-200">
                Founder, {site.name}
              </p>
            </div>
            <div className="grid content-start gap-4">
              <VerifiedPending label="Verified biography" />
              <VerifiedPending label="Motivation for establishing Project Neorhiza" />
              <VerifiedPending label="Relevant professional background" />
              <VerifiedPending label="Founder's statement" />
              <p className="text-sm leading-relaxed text-slate-500 dark:text-mist-200">
                To avoid inventing credentials, this page deliberately
                shows no degrees, affiliations, laboratory access or
                research experience until verified content is supplied.
                An empty-but-honest section is preferable to a fabricated
                one.
              </p>
            </div>
          </div>
        </GlassPanel>
      </section>

      {/* What Neorhiza is not */}
      <section aria-labelledby="not-heading" className="py-10">
        <SectionHeading
          eyebrow="Positioning"
          title="What Neorhiza Is Not"
          lead="Clarity about what a project is not is part of scientific honesty."
        />
        <GlassPanel className="mt-12 p-7 md:p-10">
          <ul className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {notList.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-ink dark:text-teal-50/90"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.5rem] flex size-4 shrink-0 items-center justify-center rounded-full bg-coral-100 text-[0.6rem] font-bold leading-none text-coral-700 dark:bg-coral-500/15 dark:text-coral-300"
                >
                  ✕
                </span>
                {item}
              </li>
            ))}
          </ul>
          <ResearchDisclaimer className="mt-8" title="Services disclaimer">
            {disclaimers.services}
          </ResearchDisclaimer>
        </GlassPanel>
      </section>

      <JsonLd data={breadcrumb} />
    </div>
  );
}

import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard, GlassPanel } from "@/components/ui/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { networkCategories, recruitmentDisciplines } from "@/content/organization";
import { createMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = createMetadata({
  title: "Scientific Network",
  description:
    "Project Neorhiza's scientific advisory and research collaboration network is under development. No advisers have yet been appointed and no institutional partners confirmed; see the disciplines the project is recruiting.",
  path: "/scientific-network",
});

const breadcrumb = breadcrumbJsonLd([{ name: "Scientific Network", path: "/scientific-network" }]);

/**
 * Scientific Advisory and Research Collaboration. RULE: no person or
 * institution is named here until formally appointed or confirmed in
 * writing AND they have given explicit permission to be identified.
 */
export default function ScientificNetworkPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-24 md:px-8">
      <section aria-labelledby="network-heading" className="py-16 lg:py-24">
        <SectionHeading
          as="h1"
          id="network-heading"
          eyebrow="Scientific Network"
          title="Scientific Advisory and Research Collaboration"
          lead="Neorhiza's advisory network is under development. Responsible tissue-engineering research depends on qualified scientists and institutions — the project is working to recruit them, and will say so plainly until it has."
        />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <StatusBadge>Advisory Network Under Development</StatusBadge>
        </div>
      </section>

      {/* Current status by category */}
      <section aria-labelledby="categories-heading" className="pb-16">
        <SectionHeading
          id="categories-heading"
          eyebrow="Current status"
          title="Who Is — and Is Not — Part of the Network"
          lead="Four kinds of relationship, kept strictly apart so that no one is presented as more involved than they are."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {networkCategories.map((category) => (
            <GlassCard as="li" key={category.title}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold tracking-[0.01em] text-heading">{category.title}</h3>
                <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-heading">
                  {category.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{category.text}</p>
            </GlassCard>
          ))}
        </ul>
      </section>

      {/* Recruitment */}
      <section aria-labelledby="recruiting-heading" className="py-10">
        <GlassPanel className="p-7 md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="label-caps mb-3">Recruitment opportunities</p>
              <h2
                id="recruiting-heading"
                className="text-2xl font-semibold tracking-[0.01em] text-heading md:text-3xl"
              >
                Disciplines We Intend to Recruit
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-ink">
                The first proposed research programme — a liver-tissue
                feasibility study — needs expertise across biology,
                engineering, clinical practice, ethics and regulation. Neorhiza is seeking qualified
                professionals willing to advise, review or collaborate.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Expressing interest does not create an appointment. Any
                advisory or research role is agreed in writing, and nobody is
                named publicly without their explicit permission.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <GlassButton
                  href="/contact?interest=researcher#inquiry-form"
                  analytics={{ event: "collaboration_cta_clicked", location: "scientific-network" }}
                >
                  Apply or Express Interest
                </GlassButton>
                <GlassButton href="/collaboration" variant="secondary">
                  Collaboration Paths
                </GlassButton>
              </div>
            </div>
            <ul className="grid content-start gap-3 sm:grid-cols-2">
              {recruitmentDisciplines.map((discipline) => (
                <li
                  key={discipline}
                  className="glass flex items-start gap-3 rounded-2xl p-4 text-[0.95rem] leading-relaxed text-ink"
                >
                  <span aria-hidden="true" className="mt-[0.55rem] size-2 shrink-0 rounded-full bg-teal-400" />
                  {discipline}
                </li>
              ))}
            </ul>
          </div>
        </GlassPanel>
      </section>

      <JsonLd data={breadcrumb} />
    </div>
  );
}

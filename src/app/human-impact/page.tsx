import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { ImpactCard } from "@/components/ui/impact-card";
import { ResearchDisclaimer } from "@/components/ui/research-disclaimer";
import { GlassPanel } from "@/components/ui/glass-panel";
import { VesselDivider } from "@/components/ui/vessel-divider";
import {
  IconCommunityGlobe,
  IconDropletCell,
  IconInterlockingRepair,
  IconLayeredRenewal,
  IconOpenHeart,
  IconOpenKnowledge,
  IconPairedPersons,
  IconSeedlingGrowth,
  IconSupportedPerson,
} from "@/components/ui/vessel-icons";
import { impactGroups } from "@/content/impact";
import { createMetadata } from "@/lib/metadata";
import { disclaimers } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = createMetadata({
  title: "Human Impact",
  description:
    "The people and communities whose needs motivate Project Neorhiza — told with dignity, accuracy and carefully qualified hope.",
  path: "/human-impact",
});

const breadcrumb = breadcrumbJsonLd([{ name: "Human Impact", path: "/human-impact" }]);

const icons: Record<string, React.ReactNode> = {
  "liver-failure": <IconSupportedPerson />,
  "kidney-disease": <IconPairedPersons />,
  "heart-damage": <IconOpenHeart />,
  diabetes: <IconDropletCell />,
  burns: <IconLayeredRenewal />,
  "tissue-injuries": <IconInterlockingRepair />,
  children: <IconSeedlingGrowth />,
  communities: <IconCommunityGlobe />,
  "future-scientists": <IconOpenKnowledge />,
};

export default function HumanImpactPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-24 md:px-8">
      <section aria-labelledby="impact-page-heading" className="py-14 lg:py-20">
        <SectionHeading
          as="h1"
          eyebrow="Human impact"
          title="The Lives This Work May One Day Reach"
          lead="Project Neorhiza communicates about human need with dignity, accuracy and carefully qualified hope. Nothing on this page is a promise of treatment — it is an explanation of why disciplined foundational research is worth decades of effort."
        />
        <ResearchDisclaimer className="mt-8 max-w-3xl">
          {disclaimers.impact}
        </ResearchDisclaimer>
      </section>

      {/* The need */}
      <section aria-labelledby="need-areas" className="pb-16">
        <h2 id="need-areas" className="sr-only">
          Areas of human need
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {impactGroups.map((group) => (
            <ImpactCard
              key={group.slug}
              icon={icons[group.slug]}
              title={group.title}
              text={group.text}
            />
          ))}
        </ul>
      </section>

      <VesselDivider />

      {/* Context and capacity building */}
      <section aria-labelledby="context-heading" className="grid gap-4 py-16 lg:grid-cols-2">
        <GlassPanel className="p-7 md:p-10">
          <h2
            id="context-heading"
            className="text-2xl font-semibold tracking-[0.01em] text-teal-700 dark:text-teal-50"
          >
            The reality of organ shortages
          </h2>
          <div className="mt-5 space-y-4 leading-relaxed text-ink/90 dark:text-teal-50/90">
            <p>
              Transplantation is one of modern medicine&apos;s quiet
              miracles, and donated organs save lives every single day.
              Yet the World Health Organization has repeatedly emphasized
              that the gap between the need for organs and their
              availability is substantial — and that this gap falls
              hardest on communities with the least access to advanced
              care.
            </p>
            <p>
              Chronic organ failure asks patients to live within strict
              routines, recurring procedures and permanent uncertainty.
              Families absorb the emotional and financial weight of care.
              None of this is a criticism of existing medicine — it is the
              human context that makes long-term regenerative research a
              responsible use of scientific attention.
            </p>
            <p>
              Rather than quoting statistics this project has not yet
              curated with reliable sources, we point to the WHO&apos;s
              public materials on donation and transplantation for
              verified global data.
            </p>
          </div>
        </GlassPanel>

        <div className="grid content-start gap-4">
          <GlassPanel className="p-7 md:p-10">
            <h3 className="text-xl font-semibold tracking-[0.01em] text-teal-700 dark:text-teal-50">
              Scientific capacity-building
            </h3>
            <p className="mt-4 leading-relaxed text-slate-500 dark:text-mist-200">
              Advanced regenerative research is concentrated in a handful
              of regions. Building capacity elsewhere is not charity — it
              widens the talent pool attacking these problems and makes
              eventual benefits more equitably distributed. Project
              Neorhiza treats research education and inclusive
              participation as mission work, not outreach decoration.
            </p>
          </GlassPanel>
          <GlassPanel className="p-7 md:p-10">
            <h3 className="text-xl font-semibold tracking-[0.01em] text-teal-700 dark:text-teal-50">
              Research education
            </h3>
            <p className="mt-4 leading-relaxed text-slate-500 dark:text-mist-200">
              The Updates page publishes plain-language scientific
              education — what organoids are, what bioreactors do, why
              vascularization is hard — so that students, journalists and
              curious readers can engage with the field accurately. Honest
              public understanding is a precondition for honest public
              support.
            </p>
          </GlassPanel>
          <GlassPanel className="p-7 md:p-10">
            <h3 className="text-xl font-semibold tracking-[0.01em] text-teal-700 dark:text-teal-50">
              Participation by underrepresented communities
            </h3>
            <p className="mt-4 leading-relaxed text-slate-500 dark:text-mist-200">
              Scientific questions benefit from many perspectives. The
              collaboration framework explicitly welcomes scientists,
              engineers and institutions from regions underrepresented in
              regenerative medicine — including future scientific advisers,
              reviewing collaborators and research partners.
            </p>
          </GlassPanel>
        </div>
      </section>

      <JsonLd data={breadcrumb} />
    </div>
  );
}

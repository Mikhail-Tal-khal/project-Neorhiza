import { SectionHeading } from "@/components/ui/section-heading";
import { ImpactCard } from "@/components/ui/impact-card";
import { ResearchDisclaimer } from "@/components/ui/research-disclaimer";
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
import { disclaimers } from "@/lib/site";

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

/** Home-page human impact preview (full page: /human-impact). */
export function ImpactPreview() {
  return (
    <section
      aria-labelledby="impact-heading"
      className="py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Human impact"
          title="The Lives This Work May One Day Reach"
          lead="The mission is measured in people, not publications. These are the communities whose needs shape — and justify — the discipline of the work."
        />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {impactGroups.map((group) => (
            <ImpactCard
              key={group.slug}
              icon={icons[group.slug]}
              title={group.title}
              text={group.text}
            />
          ))}
        </ul>

        <ResearchDisclaimer className="mt-10 max-w-3xl">
          {disclaimers.impact}
        </ResearchDisclaimer>
      </div>
    </section>
  );
}

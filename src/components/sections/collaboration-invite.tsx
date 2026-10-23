import { SectionHeading } from "@/components/ui/section-heading";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { VesselDivider } from "@/components/ui/vessel-divider";

const audiences = [
  "Universities",
  "Stem-cell laboratories",
  "Research hospitals",
  "Tissue engineers",
  "Biomedical engineers",
  "Mechanical engineers",
  "Materials scientists",
  "Clinicians",
  "Bioreactor specialists",
  "Biostatisticians",
  "Bioethicists",
  "Regulatory specialists",
  "Intellectual-property advisers",
  "Biotechnology organizations",
];

/**
 * Collaboration invitation (section 11.9). Public documents are shared
 * directly; confidential material never is.
 */
export function CollaborationInvite() {
  return (
    <section
      aria-labelledby="collab-heading"
      className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8 md:py-28"
    >
      <SectionHeading
        eyebrow="Collaboration"
        title="A Mission This Complex Requires Collaboration"
        lead="Project Neorhiza invites engagement across disciplines and institutions. Inquiries follow a professional qualification process — public materials are shared freely, confidential material never automatically."
      />

      <ul className="mt-12 flex flex-wrap justify-center gap-2.5">
        {audiences.map((audience) => (
          <li
            key={audience}
            className="glass rounded-full px-4 py-2 text-sm text-teal-700 dark:text-mist-200"
          >
            {audience}
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <GlassButton href="/collaboration" size="lg">
          Discuss a Collaboration
        </GlassButton>
        <GlassButton href="/contact" variant="secondary" size="lg">
          Request the Public Research Overview
        </GlassButton>
      </div>

      <GlassPanel className="mx-auto mt-12 max-w-3xl p-6 md:p-8">
        <h3 className="label-caps mb-2">About the public research overview</h3>
        <p className="text-sm leading-relaxed text-muted">
          The public research overview summarizes the high-level scientific
          pathway, the proposed first program and the project&apos;s
          governance principles. It contains no confidential methodologies,
          parameters or unpublished results. Request it through the contact
          form and it will be sent to qualified professional inquirers.
        </p>
      </GlassPanel>

      <VesselDivider className="mt-20" flip />
    </section>
  );
}

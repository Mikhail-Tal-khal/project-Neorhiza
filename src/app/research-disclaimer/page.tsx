import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassPanel } from "@/components/ui/glass-panel";
import { createMetadata } from "@/lib/metadata";
import { disclaimers, site } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = createMetadata({
  title: "Research Disclaimer",
  description:
    "The full research disclaimer of Project Neorhiza: what this initiative is, what it is not, and the conditions that govern any future research activity.",
  path: "/research-disclaimer",
});

const statements = [
  {
    title: "Early-stage status",
    body: "Project Neorhiza is an early-stage research initiative in its Foundation Phase. It has not begun laboratory research, has no clinical program, and holds no institutional affiliation at the time of writing. Establishing qualified institutional supervision is the explicit goal of the current phase.",
  },
  {
    title: "No medical services",
    body: "Project Neorhiza does not currently provide medical advice, diagnostic services, stem-cell treatment, organ transplantation or clinical care. It does not accept patients and cannot respond to treatment requests. If you have a medical concern, please contact a licensed healthcare professional.",
  },
  {
    title: "Scientific communication only",
    body: "Information on this website is provided for education, scientific communication and research-development purposes. Content describing the scientific pathway is high-level by design; detailed methodologies, engineering parameters and experimental procedures remain confidential and are subject to institutional scientific review.",
  },
  {
    title: "No guaranteed outcomes",
    body: "Scientific progress is not guaranteed. Statements about the project's long-term vision describe objectives, not predictions. Negative or inconclusive results will be reported when appropriate, and the roadmap may change as evidence develops.",
  },
  {
    title: "Future activities require authorization",
    body: "Future experimental or clinical activities — if ever pursued — will require qualified institutional supervision and all applicable ethical, scientific and regulatory approvals. Project Neorhiza is not accredited, licensed or affiliated at the time of writing, and it does not claim to be.",
  },
  {
    title: "Community representation",
    body: "Communities described across this website represent the human need motivating the long-term research mission. They are not patient populations, and their mention does not imply any availability of treatment now or in the near term.",
  },
];

export default function ResearchDisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 md:px-8">
      <SectionHeading
        as="h1"
        eyebrow="Transparency"
        title="Research Disclaimer"
        lead="The full, current statement of what Project Neorhiza is, what it is not, and the conditions that govern any future research activity."
      />

      <GlassPanel className="mt-12 border-coral-300/40 p-6 md:p-8 dark:border-coral-500/20">
        <p className="text-pretty leading-relaxed text-ink dark:text-teal-50/90">
          {disclaimers.footer}
        </p>
      </GlassPanel>

      <div className="mt-6 grid gap-6">
        {statements.map((statement) => (
          <GlassPanel key={statement.title} className="p-6 md:p-8">
            <h2 className="text-xl font-semibold tracking-[0.01em] text-teal-700 dark:text-teal-50">
              {statement.title}
            </h2>
            <p className="mt-3 leading-relaxed text-ink/90 dark:text-teal-50/85">
              {statement.body}
            </p>
          </GlassPanel>
        ))}

        <p className="text-sm text-slate-500 dark:text-mist-200">
          This page is the authoritative version of the project&apos;s
          research disclaimer and takes precedence over summaries elsewhere
          on the site. Last updated: October 2026. {site.name}.
        </p>
      </div>
      <JsonLd data={breadcrumbJsonLd([{ name: "Research Disclaimer", path: "/research-disclaimer" }])} />
    </div>
  );
}

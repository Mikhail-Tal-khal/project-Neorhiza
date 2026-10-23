import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { PartnerCard } from "@/components/ui/partner-card";
import { ResearchDisclaimer } from "@/components/ui/research-disclaimer";
import { GlassButton } from "@/components/ui/glass-button";
import { OverviewRequestModal } from "@/components/ui/overview-request-modal";
import { collaborationPaths } from "@/content/collaboration";
import { createMetadata } from "@/lib/metadata";
import { disclaimers } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = createMetadata({
  title: "Collaboration",
  description:
    "Eight collaboration paths for universities, laboratories, hospitals, engineers, clinicians, ethicists, regulators and organizations — with clear boundaries around confidential information.",
  path: "/collaboration",
});

const breadcrumb = breadcrumbJsonLd([{ name: "Collaboration", path: "/collaboration" }]);

export default function CollaborationPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-24 md:px-8">
      <section aria-labelledby="collab-page-heading" className="py-16 lg:py-24">
        <SectionHeading
          as="h1"
          eyebrow="Collaboration"
          title="Build the Foundation With Us"
          lead="Project Neorhiza seeks disciplined, patient collaboration across science, medicine, engineering, ethics and governance. Choose the path that matches your role — each describes what is public, what is confidential and how to inquire."
        />
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <GlassButton href="/contact" size="lg">
            Discuss a Collaboration
          </GlassButton>
          <OverviewRequestModal />
        </div>
        <ResearchDisclaimer className="mx-auto mt-8 max-w-3xl">
          {disclaimers.confidentialProcess}
        </ResearchDisclaimer>
      </section>

      <h2 className="sr-only">Collaboration paths</h2>
      <div className="grid gap-6 lg:grid-cols-2">
        {collaborationPaths.map((path) => (
          <PartnerCard
            key={path.slug}
            title={path.title}
            why={path.why}
            seeking={[...path.seeking]}
            publicInfo={path.publicInfo}
            confidential={path.confidential}
            inquiry={path.inquiry}
          />
        ))}
      </div>

      {/* Inquiry process */}
      <section aria-labelledby="process-heading" className="mt-20">
        <SectionHeading
          eyebrow="How inquiries work"
          title="A Professional Qualification Process"
          lead="Every inquiry is reviewed by the project team. Here is what to expect."
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {[
            {
              step: "1",
              title: "Submit",
              text: "Complete the contact form with your professional role, organization and area of interest.",
            },
            {
              step: "2",
              title: "Qualification",
              text: "The team reviews the inquiry against the collaboration path and confirms professional context.",
            },
            {
              step: "3",
              title: "Discussion",
              text: "Qualified inquiries receive the public research overview and, where relevant, a meeting invitation.",
            },
            {
              step: "4",
              title: "Agreement",
              text: "Any confidential discussion proceeds under appropriate institutional agreements.",
            },
          ].map((item) => (
            <li
              key={item.step}
              className="glass relative rounded-2xl p-6"
            >
              <span
                aria-hidden="true"
                className="flex size-9 items-center justify-center rounded-full bg-teal-700 text-sm font-semibold text-white dark:bg-white/90 dark:text-teal-950"
              >
                {item.step}
              </span>
              <h3 className="mt-4 font-semibold tracking-[0.01em] text-heading">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <JsonLd data={breadcrumb} />
    </div>
  );
}

import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassPanel } from "@/components/ui/glass-panel";
import { ResearchDisclaimer } from "@/components/ui/research-disclaimer";
import { createMetadata } from "@/lib/metadata";
import { disclaimers, site } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = createMetadata({
  title: "Privacy",
  description:
    "How Project Neorhiza collects, uses and protects the minimal information submitted through this website.",
  path: "/privacy",
});

const sections = [
  {
    title: "What we collect",
    body: [
      "This website is designed around minimal data collection. We collect only the information you choose to submit through the contact form: your name, organization, professional role, country, professional email address, selected area of interest and your message. We also collect the consent declaration required to process your inquiry.",
      "We do not collect medical records, patient histories, genetic information or any sensitive health data, and we ask you not to submit such information through this website.",
    ],
  },
  {
    title: "How we use it",
    body: [
      "Information submitted through the contact form is used for one purpose only: reviewing and responding to your professional inquiry in line with the collaboration framework described on the Collaboration page. Qualified inquiries may receive the public research overview or an invitation to a meeting.",
      "We do not sell, rent or share your information for marketing purposes, and we do not use it to send newsletters or promotional material.",
    ],
  },
  {
    title: "How it is protected",
    body: [
      "Submissions are transmitted over encrypted connections and processed server-side with validation, sanitization and rate limiting. Access to submitted inquiries is limited to the project team responsible for responding. Inquiries are forwarded to the project team over encrypted channels, either by email through a transactional email provider or to a secured webhook, which process the message only to deliver it.",
      "To prevent abuse, the server briefly uses the IP address of the connection to limit how many inquiries can be sent in a short period. It is held only in a short-lived counter that expires automatically and is never stored with your inquiry.",
      "No payment processing, donation handling or financial data collection exists anywhere on this website.",
    ],
  },
  {
    title: "Analytics and tracking",
    body: [
      "This website carries no advertising trackers and no cross-site behavioral profiling. If privacy-respecting, aggregate usage statistics are enabled in the future, they will be described here before activation.",
    ],
  },
  {
    title: "Retention and your rights",
    body: [
      "Inquiry correspondence is retained only as long as needed to handle the professional relationship it concerns, after which it is deleted or anonymized. You may request access to, correction of or deletion of the information you submitted by writing to the contact address published on this site.",
      "Because this is an early-stage initiative without institutional affiliation, a formal data-protection officer has not yet been designated; establishing appropriate data governance under the future institutional home is part of the Foundation Phase.",
    ],
  },
  {
    title: "Children",
    body: [
      "This website is intended for professional audiences and is not directed at children. We do not knowingly collect information from children.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 md:px-8">
      <SectionHeading
        as="h1"
        eyebrow="Privacy"
        title="Privacy Policy"
        lead="Minimal collection, professional use, honest explanation. Last updated: October 2026."
      />

      <div className="mt-12 grid gap-6">
        {sections.map((section) => (
          <GlassPanel key={section.title} className="p-6 md:p-8">
            <h2 className="text-xl font-semibold tracking-[0.01em] text-heading">
              {section.title}
            </h2>
            <div className="mt-3 space-y-4">
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="leading-relaxed text-ink/90"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </GlassPanel>
        ))}

        <ResearchDisclaimer>
          {disclaimers.footer}
        </ResearchDisclaimer>

        <p className="text-sm text-muted">
          Questions about this policy may be directed through the{" "}
          <a
            href="/contact"
            className="font-medium text-teal-700 underline underline-offset-4 dark:text-teal-200"
          >
            contact form
          </a>{" "}
          selecting “General inquiry”. {site.name}.
        </p>
      </div>
      <JsonLd data={breadcrumbJsonLd([{ name: "Privacy", path: "/privacy" }])} />
    </div>
  );
}

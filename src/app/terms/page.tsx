import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassPanel } from "@/components/ui/glass-panel";
import { ResearchDisclaimer } from "@/components/ui/research-disclaimer";
import { createMetadata } from "@/lib/metadata";
import { disclaimers, site } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = createMetadata({
  title: "Terms",
  description:
    "Terms of use for the Project Neorhiza website — educational and scientific communication only, with no medical services of any kind.",
  path: "/terms",
});

const sections = [
  {
    title: "Purpose of this website",
    body: [
      "This website communicates the vision, scientific pathway and governance principles of Project Neorhiza, an early-stage research initiative. Its content is provided for education, scientific communication and research-development purposes.",
      "Nothing on this website constitutes medical advice, diagnosis or treatment guidance, and nothing on it creates a professional relationship of any kind.",
    ],
  },
  {
    title: "No medical services",
    body: [
      "Project Neorhiza does not provide medical treatments, stem-cell therapies, diagnostic services, organ transplantation or clinical care, and does not accept patients. If you have a medical concern, please contact a licensed healthcare professional.",
    ],
  },
  {
    title: "Intellectual property and confidentiality",
    body: [
      "The Neorhiza name, mark and website content are the property of the project unless otherwise stated. Detailed methodologies, engineering parameters and potentially protectable technical information are deliberately withheld from public materials and remain confidential.",
      "Materials identified as publicly shareable — such as the public research overview — may be shared for professional purposes with attribution. They may not be republished in modified form in a way that misrepresents the project's statements.",
    ],
  },
  {
    title: "Acceptable use",
    body: [
      "You agree not to misuse this website, including attempting to disrupt its operation, submitting false information through its forms, or using automated systems to spam or probe its services. Inquiry submissions are rate-limited and validated; abusive traffic may be blocked.",
    ],
  },
  {
    title: "No warranties",
    body: [
      "The website is provided on an \"as available\" basis without warranties of uninterrupted availability. Scientific content is presented in good faith and reviewed for accuracy at publication, but the science of tissue engineering evolves, and statements about open research questions describe the field as understood at the time of writing.",
    ],
  },
  {
    title: "Limitation of liability",
    body: [
      "To the maximum extent permitted by applicable law, the project is not liable for decisions made in reliance on the general educational content of this website. Professional, medical, scientific or regulatory decisions belong with qualified professionals and institutions.",
    ],
  },
  {
    title: "Changes",
    body: [
      "These terms may be updated as the project develops. The \"last updated\" date at the top of this page reflects the current version.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 md:px-8">
      <SectionHeading
        as="h1"
        eyebrow="Terms"
        title="Terms of Use"
        lead="Plain-language terms for using this website. Last updated: October 2026."
      />

      <div className="mt-12 grid gap-6">
        {sections.map((section) => (
          <GlassPanel key={section.title} className="p-6 md:p-8">
            <h2 className="text-xl font-semibold tracking-[0.01em] text-teal-700 dark:text-teal-50">
              {section.title}
            </h2>
            <div className="mt-3 space-y-4">
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="leading-relaxed text-ink/90 dark:text-teal-50/85"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </GlassPanel>
        ))}

        <ResearchDisclaimer>{disclaimers.footer}</ResearchDisclaimer>

        <p className="text-sm text-slate-500 dark:text-mist-200">
          {site.name} — {site.descriptor}.
        </p>
      </div>
      <JsonLd data={breadcrumbJsonLd([{ name: "Terms", path: "/terms" }])} />
    </div>
  );
}

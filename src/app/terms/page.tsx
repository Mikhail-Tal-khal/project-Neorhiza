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
    "Terms of use for the Project Neorhiza website — who operates it, acceptable use, intellectual property, and why it offers no medical services or patient enrollment, and how online contributions work.",
  path: "/terms",
});

const EFFECTIVE = "9 November 2026";
const REVISED = "12 November 2026";

// LEGAL REVIEW: the governing-law, liability and contribution/refund sections
// are a plain-language draft. Have them reviewed by a Kenyan advocate before
// accepting live contributions, paid advertising, fundraising or international
// campaigns, and add the operating company's legal name
// (docs/production-launch-checklist.md, section 2a).
const sections = [
  {
    title: "Who operates this website",
    body: [
      `This website is operated by ${site.name}, an early-stage research initiative based in Kenya and founded by Rereu Lemein. It operates through a registered limited company. It is not yet institutionally affiliated and has no laboratory or clinical operations. Nothing on this website claims that the project is a registered charity, tax-exempt or licensed.`,
      `Contact: ${site.contactEmail}.`,
    ],
  },
  {
    title: "Purpose of this website",
    body: [
      "This website communicates the vision, scientific pathway and governance principles of the project. Its content is provided for education, scientific communication and research-development purposes.",
      "Nothing on this website constitutes medical advice, diagnosis or treatment guidance, and nothing on it creates a professional, clinical or contractual relationship of any kind.",
    ],
  },
  {
    title: "No medical services or patient enrollment",
    body: [
      `${site.name} does not provide medical treatments, stem-cell therapies, diagnostic services, organ transplantation or clinical care, does not enroll patients and does not accept patients. If you have a medical concern, please contact a licensed healthcare professional.`,
    ],
  },
  {
    title: "Online contributions",
    body: [
      "You can make a voluntary one-time contribution through the contribution form on the Funding page, which takes you to a checkout page hosted by Stripe. This is the only online payment channel for Project Neorhiza. Anyone asking you to pay or donate in the name of Project Neorhiza through another channel is not acting for the project — please report it to us. Institutional or conditional support is agreed separately, in writing, through a funding conversation.",
      disclaimers.contributions,
      "A contribution is a gift toward early-stage work. It does not purchase goods or services, and it gives no right to research results, influence over scientific conclusions, ethical review or project decisions, or any return. Project Neorhiza makes no promise of medical outcomes, treatments or guaranteed research results.",
    ],
  },
  {
    title: "Payments, refunds and records",
    body: [
      "Payments are processed by Stripe. Card details are entered on Stripe’s checkout page; Project Neorhiza does not directly receive or store full card details. Your use of Stripe’s checkout is also subject to Stripe’s own terms and privacy policy.",
      `Refund requests are reviewed according to applicable law and Stripe transaction records. To request a refund or report a payment you do not recognize, write to ${site.contactEmail} with the payment reference shown on your confirmation page or Stripe receipt.`,
      "Contribution records may be retained for accounting, legal and fraud-prevention purposes, as described in the Privacy Policy.",
    ],
  },
  {
    title: "Acceptable use",
    body: [
      "You may use this website for lawful, personal or professional purposes. You agree not to: submit false, misleading or impersonating information; send spam, bulk or automated submissions through the contact or contribution forms; make or attempt fraudulent or unauthorized payments; attempt to gain unauthorized access, probe for vulnerabilities outside responsible disclosure, or disrupt the website or its providers; scrape the site in a way that degrades it for others; or use the site to send unlawful, abusive or harassing content.",
      "Submissions and checkout requests are validated and rate-limited, and requests from other websites are refused. We may block traffic or ignore inquiries that breach these terms. Security issues should be reported as described in our security policy (/.well-known/security.txt).",
    ],
  },
  {
    title: "Intellectual property",
    body: [
      "The Neorhiza name, logo, mark, text, graphics and website design belong to the project unless otherwise stated, and are protected by applicable intellectual-property laws. You may link to this website and quote short passages with attribution. You may not reproduce the logo or present the project's material in a way that suggests endorsement, affiliation or claims the project has not made.",
      "Materials identified as publicly shareable — such as the public research overview — may be shared for professional purposes with attribution, but not republished in modified form that misrepresents the project's statements.",
    ],
  },
  {
    title: "Confidentiality",
    body: [
      "Detailed methodologies, engineering parameters and potentially protectable technical information are deliberately withheld from public materials. They are discussed only with qualified institutional collaborators under appropriate written agreements. Please do not send confidential or unpublished material through the contact form; nothing you send creates a confidentiality obligation unless agreed in writing.",
    ],
  },
  {
    title: "No warranties",
    body: [
      "The website is provided on an \"as is\" and \"as available\" basis without warranties of uninterrupted availability or fitness for a particular purpose. Scientific content is presented in good faith and reviewed for accuracy at publication, but the science of tissue engineering evolves, and statements about open research questions describe the field as understood at the time of writing.",
    ],
  },
  {
    title: "Limitation of liability",
    body: [
      "To the maximum extent permitted by applicable law, the project is not liable for decisions made in reliance on the general educational content of this website. Professional, medical, scientific or regulatory decisions belong with qualified professionals and institutions. Nothing in these terms limits liability that cannot be limited by law.",
    ],
  },
  {
    title: "Governing law and jurisdiction",
    body: [
      "These terms are governed by the laws of the Republic of Kenya. Any dispute arising from them or from use of this website is subject to the jurisdiction of the courts of Kenya, without prejudice to any mandatory consumer protections that apply where you live.",
    ],
  },
  {
    title: "Changes to these terms",
    body: [
      `These terms took effect on ${EFFECTIVE} and were last revised on ${REVISED}. They may be updated as the project develops; the revision date on this page always reflects the current version.`,
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
        lead={`Plain-language terms for using this website. Effective ${EFFECTIVE} · Last revised ${REVISED}.`}
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

        <ResearchDisclaimer>{disclaimers.footer}</ResearchDisclaimer>

        <p className="text-sm text-muted">
          {site.name} — {site.descriptor}.
        </p>
      </div>
      <JsonLd data={breadcrumbJsonLd([{ name: "Terms", path: "/terms" }])} />
    </div>
  );
}

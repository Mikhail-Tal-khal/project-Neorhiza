import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard, GlassPanel } from "@/components/ui/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ResearchDisclaimer } from "@/components/ui/research-disclaimer";
import { createMetadata } from "@/lib/metadata";
import { company, disclaimers, site } from "@/lib/site";
import { fundingPriorities } from "@/content/organization";
import { ProjectStatus } from "@/components/sections/project-status";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";
import { connection } from "next/server";
import { DonationSection } from "@/components/sections/donation-section";
import { donationSettings, isDonationConfigured } from "@/lib/donations/config";

const title = "Help Establish the Scientific Foundation for Neorhiza";
const description =
  "Research funding and sponsorship for Project Neorhiza, operated by Lyshub Limited, Kenya: funding priorities, who receives contributions, legal and financial disclosures, and secure one-time contributions.";

export const metadata: Metadata = createMetadata({ title: "Funding", description, path: "/funding" });

/** Secondary routes for organizations; individuals contribute directly on this page. */
const PARTNERSHIP_CONTACT = "/contact?interest=institutional#inquiry-form";
const SPONSORSHIP_CONTACT = "/contact?interest=sponsorship#inquiry-form";

const breadcrumb = breadcrumbJsonLd([{ name: "Funding", path: "/funding" }]);

const webPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${site.url}/funding#webpage`,
  url: `${site.url}/funding`,
  name: `${title} — ${site.shortName}`,
  description,
  inLanguage: "en",
  isPartOf: { "@id": `${site.url}/#website` },
  about: { "@id": `${site.url}/#organization` },
};

/** Approved introduction (corporate identity brief, section 4). */
const intro = [
  "Meaningful advances in tissue engineering require qualified scientists, appropriate research facilities, institutional partnerships and sustained scientific investigation.",
  "Neorhiza is seeking research funding and professional sponsorship to establish the foundation necessary for its first supervised research programme.",
  "Through Lyshub Limited, funding will support the recruitment and engagement of qualified researchers, institutional collaboration, scientific feasibility development and the infrastructure required to progress responsibly.",
];

const audiences = [
  {
    title: "Research funders",
    text: "Programmes supporting early-stage regenerative-medicine or biomedical-engineering groundwork, governance or feasibility planning.",
  },
  {
    title: "Institutions",
    text: "Universities, research institutes and hospitals considering in-kind support, hosting or supervisory arrangements.",
  },
  {
    title: "Foundations",
    text: "Foundations interested in responsible, transparent early-stage science and the capacity-building that precedes it.",
  },
  {
    title: "Research sponsors",
    text: "Organizations and professionals willing to sponsor foundational work on terms that respect scientific independence and ethical oversight.",
  },
];

const steps = [
  {
    title: "Get in touch",
    text: "Submit a professional inquiry describing your organization and the kind of sponsorship or partnership you have in mind.",
  },
  {
    title: "Review",
    text: "The project team reviews the inquiry and aims to respond to qualified inquiries within ten working days.",
  },
  {
    title: "Discussion",
    text: "Qualified funders receive the public research overview and, where relevant, a meeting to discuss scope and conditions.",
  },
  {
    title: "Formal terms",
    text: `Any sponsorship or partnership is agreed in writing with ${company.name}, through appropriate legal and institutional arrangements — never through this website.`,
  },
];

const commitments = [
  "We do not publish funding targets or allocations until a realistic budget has been developed and approved.",
  "We do not publish donor numbers, fundraising progress or testimonials we cannot substantiate.",
  "We make no medical promises and claim no guaranteed outcomes.",
  "We do not claim charitable, public-benefit, tax-exempt or tax-deductible status.",
  "Research support carries no shares, ownership, repayment rights or financial returns.",
  "Support never buys influence over scientific conclusions or ethical review.",
  "Periodic reports will separate planned expenditure from money actually spent.",
];

const linkClass = "font-medium text-teal-700 underline underline-offset-4 dark:text-teal-200";

export default async function FundingPage() {
  // Rendered per request so the contribution form reflects the live
  // Stripe configuration (keys can be added without a code change).
  await connection();
  const settings = donationSettings();
  const donationsOpen = isDonationConfigured();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-24 md:px-8">
      <section aria-labelledby="funding-heading" className="py-16 lg:py-24">
        <SectionHeading as="h1" id="funding-heading" eyebrow="Funding" title={title} />
        <div className="mx-auto mt-6 max-w-3xl space-y-4 text-center">
          {intro.map((paragraph) => (
            <p key={paragraph} className="text-pretty text-lg leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <StatusBadge>Foundation Phase</StatusBadge>
          <StatusBadge>Operated by {company.name}</StatusBadge>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <GlassButton
            href="#donate"
            size="lg"
            analytics={{ event: "donation_cta_clicked", location: "funding-hero" }}
          >
            Contribute Now
          </GlassButton>
          <GlassButton
            href={SPONSORSHIP_CONTACT}
            variant="secondary"
            size="lg"
            analytics={{ event: "partnership_inquiry_started", location: "funding-hero" }}
          >
            Research Sponsorship Inquiry
          </GlassButton>
        </div>
        <p className="mt-5 text-center text-sm text-muted">
          Please read the{" "}
          <Link href="#disclosure" className={linkClass}>
            legal and financial disclosure
          </Link>{" "}
          before contributing.
        </p>
      </section>

      <DonationSection settings={settings} enabled={donationsOpen} />

      {/* Funding priorities — intended uses, never allocations */}
      <section id="priorities" aria-labelledby="priorities-heading" className="scroll-mt-28 pb-16">
        <SectionHeading
          id="priorities-heading"
          eyebrow="Funding priorities"
          title="What Research Funding Will Support"
          lead={`The primary objective is to establish and operationalize the Neorhiza research programme under ${company.name}. These are intended uses, not a budget: allocations and targets will be published only after a realistic budget has been developed and approved.`}
        />
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fundingPriorities.map((item, i) => (
            <GlassCard as="li" key={item.title}>
              <span
                aria-hidden="true"
                className="flex size-8 items-center justify-center rounded-full bg-tint text-sm font-semibold text-heading"
              >
                {i + 1}
              </span>
              <h3 className="mt-4 font-semibold tracking-[0.01em] text-heading">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </GlassCard>
          ))}
        </ol>
      </section>

      {/* Legal and financial disclosure */}
      <section id="disclosure" aria-labelledby="disclosure-heading" className="scroll-mt-28 py-10">
        <GlassPanel tone="strong" className="mx-auto max-w-4xl p-7 md:p-10">
          <p className="label-caps mb-3">Legal and financial disclosure</p>
          <h2
            id="disclosure-heading"
            className="text-2xl font-semibold tracking-[0.01em] text-heading md:text-3xl"
          >
            Who Receives Contributions, and What They Are
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-ink">
            {disclaimers.contributionTerms.map((paragraph) => (
              <p key={paragraph} className="text-pretty">
                {paragraph}
              </p>
            ))}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            How funds will be reported is set out under{" "}
            <Link href="/governance" className={linkClass}>
              Governance &amp; Transparency
            </Link>
            . Questions about a contribution can be raised through the contact form or with the official
            business contact,{" "}
            <a href={`tel:${company.phoneE164}`} className={linkClass}>
              {company.phone}
            </a>
            .
          </p>
        </GlassPanel>
      </section>

      <ProjectStatus
        headingId="status-heading"
        eyebrow="Transparency"
        extra={[
          {
            label: "Online contributions",
            value: donationsOpen
              ? "Open. One-time contributions are processed securely by Stripe. Sponsorship and partnerships are agreed separately, in writing."
              : "Being prepared. Secure online contributions will open once payment processing is fully configured.",
          },
        ]}
      />

      {/* Who we want to hear from */}
      <section aria-labelledby="audiences-heading" className="py-16">
        <SectionHeading
          id="audiences-heading"
          eyebrow="Research sponsorship"
          title="Funders and Sponsors We Want to Hear From"
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((item) => (
            <GlassCard as="li" key={item.title}>
              <h3 className="font-semibold tracking-[0.01em] text-heading">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
            </GlassCard>
          ))}
        </ul>
      </section>

      {/* Process */}
      <section aria-labelledby="funding-process-heading" className="py-10">
        <SectionHeading
          id="funding-process-heading"
          eyebrow="How it works"
          title="How Sponsorship and Partnerships Proceed"
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {steps.map((item, i) => (
            <li key={item.title} className="glass relative rounded-2xl p-6">
              <span
                aria-hidden="true"
                className="flex size-9 items-center justify-center rounded-full bg-teal-700 text-sm font-semibold text-white dark:bg-white/90 dark:text-teal-950"
              >
                {i + 1}
              </span>
              <h3 className="mt-4 font-semibold tracking-[0.01em] text-heading">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Commitments + CTA */}
      <section aria-labelledby="commitments-heading" className="py-16">
        <GlassPanel className="mx-auto max-w-4xl p-7 md:p-10">
          <h2 id="commitments-heading" className="text-2xl font-semibold tracking-[0.01em] text-heading md:text-3xl">
            Our Commitments to Supporters
          </h2>
          <ul className="mt-6 grid gap-3">
            {commitments.map((item) => (
              <li key={item} className="flex items-start gap-3 leading-relaxed text-ink">
                <span aria-hidden="true" className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-coral-500" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <GlassButton
              href="#donate"
              size="lg"
              analytics={{ event: "donation_cta_clicked", location: "funding-commitments" }}
            >
              Contribute Now
            </GlassButton>
            <GlassButton
              href={PARTNERSHIP_CONTACT}
              variant="secondary"
              size="lg"
              analytics={{ event: "partnership_inquiry_started", location: "funding-commitments" }}
            >
              Institutional Partnership Inquiry
            </GlassButton>
          </div>
          <ResearchDisclaimer className="mt-8">{disclaimers.services}</ResearchDisclaimer>
        </GlassPanel>
      </section>

      <JsonLd data={breadcrumb} />
      <JsonLd data={webPage} />
    </div>
  );
}

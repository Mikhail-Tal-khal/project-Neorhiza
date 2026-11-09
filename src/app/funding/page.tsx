import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard, GlassPanel } from "@/components/ui/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ResearchDisclaimer } from "@/components/ui/research-disclaimer";
import { createMetadata } from "@/lib/metadata";
import { disclaimers, site } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";

const title = "Funding the Foundation Phase";
const description =
  "How research funders, institutions, foundations and responsible sponsors can support Project Neorhiza's Foundation Phase — governance, evidence review, scientific advising and institutional partnerships. No donations are processed online.";

export const metadata: Metadata = createMetadata({ title, description, path: "/funding" });

const FUNDING_CONTACT = "/contact?interest=funding#inquiry-form";

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

/** Where the project stands today — every line is a current fact, not a goal. */
const currentStatus = [
  {
    label: "Development phase",
    text: "Foundation Phase: evidence review, scientific advising, partnership building and project governance.",
  },
  {
    label: "Laboratory research",
    text: "Not begun. No laboratory work will start without qualified institutional supervision, ethics review and appropriate agreements.",
  },
  {
    label: "Institutional affiliation",
    text: "Not yet established. Securing qualified institutional supervision is an explicit goal of this phase.",
  },
  {
    label: "Clinical activity",
    text: "None. The project offers no treatment, diagnosis or patient enrollment.",
  },
  {
    label: "Online donations",
    text: "Not accepted. This website does not process donations or payments of any kind.",
  },
];

/** What Foundation-Phase support is for. No amounts are published. */
const supportAreas = [
  {
    title: "Governance",
    text: "Establishing the ethics, oversight and decision-making structures a responsible research initiative needs before any experimental work is considered.",
  },
  {
    title: "Evidence review",
    text: "Systematic review of the published tissue-engineering literature to define what is established, what remains experimental and where a focused feasibility question could add value.",
  },
  {
    title: "Scientific advising",
    text: "Engaging qualified scientists, clinicians and engineers to scrutinize the project's direction — including telling us where it is wrong.",
  },
  {
    title: "Institutional partnership building",
    text: "Identifying and agreeing terms with an institution able to supervise future research under its own ethics, safety and regulatory frameworks.",
  },
];

const audiences = [
  {
    title: "Research funders",
    text: "Programs supporting early-stage regenerative-medicine or biomedical-engineering groundwork, governance or feasibility planning.",
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
    title: "Responsible sponsors",
    text: "Organizations willing to support foundational work on terms that respect scientific independence and ethical oversight.",
  },
];

const steps = [
  {
    title: "Start a conversation",
    text: "Submit a professional inquiry and select “Funding and foundation support”, with your organization and the kind of support you have in mind.",
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
    text: "Any support is agreed in writing, through appropriate legal and institutional arrangements — never through this website.",
  },
];

const commitments = [
  "We do not publish funding targets or amounts we cannot justify yet.",
  "We make no medical promises and claim no guaranteed outcomes.",
  "We do not claim charitable, tax-exempt or tax-deductible status.",
  "Support never buys influence over scientific conclusions or ethical review.",
  "Progress, limitations and setbacks will be reported honestly on the Updates page.",
];

export default function FundingPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-24 md:px-8">
      <section aria-labelledby="funding-heading" className="py-16 lg:py-24">
        <SectionHeading
          as="h1"
          id="funding-heading"
          eyebrow="Funding"
          title="Support the Foundation Phase"
          lead="Project Neorhiza is seeking research funders, institutions, foundations and responsible sponsors to support the governance, evidence and partnership work that must come before any laboratory research."
        />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <StatusBadge>Early-Stage Research Initiative</StatusBadge>
          <StatusBadge>Foundation Phase</StatusBadge>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <GlassButton
            href={FUNDING_CONTACT}
            size="lg"
            analytics={{ event: "funding_inquiry_started", location: "funding-hero" }}
          >
            Start a Funding Conversation
          </GlassButton>
          <GlassButton href="/roadmap" variant="secondary" size="lg">
            View the Research Roadmap
          </GlassButton>
        </div>
        <ResearchDisclaimer className="mx-auto mt-8 max-w-3xl" title="Donations notice">
          {disclaimers.noDonations}
        </ResearchDisclaimer>
      </section>

      {/* Current status */}
      <section aria-labelledby="status-heading" className="py-10">
        <SectionHeading
          id="status-heading"
          eyebrow="Transparency"
          title="Current Status"
          lead="Where the project stands today. These are present facts, not plans."
        />
        <GlassPanel className="mx-auto mt-12 max-w-4xl overflow-hidden p-0">
          <dl className="divide-y divide-border">
            {currentStatus.map((item) => (
              <div key={item.label} className="grid gap-1 p-5 sm:grid-cols-[13rem_1fr] sm:gap-6 md:p-6">
                <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-heading">
                  {item.label}
                </dt>
                <dd className="text-[0.95rem] leading-relaxed text-ink">{item.text}</dd>
              </div>
            ))}
          </dl>
        </GlassPanel>
      </section>

      {/* What support enables */}
      <section aria-labelledby="enables-heading" className="py-16">
        <SectionHeading
          id="enables-heading"
          eyebrow="Use of support"
          title="What Support Enables"
          lead="Foundation-Phase support funds groundwork, not experiments. It builds the structures that make future research legitimate."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {supportAreas.map((area) => (
            <GlassCard as="li" key={area.title}>
              <h3 className="flex items-center gap-2.5 font-semibold tracking-[0.01em] text-heading">
                <span aria-hidden="true" className="size-2 rounded-full bg-coral-500" />
                {area.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{area.text}</p>
            </GlassCard>
          ))}
        </ul>
      </section>

      {/* Who we want to hear from */}
      <section aria-labelledby="audiences-heading" className="py-10">
        <SectionHeading
          id="audiences-heading"
          eyebrow="Who this is for"
          title="Funders and Partners We Want to Hear From"
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
      <section aria-labelledby="funding-process-heading" className="py-16">
        <SectionHeading
          id="funding-process-heading"
          eyebrow="How it works"
          title="How a Funding Conversation Proceeds"
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
      <section aria-labelledby="commitments-heading" className="py-10">
        <GlassPanel className="mx-auto max-w-4xl p-7 md:p-10">
          <h2 id="commitments-heading" className="text-2xl font-semibold tracking-[0.01em] text-heading md:text-3xl">
            Our Commitments to Funders
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
              href={FUNDING_CONTACT}
              size="lg"
              analytics={{ event: "funding_inquiry_started", location: "funding-commitments" }}
            >
              Start a Funding Conversation
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

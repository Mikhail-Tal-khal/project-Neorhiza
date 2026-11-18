import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard, GlassPanel } from "@/components/ui/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ResearchDisclaimer } from "@/components/ui/research-disclaimer";
import { ProjectStatus } from "@/components/sections/project-status";
import {
  companyParticulars,
  governanceStructure,
  notYetEstablished,
  reportingItems,
} from "@/content/organization";
import { createMetadata } from "@/lib/metadata";
import { company, disclaimers, site } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = createMetadata({
  title: "Governance & Transparency",
  description:
    "How Project Neorhiza is governed: operated by Lyshub Limited, Kenya, with founder-led oversight, required scientific supervision and approvals, a public financial reporting commitment and its current status.",
  path: "/governance",
});

const breadcrumb = breadcrumbJsonLd([{ name: "Governance & Transparency", path: "/governance" }]);

const linkClass = "font-medium text-teal-700 underline underline-offset-4 dark:text-teal-200";

export default function GovernancePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-24 md:px-8">
      <section aria-labelledby="governance-heading" className="py-16 lg:py-24">
        <SectionHeading
          as="h1"
          id="governance-heading"
          eyebrow="Governance & Transparency"
          title="How Neorhiza Is Governed and Held to Account"
          lead={`${company.operatorStatement} This page sets out who is responsible for what, which approvals research will require, and how the project will report on money and progress.`}
        />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <StatusBadge>Founder-Led</StatusBadge>
          <StatusBadge>Foundation Phase</StatusBadge>
        </div>
      </section>

      {/* Structure */}
      <section aria-labelledby="structure-heading" className="pb-16">
        <SectionHeading
          id="structure-heading"
          eyebrow="Structure"
          title="Organization and Oversight"
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {governanceStructure.map((item) => (
            <GlassCard as="li" key={item.title}>
              <h3 className="flex items-center gap-2.5 font-semibold tracking-[0.01em] text-heading">
                <span aria-hidden="true" className="size-2 rounded-full bg-coral-500" />
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
            </GlassCard>
          ))}
        </ul>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <GlassPanel className="overflow-hidden p-0">
            <h3 className="label-caps px-6 pt-6">Operating company</h3>
            <dl className="mt-3 divide-y divide-border">
              {companyParticulars.map((item) => (
                <div key={item.label} className="grid gap-1 px-6 py-4 sm:grid-cols-[12rem_1fr] sm:gap-4">
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-heading">
                    {item.label}
                  </dt>
                  <dd className={item.confirmed ? "text-[0.95rem] font-medium text-ink" : "text-[0.95rem] italic text-muted"}>
                    {item.label === "Official business contact" ? (
                      <a href={`tel:${company.phoneE164}`} className={linkClass}>
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="px-6 pb-6 pt-2 text-xs leading-relaxed text-muted">
              Particulars marked “pending publication” will be added once
              verified. {company.name} is not represented as a charity, public
              benefit organization or tax-exempt body.
            </p>
          </GlassPanel>

          <GlassPanel className="p-6 md:p-8">
            <h3 className="label-caps mb-3">Not yet established</h3>
            <p className="text-sm leading-relaxed text-muted">
              The following do not exist yet. The project will not claim them
              until they do:
            </p>
            <ul className="mt-4 grid gap-3">
              {notYetEstablished.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-ink">
                  <span
                    aria-hidden="true"
                    className="mt-[0.5rem] flex size-4 shrink-0 items-center justify-center rounded-full bg-coral-100 text-[0.6rem] font-bold leading-none text-coral-700 dark:bg-coral-500/15 dark:text-coral-300"
                  >
                    ✕
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </GlassPanel>
        </div>
      </section>

      <ProjectStatus />

      {/* Financial reporting */}
      <section aria-labelledby="reporting-heading" className="py-16">
        <SectionHeading
          id="reporting-heading"
          eyebrow="Accountability"
          title="Financial Reporting Commitment"
          lead="Neorhiza will publish periodic reports on the money it receives and how it is used, alongside research-development progress."
        />
        <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <GlassPanel className="p-7 md:p-10">
            <h3 className="text-xl font-semibold tracking-[0.01em] text-heading">Each report will cover</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {reportingItems.map((item) => (
                <li key={item} className="flex items-start gap-3 leading-relaxed text-ink">
                  <span aria-hidden="true" className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-coral-500" />
                  {item}
                </li>
              ))}
            </ul>
          </GlassPanel>
          <div className="grid gap-4">
            <GlassCard>
              <h3 className="font-semibold tracking-[0.01em] text-heading">Planned versus spent</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Reports will keep planned expenditure clearly separate from
                money actually spent. A funding priority listed on the{" "}
                <Link href="/funding#priorities" className={linkClass}>
                  Funding
                </Link>{" "}
                page describes an intended use, not an expense that has
                occurred.
              </p>
            </GlassCard>
            <GlassCard>
              <h3 className="font-semibold tracking-[0.01em] text-heading">Reports published so far</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                None yet. The first report, and the reporting schedule, will
                be published on the{" "}
                <Link href="/updates" className={linkClass}>
                  Updates
                </Link>{" "}
                page. Reports are prepared by the project; independent
                financial review has not yet been arranged.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section aria-labelledby="questions-heading" className="py-10">
        <GlassPanel className="mx-auto max-w-4xl p-7 md:p-10">
          <h2 id="questions-heading" className="text-2xl font-semibold tracking-[0.01em] text-heading md:text-3xl">
            Questions About Governance
          </h2>
          <p className="mt-4 leading-relaxed text-ink">
            Questions about how {site.name} is governed or funded can be sent
            through the contact form, or to the official business contact,{" "}
            <a href={`tel:${company.phoneE164}`} className={linkClass}>
              {company.phone}
            </a>
            .
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <GlassButton href="/contact?interest=general#inquiry-form">Ask a Question</GlassButton>
            <GlassButton href="/leadership" variant="secondary">
              Leadership
            </GlassButton>
          </div>
          <ResearchDisclaimer className="mt-8">{disclaimers.services}</ResearchDisclaimer>
        </GlassPanel>
      </section>

      <JsonLd data={breadcrumb} />
    </div>
  );
}

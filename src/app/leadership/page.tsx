import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard, GlassPanel } from "@/components/ui/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { FounderProfile } from "@/components/sections/founder-profile";
import { founderResponsibilities } from "@/content/organization";
import { createMetadata } from "@/lib/metadata";
import { company, site } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = createMetadata({
  title: "Leadership",
  description:
    "Project Neorhiza is founder-led. The Founder provides overall project oversight while the initiative builds its independent scientific and institutional network.",
  path: "/leadership",
});

const breadcrumb = breadcrumbJsonLd([{ name: "Leadership", path: "/leadership" }]);

export default function LeadershipPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-24 md:px-8">
      <section aria-labelledby="leadership-heading" className="py-16 lg:py-24">
        <SectionHeading
          as="h1"
          id="leadership-heading"
          eyebrow="Leadership"
          title="Founder and Leadership"
          lead={`${site.name} is a founder-led initiative operated by ${company.name}. The Founder provides overall project oversight while Neorhiza develops its independent scientific and institutional network.`}
        />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <StatusBadge>Founder-Led</StatusBadge>
          <StatusBadge>Foundation Phase</StatusBadge>
        </div>
      </section>

      {/* Governance model and responsibilities */}
      <section aria-labelledby="role-heading" className="pb-16">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <GlassPanel className="p-7 md:p-10">
            <h2 id="role-heading" className="label-caps mb-3">
              Founder, {site.name}
            </h2>
            <p className="text-xl font-semibold tracking-[0.01em] text-heading">
              Overall project oversight
            </p>
            <ul className="mt-6 grid gap-3">
              {founderResponsibilities.map((item) => (
                <li key={item} className="flex items-start gap-3 leading-relaxed text-ink">
                  <span aria-hidden="true" className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-coral-500" />
                  {item}
                </li>
              ))}
            </ul>
          </GlassPanel>
          <GlassCard className="p-7 md:p-10">
            <h2 className="label-caps mb-3">An honest account of the current model</h2>
            <div className="space-y-4 leading-relaxed text-ink">
              <p>
                Neorhiza is currently founder-led. Strategic, organizational
                and fundraising decisions rest with the Founder, who is
                accountable for them.
              </p>
              <p>
                The Founder&apos;s professional background is in software
                engineering and cybersecurity, not clinical medicine or
                laboratory science. Scientific direction will come from
                qualified researchers and institutional partners, whom the
                project is now working to recruit.
              </p>
              <p>
                No scientific adviser has yet been formally appointed and no
                institutional partnership has been confirmed. Both will be
                announced only once they are in place.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <GlassButton href="/scientific-network" variant="secondary">
                Scientific Network
              </GlassButton>
              <GlassButton href="/governance" variant="ghost">
                Governance &amp; Transparency
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Verified founder profile */}
      <section aria-labelledby="founder-profile-heading" className="py-10">
        <SectionHeading
          id="founder-profile-heading"
          eyebrow="Founder"
          title="The Person Behind the Project"
          align="left"
        />
        <div className="mt-10">
          <FounderProfile />
        </div>
      </section>

      <JsonLd data={breadcrumb} />
    </div>
  );
}

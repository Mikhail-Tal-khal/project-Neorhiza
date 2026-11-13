import Link from "next/link";
import { Clock, ShieldCheck } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { DonationForm } from "@/components/ui/donation-form";
import { formatMoney, type DonationSettings } from "@/lib/donations/amount";
import { disclaimers } from "@/lib/site";
import { trackAttrs } from "@/lib/analytics-events";

/** What contributions are used for. Purposes only — no outcomes are promised. */
export const contributionUses = [
  {
    title: "Early-stage research development",
    text: "Evidence review and the groundwork that defines a focused, responsible feasibility question.",
  },
  {
    title: "Scientific planning",
    text: "Engaging qualified advisers to scrutinize the project's direction, methods and limitations.",
  },
  {
    title: "Institutional engagement",
    text: "Building the partnerships needed for qualified institutional supervision of any future research.",
  },
  {
    title: "Regulatory preparation",
    text: "Understanding the ethics, safety and regulatory requirements that future work must meet.",
  },
  {
    title: "Infrastructure",
    text: "The governance, documentation and operational basics a credible research initiative depends on.",
  },
];

const linkClass = "font-medium text-teal-700 underline underline-offset-4 dark:text-teal-200";

/**
 * Online contributions on the Funding page: the amount picker (client) and
 * a plain account of what contributions support and what they are not.
 */
export function DonationSection({ settings, enabled }: { settings: DonationSettings; enabled: boolean }) {
  return (
    <section id="donate" aria-labelledby="donate-heading" className="scroll-mt-28 pb-16">
      <SectionHeading
        id="donate-heading"
        eyebrow="Online contributions"
        title="Contribute to the Foundation Phase"
        lead="Individuals can support Project Neorhiza's early-stage work with a secure one-time contribution. Every contribution is processed by Stripe; no account is needed."
      />

      <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-start">
        <GlassPanel tone="strong" className="p-6 md:p-8">
          <h3 className="text-xl font-semibold tracking-[0.01em] text-heading">Make a one-time contribution</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Choose an amount between {formatMoney(settings.minAmount, settings.currency)} and{" "}
            {formatMoney(settings.maxAmount, settings.currency)}. You will enter your email and payment details on
            Stripe&apos;s secure checkout page.
          </p>

          {!enabled && (
            <div role="note" aria-label="Online contributions status" className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-tint p-4">
              <Clock aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-teal-400" />
              <div>
                <p className="font-semibold text-heading">Secure donations are being prepared</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  Online contributions will open once secure payment processing is fully configured. No payment
                  can be taken until then. Please check back soon.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6">
            <DonationForm settings={settings} enabled={enabled} />
          </div>

          <p className="mt-6 flex items-start gap-2.5 border-t border-border pt-5 text-sm leading-relaxed text-muted">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-teal-400" />
            <span>{disclaimers.stripeProcessing}</span>
          </p>
        </GlassPanel>

        <div className="grid gap-6">
          <GlassPanel className="p-6 md:p-8">
            <h3 className="text-xl font-semibold tracking-[0.01em] text-heading">Where contributions go</h3>
            <ul className="mt-5 grid gap-4">
              {contributionUses.map((use) => (
                <li key={use.title} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-[0.55rem] size-2 shrink-0 rounded-full bg-coral-500" />
                  <span className="leading-relaxed">
                    <span className="font-semibold text-heading">{use.title}.</span>{" "}
                    <span className="text-sm text-muted">{use.text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Contributions fund groundwork, not promises: they do not guarantee research results, treatments or
              medical outcomes. Progress and setbacks are reported on the{" "}
              <Link href="/updates" className={linkClass}>
                Updates
              </Link>{" "}
              page.
            </p>
          </GlassPanel>

          <aside
            role="note"
            aria-label="About contributions"
            className="rounded-2xl border border-border bg-surface p-5 text-sm leading-relaxed text-ink md:p-6"
          >
            <p className="label-caps mb-2">Please note</p>
            <p className="text-pretty">{disclaimers.contributions}</p>
            <p className="mt-3 text-muted">
              Institutions and organizations considering a formal partnership can send an{" "}
              <Link
                href="/contact?interest=institutional#inquiry-form"
                className={linkClass}
                {...trackAttrs("partnership_inquiry_started", "funding-donate-note")}
              >
                institutional partnership inquiry
              </Link>
              . See the{" "}
              <Link href="/terms" className={linkClass}>
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className={linkClass}>
                Privacy Policy
              </Link>{" "}
              for how contributions and refunds are handled.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

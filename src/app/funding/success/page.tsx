import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";
import { TrackOnMount } from "@/components/analytics-click-tracker";
import { createMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { formatCents } from "@/lib/donations/amount";
import { getStripe } from "@/lib/donations/stripe";
import { verifyCheckoutSession, type VerifiedSession } from "@/lib/donations/checkout";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Contribution Status",
    description: "Confirmation of a one-time contribution to Project Neorhiza, verified with Stripe.",
    path: "/funding/success",
  }),
  // A per-visitor confirmation: never indexed, and the session ID in the
  // URL is not passed on as a referrer.
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const linkClass = "font-medium text-teal-700 underline underline-offset-4 dark:text-teal-200";

type Copy = { icon: typeof CheckCircle2; eyebrow: string; title: string; body: React.ReactNode };

function copyFor(result: Exclude<VerifiedSession, { state: "paid" }>): Copy {
  switch (result.state) {
    case "processing":
      return {
        icon: Clock,
        eyebrow: "Payment processing",
        title: "Your payment is being processed",
        body: "Checkout is complete, but your payment method has not confirmed the payment yet. Some methods take a few days. Stripe will notify you of the outcome, and no further action is needed now.",
      };
    case "unavailable":
      return {
        icon: AlertCircle,
        eyebrow: "Status unavailable",
        title: "We can’t confirm your contribution right now",
        body: "Payment confirmation is temporarily unavailable. If you completed checkout, your payment is handled by Stripe and is not affected — please reload this page in a few minutes.",
      };
    case "unpaid":
      return {
        icon: AlertCircle,
        eyebrow: "Not completed",
        title: "No completed payment was found",
        body: "Stripe has not reported a completed payment for this checkout, so no contribution has been confirmed. You are welcome to try again.",
      };
    case "invalid":
      return {
        icon: AlertCircle,
        eyebrow: "Not found",
        title: "We couldn’t find this contribution",
        body: "This confirmation link is incomplete or does not match a contribution to Project Neorhiza. If you completed a payment, Stripe’s receipt or your statement is the authoritative record.",
      };
  }
}

/**
 * Contribution confirmation. The ?session_id= parameter only says which
 * Checkout Session to look up; success is shown only when Stripe itself
 * reports the session as paid.
 */
export default async function DonationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { session_id: sessionId } = await searchParams;
  const result = await verifyCheckoutSession(getStripe(), typeof sessionId === "string" ? sessionId : undefined);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-12 md:px-8 md:pt-20">
      {result.state === "paid" ? (
        <GlassPanel tone="strong" className="p-7 text-center md:p-12">
          <TrackOnMount event="donation_success_viewed" />
          <CheckCircle2 aria-hidden="true" className="mx-auto size-12 text-teal-400" />
          <p className="label-caps mt-6">Payment received</p>
          <h1 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-[0.01em] text-heading md:text-4xl">
            Thank you for supporting Project Neorhiza
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted">
            Stripe has confirmed your one-time contribution. It supports the project&apos;s early-stage research and
            development work — governance, evidence review, scientific planning and institutional partnerships.
          </p>

          <dl className="mx-auto mt-8 grid max-w-md divide-y divide-border rounded-2xl border border-border bg-surface text-left">
            <div className="flex flex-wrap items-baseline justify-between gap-2 p-4">
              <dt className="text-sm text-muted">Amount</dt>
              <dd className="font-semibold tabular-nums text-heading">
                {formatCents(result.amountCents, result.currency)} {result.currency.toUpperCase()}
              </dd>
            </div>
            {result.reference && (
              <div className="flex flex-wrap items-baseline justify-between gap-2 p-4">
                <dt className="text-sm text-muted">Payment reference</dt>
                <dd className="break-all font-mono text-sm text-heading">{result.reference}</dd>
              </div>
            )}
          </dl>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted">
            Please keep the payment reference for your records. For any question about this contribution, write to{" "}
            <a href={`mailto:${site.contactEmail}`} className={linkClass}>
              {site.contactEmail}
            </a>{" "}
            and quote the reference.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <GlassButton href="/updates" size="lg">
              Follow Project Updates
            </GlassButton>
            <GlassButton href="/funding" variant="secondary" size="lg">
              Back to Funding
            </GlassButton>
          </div>
        </GlassPanel>
      ) : (
        <StatusPanel {...copyFor(result)} />
      )}
    </div>
  );
}

function StatusPanel({ icon: Icon, eyebrow, title, body }: Copy) {
  return (
    <GlassPanel tone="strong" className="p-7 text-center md:p-12">
      <Icon aria-hidden="true" className="mx-auto size-12 text-teal-400" />
      <p className="label-caps mt-6">{eyebrow}</p>
      <h1 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-[0.01em] text-heading md:text-4xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted">{body}</p>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
        Questions? Write to{" "}
        <a href={`mailto:${site.contactEmail}`} className={linkClass}>
          {site.contactEmail}
        </a>
        .
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <GlassButton href="/funding#contribute" size="lg">
          Return to Funding
        </GlassButton>
        <GlassButton href="/updates" variant="secondary" size="lg">
          Read Project Updates
        </GlassButton>
      </div>
      <p className="mt-6 text-xs text-muted">
        <Link href="/terms" className={linkClass}>
          Terms
        </Link>{" "}
        ·{" "}
        <Link href="/privacy" className={linkClass}>
          Privacy
        </Link>
      </p>
    </GlassPanel>
  );
}

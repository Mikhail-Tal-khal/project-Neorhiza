import type { Metadata } from "next";
import { CircleSlash } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";
import { createMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Contribution Not Completed",
    description: "Checkout was cancelled and no payment was taken. You can return to the Funding page to try again.",
    path: "/funding/cancelled",
  }),
  robots: { index: false, follow: false },
};

/** Stripe Checkout's cancel_url: the visitor left checkout without paying. */
export default function DonationCancelledPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-12 md:px-8 md:pt-20">
      <GlassPanel tone="strong" className="p-7 text-center md:p-12">
        <CircleSlash aria-hidden="true" className="mx-auto size-12 text-teal-400" />
        <p className="label-caps mt-6">Checkout cancelled</p>
        <h1 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-[0.01em] text-heading md:text-4xl">
          Your contribution was not completed
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted">
          You left Stripe&apos;s checkout before paying, so no payment was taken and nothing was charged. If that
          was a mistake, you can choose an amount and try again at any time.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <GlassButton
            href="/funding#donate"
            size="lg"
            analytics={{ event: "donation_cta_clicked", location: "checkout-cancelled" }}
          >
            Try Again
          </GlassButton>
          <GlassButton href="/updates" variant="secondary" size="lg">
            Read Project Updates
          </GlassButton>
        </div>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted">
          Prefer to discuss support first? Write to{" "}
          <a
            href={`mailto:${site.contactEmail}`}
            className="font-medium text-teal-700 underline underline-offset-4 dark:text-teal-200"
          >
            {site.contactEmail}
          </a>
          .
        </p>
      </GlassPanel>
    </div>
  );
}

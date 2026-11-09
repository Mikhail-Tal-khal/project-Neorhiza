"use client";

import { GlassModal, GlassModalTrigger, GlassModalContent, GlassModalClose } from "@/components/ui/glass-modal";
import { trackAttrs } from "@/lib/analytics-events";

/**
 * Public Research Overview request — the overview itself is never
 * auto-distributed; it is sent to qualified professional inquirers
 * through the contact process.
 *
 * The trigger and the call to action are rendered by the (server) page and
 * passed in, so GlassButton and its class merging stay out of the browser
 * bundle. Each must be a single element that accepts props (Radix asChild).
 */
export function OverviewRequestModal({
  trigger,
  cta,
}: {
  trigger: React.ReactElement;
  cta: React.ReactElement;
}) {
  return (
    <GlassModal>
      <GlassModalTrigger asChild {...trackAttrs("research_overview_requested", "collaboration-modal")}>
        {trigger}
      </GlassModalTrigger>
      <GlassModalContent
        title="Request the Public Research Overview"
        description="What the overview contains — and how to receive it."
      >
        <div className="space-y-4">
          <p>
            The public research overview is a shareable document describing
            the high-level scientific pathway, the proposed first program
            and the project&apos;s governance and ethics principles.
          </p>
          <p>
            It deliberately contains no confidential methodologies,
            engineering parameters, unpublished results or proprietary
            technical information. Confidential material is never
            distributed automatically — it is discussed only with
            qualified institutional collaborators under appropriate
            agreements.
          </p>
          <p>
            To receive the overview, submit a professional inquiry through
            the contact form and select an area of interest. Requests are
            qualified by role and institutional context; you will receive
            a response from the project team.
          </p>
          <GlassModalClose asChild>{cta}</GlassModalClose>
        </div>
      </GlassModalContent>
    </GlassModal>
  );
}

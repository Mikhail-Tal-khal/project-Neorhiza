"use client";

import { GlassModal, GlassModalTrigger, GlassModalContent, GlassModalClose } from "@/components/ui/glass-modal";
import { GlassButton } from "@/components/ui/glass-button";

/**
 * Public Research Overview request — the overview itself is never
 * auto-distributed; it is sent to qualified professional inquirers
 * through the contact process.
 */
export function OverviewRequestModal() {
  return (
    <GlassModal>
      <GlassModalTrigger asChild>
        <GlassButton variant="secondary" size="lg">
          Request the Public Research Overview
        </GlassButton>
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
          <GlassModalClose asChild>
            <GlassButton href="/contact" size="md" className="mt-2">
              Continue to the contact form
            </GlassButton>
          </GlassModalClose>
        </div>
      </GlassModalContent>
    </GlassModal>
  );
}

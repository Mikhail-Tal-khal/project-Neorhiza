/**
 * Conversion events sent to Vercel Web Analytics (first-party, cookieless,
 * aggregate). See docs/analytics-events.md for the plan.
 *
 * Properties are limited to fixed labels chosen in code — never names,
 * email addresses, message text or anything a visitor typed. Free of
 * runtime dependencies so server components can use trackAttrs().
 */
export const analyticsEvents = [
  "contact_form_started",
  "inquiry_submitted",
  "collaboration_cta_clicked",
  "research_overview_requested",
  "funding_inquiry_started",
  "article_opened",
  "outbound_profile_clicked",
] as const;

export type AnalyticsEvent = (typeof analyticsEvents)[number];

/** Allowed property keys; values must be code-defined labels or slugs. */
export type AnalyticsProps = Partial<Record<"location" | "area" | "slug", string>>;

/** Attributes for an element tracked by <AnalyticsClickTracker />. */
export function trackAttrs(event: AnalyticsEvent, location?: string) {
  return {
    "data-analytics-event": event,
    ...(location ? { "data-analytics-location": location } : {}),
  };
}

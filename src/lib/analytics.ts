import { track } from "@vercel/analytics";
import type { AnalyticsEvent, AnalyticsProps } from "@/lib/analytics-events";

export { analyticsEvents, type AnalyticsEvent, type AnalyticsProps } from "@/lib/analytics-events";

/** Sends a conversion event (client only). Analytics never affects the page. */
export function trackEvent(name: AnalyticsEvent, props?: AnalyticsProps) {
  try {
    track(name, props);
  } catch {
    // Ignore: blocked or disabled analytics must not break interaction.
  }
}

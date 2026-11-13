"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Removes the query string from URLs reported by Vercel Web Analytics and
 * Speed Insights. Nothing on the site needs it for measurement, and the
 * contribution success page carries a Stripe Checkout Session ID there
 * (?session_id=cs_…), which must never reach analytics.
 */
export function scrubUrl(url: string) {
  try {
    const parsed = new URL(url);
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return url.split(/[?#]/)[0];
  }
}

export function VercelInsights() {
  return (
    <>
      <Analytics beforeSend={(event) => ({ ...event, url: scrubUrl(event.url) })} />
      <SpeedInsights beforeSend={(event) => ({ ...event, url: scrubUrl(event.url) })} />
    </>
  );
}

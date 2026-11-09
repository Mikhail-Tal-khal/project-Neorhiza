"use client";

import { useEffect } from "react";
import { analyticsEvents, trackEvent, type AnalyticsEvent } from "@/lib/analytics";

const known = new Set<string>(analyticsEvents);

/**
 * One delegated click listener for elements marked with
 * `data-analytics-event` (see trackAttrs). Lets server components report
 * CTA clicks without becoming client components.
 */
export function AnalyticsClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const el = (event.target as Element | null)?.closest<HTMLElement>("[data-analytics-event]");
      const name = el?.dataset.analyticsEvent;
      if (!el || !name || !known.has(name)) return;
      const location = el.dataset.analyticsLocation;
      trackEvent(name as AnalyticsEvent, location ? { location } : undefined);
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}

/** Fires one event when mounted (e.g. an article view). */
export function TrackOnMount({ event, slug }: { event: AnalyticsEvent; slug?: string }) {
  useEffect(() => {
    trackEvent(event, slug ? { slug } : undefined);
  }, [event, slug]);
  return null;
}

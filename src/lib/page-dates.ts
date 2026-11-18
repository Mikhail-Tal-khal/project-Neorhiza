/**
 * Last meaningful content change for each static page (YYYY-MM-DD), used
 * for sitemap <lastmod>. Update the date when a page's content changes —
 * never use the build or deployment time, which would tell search engines
 * every page changed on every deploy. Article dates come from frontmatter.
 */
export const pageDates = {
  "/": "2026-11-17",
  "/why-neorhiza": "2026-11-17",
  "/our-science": "2026-10-23",
  "/roadmap": "2026-11-17",
  "/human-impact": "2026-10-23",
  "/leadership": "2026-11-17",
  "/scientific-network": "2026-11-17",
  "/collaboration": "2026-11-09",
  "/funding": "2026-11-17",
  "/governance": "2026-11-17",
  "/updates": "2026-11-09",
  "/contact": "2026-11-17",
  "/privacy": "2026-11-17",
  "/terms": "2026-11-17",
  "/research-disclaimer": "2026-10-23",
} as const;

export type StaticRoute = keyof typeof pageDates;

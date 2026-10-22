# Project Neorhiza — Website

The public website of **Project Neorhiza**, a patient-specific tissue engineering initiative: *Engineering New Beginnings from Living Cells.*

> **Early-stage disclaimer.** Project Neorhiza is an early-stage research initiative. It does not currently provide medical advice, diagnostic services, stem-cell treatment, organ transplantation or clinical care. Information on this website is provided for education, scientific communication and research-development purposes. Future experimental or clinical activities will require qualified institutional supervision and all applicable ethical, scientific and regulatory approvals.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Server Components by default, Turbopack) and React 19
- TypeScript in `strict` mode
- Tailwind CSS 4 with design tokens in `src/styles/globals.css`
- `next/font` (Manrope, self-hosted), Metadata API, dynamic Open Graph images (`next/og`)
- MDX articles (`next-mdx-remote` + `gray-matter`)
- Zod validation for the contact API
- Playwright + axe-core for end-to-end and accessibility tests, Lighthouse for performance

## Prerequisites

- **Node.js 22** (see `.nvmrc`; `engines` requires `>=22`). With nvm: `nvm use`.
- npm 10 or newer.

## Install and run

```bash
npm ci                 # install exactly what package-lock.json specifies
cp .env.example .env.local   # optional; every variable has a safe default
npm run dev            # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start          # http://localhost:3000
```

## Environment variables

All variables are documented in [`.env.example`](.env.example). None are required to build or to run locally.

| Variable | Purpose | When missing |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Base URL for canonical links, sitemap, robots, OG images, structured data | Falls back to `https://neorhiza.org` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public contact address in structured data | Omitted |
| `CONTACT_WEBHOOK_URL`, `CONTACT_WEBHOOK_TOKEN` | Contact form delivery via webhook | — |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Contact form delivery via email (Resend) | — |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (or `KV_REST_API_URL`, `KV_REST_API_TOKEN`) | Shared rate-limit store for serverless | In-memory limiter (per instance) |
| `CONTACT_RATE_LIMIT_MAX`, `CONTACT_RATE_LIMIT_WINDOW_SECONDS` | Rate-limit tuning | 5 per 600 s |

If **no** delivery destination (webhook or Resend) is configured, the contact form still validates input but then tells the visitor it is temporarily unavailable (HTTP 503). It never pretends a message was sent.

## Project structure

```
brand/originals/          Official logo files as supplied (source of truth, never edited)
public/images/logo/       Official logos (byte-identical copies) + the one sanctioned
                          reversed-transparent variant
public/icons/             Manifest icons (from the official Android app icon)
scripts/                  generate-logos, check-contrast, check-links, lighthouse
src/app/                  Routes (App Router), metadata routes, OG images, API
  api/contact/route.ts    Contact form handler (Zod, honeypot, rate limit, delivery)
src/assets/               Fonts and OG raster art (server-side only)
src/components/sections/  Page sections (header, footer, hero, ...)
src/components/ui/        Reusable UI (BrandMark, GlassPanel, VesselDivider, ...)
src/content/              Page copy (TypeScript) and Updates articles (MDX)
src/lib/                  Site config, metadata, validation, rate limiting, delivery
src/styles/globals.css    Design tokens (color, glass, motion) — the only place colors are defined
tests/                    Playwright end-to-end and accessibility suites
docs/                     AUDIT.md (audit log) and DEPLOYMENT.md
```

`"use client"` is used only where interactivity requires it: the header (scroll state, mobile menu), theme provider and toggle, contact form, scientific journey, overview modal and the error boundary.

## Editing content

- **Page copy** lives in `src/content/*.ts` and the page files in `src/app/**/page.tsx`.
- **Required disclaimers** are defined once in `src/lib/site.ts` (`disclaimers`). Do not reword them.
- **Navigation** items are in `src/lib/site.ts` (`navItems`).

### Adding an Updates article

1. Create `src/content/articles/<slug>.mdx` with frontmatter:

   ```mdx
   ---
   title: "Article title"
   slug: "article-title"            # must match the file name
   category: "Scientific Education" # one of the 7 categories in src/lib/articles.ts
   excerpt: "One or two sentences shown in listings and as the meta description."
   date: "2026-11-01"               # ISO date
   readingMinutes: 4
   ---

   Article body in Markdown/MDX.
   ```

2. Add the path to `PAGES` in `tests/support/site.ts`.
3. Run `npm run build`. The article page, its OG image, the sitemap entry and structured data are generated automatically.

## Testing and quality checks

```bash
npm run lint             # ESLint, zero warnings allowed
npm run typecheck        # tsc --noEmit
npm run check:contrast   # WCAG contrast of every token pairing, both themes, incl. glass worst cases
npm run build
npm run test:e2e         # Playwright: pages, SEO, navigation, theme, form, a11y (axe), no-JS, screenshots
```

`test:e2e` starts its own production servers (`next start`) and a local webhook sink, so run `npm run build` first. To use an already-installed Chromium instead of Playwright's managed download, set `PLAYWRIGHT_CHROMIUM_PATH=/path/to/chrome`. Screenshots for visual review are saved to `test-results/screenshots/`.

With a production server running (`npm run start`):

```bash
BASE_URL=http://localhost:3000 npm run check:links   # crawl internal links and anchors, verify 404
BASE_URL=http://localhost:3000 npm run lighthouse    # mobile Lighthouse on key pages (set CHROME_PATH if needed)
```

## Brand and logo rules

- The official logo files in `brand/originals/` are **never altered**. `npm run generate:logos` copies them byte for byte into `public/images/logo/`.
- The only derived logo variant is `neorhiza-horizontal-reversed-transparent.svg`: the official reversed lockup with its background rectangle removed, for deep-teal surfaces.
- Always use the `BrandMark` component. Teal lockup on light surfaces; `tone="reversed"` on solid deep-teal surfaces.
- Never place a logo on glass below 85% effective opacity. The stacked lockup has no reversed version, so it always sits on a solid light tile.
- All colors come from the tokens in `src/styles/globals.css`. Coral is an accent: coral buttons use dark text, and coral is not used for small text on light backgrounds except the darkened `coral-700` error color, which passes the contrast check.

## Confidentiality rule for contributors

This website describes the scientific pathway **only at a general level**. Never add project-specific methods, protocols, engineering parameters (concentrations, flow rates, pressures, oxygen levels, cell densities, seeding details, ratios), named reagents, or unpublished results, anywhere: pages, articles, metadata, alt text, comments or commit messages. Never invent results, statistics, partners, testimonials or credentials. Never add donation, payment, investment or patient-enrollment features. See `.github/pull_request_template.md`.

## Deployment

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for Vercel (recommended) and generic Node hosting.

## License

All rights reserved. See [LICENSE](LICENSE).

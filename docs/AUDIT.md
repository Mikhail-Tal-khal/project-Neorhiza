# Project Neorhiza — Audit Log

**Date:** 2026-10-22 · **Scope:** audit, fix, test, GitHub prep, deployment prep · **Stack:** Next.js 16.4.2, React 19.2, Tailwind 4, TypeScript (strict)

Severity: **S1** confidentiality / safety wording · **S2** broken functionality · **S3** accessibility · **S4** brand / color · **S5** performance · **S6** hygiene / polish
Status: **Pass** (met as found) · **Fixed** (changed and re-verified) · **Open** (not resolved; reason given)

---

## 0. Important limitation: the specification file was not available

The build spec `neorhiza-website-prompt.md` (v2), named as the single source of truth, is **not in the repository** and could not be found in `~/Desktop`, `~/Downloads` or `~/Documents`. The owner chose to proceed without it.

Consequences:
- Every check that needs the spec's **exact wording** (headings, body copy, the 7 journey stages, roadmap phases, values, verbatim disclaimers, buttons, inquiry types) is marked **Open: spec unavailable**. The current site copy was kept as-is. It was not "corrected" against a document I could not read.
- Requirements stated in the audit prompt itself (technology, security, accessibility, forbidden content, forms, structured data, brand and logo rules) were fully audited.
- Section numbers below follow the audit prompt.

**To close these items:** add the spec to the repo (for example at `docs/spec/neorhiza-website-prompt.md`) and compare it against `src/lib/site.ts` (disclaimers, navigation), `src/content/*.ts` (stages, roadmap, values, collaboration, impact) and `src/lib/inquiry-types.ts`.

---

## 1. Traceability table

### 1.1 Technology (spec §1)

| Requirement | Status | Evidence / change |
|---|---|---|
| Next.js latest stable | Fixed | `^16.1.1` → `^16.4.2` (latest on npm at audit time) |
| App Router | Pass | `src/app/` |
| TypeScript strict | Fixed | `strict: true` was being weakened by `noImplicitAny: false` (removed). `next.config` had `typescript.ignoreBuildErrors: true` (removed, F-01). `tsc --noEmit`: 0 errors |
| Tailwind | Pass | Tailwind 4 via `@tailwindcss/postcss` |
| Server Components by default | Fixed | 8 client files, each justified in §1.2. `ExpandableRoadmap` converted to a Server Component (native `<details>`) |
| Required folder structure | Pass | `src/app`, `src/components/{sections,ui}`, `src/content`, `src/lib`, `src/styles`, `public/images/logo`. Exact layout from spec §1 unverifiable (spec unavailable) |
| `next/image` | Pass (n/a) | No raster content images exist. Logos are SVG (inline or `<img>` for the icon); the OG art is rendered server-side |
| `next/font` | Fixed | Now one self-hosted Manrope woff2 subset (22 KB) via `next/font/local`. It was a 165 KB TTF plus a duplicate public woff2 preload. **Also fixed S4 bug F-20: Manrope was never applied to page text** (see findings) |
| Metadata API | Pass | `createMetadata()` per page: title, description, canonical, OG, Twitter |
| Dynamic OG images | Fixed | Root and per-article `opengraph-image.tsx` now use the sanctioned reversed horizontal logo (was a recolored stacked logo, F-14). Article metadata uses its own OG image and `og:type=article` |
| Route handlers | Pass | `src/app/api/contact/route.ts`. Scaffold `api/route.ts` ("Hello, world!") removed |
| not-found | Pass | `src/app/not-found.tsx`; returns 404 for unknown routes and unknown article slugs (`dynamicParams = false`) |
| Loading state | Fixed / changed | Root `loading.tsx` **removed** (F-22): it wrapped every page in a Suspense boundary, so prerendered HTML hid all content in `<div hidden>` until JS ran (fails no-JS). All pages are static, so the fallback was never useful on first load. The form keeps its own submitting state |
| Error state | Pass | `src/app/error.tsx` (client, required by Next.js) |
| sitemap | Pass | `sitemap.ts`: 11 static pages + 7 articles, driven by `NEXT_PUBLIC_SITE_URL` |
| robots.txt | Pass | `robots.ts`: allow `/`, disallow `/api/`, sitemap link |
| Canonical URLs | Pass | All 18 pages, verified by e2e |
| Structured data | Fixed | Organization (`ResearchOrganization`) + WebSite in layout; BreadcrumbList now on **all** pages (was missing on legal pages and articles); Article on articles. Shared `JsonLd` component escapes `<` |

### 1.2 `"use client"` inventory

| File | Justification |
|---|---|
| `src/app/error.tsx` | Next.js requires error boundaries to be client components (`reset()`) |
| `src/components/sections/site-header.tsx` | Scroll state, mobile menu open/close, Escape handling, `usePathname` for `aria-current` |
| `src/components/theme-provider.tsx` | `next-themes` context provider |
| `src/components/ui/theme-toggle.tsx` | Reads and sets theme (`useTheme`) |
| `src/components/ui/contact-form.tsx` | Controlled form, client validation, submission, focus management |
| `src/components/ui/scientific-journey.tsx` | IntersectionObserver scroll progress and stage selection |
| `src/components/ui/glass-modal.tsx` | Radix Dialog (focus trap, Escape) |
| `src/components/ui/overview-request-modal.tsx` | Composes the dialog trigger and content |

### 1.3 Brand identity (spec §3)

| Requirement | Status | Evidence / change |
|---|---|---|
| Logos unaltered | Pass | SHA-256 of all 5 official SVGs in `public/images/logo/` = `brand/originals/` = the user's `~/Downloads` originals (`cmp` identical) |
| Only one derived transparent variant | Fixed | Removed `neorhiza-stacked-reversed-transparent.svg` and the recolored stacked OG art (a **recolored** stacked logo, not an allowed variant). Only `neorhiza-horizontal-reversed-transparent.svg` remains (official reversed minus its background `<rect>`) |
| Navigation logo | Pass | Horizontal lockup on `glass-strong` (opacity raised from 85%/84% to 95% light / 90% dark, F-18) |
| Brand moments | Fixed | Why page: the stacked lockup sat on low-opacity glass (62% light / 32% dark) and swapped to the recolored variant in dark mode. It now sits on a solid white tile in both themes |
| Footer | Pass | Reversed horizontal on solid deep teal |
| 404 | Fixed | Recolored stacked → reversed horizontal on deep teal; primary action is now a coral button with dark text (was teal-on-teal) |
| Favicon `src/app/icon.svg` | Pass | Exact copy of `neorhiza-icon.svg` (pipeline verified) |
| `apple-icon.png` | Pass | 180 px from the official iOS icon |
| Manifest icons | Pass | 192/512 from the official Android icon (`any` + `maskable`) |
| OG image | Fixed | See 1.1 |
| Clear space / minimum sizes | Open (partial) | Header lockup is 120×40 px. Minimum-size rules from spec §3 unverifiable (spec unavailable). I removed an invented minimum I had briefly added |
| Logo never on low-opacity glass | Fixed | See above; header glass ≥ 90% |
| Annotated mark (Why page) | Open (owner review) | `AnnotatedMark` redraws the official mark paths in theme colors as an explanatory diagram. Not a logo placement, but a judgment call against the brand rules |
| Reproducible pipeline | Fixed | `scripts/generate-logos.mjs` was hard-coded to `/home/z/...` and Linux tools. Now cross-platform; renders OG art in Chromium with real Manrope |

### 1.4 Color system (spec §7)

| Requirement | Status | Evidence / change |
|---|---|---|
| All colors from tokens | Fixed | Hex literals in `layout.tsx` (themeColor) and `manifest.ts` now come from `src/lib/brand-colors.ts` (documented token mirror for non-CSS contexts). Remaining hex: `globals.css` (token source), `brand-colors.ts`, generated lockup SVG strings (official logo files) |
| No medical blue / navy / violet | Pass | No Tailwind default hue classes in used components. `placeholder:text-slate-400` (Tailwind's bluish slate) removed |
| Coral never small text on light | Fixed | `text-coral-700` small text in light mode (evidence-card label, "Current Position" chip, form error text) changed to teal/ink text; coral kept for icons, dots and borders. Dark mode keeps coral-300 text on deep teal |
| Coral buttons use dark text | Pass | `coral` variant: teal-950 on coral-500 (5.27:1) |
| Dark mode is deep teal | Pass | `--background: #06222a` (teal-950) |
| Light / dark / system + manual control | Fixed | Toggle buttons were 32 px (→ 44 px) and used `role=radio` without arrow keys (→ `aria-pressed` toggle buttons). Desktop uses a compact 44 px cycle button so the nav pill fits at 1280 px |
| No flash of wrong theme | Pass | `next-themes` inline script; e2e verifies `html.dark` is set before the first content element is parsed |

### 1.5 Typography (spec §9)

| Requirement | Status | Evidence / change |
|---|---|---|
| Manrope only, via `next/font` | **Fixed (F-20)** | `manrope.variable` was on `<body>`, but Tailwind resolves `--font-sans: var(--font-manrope)` on `:root`, so **all page text rendered in the system stack (Segoe UI)**. Moved to `<html>`. New e2e test asserts h1/p/nav/button compute to Manrope and the face is loaded |
| No layout shift | Pass | `next/font` fallback metrics; Lighthouse CLS = 0.000 on all audited pages |

### 1.6 Content (spec §11–19) and pages

| Requirement | Status | Evidence |
|---|---|---|
| All pages exist: Home, Why Neorhiza, Our Science, Research Roadmap, Human Impact, Collaboration, Updates, Contact, Privacy, Terms, Research Disclaimer | Pass | 11 routes return 200 (e2e + crawl) |
| Updates: 7 initial articles, 7 categories | Pass | 7 MDX files; 7 categories in `articleCategories` (now schema-validated at build) |
| Exact headings, copy, stages, roadmap phases, values | **Open** | Spec unavailable. Structure present: 7 journey stages, 6 roadmap preview phases + 9 detailed stages, values, collaboration paths |
| Verbatim disclaimers, character by character | **Open** | Spec unavailable. Disclaimers centralized in `src/lib/site.ts` (`disclaimers.*`) and rendered from there; unchanged |
| Inquiry types | Open (structure Pass) | 7 types in `src/lib/inquiry-types.ts`; e2e asserts the rendered list. Exact wording unverifiable |
| Form fields | Pass | Full name, professional email, organization, role, country, area of interest, message, consent. No health fields |
| Navigation / buttons / footer links | Fixed | **Navigation was unreachable from 768–1279 px** (desktop links `xl:` only, hamburger `md:hidden`, F-19). All internal links: 223 checked, 0 broken |
| Founder (REREU) content | Pass | "Verified profile in preparation" state; no invented credentials |
| Privacy policy accuracy | Fixed | Now discloses delivery via email provider / webhook and short-lived IP-based rate limiting (these behaviors are new) |

### 1.7 Forbidden-content scan (whole repo: source, MDX, metadata, alt text, comments)

| Pattern group | Status | Hits and justification |
|---|---|---|
| donate / fund / invest / campaign / payment / pay / crowdfund | Pass | "donated organs" / "donation and transplantation" (organ-transplant context: human-need, human-impact, vision); "No payment processing, donation handling…" (privacy disclaimer); "investigate" (word stem). README/PR template mention them only as prohibitions. `Permissions-Policy: payment=()` disables the Payment API |
| "apply for treatment", "enroll", "book a consultation" | Pass | "does not offer medical treatment or patient enrollment" (required disclaimer, contact + footer) |
| testimonial, "clinically proven", "guaranteed", "cure", unsourced stats | Pass | "not guaranteed" / "No guaranteed outcomes" / "A guaranteed medical solution" (in the *What Neorhiza is not* list) are all negations. Stats: "2012 Nobel Prize" (iPSC, public fact); "tens to hundreds of micrometers" (general diffusion limit, educational) |
| Confidential parameters (concentrations, flow, pressure, O₂ %, densities, seeding, ratios, reagents, genes as methods) | Pass | None. "oxygen and nutrients" and "pressure cycles" are physiology descriptions; "seeding vessel-associated cells" is a literature-level description without parameters |
| Invented founder credentials | Pass | Only the name "REREU"; the page states credentials are withheld until verified |

### 1.8 Forms (spec §18)

| Requirement | Status | Evidence / change |
|---|---|---|
| Zod validation on the server | Pass | `contactSchema` (lengths, email, enum, consent literal) |
| Honeypot | Pass | `companyWebsite`; bots get an indistinguishable 200 and **nothing is delivered** (e2e checks the sink) |
| Rate limiting | Fixed | `RateLimiter` interface: Upstash/Vercel KV REST store when configured, in-memory fallback (F-04). Configurable via env. e2e: 5 × 200 then 429 + `Retry-After` |
| Accessible error text | Fixed | Server field errors were never shown on fields; focus now moves to the first invalid field; `aria-invalid` + `aria-describedby` + `role=alert`; "required" legend |
| No sensitive health fields | Pass | e2e asserts no field name or label matches medical/genetic/health/patient/… |
| Consent required | Pass | Client + server (e2e) |
| Secrets only in env | Pass | See §1.9 |
| Graceful failure without config | **Fixed (S1/S2, F-03)** | It returned `{ok:true}` with no delivery configured, and swallowed webhook errors. Now 503 "temporarily unavailable" when unconfigured, 502 on delivery failure; never claims success. e2e verifies against a server with no delivery |
| Real delivery | Fixed | Webhook (`CONTACT_WEBHOOK_URL` + optional bearer) and/or email via Resend REST (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`). e2e delivers to a real local webhook and checks payload and auth |
| Input hardening | Fixed | JSON content-type required (415), 16 KB body cap (413), control-char / `<>` stripping, trimmed fields, consent and honeypot not forwarded |

### 1.9 Security and privacy (spec §24)

| Requirement | Status | Evidence / change |
|---|---|---|
| Content-Security-Policy | Fixed | Added (F-17): `default-src 'self'`, no third-party origins, `frame-ancestors 'none'`, `object-src 'none'`, `form-action 'self'`, `upgrade-insecure-requests`. `'unsafe-inline'` is needed for the next-themes no-flash script and Next.js inline bootstrap; `'unsafe-eval'` in dev only |
| CSP clean at runtime | Fixed (F-23) | Zod v4's JIT probe (`Function("")`) hit the CSP on /contact because the client form imported the Zod module. Inquiry types moved to a Zod-free module; Zod no longer ships to the client. e2e now fails on any CSP violation |
| HSTS, nosniff, Referrer-Policy, Permissions-Policy, frame protection | Pass | Present (verified with `curl -I` and e2e); added COOP and `payment=()`, `browsing-topics=()` |
| `poweredByHeader: false` | Pass | No `X-Powered-By` (e2e) |
| No third-party trackers | Pass | No external scripts, styles, fonts or images; CSP enforces it |
| No client-side secrets | Pass | `.next/static` grep for env names, `re_…` keys, `Bearer`, test token: no hits |
| Input sanitization | Pass | §1.8 |
| Public email address | Fixed | `collaborate@neorhiza.org` (unverified) was published in JSON-LD by default; now only when `NEXT_PUBLIC_CONTACT_EMAIL` is set |

### 1.10 Structured data

| Requirement | Status | Evidence |
|---|---|---|
| Organization, WebSite, Breadcrumb, Article | Fixed | See 1.1; all blocks JSON-parse (e2e on 18 pages) |
| Never hospital / clinic / accredited | Pass | `ResearchOrganization`; e2e rejects `Hospital`, `MedicalClinic`, `MedicalOrganization`, `Physician`, `EducationalOrganization`, `CollegeOrUniversity`, "accredit" in any JSON-LD |

---

## 2. Findings log (highest severity first)

| ID | Sev | Finding | Change | Verification |
|---|---|---|---|---|
| F-03 | S1/S2 | Contact form reported success with no delivery configured and on delivery failure | Real delivery providers; 503/502 honest failures | e2e: delivered to sink; 503 on unconfigured server |
| F-14 | S4 (brand rule) | Recolored stacked logo used as an extra "reversed" variant (404, OG, Why dark mode) | Removed; sanctioned variant only | `cmp` official files; screenshots reviewed |
| F-19 | S2 | No navigation at 768–1279 px | Hamburger shown below `xl` | e2e at 1024 px |
| F-20 | S4 | Manrope never applied to page text | Font variable on `<html>` | e2e computed-font test; screenshots |
| F-22 | S2/S3 | All content hidden without JS (root `loading.tsx` streaming) | Removed root `loading.tsx` | e2e no-JS on 18 pages |
| F-01 | S2 | `ignoreBuildErrors: true` | Removed | build runs TypeScript, 0 errors |
| F-02 | S2 | `noImplicitAny: false` | Removed | `tsc` 0 errors |
| F-04 | S2 | In-memory rate limit only | Upstash interface + fallback | e2e 429 |
| F-08 | S2 | Scripts used `bun`, `tee`, `cp -r`, POSIX env prefixes, `output: standalone` | Plain `next dev/build/start` | builds and runs on Windows; CI on Linux |
| F-21 | S2 | Roadmap stages required JS (`hidden` state) | Native `<details>/<summary>` (server component) | e2e keyboard + no-JS |
| F-24 | S2 | Modal stayed visible after Escape (exit animation never finished) | Exit animation removed; entry animation `motion-safe` | e2e focus trap + Escape |
| F-17 | S2 | No CSP | Added | e2e + curl |
| F-23 | S2 | CSP violation from Zod in client bundle | Zod-free inquiry types module | CSP probe; Lighthouse BP |
| F-10 | S3 | Theme toggle 32 px, incomplete radio pattern | 44 px, `aria-pressed` | e2e touch targets, theme tests |
| F-25 | S3 | Header logo link: name failed label-in-name (axe serious) and 40 px tall | Name starts with visible text; `min-h-11` | axe 0 serious/critical |
| F-26 | S3 | `<ul>` with `<article>` children; h1→h3 jumps on Updates, Roadmap, Collaboration | `<li>` wrappers; visually hidden h2s | axe + heading-order test |
| F-27 | S3 | Modal close button 36 px | 44 px | touch-target test |
| F-28 | S3 | Animations played their delays under reduced motion; SMIL loader ignored it | `motion-safe:` everywhere; delays zeroed; CSS loader | e2e: no running animations on 18 pages |
| F-29 | S3 | Server-side field errors never displayed; no focus management | Fixed | e2e |
| F-30 | S3 | Contrast worst cases: header nav text over deep panels (4.13:1); coral state node (2.90:1) | Header glass opacity raised; coral-700 node outline | `check:contrast` 39/39 |
| F-16 | S4 | Coral small text on light backgrounds | Teal/ink text, coral icons | review + contrast |
| F-12/13 | S4 | Hex literals outside tokens; Tailwind default slate | Token imports | grep |
| F-18 | S4 | Logo on 84–85% glass | 90–95% | contrast script |
| F-15 | S5 | Manrope shipped twice (TTF + woff2) | One 22 KB woff2 | build |
| F-06/07 | S6 | ~45 unused deps, 38 unused UI components, Prisma, scaffold dirs, ~70 debug PNGs, tracked `.env`, `worklog.md` | Removed (recoverable from `.git-old-backup/`) | lint / build / tests |
| F-05/11 | S6 | Scaffold hello-world API; `console.log` in API | Removed | lint rule `no-console` (error only allowed) |
| F-09 | S6 | No npm lockfile (bun only) | `package-lock.json` | `npm ci` |
| F-31 | S6 | ESLint config disabled ~30 rules, so "0 warnings" was meaningless | Restored Next.js core-web-vitals + TS defaults; `--max-warnings=0` | lint clean |
| F-32 | S6 | `gray-matter` pulled 4 moderate advisories into prod deps | Replaced with `yaml` + Zod-validated frontmatter | `npm audit --omit=dev`: 0 |

---

## 3. Verification results (real output)

All results are from the final state of the repository, on Windows 11 / Node 22.20.0 / npm 11.19.1 / Chromium 153 (Playwright cache) / Chrome stable (Lighthouse).

### Static checks
```
npm run lint        → eslint . --max-warnings=0   (no output: 0 errors, 0 warnings)
npx tsc --noEmit    → 0 errors
npm run build       → ✓ Compiled successfully; ✓ Generating static pages (27/27); no warnings
```

### Contrast (`npm run check:contrast`)
```
All 39 pairings meet WCAG 2.2 AA.
(light + dark + deep surfaces; glass text checked at worst-case backdrop:
 tint and opaque fallback over page, glows, blobs, white cards and deep panels)
lowest: light nav link on header glass over teal-950 = 4.57:1 (min 4.5)
```

### E2E (`npm run test:e2e`, Playwright, production build)
```
npx playwright test   (production build; servers on :3000, :3001 and webhook sink :4599)
  183 passed (11.2m)
```

Coverage: 18 pages load with zero console errors, warnings or CSP violations; unique titles and descriptions; canonical, OG and Twitter tags; JSON-LD parses; 10 metadata/asset routes return 200 with the right content type; sitemap lists all pages; robots; security headers; 404 for bad URLs and bad slugs; desktop nav and `aria-current`; no nav overflow at 1280/1440/1920; tablet menu; mobile menu by keyboard (Escape returns focus) and touch; footer links; theme system/light/dark persistence and no flash; compact theme control; contact form (empty → accessible errors + focus, invalid email client and server, consent, valid → delivered with bearer, honeypot → not delivered, 429 after 5, 429 shown in UI, no health fields, 7 inquiry types, 503 when unconfigured); journey and roadmap by keyboard; modal focus trap; reduced motion (no running animations, 18 pages); reduced transparency (opaque glass via CDP media emulation); forced colors; JS disabled (18 pages readable, roadmap opens natively); **axe-core on 18 pages × light/dark × 375/1280 = 72 scans: 0 serious/critical**; skip link; visible focus on every tab stop and forward tab order (4 pages); heading order and alt text (18 pages); touch targets ≥ 44 px (5 pages × 2 widths); Manrope applied; screenshots at 375/768/1280/1920 × light/dark × 11 pages (88 images) with no horizontal overflow.

### Visual review
88 screenshots reviewed in `test-results/screenshots/` (regenerated by `test:e2e`). Found and fixed: system font instead of Manrope (F-20); low-emphasis teal-on-teal button on 404. Confirmed: logos only on solid surfaces or ≥ 90% glass; reversed lockup on deep surfaces in both themes; stacked lockup on a solid tile; no overflow at any width. Note: full-page captures taller than 16,384 px (home at 375 px) show a Chromium tiling repeat; this is a capture artifact, not a layout bug.

### Link crawl (`BASE_URL=http://localhost:3200 npm run check:links`, production server)
```
Crawled 18 pages, checked 223 internal links.
Zero broken links, zero broken anchors; custom 404 renders.
```

### Lighthouse (`npm run lighthouse`, mobile, default throttling, median of 3, production server)
```
page           perf  a11y  best-practices  seo   CLS    LCP     TBT    JS
/               95   100        100        100  0.000  2749ms  110ms  143KB
/our-science   100   100        100        100  0.000  1295ms   70ms  146KB
/updates        98   100        100        100  0.000  1286ms  167ms  146KB
/contact        95   100        100        100  0.000  1613ms  260ms  146KB
All Lighthouse targets met.
```
The first attempt crashed when one run on a cold server returned a Lighthouse `runtimeError` (no metrics). `scripts/lighthouse.mjs` now retries failed runs. The rerun above is the result.

### Dev mode
`next dev -p 3300`, then `E2E_BASE_URL=http://localhost:3300 npx playwright test tests/pages.spec.ts -g "loads cleanly|not-found"`:
```
18 passed, 1 failed: /why-neorhiza page.goto timed out (60 s) while the dev server compiled it (40 s on a loaded machine)
rerun of /why-neorhiza (page warm, --timeout=180000): 1 passed
dev server log: 0 lines matching error / warn / hydrat
```
All 18 pages plus the 404 route load in dev with zero console errors, zero hydration warnings and zero CSP violations. The one failure was dev-compile latency, not a page error.

### Dependency health
```
npm audit --omit=dev → found 0 vulnerabilities
npm audit (incl. dev)  → high-severity advisories only in dev tooling:
  eslint-config-next (micromatch/braces via @next/eslint-plugin-next),
  lighthouse (puppeteer-core → proxy-agent/basic-ftp/extract-zip).
  Not shipped to production; fixes need upstream releases. Re-check via Dependabot.
```

### Secret scan
```
Working tree (excl. node_modules/.next): no API keys, tokens, private keys or private URLs.
Env files: only .env.example (no values).
.next/static: no env-variable names, keys or bearer tokens.
Git history: new repository (fresh history); old history moved to .git-old-backup/ (git-ignored, not pushed).
```

---

## 4. Remaining Open items

| Item | Why open | What is needed |
|---|---|---|
| Verbatim copy, headings, stages, phases, values, disclaimers, inquiry-type wording | Spec file unavailable | Supply `neorhiza-website-prompt.md` |
| Logo clear-space / minimum-size rules | Spec §3 unavailable | Spec, or confirm the 120 px horizontal minimum |
| Annotated mark recolors the logo paths | Brand judgment | Owner decision: keep, or replace with an unaltered placement |
| Founder profile | No verified content | Verified bio, photo, statement (shown as "Verified profile in preparation") |
| Production domain | Default `https://neorhiza.org` is a placeholder | Set `NEXT_PUBLIC_SITE_URL` |
| Form delivery | No provider configured | Resend key + addresses, or a webhook URL |
| Rate-limit store for serverless | Optional but recommended | Upstash Redis (Vercel Marketplace) |
| Security contact | Placeholder in `SECURITY.md` | A monitored security mailbox |
| No-JS mobile navigation | The hamburger needs JS; without JS, the footer carries all links | Acceptable as-is; noted |
| `'unsafe-inline'` in `script-src` | Needed for the next-themes inline script without nonce middleware (which would make every page dynamic) | Revisit if nonce-based CSP becomes a requirement |

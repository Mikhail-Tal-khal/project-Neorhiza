# Analytics event plan

Measurement uses **Vercel Web Analytics** (page views, referrers, countries,
devices) and **Vercel Speed Insights** (Core Web Vitals). Both are
first-party, served from `/_vercel/*` on this domain, set no cookies and
report aggregates only. No advertising tracker, pixel or session recorder is
used — adding one requires a Privacy Policy update first.

The components render only in builds made on Vercel (`process.env.VERCEL`),
and must be enabled in the Vercel dashboard. Custom events need a Vercel plan
that supports them; page views work regardless.

## Rules

- Event names and properties are fixed in code (`src/lib/analytics-events.ts`).
- Properties are code-defined labels or slugs only. **Never** names, email
  addresses, organizations, message text or anything a visitor types.
- Analytics failures are swallowed; they never affect the page.

## Events

| Event | Fires when | Properties | Where |
|---|---|---|---|
| `contact_form_started` | First edit of any contact-form field (once per form view) | — | `contact-form.tsx` |
| `inquiry_submitted` | API confirms delivery (HTTP 200) | `area` — the selected inquiry type (fixed list) | `contact-form.tsx` |
| `collaboration_cta_clicked` | Any "Collaborate With Neorhiza" button | `location`: `header`, `mobile-menu`, `home-hero`, `home-invite`, `home-final` | header, hero, home sections |
| `research_overview_requested` | "Request the Public Research Overview" button or modal | `location`: `home-invite`, `collaboration-modal` | home, collaboration |
| `funding_inquiry_started` | Funding CTA clicked, Funders route chosen, or "Funding and foundation support" selected in the form | `location`: `funding-hero`, `funding-commitments`, `home-final`, `contact-routes`, `contact-form` | funding, home, contact |
| `article_opened` | An article page is viewed | `slug` — the article's URL slug | `updates/[slug]` |
| `outbound_profile_clicked` | Founder's portfolio or GitHub link | `location`: `portfolio`, `github` | why-neorhiza |

Click events use one delegated listener (`AnalyticsClickTracker`) and
`data-analytics-event` / `data-analytics-location` attributes, so server
components stay server-rendered.

## Funnel to watch

`funding_inquiry_started` / `collaboration_cta_clicked`
→ `contact_form_started` → `inquiry_submitted` (by `area`).

A large drop between `contact_form_started` and `inquiry_submitted` suggests
validation friction; check the form on mobile first.

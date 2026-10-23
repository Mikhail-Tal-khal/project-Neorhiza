# Project Neorhiza — Theme

**Date:** 2026-10-23 · **Scope:** theme refinement (softer, whiter, more polished). This overrides the color, background and glass rules in §7 of the v2 spec wherever they conflict.

The goal: a soft, calm, mostly pearl-and-off-white site. Deep teal is the accent for type, lines and buttons; coral is a small warm highlight. The logo files and logo colors (`#0F4C5C` teal, `#E36F5C` coral) are unchanged.

---

## 1. Color proportion rule

Across any light-mode viewport, aim for:

| Share | Role | Where |
|---|---|---|
| ~70% | Neutral | `--bg` pearl, `--bg-band` stone, `--surface` off-white cards |
| ~18% | Deep teal | Headings, buttons, links, logo, icons, and at most two deep panels per page (final CTA, footer) |
| ~10% | Soft tints | `--tint` icon chips and occasional highlights only |
| ~2% | Coral | Nodes, dots, the coral CTA button |

Teal is a text, line and button color, not a background for large areas. The only teal-filled areas are the final CTA and the footer, both solid `#0A3540` (teal-900).

## 2. Tokens

All values live in `src/styles/globals.css` (`:root` and `.dark`) and are exposed as Tailwind colors in `@theme inline`. Components use the token classes only: `bg-page`, `bg-band`/`.band`, `bg-surface`, `bg-tint`, `text-ink`, `text-heading`, `text-muted`, `border-border`.

### Light

| Token | Value | Use |
|---|---|---|
| `--bg` | `#F6F6F3` | Page background (soft pearl, a hint of warmth) |
| `--bg-band` | `#EEEFEC` | Alternate section bands (neutral stone) |
| `--surface` | `#FBFBF9` | Cards, panels, inputs, status badges |
| `--surface-glass` | `rgba(251, 251, 249, 0.72)` | Glass panels |
| `--border` | `rgba(15, 76, 92, 0.12)` | Hairlines and card borders |
| `--ink` | `#1C353C` | Body text |
| `--heading` | `#0F4C5C` | Headings (brand teal) |
| `--muted` | `#5A6D74` | Secondary text. **Spec value `#5F7279` gives 4.36:1 on `--bg-band`, below AA; darkened by the smallest step that passes (4.70:1).** |
| `--tint` | `#E7ECEC` | Pale teal-gray wash, low area only |
| `--coral-500` | `#E36F5C` | Nodes and small highlights |
| `--coral-100` | `#F9E6E1` | Soft warm highlight wash |
| `--coral-700` | `#B84A38` | Coral on light surfaces (icons, outlines; never small text) |

### Dark (calm deep slate-teal)

| Token | Value |
|---|---|
| `--bg` | `#0D262C` |
| `--bg-band` | `#102E35` |
| `--surface` | `#143840` |
| `--surface-glass` | `rgba(20, 56, 64, 0.62)` |
| `--border` | `rgba(255, 255, 255, 0.10)` |
| `--ink` | `#E6EEEF` |
| `--heading` | `#F2F6F6` |
| `--muted` | `#A9BDC2` |
| `--coral-500` | `#E36F5C` |

Dark backgrounds are flat. The deep CTA and footer panels stay teal-900 `#0A3540` in both themes.

### Component rules

- **No large area of pure `#FFFFFF`.** Measured at 0.0% on every page. White appears only as a glass highlight line and as text on deep teal. The stacked logo sits on an off-white `#FBFBF9` tile (`.logo-tile`), because no reversed stacked lockup exists.
- **Bands:** Home alternates `--bg` and `--bg-band` section by section. Our Science, Research Roadmap and Contact put the page header on `--bg` and the main content on a band.
- **Hero:** `--bg` with two large, faint, off-canvas radial washes (`.hero-wash`): `--coral-100` at 40% and `--tint` at 50%. They fade out inside the section, so there is no hard edge. This replaces the blurred teal blob, which was clipped into a visible line.
- **Buttons:** primary is solid `#0F4C5C` with `--surface` text (a light pill with dark text in dark mode). Secondary is transparent with a hairline outline and teal text. Hover changes lightness only (`brightness`), never hue. The coral light sweep was removed.
- **Status badges:** a `--surface` pill with a hairline border and a coral dot (previously teal glass).
- **Glass:** `--surface-glass`, `blur(16px) saturate(110%)` (was `saturate(1.5–1.6)`), a hairline `--border`, an inner 1 px `rgba(255,255,255,0.7)` edge, and a top highlight at 60% white or less. The header glass is 93% opaque so muted nav text keeps 4.5:1 over the deep footer.
- **Shadows:** neutral, layered: `0 1px 2px rgba(28,53,60,.06), 0 8px 24px rgba(28,53,60,.06)` (`shadow-soft`), plus `shadow-lift` for hover and open states. All teal-tinted glows were removed. Coral halos are 8% opacity at most.

## 3. Polish pass

- **Spacing:** sections use at least 80 px (mobile) / 96–112 px (desktop) vertical padding. Inner-page headers were unified to `py-16 lg:py-24`. The final CTA now has full section padding instead of sitting 16 px under the band above it.
- **Type:** body text is 17 px (`--text-base: 1.0625rem`) at line-height 1.6. Section leads are capped at `max-w-2xl` (about 70 characters).
- **Radius:** one scale: 12 px (`rounded-xl`), 20 px (`rounded-2xl`), 28 px (`rounded-3xl`). The one-off `2.5rem` radii and 8 px chips were folded into it.
- **Consistency:** about 120 paired classes (`text-teal-700 dark:text-teal-50`, `text-slate-500 dark:text-mist-200`, and so on) became single semantic tokens (`text-heading`, `text-muted`, `text-ink`). Ad-hoc teal hairlines became `border-border`. Icon chips use `bg-tint text-heading`.
- **Motion:** 200–400 ms ease-out. The bouncy `cubic-bezier(0.34, 1.56, …)` easing was removed, hover lifts (`-translate-y`) were replaced by a shadow change, and the reveal travel was reduced from 18 px to 8 px. Unused continuous keyframes (`float-slow`, `loading-travel`) were deleted. Nothing loops.
- **Illustration:** hero vessel strokes are thinner (7/5/3.4 → 4.5/3.5/2.5 px; connector 2 → 1.5 px). Each segment draws in 400 ms.
- **Logo fix:** the final CTA rendered the light stacked lockup directly on deep teal, so the teal wordmark was nearly invisible (this predates the refinement). It now sits on its solid light tile, as `BrandMark` requires.

## 4. Measurements

### How

```bash
npm run build && npm start                    # production server on :3000
npm run screenshots -- docs/theme/after       # Home, Our Science, Roadmap, Contact · 1280 px · light + dark
npm run check:palette -- docs/theme/after     # light-mode color proportions; fails on a limit
npm run check:contrast                        # WCAG 2.2 AA, both themes
```

Set `PLAYWRIGHT_CHROMIUM_PATH` to a local Chromium if Playwright's managed browser is not installed. The headless shell is much faster for full-page captures with backdrop blur.

### Palette metric definitions (`scripts/check-palette.mjs`)

- **teal wash (enforced, < 12%)**: hue 150°–210°, HSL saturation > 25%, lightness ≥ 50%.
- **deep teal (reported)**: the same hue and saturation at lightness < 50%. This is the CTA and footer panels plus teal type. It is budgeted in the ~18% teal share, not the wash.
- **literal**: wash + deep. This is the rule exactly as first written (hue and saturation only).
- **pure white (enforced, < 10%)**: exactly `#FFFFFF`.
- **near-neutral (reported)**: chroma (max − min channel) < 6%.
- **green cast (reported)**: near-white pixels (lightness ≥ 85%) whose green or blue channel exceeds red by more than 2. This is what made the old site read as "green".

**Why the wash limit is split by lightness:** applied literally, the rule counts the mandated teal-900 footer as "wash". On short pages (Contact, Roadmap) the footer alone covers 25–30% of the screenshot, so no design that keeps the required footer could pass. Pale tints, the actual "wash", are under 0.1% on every page.

### Results (light mode, 1280 px)

| Page | Near-neutral | Teal wash (enforced < 12%) | Deep teal | Literal (wash + deep) | Pure white (enforced < 10%) | Green cast | Coral |
|---|---|---|---|---|---|---|---|
| Home — before | 86.9% | 1.1% | 11.1% | 12.3% | 0.1% | **56.9%** | 0.4% |
| Home — after | 86.8% | **0.0%** | 11.5% | 11.5% | **0.0%** | **1.1%** | 0.2% |
| Our Science — before | 88.3% | 0.5% | 9.2% | 9.7% | 0.0% | **28.9%** | 0.0% |
| Our Science — after | 89.7% | **0.0%** | 8.2% | 8.2% | **0.0%** | **1.6%** | 0.0% |
| Research Roadmap — before | 72.4% | 0.1% | 25.9% | 25.9% | 0.1% | **37.7%** | 0.1% |
| Research Roadmap — after | 73.7% | **0.0%** | 24.7% | 24.7% | **0.0%** | **1.3%** | 0.0% |
| Contact — before | 67.1% | 0.2% | 30.9% | 31.0% | 0.2% | **30.2%** | 0.1% |
| Contact — after | 68.6% | **0.0%** | 29.6% | 29.6% | **0.0%** | **1.0%** | 0.0% |

`npm run check:palette` → **All 4 light-mode pages are within the palette limits.**

Note that the old site also passes the enforced hue rule: its pale tints were already rare. What made it read as green was the near-white background itself (`#F4F7F2`, green over red by 3) and the teal-50 card tints (`#E8F1F2`). The **green-cast** column measures exactly that, and it fell from 29–57% of the page to 1.0–1.6% (what remains is anti-aliasing around teal type and icons).

Contrast: `npm run check:contrast` → **All 58 pairings meet WCAG 2.2 AA** (both themes, glass checked at its worst-case backdrop). The lowest are muted text on the band at 4.70:1 and muted nav text on header glass over the deep footer at 4.60:1.

### Screenshots

Before and after, 1280 px, light and dark: `docs/theme/before/` and `docs/theme/after/`. These are WebP (quality 82) copies for review. The palette numbers above were measured on the lossless PNG captures, which are not committed. Regenerate them with `npm run screenshots`.

| Page | Before (light) | After (light) | Before (dark) | After (dark) |
|---|---|---|---|---|
| Home | [before](theme/before/1280-light-home.webp) | [after](theme/after/1280-light-home.webp) | [before](theme/before/1280-dark-home.webp) | [after](theme/after/1280-dark-home.webp) |
| Our Science | [before](theme/before/1280-light-science.webp) | [after](theme/after/1280-light-science.webp) | [before](theme/before/1280-dark-science.webp) | [after](theme/after/1280-dark-science.webp) |
| Research Roadmap | [before](theme/before/1280-light-roadmap.webp) | [after](theme/after/1280-light-roadmap.webp) | [before](theme/before/1280-dark-roadmap.webp) | [after](theme/after/1280-dark-roadmap.webp) |
| Contact | [before](theme/before/1280-light-contact.webp) | [after](theme/after/1280-light-contact.webp) | [before](theme/before/1280-dark-contact.webp) | [after](theme/after/1280-dark-contact.webp) |

### What changed, honestly

- **Light mode** now reads as pearl and stone rather than pale green. Sections have a visible rhythm (pearl `#F6F6F3` / stone `#EEEFEC`) without any color, and cards are off-white with soft neutral shadows instead of blue-green glows. Teal is confined to type, buttons, icons and the two deep panels. There is no pure white anywhere large. The hero no longer has the hard horizontal edge where the clipped blurred blob ended.
- **Dark mode** is a flat, calm slate-teal (`#0D262C` / `#102E35`). The glowing gradient at the top of each glass card is reduced to a faint highlight.
- **Still teal-heavy by area:** Contact and Roadmap are short, so the required deep footer covers about a quarter of their screenshots. This is by design (one of the two allowed panels), but it is the largest single colored area on those pages.
- **Unchanged by design:** the hero illustration keeps coral cell nodes (see open decisions), and the CTA/footer keep teal-900.

## 5. Open decisions

- **Pearl temperature.** `--bg #F6F6F3` is very slightly warm. A cooler option is `#F5F6F5`; a warmer one is `#F7F6F2`. Both keep every contrast pairing.
- **Wash metric.** Confirm the lightness split above, or define a different rule for the deep panels.
- **`--muted`.** `#5A6D74` instead of the spec's `#5F7279` (required for AA on the band). The alternative is a lighter band.
- **Hero illustration coral.** The cell, cluster and tissue stages are coral nodes because they represent cells. The rule "coral limited to the tips" was applied only to the vessel tree. Making the cell stages teal would reduce coral further but would weaken the cell-to-tissue story.

## 6. Regression checks (2026-10-23)

| Check | Result |
|---|---|
| `npm run lint` | 0 problems |
| `npm run typecheck` | 0 errors |
| `npm run check:contrast` | All 58 pairings meet WCAG 2.2 AA |
| `npm run check:palette` | 4 / 4 pages within limits |
| `npm run build` | Success |
| `npm run test:e2e` (183 tests) | 181 passed. 2 failed with `page.goto` 60 s timeouts on the first navigations while the servers were warming up (axe · mobile · light `/` and `/why-neorhiza`). They are not violations: re-running `tests/a11y.spec.ts` alone gave **97 / 97 passed**, 0 serious or critical axe findings |
| Lighthouse (mobile) | `/` 93 / 100 / 100 / 100, `/our-science` 99 / 100 / 100 / 100, `/updates` 99 / 100 / 100 / 100, `/contact` 99 / 100 / 100 / 100 (perf / a11y / best practices / SEO); CLS 0.000 everywhere; "All Lighthouse targets met" |

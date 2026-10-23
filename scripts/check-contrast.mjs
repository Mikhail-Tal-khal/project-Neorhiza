/**
 * Neorhiza contrast check (WCAG 2.2 AA).
 *
 * Reads the color tokens for BOTH themes from src/styles/globals.css
 * (@theme scale, :root and .dark blocks) and checks every documented
 * text/background pairing. Text on glass is checked at its WORST-CASE
 * backdrop: the glass tint composited over each surface it can float above
 * (page background, section band, hero washes, surface cards, tint wash,
 * and for the header also deep-teal panels), using both the backdrop-filter
 * tint and the opaque fallback.
 *
 * Thresholds: 4.5:1 normal text, 3:1 large text and graphics/UI.
 * Exits non-zero on any failure.
 *
 * Usage: npm run check:contrast
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(ROOT, "src/styles/globals.css"), "utf8");

/* ------------------------------ parsing ------------------------------ */

function block(selectorRe) {
  const m = css.match(selectorRe);
  if (!m) throw new Error(`Block ${selectorRe} not found`);
  return m[1];
}
const themeBlock = block(/@theme\s*\{([\s\S]*?)\n\}/);
const rootBlock = block(/\n:root\s*\{([\s\S]*?)\n\}/);
const darkBlock = block(/\n\.dark\s*\{([\s\S]*?)\n\}/);

/** Parses #hex, rgb(r g b / a) or rgba(r, g, b, a) → [r, g, b, a]. */
function parseColor(value) {
  const v = value.trim();
  let m = v.match(/^#([0-9a-f]{3,8})$/i);
  if (m) {
    const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join("") : m[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).concat(1);
  }
  m = v.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[/,]\s*([\d.]+))?\s*\)$/);
  if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
  throw new Error(`Unparseable color: ${value}`);
}

function rawToken(src, name) {
  const m = src.match(new RegExp(`--${name}:\\s*([^;]+);`));
  return m ? m[1].replace(/\/\*.*?\*\//g, "").trim() : undefined;
}

/** Token getter for a theme block; var(--x) resolves in that block, then :root. */
function resolver(src) {
  return function get(name) {
    const v = rawToken(src, name) ?? rawToken(rootBlock, name);
    if (v === undefined) throw new Error(`Token --${name} not found`);
    const ref = v.match(/^var\(--([\w-]+)\)$/);
    return ref ? get(ref[1]) : parseColor(v);
  };
}

const scale = (name) => resolver(themeBlock)(`color-${name}`);

/* ------------------------------ color math ------------------------------ */

/** Composites a (possibly translucent) color over an opaque backdrop. */
function over(fg, bg) {
  const a = fg[3];
  return [0, 1, 2].map((i) => Math.round(fg[i] * a + bg[i] * (1 - a))).concat(1);
}
const withAlpha = (c, a) => [c[0], c[1], c[2], a];
const opaque = (c, bg) => (c[3] < 1 ? over(c, bg) : c);
/** CSS brightness(k) filter on an opaque color. */
const bright = (c, k) => [0, 1, 2].map((i) => Math.min(255, Math.round(c[i] * k))).concat(1);

function luminance([r, g, b]) {
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function contrast(fg, bg) {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

/* ------------------------------ palette ------------------------------ */

const WHITE = [255, 255, 255, 1];
const C = {
  teal400: scale("teal-400"),
  teal700: scale("teal-700"),
  teal900: scale("teal-900"),
  teal950: scale("teal-950"),
  coral100: scale("coral-100"),
  coral300: scale("coral-300"),
  coral500: scale("coral-500"),
  coral700: scale("coral-700"),
  mist200: scale("mist-200"),
};

const themeTokens = (get) => ({
  bg: get("bg"),
  band: get("bg-band"),
  surface: get("surface"),
  tint: get("tint"),
  ink: get("ink"),
  heading: get("heading"),
  muted: get("muted"),
  primary: get("primary"),
  primaryFg: get("primary-foreground"),
  glass: get("glass-tint"),
  glassFallback: get("glass-fallback"),
  glassStrong: get("glass-strong-tint"),
  glassStrongFallback: get("glass-strong-fallback"),
  washWarm: get("hero-wash-warm"),
  washCool: get("hero-wash-cool"),
  focus: get("focus-color"),
});
const L = themeTokens(resolver(rootBlock));
const D = themeTokens(resolver(darkBlock));

/* Every opaque surface glass can float above, per theme. */
const backdrops = (T) => ({
  page: T.bg,
  band: T.band,
  "hero wash (warm)": over(T.washWarm, T.bg),
  "hero wash (cool)": over(T.washCool, T.bg),
  "surface card": T.surface,
  "tint wash": opaque(T.tint, T.bg),
});
const LIGHT_BACKDROPS = backdrops(L);
const DARK_BACKDROPS = backdrops(D);
/* The fixed header (glass-strong) scrolls over any content, including the
   deep-teal panels, the stacked-logo tile and light pills. */
const LIGHT_HEADER_BACKDROPS = { ...LIGHT_BACKDROPS, "deep panel teal-900": C.teal900 };
const DARK_HEADER_BACKDROPS = {
  ...DARK_BACKDROPS,
  "deep panel teal-900": C.teal900,
  "white logo tile": WHITE,
  "light pill": D.primary,
};

/** Worst-case contrast of `fg` over glass `tints` on every backdrop. */
function worstOnGlass(fg, tints, backdrops) {
  let worst = { ratio: Infinity, where: "" };
  for (const [tintName, tint] of Object.entries(tints)) {
    for (const [bdName, bd] of Object.entries(backdrops)) {
      const ratio = contrast(fg, over(tint, bd));
      if (ratio < worst.ratio) worst = { ratio, where: `${tintName} over ${bdName}` };
    }
  }
  return worst;
}

/* ------------------------------ pairings ------------------------------ */

const AA = 4.5;
const LARGE = 3.0;

const solid = (name, fg, bg, min) => ({ name, ratio: contrast(fg, bg), min });
const glass = (name, fg, tints, backdrops, min) => {
  const w = worstOnGlass(fg, tints, backdrops);
  return { name: `${name} [worst: ${w.where}]`, ratio: w.ratio, min };
};

const LG = { tint: L.glass, fallback: L.glassFallback };
const DG = { tint: D.glass, fallback: D.glassFallback };
const LGS = { tint: L.glassStrong, fallback: L.glassStrongFallback };
const DGS = { tint: D.glassStrong, fallback: D.glassStrongFallback };

const pairs = [
  // ---------- LIGHT ----------
  solid("light: body text (ink) on page", L.ink, L.bg, AA),
  solid("light: body text on band", L.ink, L.band, AA),
  solid("light: body text on surface card", L.ink, L.surface, AA),
  solid("light: heading teal on page", L.heading, L.bg, AA),
  solid("light: heading teal on band", L.heading, L.band, AA),
  solid("light: heading teal on tint chip", L.heading, opaque(L.tint, L.surface), AA),
  solid("light: muted text on page", L.muted, L.bg, AA),
  solid("light: muted text on band", L.muted, L.band, AA),
  solid("light: muted text on surface card", L.muted, L.surface, AA),
  solid("light: surface text on primary button", L.primaryFg, L.primary, AA),
  solid("light: surface text on primary hover (brightness 1.18)", L.primaryFg, bright(L.primary, 1.18), AA),
  solid("light: teal-950 text on coral-500 button", C.teal950, C.coral500, AA),
  solid("light: teal-950 text on coral hover (brightness 1.05)", C.teal950, bright(C.coral500, 1.05), AA),
  solid("light: teal text on coral-100 chip", L.heading, C.coral100, AA),
  // Light mode never sets small text in coral: errors are ink text + coral-700 icon.
  solid("light: coral-700 error/accent icon on page (graphics)", C.coral700, L.bg, LARGE),
  solid("light: coral-700 journey node outline on band (graphics)", C.coral700, L.band, LARGE),
  solid("light: teal-400 icons/lines on page (graphics)", C.teal400, L.bg, LARGE),
  solid("light: teal-400 icons/lines on band (graphics)", C.teal400, L.band, LARGE),
  solid("light: focus ring on page (graphics)", L.focus, L.bg, LARGE),
  solid("light: focus ring on band (graphics)", L.focus, L.band, LARGE),
  glass("light: body text on glass", L.ink, LG, LIGHT_BACKDROPS, AA),
  glass("light: muted text on glass", L.muted, LG, LIGHT_BACKDROPS, AA),
  glass("light: heading teal on glass", L.heading, LG, LIGHT_BACKDROPS, AA),
  glass(
    "light: ink error text on error panel (coral-100/60 over glass)",
    L.ink,
    {
      tint: over(withAlpha(C.coral100, 0.6), over(L.glass, L.bg)),
      fallback: over(withAlpha(C.coral100, 0.6), over(L.glassFallback, L.bg)),
    },
    { page: L.bg },
    AA
  ),
  glass("light: nav link (muted) on header glass", L.muted, LGS, LIGHT_HEADER_BACKDROPS, AA),
  glass("light: nav current (teal) on header glass", L.heading, LGS, LIGHT_HEADER_BACKDROPS, AA),

  // ---------- DARK ----------
  solid("dark: body text on page", D.ink, D.bg, AA),
  solid("dark: body text on band", D.ink, D.band, AA),
  solid("dark: body text on surface card", D.ink, D.surface, AA),
  solid("dark: heading on page", D.heading, D.bg, AA),
  solid("dark: heading on surface card", D.heading, D.surface, AA),
  solid("dark: muted text on page", D.muted, D.bg, AA),
  solid("dark: muted text on band", D.muted, D.band, AA),
  solid("dark: muted text on surface card", D.muted, D.surface, AA),
  solid("dark: dark text on light primary pill", D.primaryFg, D.primary, AA),
  solid("dark: dark text on primary hover (brightness 0.9)", D.primaryFg, bright(D.primary, 0.9), AA),
  solid("dark: teal-950 text on coral-500 button", C.teal950, C.coral500, AA),
  solid("dark: coral-300 error text on page", C.coral300, D.bg, AA),
  solid("dark: coral-300 text on surface card", C.coral300, D.surface, AA),
  solid("dark: mist link on page", C.mist200, D.bg, AA),
  solid("dark: mist link on surface card", C.mist200, D.surface, AA),
  solid("dark: coral-500 node on page (graphics)", C.coral500, D.bg, LARGE),
  solid("dark: teal-400 lines on page (graphics)", C.teal400, D.bg, LARGE),
  solid("dark: focus ring on page (graphics)", D.focus, D.bg, LARGE),
  solid("dark: focus ring on surface card (graphics)", D.focus, D.surface, LARGE),
  glass("dark: body text on glass", D.ink, DG, DARK_BACKDROPS, AA),
  glass("dark: muted text on glass", D.muted, DG, DARK_BACKDROPS, AA),
  glass("dark: heading on glass", D.heading, DG, DARK_BACKDROPS, AA),
  glass(
    "dark: coral-300 error on error panel (coral-500/10 over glass)",
    C.coral300,
    {
      tint: over(withAlpha(C.coral500, 0.1), over(D.glass, D.bg)),
      fallback: over(withAlpha(C.coral500, 0.1), over(D.glassFallback, D.bg)),
    },
    { page: D.bg },
    AA
  ),
  glass("dark: nav link (muted) on header glass", D.muted, DGS, DARK_HEADER_BACKDROPS, AA),
  glass("dark: nav current (white) on header glass", WHITE, DGS, DARK_HEADER_BACKDROPS, AA),

  // ---------- DEEP BRAND SURFACES (final CTA, footer, 404) ----------
  solid("deep: white text on teal-900", WHITE, C.teal900, AA),
  solid("deep: mist text on teal-900", C.mist200, C.teal900, AA),
  solid("deep: mist/80 small text on teal-900", over(withAlpha(C.mist200, 0.8), C.teal900), C.teal900, AA),
  solid("deep: white text on white/10 pill over teal-900", WHITE, over(withAlpha(WHITE, 0.1), C.teal900), AA),
  solid("deep: coral-300 text on teal-900", C.coral300, C.teal900, AA),
  solid("deep: reversed logo (white) on teal-900 (graphics)", WHITE, C.teal900, LARGE),
  solid("deep: coral tips on teal-900 (graphics)", C.coral500, C.teal900, LARGE),
];

let failures = 0;
for (const { name, ratio, min } of pairs) {
  const pass = ratio >= min;
  if (!pass) failures++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${ratio.toFixed(2).padStart(5)}:1  (min ${min.toFixed(1)})  ${name}`);
}
console.log(
  failures === 0
    ? `\nAll ${pairs.length} pairings meet WCAG 2.2 AA.`
    : `\n${failures} of ${pairs.length} pairing(s) FAILED.`
);
process.exit(failures === 0 ? 0 : 1);

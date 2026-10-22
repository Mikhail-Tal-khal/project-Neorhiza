/**
 * Neorhiza contrast check (WCAG 2.2 AA).
 *
 * Reads the color tokens for BOTH themes from src/styles/globals.css
 * (@theme scale, :root and .dark blocks) and checks every documented
 * text/background pairing. Text on glass is checked at its WORST-CASE
 * backdrop: the glass tint composited over each surface it can float above
 * (page background, decorative glows and blobs, deep-teal panels, white
 * cards), using both the backdrop-filter tint and the opaque fallback.
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

function tokenIn(src, name) {
  const m = src.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!m) throw new Error(`Token --${name} not found`);
  return parseColor(m[1].replace(/\/\*.*?\*\//g, ""));
}

const scale = (name) => tokenIn(themeBlock, `color-${name}`);
const light = (name) => tokenIn(rootBlock, name);
const dark = (name) => tokenIn(darkBlock, name);

/* ------------------------------ color math ------------------------------ */

/** Composites a (possibly translucent) color over an opaque backdrop. */
function over(fg, bg) {
  const a = fg[3];
  return [0, 1, 2].map((i) => Math.round(fg[i] * a + bg[i] * (1 - a))).concat(1);
}
const withAlpha = (c, a) => [c[0], c[1], c[2], a];

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
  teal50: scale("teal-50"),
  teal100: scale("teal-100"),
  teal200: scale("teal-200"),
  teal400: scale("teal-400"),
  teal700: scale("teal-700"),
  teal900: scale("teal-900"),
  teal950: scale("teal-950"),
  coral100: scale("coral-100"),
  coral300: scale("coral-300"),
  coral500: scale("coral-500"),
  coral700: scale("coral-700"),
  ink: scale("ink"),
  slate500: scale("slate-500"),
  mist200: scale("mist-200"),
};

const L = {
  bg: light("background"),
  fg: light("foreground"),
  muted: light("muted-foreground"),
  primary: light("primary"),
  destructive: light("destructive"),
  glass: light("glass-tint"),
  glassFallback: light("glass-fallback"),
  glassStrong: light("glass-strong-tint"),
  glassStrongFallback: light("glass-strong-fallback"),
  glow1: light("page-glow-1"),
  glow2: light("page-glow-2"),
};
const D = {
  bg: dark("background"),
  fg: dark("foreground"),
  muted: dark("muted-foreground"),
  primary: dark("primary"),
  destructive: dark("destructive"),
  glass: dark("glass-tint"),
  glassFallback: dark("glass-fallback"),
  glassStrong: dark("glass-strong-tint"),
  glassStrongFallback: dark("glass-strong-fallback"),
  glow1: dark("page-glow-1"),
  glow2: dark("page-glow-2"),
};

/* Every opaque surface glass can float above, per theme (decorative blobs
   from the hero and section backgrounds included). */
const LIGHT_BACKDROPS = {
  page: L.bg,
  "page glow 1": over(L.glow1, L.bg),
  "page glow 2 (coral)": over(L.glow2, L.bg),
  "hero blob teal-50/80": over(withAlpha(C.teal50, 0.8), L.bg),
  "hero blob coral-100/50": over(withAlpha(C.coral100, 0.5), L.bg),
  "white card": WHITE,
};
const DARK_BACKDROPS = {
  page: D.bg,
  "page glow 1": over(D.glow1, D.bg),
  "page glow 2": over(D.glow2, D.bg),
  "hero blob teal-700/15": over(withAlpha(C.teal700, 0.15), D.bg),
  "blob coral-500/8": over(withAlpha(C.coral500, 0.08), D.bg),
  "card teal-900": C.teal900,
};
/* The fixed header (glass-strong) scrolls over any content, including
   deep-teal panels in light mode and white tiles in dark mode. */
const LIGHT_HEADER_BACKDROPS = { ...LIGHT_BACKDROPS, "deep panel teal-900": C.teal900, "deep panel teal-950": C.teal950 };
const DARK_HEADER_BACKDROPS = { ...DARK_BACKDROPS, "white logo tile": WHITE, "mist button": D.primary };

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
  solid("light: body text (ink) on page", L.fg, L.bg, AA),
  solid("light: body text on white card", L.fg, WHITE, AA),
  solid("light: muted text (slate-500) on page", L.muted, L.bg, AA),
  solid("light: muted text on white card", L.muted, WHITE, AA),
  solid("light: teal-700 heading/link on page", L.primary, L.bg, AA),
  solid("light: white text on teal-700 button", WHITE, L.primary, AA),
  solid("light: white text on teal-900 button hover", WHITE, C.teal900, AA),
  solid("light: teal-950 text on coral-500 button", C.teal950, C.coral500, AA),
  solid("light: teal-950 text on coral-300 button hover", C.teal950, C.coral300, AA),
  // Light mode never sets small text in coral: errors are ink text + coral-700 icon.
  solid("light: coral-700 error/accent icon on page (graphics)", C.coral700, L.bg, LARGE),
  solid("light: teal-700 chip text on coral-100", L.primary, C.coral100, AA),
  solid("light: teal-400 icons/lines on page (graphics)", C.teal400, L.bg, LARGE),
  // Journey state nodes: coral-500 fill carries a coral-700 outline in light mode.
  solid("light: active journey node outline (coral-700) on page (graphics)", C.coral700, L.bg, LARGE),
  glass("light: body text on glass", L.fg, LG, LIGHT_BACKDROPS, AA),
  glass("light: muted text on glass", L.muted, LG, LIGHT_BACKDROPS, AA),
  glass("light: teal-700 text on glass", L.primary, LG, LIGHT_BACKDROPS, AA),
  glass(
    "light: ink error text on error panel (coral-100/60 over glass)",
    L.fg,
    { tint: over(withAlpha(C.coral100, 0.6), over(L.glass, L.bg)), fallback: over(withAlpha(C.coral100, 0.6), L.glassFallback) },
    { page: L.bg },
    AA
  ),
  glass("light: nav link (slate-500) on header glass", L.muted, LGS, LIGHT_HEADER_BACKDROPS, AA),
  glass("light: nav current (teal-700) on header glass", L.primary, LGS, LIGHT_HEADER_BACKDROPS, AA),

  // ---------- DARK ----------
  solid("dark: body text on page", D.fg, D.bg, AA),
  solid("dark: body text on teal-900 card", D.fg, C.teal900, AA),
  solid("dark: muted text (mist) on page", D.muted, D.bg, AA),
  solid("dark: mist link/heading on page", D.primary, D.bg, AA),
  solid("dark: teal-950 text on mist (white/90) button", C.teal950, over(withAlpha(WHITE, 0.9), D.bg), AA),
  solid("dark: teal-950 text on coral-500 button", C.teal950, C.coral500, AA),
  solid("dark: coral-300 error text on page", C.coral300, D.bg, AA),
  solid("dark: coral-500 node on page (graphics)", C.coral500, D.bg, LARGE),
  solid("dark: teal-400 lines on page (graphics)", C.teal400, D.bg, LARGE),
  glass("dark: body text on glass", D.fg, DG, DARK_BACKDROPS, AA),
  glass("dark: muted text on glass", D.muted, DG, DARK_BACKDROPS, AA),
  glass(
    "dark: coral-300 error on error panel (coral-500/10 over glass)",
    C.coral300,
    { tint: over(withAlpha(C.coral500, 0.1), over(D.glass, D.bg)), fallback: over(withAlpha(C.coral500, 0.1), over(D.glassFallback, D.bg)) },
    { page: D.bg },
    AA
  ),
  glass("dark: nav link (mist) on header glass", D.muted, DGS, DARK_HEADER_BACKDROPS, AA),
  glass("dark: nav current (white) on header glass", WHITE, DGS, DARK_HEADER_BACKDROPS, AA),

  // ---------- DEEP BRAND SURFACES (final CTA, footer, 404) ----------
  solid("deep: white text on teal-900", WHITE, C.teal900, AA),
  solid("deep: white text on teal-950", WHITE, C.teal950, AA),
  solid("deep: mist text on teal-900", C.mist200, C.teal900, AA),
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

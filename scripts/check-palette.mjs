/**
 * Neorhiza palette check (light mode).
 *
 * Measures the color proportion of each light-mode screenshot produced by
 * `npm run screenshots` and enforces the theme limits from docs/THEME.md:
 *   - "green/teal wash": pixels with hue 150°–210°, HSL saturation above 25%
 *     and lightness of at least 50% must cover under 12% of the page;
 *   - pure white (#FFFFFF) must cover under 10% of the page.
 *
 * The wash limit applies to light tints only. Dark pixels in the same hue
 * range are the deep-teal brand panels (final CTA, footer), which the theme
 * requires and budgets inside the ~18% teal share; on short pages the footer
 * alone covers about a quarter of the screenshot. They are reported as
 * "deep teal", and the literal all-lightness total is printed too.
 *
 * Reported for information:
 *   - near-neutral: chroma (max − min channel) under 6%, which unlike HSL
 *     saturation does not inflate for pale near-white colors;
 *   - green cast: near-white pixels (lightness ≥ 85%) whose green or blue
 *     channel exceeds red by more than 2, i.e. a cool/green-tinted "white";
 *   - coral share.
 *
 * Usage: npm run check:palette -- [dir]   (dir defaults to test-results/palette)
 * Exits non-zero if any limit is exceeded or no screenshots are found.
 */
import { readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const dir = process.argv[2] ?? "test-results/palette";
const LIMITS = { wash: 0.12, white: 0.1 };
const NEUTRAL_MAX_CHROMA = 0.06 * 255;

/** RGB 0–255 → [hue°, HSL saturation 0–1, lightness 0–1]. */
function hsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60;
  if (h < 0) h += 360;
  return [h, s, l];
}

async function measure(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const total = info.width * info.height;
  const n = { neutral: 0, wash: 0, deep: 0, white: 0, cast: 0, coral: 0 };
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r === 255 && g === 255 && b === 255) n.white++;
    const [h, s, l] = hsl(r, g, b);
    if (Math.max(r, g, b) - Math.min(r, g, b) < NEUTRAL_MAX_CHROMA) n.neutral++;
    if (h >= 150 && h <= 210 && s > 0.25) {
      if (l >= 0.5) n.wash++;
      else n.deep++;
    }
    if (l >= 0.85 && Math.max(g, b) - r > 2) n.cast++;
    if ((h <= 20 || h >= 340) && s > 0.35) n.coral++;
  }
  return { ...Object.fromEntries(Object.entries(n).map(([k, v]) => [k, v / total])), size: `${info.width}×${info.height}` };
}

const files = readdirSync(dir).filter((f) => /-light-.*\.png$/.test(f)).sort();
if (files.length === 0) {
  console.error(`No light-mode screenshots in ${dir}. Run \`npm run screenshots\` first.`);
  process.exit(1);
}

const pct = (x) => `${(x * 100).toFixed(1)}%`.padStart(7);
let failures = 0;
console.log(
  "     page                   size          neutral  teal-wash  deep-teal  (literal)  pure-white  green-cast  coral"
);
for (const f of files) {
  const m = await measure(join(dir, f));
  const problems = [];
  if (m.wash >= LIMITS.wash) problems.push(`teal wash ≥ ${LIMITS.wash * 100}%`);
  if (m.white >= LIMITS.white) problems.push(`pure white ≥ ${LIMITS.white * 100}%`);
  if (problems.length) failures++;
  console.log(
    `${problems.length ? "FAIL" : "PASS"} ${f.replace(/\.png$/, "").padEnd(22)} ${m.size.padEnd(12)} ${pct(m.neutral)}  ${pct(m.wash)}    ${pct(m.deep)}    ${pct(m.wash + m.deep)}     ${pct(m.white)}     ${pct(m.cast)}  ${pct(m.coral)}` +
      (problems.length ? `   ← ${problems.join(", ")}` : "")
  );
}
console.log(
  failures === 0
    ? `\nAll ${files.length} light-mode pages are within the palette limits (teal wash < 12%, pure white < 10%).`
    : `\n${failures} of ${files.length} page(s) exceed the palette limits.`
);
process.exit(failures === 0 ? 0 : 1);

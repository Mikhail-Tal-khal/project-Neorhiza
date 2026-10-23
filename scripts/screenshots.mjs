/**
 * Theme screenshots for the palette check and before/after review.
 *
 * Captures full-page screenshots of Home, Our Science, Research Roadmap and
 * Contact at 1280 px wide in light and dark mode, with reduced motion so
 * every reveal animation is settled.
 *
 * Requires a running site (default http://localhost:3000, e.g. `npm run
 * build && npm start`). Set PLAYWRIGHT_CHROMIUM_PATH to use a local Chromium.
 *
 * Usage: npm run screenshots -- [outDir] [baseURL]
 *   outDir defaults to test-results/palette
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";

export const PALETTE_PAGES = {
  home: "/",
  science: "/our-science",
  roadmap: "/roadmap",
  contact: "/contact",
};
const THEMES = ["light", "dark"];
const WIDTH = 1280;

const outDir = process.argv[2] ?? "test-results/palette";
const baseURL = process.argv[3] ?? process.env.E2E_BASE_URL ?? "http://localhost:3000";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined });
try {
  for (const theme of THEMES) {
    const context = await browser.newContext({
      viewport: { width: WIDTH, height: 900 },
      colorScheme: theme,
      reducedMotion: "reduce",
    });
    await context.addInitScript((t) => {
      try {
        localStorage.setItem("theme", t);
      } catch {}
    }, theme);
    const page = await context.newPage();
    for (const [name, path] of Object.entries(PALETTE_PAGES)) {
      await page.goto(new URL(path, baseURL).href);
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);
      const file = join(outDir, `${WIDTH}-${theme}-${name}.png`);
      await page.screenshot({ path: file, fullPage: true, animations: "disabled", timeout: 120_000 });
      console.log(`saved ${file}`);
    }
    await context.close();
  }
} finally {
  await browser.close();
}

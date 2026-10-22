import { expect, test } from "@playwright/test";
import { presetTheme } from "./support/site";

/**
 * Captures full-page screenshots for manual visual review (layout breaks,
 * overflow, text on glass, logo misuse) and asserts no horizontal overflow.
 * Output: test-results/screenshots/<width>-<theme>-<page>.png
 */
const WIDTHS = [375, 768, 1280, 1920];
const THEMES = ["light", "dark"] as const;
const SHOTS = {
  home: "/",
  why: "/why-neorhiza",
  science: "/our-science",
  roadmap: "/roadmap",
  impact: "/human-impact",
  collaboration: "/collaboration",
  updates: "/updates",
  article: "/updates/what-a-bioreactor-does",
  contact: "/contact",
  privacy: "/privacy",
  notfound: "/this-page-does-not-exist",
};

for (const width of WIDTHS) {
  for (const theme of THEMES) {
    test(`screenshots ${width}px ${theme}`, async ({ page }) => {
      test.setTimeout(180_000);
      await presetTheme(page, theme);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width, height: 900 });
      for (const [name, path] of Object.entries(SHOTS)) {
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        await page.evaluate(() => document.fonts.ready);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${name} horizontal overflow at ${width}px`).toBeLessThanOrEqual(0);
        await page.screenshot({
          path: `test-results/screenshots/${width}-${theme}-${name}.png`,
          fullPage: true,
        });
      }
    });
  }
}

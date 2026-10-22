import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { PAGES, presetTheme } from "./support/site";

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "desktop", width: 1280, height: 900 },
] as const;
const THEMES = ["light", "dark"] as const;

async function axe(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
    .analyze();
  return results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
}

for (const vp of VIEWPORTS) {
  for (const theme of THEMES) {
    test.describe(`axe · ${vp.name} · ${theme}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });
      for (const path of PAGES) {
        test(path, async ({ page }) => {
          await presetTheme(page, theme);
          await page.emulateMedia({ reducedMotion: "reduce" });
          await page.goto(path);
          await page.waitForLoadState("networkidle");
          const violations = await axe(page);
          expect(
            violations,
            violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`).join("\n")
          ).toEqual([]);
        });
      }
    });
  }
}

test.describe("manual accessibility checks", () => {
  test("skip link is the first focusable element and moves focus to main", async ({ page }) => {
    await page.goto("/our-science");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main-content$/);
  });

  for (const path of ["/", "/contact", "/roadmap", "/collaboration"]) {
    test(`${path}: every tab stop shows a visible focus indicator, in DOM order`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(path);
      const seen: string[] = [];
      let lastTop = -Infinity;
      let backwards = 0;
      for (let i = 0; i < 80; i++) {
        await page.keyboard.press("Tab");
        const info = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          const cs = getComputedStyle(el);
          const visible =
            (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2) || cs.boxShadow !== "none";
          const r = el.getBoundingClientRect();
          return {
            key: `${el.tagName}#${el.id}.${el.textContent?.trim().slice(0, 30)}`,
            visible,
            top: r.top + window.scrollY,
          };
        });
        if (!info) break;
        if (seen.includes(info.key)) break;
        seen.push(info.key);
        expect(info.visible, `no focus indicator on ${info.key}`).toBe(true);
        if (info.top < lastTop - 400) backwards++;
        lastTop = info.top;
      }
      expect(seen.length).toBeGreaterThan(5);
      // The fixed header is first; after that, focus should flow down the page.
      expect(backwards, "tab order jumps backwards").toBeLessThanOrEqual(1);
    });
  }

  for (const path of PAGES) {
    test(`${path}: heading levels never skip, images have alt text`, async ({ page }) => {
      await page.goto(path);
      const levels = await page.locator("main h1, main h2, main h3, main h4, main h5, main h6").evaluateAll((hs) =>
        hs.map((h) => Number(h.tagName[1]))
      );
      expect(levels[0]).toBe(1);
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i] - levels[i - 1], `heading jump at index ${i}: ${levels.join(",")}`).toBeLessThanOrEqual(1);
      }
      const missingAlt = await page.locator("img:not([alt])").count();
      expect(missingAlt).toBe(0);
    });
  }

  for (const width of [375, 1280]) {
    test(`touch targets are at least 44px at ${width}px`, async ({ page }) => {
      test.setTimeout(180_000);
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["/", "/contact", "/roadmap", "/updates", "/collaboration"]) {
        await page.goto(path);
        const small = await page.evaluate(() => {
          const out: string[] = [];
          const els = document.querySelectorAll<HTMLElement>(
            "button, a[href], summary, select, input:not([type=hidden]):not(#companyWebsite), textarea"
          );
          for (const el of els) {
            const r = el.getBoundingClientRect();
            if (r.width <= 1 || r.height <= 1) continue; // not rendered, or visually hidden (skip link)
            // WCAG 2.5.8 exempts links inline within a sentence.
            if (el.tagName === "A" && getComputedStyle(el).display === "inline") continue;
            // A checkbox counts with its label as one target.
            if (el instanceof HTMLInputElement && el.type === "checkbox") {
              const row = el.parentElement!.getBoundingClientRect();
              if (row.height >= 44) continue;
            }
            if (r.height < 43.5 || r.width < 43.5) out.push(`${el.tagName} "${el.textContent?.trim().slice(0, 40)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
          }
          return out;
        });
        expect(small, `${path}\n${small.join("\n")}`).toEqual([]);
      }
    });
  }
});

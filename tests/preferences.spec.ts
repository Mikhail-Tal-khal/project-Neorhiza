import { expect, test } from "@playwright/test";
import { PAGES } from "./support/site";

test("reduced motion: no animation runs on any page", async ({ page }) => {
  test.setTimeout(240_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of PAGES) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await page.mouse.wheel(0, 1500);
    const running = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => a.playState === "running")
        .filter((a) => {
          const timing = a.effect?.getComputedTiming();
          return Number(timing?.duration ?? 0) > 1 || timing?.iterations === Infinity;
        })
        .map((a) => (a as CSSAnimation).animationName ?? a.constructor.name)
    );
    expect(running, `${path}: ${running.join(", ")}`).toEqual([]);
  }
});

test("reduced transparency: glass surfaces become opaque", async ({ page }) => {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-transparency", value: "reduce" }],
  });
  await page.goto("/");
  const styles = await page.locator(".glass").first().evaluate((el) => {
    const cs = getComputedStyle(el);
    return { bg: cs.backgroundColor, filter: cs.backdropFilter };
  });
  expect(styles.filter).toBe("none");
  // Fallback alpha is ≥ 0.9 in light mode.
  const alpha = Number(styles.bg.match(/[\d.]+(?=\))/)?.[0] ?? 1);
  expect(alpha).toBeGreaterThanOrEqual(0.9);
});

test("forced colors: pages render and glass uses system colors", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/contact");
  await expect(page.locator("h1")).toBeVisible();
  const border = await page.locator(".glass").first().evaluate((el) => getComputedStyle(el).borderStyle);
  expect(border).toBe("solid");
});

test.describe("JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });

  for (const path of PAGES) {
    test(`${path} is fully readable`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      // Nothing in <main> is left invisible waiting for JS.
      const hidden = await page.evaluate(() => {
        const out: string[] = [];
        for (const el of document.querySelectorAll<HTMLElement>("main p, main h2, main h3, main li")) {
          if (el.closest("details:not([open])")) continue; // native disclosure, works without JS
          const cs = getComputedStyle(el);
          if (el.offsetParent !== null && (cs.opacity === "0" || cs.visibility === "hidden")) {
            out.push(el.textContent!.trim().slice(0, 50));
          }
        }
        return out;
      });
      expect(hidden).toEqual([]);
    });
  }

  test("roadmap stages open without JavaScript", async ({ page }) => {
    await page.goto("/roadmap");
    const second = page.locator("details").nth(1);
    await second.locator("summary").click();
    await expect(second.getByText("Principal risks")).toBeVisible();
  });
});

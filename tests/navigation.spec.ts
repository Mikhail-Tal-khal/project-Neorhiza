import { expect, test } from "@playwright/test";
import { gotoHydrated } from "./support/site";

const NAV = [
  ["Why Neorhiza", "/why-neorhiza"],
  ["Our Science", "/our-science"],
  ["Research Roadmap", "/roadmap"],
  ["Human Impact", "/human-impact"],
  ["Collaboration", "/collaboration"],
  ["Updates", "/updates"],
  ["Contact", "/contact"],
  ["Home", "/"],
] as const;

test.describe("desktop navigation", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("every primary link navigates and is marked current", async ({ page }) => {
    await gotoHydrated(page, "/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const [label, href] of NAV) {
      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(href);
      await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute("aria-current", "page");
    }
  });

  test("navigation pill does not overflow at desktop widths", async ({ page }) => {
    for (const width of [1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await gotoHydrated(page, "/");
      const nav = page.getByRole("navigation", { name: "Primary" });
      const overflow = await nav.evaluate((el) => el.scrollWidth - el.clientWidth);
      expect(overflow, `nav overflow at ${width}px`).toBeLessThanOrEqual(0);
    }
  });
});

test.describe("tablet navigation", () => {
  test.use({ viewport: { width: 1024, height: 800 } });

  test("menu button is available between mobile and desktop widths", async ({ page }) => {
    await gotoHydrated(page, "/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator("#mobile-navigation").getByRole("link", { name: "Research Roadmap" })).toBeVisible();
  });
});

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("works by keyboard: open, Escape returns focus, navigate", async ({ page }) => {
    await gotoHydrated(page, "/");
    const panel = page.locator("#mobile-navigation");
    await page.getByRole("button", { name: "Open menu" }).focus();
    await page.keyboard.press("Enter");
    await expect(panel).toBeVisible();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(panel).toBeVisible();
    // Tab moves from the toggle into the panel's first link.
    await page.keyboard.press("Tab");
    await expect(panel.getByRole("link", { name: "Home" })).toBeFocused();
    await panel.getByRole("link", { name: "Our Science" }).focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("/our-science");
    await expect(panel).toBeHidden();
  });
});

test.describe("mobile menu (touch)", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });

  test("works by touch", async ({ page }) => {
    await gotoHydrated(page, "/");
    await page.getByRole("button", { name: "Open menu" }).tap();
    const panel = page.locator("#mobile-navigation");
    await expect(panel).toBeVisible();
    await panel.getByRole("link", { name: "Contact" }).tap();
    await expect(page).toHaveURL("/contact");
  });
});

test("footer links resolve", async ({ page, request }) => {
  await gotoHydrated(page, "/");
  const hrefs = await page
    .locator("footer a[href^='/']")
    .evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")!))]);
  expect(hrefs).toEqual(expect.arrayContaining(["/privacy", "/terms", "/research-disclaimer"]));
  for (const href of hrefs) expect((await request.get(href)).status(), href).toBe(200);
});

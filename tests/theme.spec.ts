import { expect, test, type Page } from "@playwright/test";
import { presetTheme, gotoHydrated } from "./support/site";

const isDark = (page: Page) => page.evaluate(() => document.documentElement.classList.contains("dark"));

test.describe("theme", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("follows the system preference by default", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await gotoHydrated(page, "/");
    expect(await isDark(page)).toBe(true);
    await page.emulateMedia({ colorScheme: "light" });
    await gotoHydrated(page, "/");
    expect(await isDark(page)).toBe(false);
  });

  test("manual light / dark / system persists across reload", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await gotoHydrated(page, "/");
    const group = page.locator("#mobile-navigation").getByRole("group", { name: "Color theme" });
    const openMenu = () => page.getByRole("button", { name: "Open menu" }).click();

    await openMenu();
    await group.getByRole("button", { name: "Dark theme" }).click();
    await expect(group.getByRole("button", { name: "Dark theme" })).toHaveAttribute("aria-pressed", "true");
    expect(await isDark(page)).toBe(true);
    await page.reload({ waitUntil: "networkidle" });
    expect(await isDark(page)).toBe(true);

    await openMenu();
    await group.getByRole("button", { name: "Light theme" }).click();
    expect(await isDark(page)).toBe(false);
    await page.reload({ waitUntil: "networkidle" });
    expect(await isDark(page)).toBe(false);

    await openMenu();
    await group.getByRole("button", { name: "Follow system theme" }).click();
    await page.emulateMedia({ colorScheme: "dark" });
    await page.reload({ waitUntil: "networkidle" });
    expect(await isDark(page)).toBe(true);
  });

  test("no flash: the stored theme is applied before any content is parsed", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await presetTheme(page, "dark");
    await page.addInitScript(() => {
      const w = window as unknown as { __firstClass?: string };
      new MutationObserver((_, obs) => {
        // The first content element after next-themes' inline <script>.
        if (document.querySelector("a[href='#main-content']") && w.__firstClass === undefined) {
          w.__firstClass = document.documentElement.className;
          obs.disconnect();
        }
      }).observe(document, { childList: true, subtree: true });
    });
    await gotoHydrated(page, "/");
    const first = await page.evaluate(() => (window as unknown as { __firstClass?: string }).__firstClass);
    expect(first).toContain("dark");
  });
});

test.describe("desktop theme control", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("compact control cycles light → dark → system", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await presetTheme(page, "light");
    await gotoHydrated(page, "/");
    const btn = page.getByTestId("theme-cycle");
    await expect(btn).toHaveAttribute("aria-label", /Light theme/);
    await btn.click();
    await expect(btn).toHaveAttribute("aria-label", /Dark theme/);
    expect(await isDark(page)).toBe(true);
    await btn.click();
    await expect(btn).toHaveAttribute("aria-label", /Follow system theme/);
    expect(await isDark(page)).toBe(false);
  });
});

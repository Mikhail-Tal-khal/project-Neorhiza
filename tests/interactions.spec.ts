import { expect, test } from "@playwright/test";
import { gotoHydrated } from "./support/site";

test("scientific journey stages are operable by keyboard", async ({ page }) => {
  await gotoHydrated(page, "/");
  const stages = page.locator("ol li button").filter({ hasText: /^Stage \d/ });
  const count = await stages.count();
  expect(count).toBeGreaterThanOrEqual(7);

  const third = stages.nth(2);
  await third.focus();
  await page.keyboard.press("Enter");
  await expect(third).toHaveAttribute("aria-current", "step");
  await page.keyboard.press("Tab");
  await expect(stages.nth(3)).toBeFocused();
  await page.keyboard.press("Space");
  await expect(stages.nth(3)).toHaveAttribute("aria-current", "step");
  await expect(third).not.toHaveAttribute("aria-current", "step");
});

test("roadmap stages expand and collapse by keyboard", async ({ page }) => {
  await gotoHydrated(page, "/roadmap");
  const details = page.locator("details");
  expect(await details.count()).toBe(9);
  await expect(details.first()).toHaveAttribute("open", "");

  const second = details.nth(1);
  await expect(second).not.toHaveAttribute("open", "");
  await second.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(second).toHaveAttribute("open", "");
  await expect(second.getByText("Principal risks")).toBeVisible();
  await page.keyboard.press("Space");
  await expect(second).not.toHaveAttribute("open", "");
});

test("collaboration overview modal traps focus and closes with Escape", async ({ page }) => {
  await gotoHydrated(page, "/collaboration");
  const trigger = page.getByRole("button", { name: "Request the Public Research Overview" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Request the Public Research Overview" });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

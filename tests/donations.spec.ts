import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { gotoHydrated, trackConsole, uniqueIp } from "./support/site";

/**
 * Browser tests for the contribution flow against the production build.
 *  - :3000 runs with a fake (non-functional) STRIPE_SECRET_KEY, so the form
 *    is enabled. Every checkout request is intercepted in the browser with
 *    page.route(); no test lets :3000 call Stripe.
 *  - :3001 runs without Stripe, so the "being prepared" state shows.
 */

const UNCONFIGURED = "http://localhost:3001";
const MOCK_CHECKOUT_URL = "https://checkout.stripe.com/c/pay/cs_test_mockSessionForE2E";

async function mockStripePage(page: Page) {
  await page.route("https://checkout.stripe.com/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/html", body: "<title>Mock Stripe Checkout</title><h1>Mock</h1>" })
  );
}

/** Clicks the visible amount pill, as a visitor would (the radio itself is visually hidden). */
async function pick(page: Page, label: string) {
  await page.locator("#donate").getByText(label, { exact: true }).click();
}

async function seriousViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
    .analyze();
  return results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
}

test.beforeEach(async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-forwarded-for": uniqueIp() });
});

test.describe("contribution form (Stripe configured)", () => {
  test("shows presets, a $100 default and the required statement", async ({ page }) => {
    const problems = trackConsole(page);
    await gotoHydrated(page, "/funding");
    const section = page.locator("#donate");
    await expect(section.getByRole("heading", { level: 2, name: "Contribute to the Foundation Phase" })).toBeVisible();

    const group = section.getByRole("group", { name: /Choose a one-time amount/ });
    for (const label of ["$25", "$50", "$100", "$250", "$500", "Other amount"]) {
      await expect(group.getByRole("radio", { name: label, exact: true })).toBeEnabled();
    }
    await expect(group.getByRole("radio", { name: "$100", exact: true })).toBeChecked();
    await expect(section.getByText("Contribution: $100 USD, one time")).toBeVisible();
    await expect(section.getByRole("button", { name: "Donate securely with Stripe" })).toBeEnabled();
    await expect(section).toContainText(
      "Contributions support Project Neorhiza’s early-stage research and development activities. They are not investments, do not provide equity or ownership, and should not be assumed to be tax-deductible unless independently confirmed under the donor’s applicable laws."
    );
    for (const use of ["Early-stage research development", "Scientific planning", "Institutional engagement", "Regulatory preparation", "Infrastructure"]) {
      await expect(section.getByText(use, { exact: false }).first()).toBeVisible();
    }
    await expect(section.getByText("Secure donations are being prepared")).toHaveCount(0);
    expect(problems, problems.join("\n")).toEqual([]);
  });

  test("is keyboard operable: arrow keys move between amounts", async ({ page }) => {
    await gotoHydrated(page, "/funding");
    const group = page.getByRole("group", { name: /Choose a one-time amount/ });
    await group.getByRole("radio", { name: "$100", exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(group.getByRole("radio", { name: "$250", exact: true })).toBeChecked();
    await expect(group.getByRole("radio", { name: "$250", exact: true })).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect(group.getByRole("radio", { name: "Other amount", exact: true })).toBeChecked();
    await expect(page.getByLabel("Your amount (USD)")).toBeFocused();
  });

  test("validates custom amounts in the browser before any request", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (r) => r.url().includes("/api/donations") && requests.push(r.url()));
    await gotoHydrated(page, "/funding");
    await pick(page, "Other amount");
    const input = page.getByLabel("Your amount (USD)");
    const donate = page.getByRole("button", { name: "Donate securely with Stripe" });

    await donate.click();
    await expect(page.locator("#donate").getByRole("alert")).toHaveText("Please enter an amount.");

    await input.fill("3");
    await donate.click();
    await expect(page.locator("#donate").getByRole("alert")).toHaveText("The minimum contribution is $5.");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toBeFocused();

    await input.fill("60000");
    await donate.click();
    await expect(page.locator("#donate").getByRole("alert")).toContainText("The maximum online contribution is $50,000.");

    await input.fill("12.345");
    await donate.click();
    await expect(page.locator("#donate").getByRole("alert")).toContainText("Please enter a valid amount");

    await input.fill("$1,250.50");
    await expect(page.getByText("Contribution: $1,250.50 USD, one time")).toBeVisible();
    expect(requests).toEqual([]);
  });

  test("starts checkout with the chosen amount and redirects to Stripe", async ({ page }) => {
    await mockStripePage(page);
    let sent: unknown;
    await page.route("**/api/donations/checkout", async (route) => {
      sent = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, url: MOCK_CHECKOUT_URL }) });
    });
    await gotoHydrated(page, "/funding");
    await pick(page, "$250");
    await page.getByRole("button", { name: "Donate securely with Stripe" }).click();
    await page.waitForURL(MOCK_CHECKOUT_URL);
    expect(sent).toEqual({ amount: "250", currency: "usd" });
  });

  test("shows a loading state and blocks double submission", async ({ page }) => {
    await mockStripePage(page);
    let count = 0;
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    await page.route("**/api/donations/checkout", async (route) => {
      count += 1;
      await gate;
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, url: MOCK_CHECKOUT_URL }) });
    });
    await gotoHydrated(page, "/funding");
    await page.getByRole("button", { name: "Donate securely with Stripe" }).click();
    const busy = page.getByRole("button", { name: "Redirecting to Stripe…" });
    await expect(busy).toBeDisabled();
    await expect(page.getByRole("radio", { name: "$50", exact: true })).toBeDisabled();
    await busy.click({ force: true });
    release();
    await page.waitForURL(MOCK_CHECKOUT_URL);
    expect(count).toBe(1);
  });

  test("shows the server's safe error and lets the visitor retry", async ({ page }) => {
    await page.route("**/api/donations/checkout", (route) =>
      route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({ ok: false, message: "Secure checkout could not be started. No payment was taken. Please try again shortly." }),
      })
    );
    await gotoHydrated(page, "/funding");
    await page.getByRole("button", { name: "Donate securely with Stripe" }).click();
    await expect(page.getByRole("status").filter({ hasText: "could not be started" })).toContainText("No payment was taken");
    await expect(page.getByRole("button", { name: "Donate securely with Stripe" })).toBeEnabled();
    await expect(page).toHaveURL(/\/funding$/);
  });

  test("the API rejects invalid amounts, other methods and cross-site posts", async ({ request }) => {
    const bad = await request.post("/api/donations/checkout", { data: { amount: "1e3", currency: "usd" } });
    expect(bad.status()).toBe(400);
    expect((await request.get("/api/donations/checkout")).status()).toBe(405);
    expect((await request.get("/api/stripe/webhook")).status()).toBe(405);
    const crossSite = await request.post("/api/donations/checkout", {
      data: { amount: "100" },
      headers: { origin: "https://evil.example", "sec-fetch-site": "cross-site" },
    });
    expect(crossSite.status()).toBe(403);
    const unsigned = await request.post("/api/stripe/webhook", { data: { id: "evt_fake" } });
    expect(unsigned.status()).toBe(503); // no signing secret on the test server
  });

  test("passes axe in light and dark themes", async ({ page }) => {
    for (const theme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await gotoHydrated(page, "/funding");
      await pick(page, "Other amount");
      await page.getByLabel("Your amount (USD)").fill("2");
      await page.getByRole("button", { name: "Donate securely with Stripe" }).click();
      const violations = await seriousViolations(page);
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ") + " " + n.failureSummary).join(" | ")}`), theme).toEqual([]);
    }
  });
});

test.describe("contribution form (Stripe not configured)", () => {
  test("disables donating and explains that secure donations are being prepared", async ({ page }) => {
    await gotoHydrated(page, `${UNCONFIGURED}/funding`);
    const section = page.locator("#donate");
    await expect(section.getByText("Secure donations are being prepared")).toBeVisible();
    await expect(section.getByRole("button", { name: "Donate securely with Stripe" })).toBeDisabled();
    await expect(section.getByRole("radio", { name: "$100", exact: true })).toBeDisabled();
    await expect(page.getByText("Being prepared. Secure online contributions will open")).toBeVisible();
    // A professional notice, never a redirect to the contact form.
    await expect(section).toContainText("No payment can be taken until then. Please check back soon.");
    await expect(page.locator('a[href*="interest=funding"]')).toHaveCount(0);
    expect((await seriousViolations(page)).map((v) => v.id)).toEqual([]);
  });

  test("the API answers 503 instead of failing obscurely", async ({ request }) => {
    const res = await request.post(`${UNCONFIGURED}/api/donations/checkout`, { data: { amount: "100", currency: "usd" } });
    expect(res.status()).toBe(503);
    expect(await res.json()).toEqual({
      ok: false,
      message: "Secure online contributions are being prepared and are not available yet.",
    });
  });
});

test.describe("success and cancellation pages", () => {
  test("success never confirms a payment from the query string alone", async ({ page }) => {
    for (const url of ["/funding/success", "/funding/success?session_id=not-a-session", "/funding/success?session_id=cs_test_x&session_id=y"]) {
      const res = await page.goto(url);
      expect(res?.status(), url).toBe(200);
      await expect(page.locator("h1")).toHaveText("We couldn’t find this contribution");
      await expect(page.getByText("Payment received")).toHaveCount(0);
    }
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('meta[name="referrer"]')).toHaveAttribute("content", "no-referrer");
  });

  test("success reports unavailability when Stripe cannot be asked", async ({ page }) => {
    await page.goto(`${UNCONFIGURED}/funding/success?session_id=cs_test_a1B2c3D4e5F6g7H8`);
    await expect(page.locator("h1")).toHaveText("We can’t confirm your contribution right now");
    await expect(page.getByRole("link", { name: "Return to Funding" })).toHaveAttribute("href", "/funding#donate");
    await expect(page.getByRole("link", { name: "Read Project Updates" })).toHaveAttribute("href", "/updates");
    expect((await seriousViolations(page)).map((v) => v.id)).toEqual([]);
  });

  test("cancellation explains nothing was charged and offers a retry", async ({ page }) => {
    const problems = trackConsole(page);
    const res = await page.goto("/funding/cancelled");
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText("Your contribution was not completed");
    await expect(page.locator("main")).toContainText("no payment was taken");
    const retry = page.getByRole("link", { name: "Try Again" });
    await expect(retry).toHaveAttribute("href", "/funding#donate");
    await expect(retry).toHaveAttribute("data-analytics-event", "donation_cta_clicked");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    expect((await seriousViolations(page)).map((v) => v.id)).toEqual([]);
    expect(problems, problems.join("\n")).toEqual([]);
  });

  test("neither page is listed in the sitemap", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).not.toContain("/funding/success");
    expect(xml).not.toContain("/funding/cancelled");
  });
});

test.describe("calls to action", () => {
  test("home and footer donate directly, tracked without amounts", async ({ page }) => {
    await page.goto("/");
    const home = page.locator("#cta-heading ~ div").getByRole("link", { name: "Support Neorhiza" });
    await expect(home).toHaveAttribute("href", "/funding#donate");
    await expect(home).toHaveAttribute("data-analytics-event", "donation_cta_clicked");
    await expect(home).toHaveAttribute("data-analytics-location", "home-final");
    const footer = page.getByRole("contentinfo").getByRole("link", { name: "Donate Now" });
    await expect(footer).toHaveAttribute("href", "/funding#donate");
    await expect(footer).toHaveAttribute("data-analytics-location", "footer");

    await footer.click();
    await page.waitForURL(/\/funding#donate$/);
    await expect(page.locator("#donate")).toBeInViewport();
  });

  test("collaboration and contact pages send supporters straight to the donation form", async ({ page }) => {
    await page.goto("/collaboration");
    const collab = page.getByRole("link", { name: "Support Neorhiza" });
    await expect(collab).toHaveAttribute("href", "/funding#donate");
    await expect(collab).toHaveAttribute("data-analytics-location", "collaboration-hero");

    await page.goto("/contact");
    const routes = page.getByRole("navigation", { name: "Choose your inquiry route" });
    const supporters = routes.getByRole("link", { name: /Supporters/ });
    await expect(supporters).toHaveAttribute("href", "/funding#donate");
    await expect(supporters).toHaveAttribute("data-analytics-event", "donation_cta_clicked");
  });

  test("the funding hero's Donate Now jumps to the amount picker", async ({ page }) => {
    await gotoHydrated(page, "/funding");
    await page.getByRole("link", { name: "Donate Now" }).first().click();
    await expect(page).toHaveURL(/#donate$/);
    await expect(page.locator("#donate")).toBeInViewport();
  });

  test("the amount picker and Stripe button come right after the hero", async ({ page }) => {
    await gotoHydrated(page, "/funding");
    const order = await page
      .locator("main section[aria-labelledby]")
      .evaluateAll((els) => els.slice(0, 2).map((el) => el.getAttribute("aria-labelledby")));
    expect(order).toEqual(["funding-heading", "donate-heading"]);
    await expect(page.locator("#donate").getByRole("button", { name: "Donate securely with Stripe" })).toBeVisible();
  });

  test("no funding link leads to the contact form", async ({ page }) => {
    for (const path of ["/", "/funding", "/collaboration", "/contact", "/funding/cancelled"]) {
      await page.goto(path);
      await expect(page.locator('a[href*="interest=funding"]'), path).toHaveCount(0);
      await expect(page.getByRole("link", { name: /Funding Conversation/i }), path).toHaveCount(0);
    }
  });
});

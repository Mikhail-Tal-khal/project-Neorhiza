import { expect, test, type Page } from "@playwright/test";
import { uniqueIp, gotoHydrated } from "./support/site";

const SINK = "http://127.0.0.1:4599/received";

const VALID = {
  fullName: "Ada Example",
  professionalEmail: "ada@example.org",
  organization: "Example Institute",
  professionalRole: "Research scientist",
  country: "Netherlands",
  areaOfInterest: "Scientific collaboration",
  message: "I would like to discuss a possible scientific collaboration on vascularization.",
};

async function received(page: Page, email: string) {
  const res = await page.request.get(SINK);
  const all = (await res.json()) as { auth: string; body: { data: { professionalEmail: string } } }[];
  return all.filter((r) => r.body.data.professionalEmail === email);
}

async function fillValid(page: Page, email: string) {
  await page.getByLabel("Full name").fill(VALID.fullName);
  await page.getByLabel("Professional email").fill(email);
  await page.getByLabel("Organization").fill(VALID.organization);
  await page.getByLabel("Professional role").fill(VALID.professionalRole);
  await page.getByLabel("Country").fill(VALID.country);
  await page.getByLabel("Area of interest").selectOption(VALID.areaOfInterest);
  await page.getByLabel("Message").fill(VALID.message);
  await page.getByLabel(/I consent/).check();
}

test.describe("contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-forwarded-for": uniqueIp() });
    await gotoHydrated(page, "/contact");
  });

  test("empty submission shows accessible errors and focuses the first field", async ({ page }) => {
    await page.getByRole("button", { name: "Submit inquiry" }).click();
    await expect(page.getByLabel("Full name")).toBeFocused();
    for (const [label, id] of [
      ["Full name", "fullName"],
      ["Professional email", "professionalEmail"],
      ["Area of interest", "areaOfInterest"],
      ["Message", "message"],
    ] as const) {
      const field = page.getByLabel(label);
      await expect(field).toHaveAttribute("aria-invalid", "true");
      await expect(field).toHaveAttribute("aria-describedby", `${id}-error`);
      await expect(page.locator(`#${id}-error`)).toBeVisible();
    }
    await expect(page.locator("#consent-error")).toContainText("consent");
    await expect(page.getByText("Please correct the highlighted fields")).toBeVisible();
  });

  test("invalid email is rejected on client and server", async ({ page }) => {
    await fillValid(page, "not-an-email");
    await page.getByRole("button", { name: "Submit inquiry" }).click();
    await expect(page.locator("#professionalEmail-error")).toContainText("valid professional email");

    const res = await page.request.post("/api/contact", {
      headers: { "x-forwarded-for": uniqueIp() },
      data: { ...VALID, professionalEmail: "bad@", consent: true },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).errors.professionalEmail).toBeTruthy();
  });

  test("consent is required by the server", async ({ page }) => {
    const res = await page.request.post("/api/contact", {
      headers: { "x-forwarded-for": uniqueIp() },
      data: { ...VALID, consent: false },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).errors.consent).toBeTruthy();
  });

  test("valid submission is delivered and shows success", async ({ page }) => {
    const email = `valid-${Date.now()}@example.org`;
    await fillValid(page, email);
    await page.getByRole("button", { name: "Submit inquiry" }).click();
    await expect(page.getByRole("status")).toContainText("Inquiry received");
    const got = await received(page, email);
    expect(got).toHaveLength(1);
    expect(got[0].auth).toBe("Bearer e2e-test-token");
    // Consent and honeypot are not forwarded.
    expect(Object.keys(got[0].body.data)).not.toContain("companyWebsite");
  });

  test("honeypot submission is silently rejected", async ({ page }) => {
    const email = `bot-${Date.now()}@example.org`;
    await fillValid(page, email);
    await page.locator("#companyWebsite").fill("https://spam.example", { force: true });
    await page.getByRole("button", { name: "Submit inquiry" }).click();
    await expect(page.getByRole("status")).toContainText("Inquiry received");
    expect(await received(page, email)).toHaveLength(0);
  });

  test("repeated rapid submissions are rate limited", async ({ page }) => {
    const ip = uniqueIp();
    const statuses: number[] = [];
    for (let i = 0; i < 7; i++) {
      const res = await page.request.post("/api/contact", {
        headers: { "x-forwarded-for": ip },
        data: { ...VALID, professionalEmail: `rl-${i}-${Date.now()}@example.org`, consent: true },
      });
      statuses.push(res.status());
      if (res.status() === 429) {
        expect(res.headers()["retry-after"]).toBeTruthy();
        expect((await res.json()).message).toMatch(/Too many inquiries/);
      }
    }
    expect(statuses.slice(0, 5)).toEqual([200, 200, 200, 200, 200]);
    expect(statuses.slice(5)).toEqual([429, 429]);
  });

  test("rate-limit message is shown accessibly in the UI", async ({ page }) => {
    const ip = uniqueIp();
    await page.setExtraHTTPHeaders({ "x-forwarded-for": ip });
    for (let i = 0; i < 5; i++) {
      await page.request.post("/api/contact", {
        headers: { "x-forwarded-for": ip },
        data: { ...VALID, professionalEmail: `ui-rl-${i}@example.org`, consent: true },
      });
    }
    await fillValid(page, "ui-rl-final@example.org");
    await page.getByRole("button", { name: "Submit inquiry" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Too many inquiries" })).toBeVisible();
  });

  test("no medical, genetic or health fields exist", async ({ page }) => {
    const fields = await page.locator("form input, form select, form textarea").evaluateAll((els) =>
      els.map((el) => {
        const id = el.id;
        const label = id ? document.querySelector(`label[for="${id}"]`)?.textContent ?? "" : "";
        return `${(el as HTMLInputElement).name} ${label}`;
      })
    );
    expect(fields.length).toBeGreaterThan(0);
    for (const f of fields) {
      expect(f).not.toMatch(/medical|diagnos|genetic|\bdna\b|health|patient|condition|symptom|treatment|birth/i);
    }
    // Inquiry types offered
    const options = await page.getByLabel("Area of interest").locator("option:not([disabled])").allTextContents();
    expect(options).toEqual([
      "Scientific collaboration",
      "Institutional collaboration",
      "Clinical advisory",
      "Engineering collaboration",
      "Ethics and regulation",
      "Media inquiry",
      "General inquiry",
    ]);
  });
});

test("fails clearly when no delivery destination is configured", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-forwarded-for": uniqueIp() });
  await gotoHydrated(page, "http://localhost:3001/contact");
  await fillValid(page, "unconfigured@example.org");
  await page.getByRole("button", { name: "Submit inquiry" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "temporarily unavailable" })).toBeVisible();
  await expect(page.getByText("Inquiry received")).toHaveCount(0);

  const res = await page.request.post("http://localhost:3001/api/contact", {
    headers: { "x-forwarded-for": uniqueIp() },
    data: { ...VALID, consent: true },
  });
  expect(res.status()).toBe(503);
});

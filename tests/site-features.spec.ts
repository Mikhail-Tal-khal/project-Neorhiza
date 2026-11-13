import { expect, test } from "@playwright/test";
import { PAGES, gotoHydrated, uniqueIp } from "./support/site";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.neorhiza.space";
const ARTICLES = PAGES.filter((p) => p.startsWith("/updates/"));
/** Converts an absolute site URL from the sitemap into a local path. */
const toPath = (url: string) => url.replace(SITE_URL, "") || "/";

test.describe("security.txt", () => {
  test("is valid plain text with the required fields", async ({ request }) => {
    const res = await request.get("/.well-known/security.txt");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("text/plain; charset=utf-8");
    const body = await res.text();
    expect(body).not.toMatch(/<html|<body|<!doctype/i);
    expect(body.split("\n").filter(Boolean)).toEqual([
      "Contact: mailto:inquiries@neorhiza.space",
      "Canonical: https://www.neorhiza.space/.well-known/security.txt",
      "Policy: https://github.com/Mikhail-Tal-khal/project-Neorhiza/security/policy",
      "Preferred-Languages: en",
      "Expires: 2027-11-09T00:00:00.000Z",
    ]);
    expect(body).not.toMatch(/re_[A-Za-z0-9]|token|secret|password|gmail/i);
  });

  test("has not expired and is renewed at least 30 days ahead", async ({ request }) => {
    const body = await (await request.get("/.well-known/security.txt")).text();
    const expires = Date.parse(/^Expires: (.+)$/m.exec(body)![1]);
    expect(expires - Date.now()).toBeGreaterThan(30 * 24 * 3600 * 1000);
    expect(expires - Date.now()).toBeLessThan(366 * 24 * 3600 * 1000 + 30 * 24 * 3600 * 1000);
  });
});

test.describe("removed RSS feed", () => {
  test("/updates/feed.xml is gone and nothing advertises or links to a feed", async ({ page, request }) => {
    expect((await request.get("/updates/feed.xml")).status()).toBe(404);
    for (const path of ["/", "/updates", "/funding", ARTICLES[0]]) {
      await page.goto(path);
      await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]'), path).toHaveCount(0);
      await expect(page.locator('a[href*="feed.xml"], a[type="application/rss+xml"]'), path).toHaveCount(0);
      await expect(page.getByText(/RSS/), path).toHaveCount(0);
    }
  });
});

test.describe("funding page", () => {
  test("explains the Foundation Phase truthfully and leads with a direct donation", async ({ page }) => {
    const res = await page.goto("/funding");
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText("Support the Foundation Phase");
    const text = await page.locator("main").innerText();
    expect(text).toMatch(/No laboratory work will start/);
    expect(text).toMatch(/do not claim charitable, tax-exempt or tax-deductible status/);
    expect(text).toContain(
      "They are not investments, do not provide equity or ownership, and should not be assumed to be tax-deductible"
    );
    // No funding amounts or targets are published outside the contribution picker.
    const outsidePicker = await page
      .locator("main")
      .evaluate((main) => {
        const clone = main.cloneNode(true) as HTMLElement;
        clone.querySelector("#donate")?.remove();
        return clone.innerText;
      });
    expect(outsidePicker).not.toMatch(/\$\s?\d|KES\s?\d|USD\s?\d|€\s?\d|£\s?\d/i);
    for (const heading of ["Current Status", "What Support Enables"]) {
      await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
    }

    const cta = page.getByRole("link", { name: "Donate Now" }).first();
    await expect(cta).toHaveAttribute("href", "#donate");
    await expect(cta).toHaveAttribute("data-analytics-event", "donation_cta_clicked");
    // Partnerships remain a secondary option, never a funding-inquiry form.
    const partner = page.getByRole("link", { name: "Institutional Partnership Inquiry", exact: true });
    await expect(partner).toHaveAttribute("href", "/contact?interest=institutional#inquiry-form");
    await expect(partner).toHaveAttribute("data-analytics-event", "partnership_inquiry_started");
    await expect(page.locator('a[href*="interest=funding"]')).toHaveCount(0);

    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(" ");
    expect(ld).toContain('"@type":"WebPage"');
  });

  test("the secondary partnership link preselects institutional collaboration", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-forwarded-for": uniqueIp() });
    await gotoHydrated(page, "/funding");
    await page.getByRole("link", { name: "Institutional Partnership Inquiry", exact: true }).click();
    await page.waitForURL(/\/contact\?interest=institutional/);
    await expect(page.getByLabel("Area of interest")).toHaveValue("Institutional collaboration");
  });

  test("the retired ?interest=funding slug preselects nothing", async ({ page }) => {
    await gotoHydrated(page, "/contact?interest=funding");
    await expect(page.getByLabel("Area of interest")).toHaveValue("");
  });

  test("audience routes on the contact page preselect the right area", async ({ page }) => {
    await gotoHydrated(page, "/contact");
    const routes = page.getByRole("navigation", { name: "Choose your inquiry route" });
    for (const [label, area] of [
      ["Researchers", "Scientific collaboration"],
      ["Institutions", "Institutional collaboration"],
      ["Media", "Media inquiry"],
    ] as const) {
      await routes.getByRole("link", { name: new RegExp(label) }).click();
      await page.waitForLoadState("networkidle");
      await expect(page.getByLabel("Area of interest")).toHaveValue(area);
    }
  });

  test("is in the footer, but not crowding the main menu", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Funding" })).toHaveAttribute("href", "/funding");
    await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Funding" })).toHaveCount(0);
  });
});

test.describe("search readiness", () => {
  test("every sitemap URL returns 200 and lastmod values are real content dates", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const entries = [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)].map((m) => ({
      loc: m[1],
      lastmod: m[2],
    }));
    expect(entries.map((e) => toPath(e.loc)).sort()).toEqual([...PAGES].sort());
    for (const { loc } of entries) {
      expect((await request.get(toPath(loc))).status(), loc).toBe(200);
    }
    // Dates are midnight UTC content dates, never the build clock, and not in the future.
    for (const { lastmod, loc } of entries) {
      expect(lastmod, loc).toMatch(/T00:00:00(\.000)?Z$/);
      expect(Date.parse(lastmod), loc).toBeLessThanOrEqual(Date.now());
    }
    expect(new Set(entries.map((e) => e.lastmod)).size).toBeGreaterThan(1);
  });

  test("the sitemap lists /funding and every article, and never the API", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => toPath(m[1]));
    expect(locs).toContain("/funding");
    for (const article of ARTICLES) expect(locs).toContain(article);
    expect(locs.filter((l) => l.startsWith("/api"))).toEqual([]);
  });

  // The build under test decides the expectation: with the variables unset
  // (the default) no tag may appear; with values set at build time, every
  // indexable page must carry the trimmed value.
  test("verification tags match the build configuration on every page", async ({ request }) => {
    const expected = {
      "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() ?? "",
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim() ?? "",
    };
    for (const path of PAGES) {
      const html = await (await request.get(path)).text();
      for (const [name, value] of Object.entries(expected)) {
        const tags = [...html.matchAll(new RegExp(`<meta name="${name.replace(".", "\\.")}" content="([^"]*)"`, "g"))];
        if (value) {
          expect(tags.map((t) => t[1]), `${name} on ${path}`).toEqual([value]);
        } else {
          expect(tags, `${name} on ${path}`).toHaveLength(0);
        }
      }
      expect(html, path).not.toMatch(/<meta name="(google-site-verification|msvalidate\.01)" content=""/);
    }
  });
});

test.describe("personal information", () => {
  test("no personal email or precise location appears in pages or structured data", async ({ request }) => {
    const sources = [...PAGES, "/sitemap.xml", "/.well-known/security.txt"];
    for (const path of sources) {
      const body = await (await request.get(path)).text();
      expect(body, path).not.toMatch(/gmail\.com|rereulemein@/i);
      expect(body, path).not.toMatch(/Mombasa, Kenya|based in Mombasa/);
    }
  });

  test("the founder section and organization data use the project mailbox", async ({ page }) => {
    await page.goto("/why-neorhiza");
    const founderLinks = page.getByRole("list", { name: "Founder's professional links" });
    await expect(founderLinks.getByRole("link", { name: "inquiries@neorhiza.space" })).toHaveAttribute(
      "href",
      "mailto:inquiries@neorhiza.space"
    );
    await expect(founderLinks).toContainText("Kenya");
    await page.goto("/");
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(" ");
    expect(ld).toContain('"email":"inquiries@neorhiza.space"');
  });
});

test.describe("API origin protection (live server)", () => {
  test("cross-site browser posts are refused; same-origin posts reach validation", async ({ request }) => {
    const crossSite = await request.post("/api/contact", {
      headers: { origin: "https://evil.example", "sec-fetch-site": "cross-site", "x-forwarded-for": uniqueIp() },
      data: {},
    });
    expect(crossSite.status()).toBe(403);
    const sameOrigin = await request.post("/api/contact", {
      headers: { "sec-fetch-site": "same-origin", "x-forwarded-for": uniqueIp() },
      data: {},
    });
    expect(sameOrigin.status()).toBe(400);
  });
});

test.describe("small screens", () => {
  for (const width of [320, 375, 390, 430]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      test.setTimeout(120_000);
      await page.setViewportSize({ width, height: 800 });
      for (const path of ["/", "/why-neorhiza", "/our-science", "/funding", "/contact", "/updates", "/privacy", "/terms"]) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});

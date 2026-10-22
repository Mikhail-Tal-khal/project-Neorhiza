import { expect, test } from "@playwright/test";
import { PAGES, trackConsole } from "./support/site";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://neorhiza.org";

test.describe("every page", () => {
  for (const path of PAGES) {
    test(`${path} loads cleanly with complete SEO metadata`, async ({ page }) => {
      const problems = trackConsole(page);
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await page.waitForLoadState("networkidle");

      await expect(page.locator("h1")).toHaveCount(1);
      expect((await page.title()).length).toBeGreaterThan(10);
      const meta = (sel: string) => page.locator(sel).first().getAttribute("content");
      expect(await meta('meta[name="description"]')).toBeTruthy();

      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toBe(`${SITE_URL}${path === "/" ? "" : path}`);
      for (const sel of [
        'meta[property="og:title"]',
        'meta[property="og:description"]',
        'meta[property="og:url"]',
        'meta[property="og:image"]',
        'meta[name="twitter:card"]',
        'meta[name="twitter:title"]',
        'meta[name="twitter:image"]',
      ]) {
        expect(await meta(sel), sel).toBeTruthy();
      }

      // JSON-LD parses and never presents Neorhiza as a clinical or accredited provider.
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(blocks.length).toBeGreaterThanOrEqual(2);
      for (const raw of blocks) {
        const data = JSON.parse(raw);
        expect(data["@context"]).toBe("https://schema.org");
        expect(raw).not.toMatch(
          /Hospital|MedicalClinic|MedicalOrganization|Physician|EducationalOrganization|CollegeOrUniversity|accredit/i
        );
      }
      expect(blocks.join(" ")).toContain("BreadcrumbList");

      expect(problems, problems.join("\n")).toEqual([]);
    });
  }

  test("titles and descriptions are unique", async ({ page }) => {
    test.setTimeout(180_000);
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const path of PAGES) {
      await page.goto(path);
      titles.add(await page.title());
      descriptions.add((await page.locator('meta[name="description"]').getAttribute("content")) ?? "");
    }
    expect(titles.size).toBe(PAGES.length);
    expect(descriptions.size).toBe(PAGES.length);
  });

  test("unknown URLs render the custom not-found page with 404", async ({ page }) => {
    for (const path of ["/does-not-exist", "/updates/not-a-real-article"]) {
      const res = await page.goto(path);
      expect(res?.status()).toBe(404);
      await expect(page.getByRole("heading", { level: 1 })).toContainText("This branch hasn");
    }
  });
});

test.describe("metadata routes", () => {
  const routes: [string, RegExp][] = [
    ["/sitemap.xml", /xml/],
    ["/robots.txt", /text\/plain/],
    ["/manifest.webmanifest", /manifest\+json|json/],
    ["/icon.svg", /image\/svg\+xml/],
    ["/apple-icon.png", /image\/png/],
    ["/opengraph-image", /image\/png/],
    ["/twitter-image", /image\/png/],
    ["/updates/what-a-bioreactor-does/opengraph-image", /image\/png/],
    ["/icons/icon-192.png", /image\/png/],
    ["/icons/icon-512.png", /image\/png/],
  ];
  for (const [path, type] of routes) {
    test(`${path} returns 200 with the right content type`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toMatch(type);
    });
  }

  test("sitemap lists every public page", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const path of PAGES) {
      expect(xml).toContain(`<loc>${SITE_URL}${path === "/" ? "" : path}</loc>`);
    }
  });

  test("robots allows crawling, blocks /api and links the sitemap", async ({ request }) => {
    const txt = await (await request.get("/robots.txt")).text();
    expect(txt).toMatch(/Allow: \//);
    expect(txt).toMatch(/Disallow: \/api\//);
    expect(txt).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  });

  test("security headers are present", async ({ request }) => {
    const h = (await request.get("/")).headers();
    expect(h["content-security-policy"]).toContain("default-src 'self'");
    expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(h["strict-transport-security"]).toContain("max-age=");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["permissions-policy"]).toContain("camera=()");
    expect(h["x-powered-by"]).toBeUndefined();
  });
});

test("page typography renders in Manrope", async ({ page }) => {
  await page.goto("/");
  const families = await page.evaluate(async () => {
    await document.fonts.ready;
    return ["h1", "p", "nav a", "button"].map((sel) => getComputedStyle(document.querySelector(sel)!).fontFamily);
  });
  for (const f of families) expect(f.toLowerCase()).toMatch(/^"?manrope/);
  expect(await page.evaluate(() => document.fonts.check("600 16px manrope"))).toBe(true);
});

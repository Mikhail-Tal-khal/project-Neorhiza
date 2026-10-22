import type { Page } from "@playwright/test";

/** Every public page. Keep in sync with src/app/sitemap.ts. */
export const PAGES = [
  "/",
  "/why-neorhiza",
  "/our-science",
  "/roadmap",
  "/human-impact",
  "/collaboration",
  "/updates",
  "/contact",
  "/privacy",
  "/terms",
  "/research-disclaimer",
  "/updates/from-patient-cells-to-organized-tissue",
  "/updates/the-difference-between-an-organoid-engineered-tissue-and-a-replacement-organ",
  "/updates/what-a-bioreactor-does",
  "/updates/why-dna-alone-cannot-be-grown-into-an-organ",
  "/updates/why-project-neorhiza-is-beginning-with-a-focused-feasibility-phase",
  "/updates/why-scientific-collaboration-protects-patients-and-strengthens-research",
  "/updates/why-vascularization-is-one-of-organ-engineerings-greatest-challenges",
] as const;

/** Collects console errors/warnings and uncaught page errors. */
export function trackConsole(page: Page) {
  const problems: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") problems.push(`${msg.type()}: ${msg.text()}`);
  });
  page.on("pageerror", (err) => problems.push(`pageerror: ${err.message}`));
  // Surface Content-Security-Policy violations (some are swallowed by try/catch).
  void page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (e) =>
      console.error(`CSP violation: ${e.violatedDirective} blocked ${e.blockedURI} in ${e.sourceFile}`)
    );
  });
  return problems;
}

/** Sets the stored theme before any page script runs. */
export async function presetTheme(page: Page, theme: "light" | "dark" | "system") {
  await page.addInitScript((t) => {
    try {
      localStorage.setItem("theme", t);
    } catch {}
  }, theme);
}

let ipCounter = 0;
/** A unique client IP per test so rate-limit buckets don't collide. */
export function uniqueIp() {
  ipCounter += 1;
  return `10.${process.pid % 250}.${Math.floor(ipCounter / 250)}.${(ipCounter % 250) + 1}`;
}

/** Navigates and waits until the client bundle has hydrated. */
export async function gotoHydrated(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

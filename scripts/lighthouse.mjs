/**
 * Runs Lighthouse (mobile, default throttling) against a running production
 * server and fails if any category is below target.
 *
 * Targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
 *
 * Usage: BASE_URL=http://localhost:3000 CHROME_PATH=/path/to/chrome npm run lighthouse
 * Reports are written to lighthouse-reports/<page>.html
 */
import { mkdirSync, writeFileSync } from "node:fs";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const PAGES = (process.env.LH_PAGES ?? "/,/our-science,/updates,/contact").split(",");
const TARGETS = { performance: 90, accessibility: 95, "best-practices": 95, seo: 95 };
const RUNS = Number(process.env.LH_RUNS ?? 3); // median of N runs smooths noise

mkdirSync("lighthouse-reports", { recursive: true });
const chrome = await chromeLauncher.launch({
  chromePath: process.env.CHROME_PATH,
  chromeFlags: ["--headless=new", "--no-sandbox"],
});

let failed = false;
const rows = [];
try {
  for (const path of PAGES) {
    const runs = [];
    // A cold server can make a run fail (runtimeError, no metrics); retry those.
    for (let attempt = 0; runs.length < RUNS && attempt < RUNS * 2; attempt++) {
      const result = await lighthouse(BASE + path, {
        port: chrome.port,
        output: "html",
        logLevel: "error",
        formFactor: "mobile",
        onlyCategories: Object.keys(TARGETS),
      });
      if (result.lhr.runtimeError) {
        console.warn(`${path}: run failed (${result.lhr.runtimeError.code}), retrying`);
        continue;
      }
      runs.push(result);
    }
    if (runs.length === 0) throw new Error(`${path}: every Lighthouse run failed`);
    runs.sort((a, b) => a.lhr.categories.performance.score - b.lhr.categories.performance.score);
    const median = runs[Math.floor(runs.length / 2)];
    const name = path === "/" ? "home" : path.slice(1).replace(/\//g, "-");
    writeFileSync(`lighthouse-reports/${name}.html`, median.report);

    const lhr = median.lhr;
    const scores = Object.fromEntries(
      Object.keys(TARGETS).map((k) => [k, Math.round(lhr.categories[k].score * 100)])
    );
    const cls = lhr.audits["cumulative-layout-shift"].numericValue;
    const lcp = lhr.audits["largest-contentful-paint"].numericValue;
    const tbt = lhr.audits["total-blocking-time"].numericValue;
    const js = lhr.audits["total-byte-weight"].details?.items
      ?.filter((i) => String(i.url).endsWith(".js"))
      .reduce((n, i) => n + i.totalBytes, 0);
    rows.push({ page: path, ...scores, CLS: cls.toFixed(3), LCP: `${Math.round(lcp)}ms`, TBT: `${Math.round(tbt)}ms`, JS: `${Math.round((js ?? 0) / 1024)}KB` });
    for (const [k, min] of Object.entries(TARGETS)) if (scores[k] < min) failed = true;
  }
} finally {
  await chrome.kill();
}

console.table(rows);
if (failed) {
  console.error("One or more Lighthouse targets were missed.");
  process.exit(1);
}
console.log("All Lighthouse targets met.");

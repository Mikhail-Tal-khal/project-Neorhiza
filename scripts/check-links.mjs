/**
 * Crawls every internal link reachable from the home page (plus the
 * sitemap) on a running server and verifies:
 *  - every internal URL returns 200
 *  - every #fragment points at an existing id on the target page
 *  - a bad URL returns 404 with the custom not-found page
 *
 * Usage: BASE_URL=http://localhost:3000 npm run check:links
 */
const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const pages = new Map(); // path -> html
const queue = ["/"];
const failures = [];
const links = new Set();

async function fetchPage(path) {
  const res = await fetch(BASE + path, { redirect: "manual" });
  const type = res.headers.get("content-type") ?? "";
  return { status: res.status, html: type.includes("text/html") ? await res.text() : "" };
}

function extractLinks(html) {
  const out = [];
  for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) out.push(m[1].replace(/&amp;/g, "&"));
  return out;
}

// Seed with the sitemap so orphaned pages are covered too.
const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
for (const m of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  queue.push(new URL(m[1]).pathname);
}

while (queue.length) {
  const path = queue.shift();
  if (pages.has(path)) continue;
  const { status, html } = await fetchPage(path);
  pages.set(path, html);
  if (status !== 200) {
    failures.push(`${status} ${path}`);
    continue;
  }
  for (const href of extractLinks(html)) {
    if (/^(mailto:|tel:|https?:)/.test(href)) continue;
    const url = new URL(href, BASE + path);
    links.add(`${path} -> ${url.pathname}${url.hash}`);
    if (!pages.has(url.pathname)) queue.push(url.pathname);
  }
}

// Fragment check.
for (const link of links) {
  const [from, target] = link.split(" -> ");
  const [path, hash] = target.split("#");
  if (!hash) continue;
  const html = pages.get(path) ?? "";
  if (!new RegExp(`\\sid="${hash}"`).test(html)) failures.push(`broken anchor ${target} (from ${from})`);
}

// Custom 404.
const missing = await fetchPage("/this-page-does-not-exist");
if (missing.status !== 404 || !missing.html.includes("This branch hasn")) {
  failures.push(`custom not-found page did not render (status ${missing.status})`);
}

console.log(`Crawled ${pages.size} pages, checked ${links.size} internal links.`);
if (failures.length) {
  console.error(`\n${failures.length} problem(s):\n${failures.join("\n")}`);
  process.exit(1);
}
console.log("Zero broken links, zero broken anchors; custom 404 renders.");

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { expect, test } from "@playwright/test";

/**
 * Stripe secrets stay on the server: they never appear in client bundles,
 * never use the NEXT_PUBLIC_ prefix, are never imported by client
 * components, and the committed example file holds no real values.
 */

const root = process.cwd();
const SECRET_PATTERNS = [
  /\b(sk|rk)_(test|live)_[A-Za-z0-9]{8,}/,
  /\bwhsec_[A-Za-z0-9]{8,}/,
  /STRIPE_SECRET_KEY/,
  /STRIPE_WEBHOOK_SECRET/,
];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

test("client bundles contain no Stripe secrets or secret variable names", () => {
  const staticDir = join(root, ".next/static");
  test.skip(!existsSync(staticDir), "requires `npm run build` first");
  const offenders: string[] = [];
  for (const file of walk(staticDir).filter((f) => /\.(js|css|html|json|txt)$/.test(f))) {
    const text = readFileSync(file, "utf8");
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(text)) offenders.push(`${relative(root, file)} matches ${pattern}`);
    }
  }
  expect(offenders).toEqual([]);
});

test("client components never import the server-side Stripe modules", () => {
  const clientFiles = walk(join(root, "src")).filter(
    (f) => /\.tsx?$/.test(f) && /^\s*["']use client["']/.test(readFileSync(f, "utf8"))
  );
  expect(clientFiles.length).toBeGreaterThan(0);
  for (const file of clientFiles) {
    const source = readFileSync(file, "utf8");
    expect(source, relative(root, file)).not.toMatch(
      /from ["'](stripe|@\/lib\/donations\/(config|stripe|checkout|event-store|records))["']/
    );
    expect(source, relative(root, file)).not.toMatch(/process\.env\.STRIPE/);
  }
});

test("Stripe variables are documented empty and never public", () => {
  const example = readFileSync(join(root, ".env.example"), "utf8");
  for (const name of ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"]) {
    expect(example).toMatch(new RegExp(`^${name}=$`, "m"));
  }
  expect(example).toMatch(/^DONATION_CURRENCY=usd$/m);
  expect(example).toMatch(/^DONATION_MIN_AMOUNT=5$/m);
  expect(example).toMatch(/^DONATION_MAX_AMOUNT=50000$/m);
  expect(example).not.toMatch(/NEXT_PUBLIC_STRIPE/);

  const sources = walk(join(root, "src")).filter((f) => /\.(ts|tsx)$/.test(f));
  for (const file of sources) {
    const text = readFileSync(file, "utf8");
    expect(text, relative(root, file)).not.toMatch(/NEXT_PUBLIC_STRIPE|(sk|rk)_live_[A-Za-z0-9]{8,}|whsec_[A-Za-z0-9]{16,}/);
  }
});

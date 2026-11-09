import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { REDIS_CREDENTIAL_PAIRS } from "@/lib/rate-limit";

/**
 * Redis credential names are detected in three places that cannot share
 * code (app TypeScript, next.config.ts, a plain Node script). These tests
 * keep them in sync and run the config check without printing any value.
 */

const root = process.cwd();
const SCRIPT = join(root, "scripts/check-production-config.mjs");
const FAKE_URL = "https://fake-store.upstash.example";
const FAKE_TOKEN = "fake-secret-token-value";

/** Runs the config check with only the given variables (plus PATH). */
function runCheck(vars: Record<string, string>) {
  try {
    const env: NodeJS.ProcessEnv = { NODE_ENV: "production", PATH: process.env.PATH ?? "", ...vars };
    return { code: 0, out: execFileSync(process.execPath, [SCRIPT], { env, encoding: "utf8" }) };
  } catch (error) {
    const e = error as { status: number; stdout: string; stderr: string };
    return { code: e.status, out: `${e.stdout}${e.stderr}` };
  }
}

test.describe("Redis credential names", () => {
  test("next.config.ts and the config check accept exactly the rate limiter's pairs", () => {
    for (const file of ["next.config.ts", "scripts/check-production-config.mjs"]) {
      const source = readFileSync(join(root, file), "utf8");
      const pairs = [...source.matchAll(/\["([A-Z_]+_URL)", "([A-Z_]+_TOKEN)"\]/g)].map((m) => [m[1], m[2]]);
      expect(pairs, file).toEqual(REDIS_CREDENTIAL_PAIRS.map((p) => [...p]));
    }
  });

  test("the documented example lists every accepted name", () => {
    const example = readFileSync(join(root, ".env.example"), "utf8");
    for (const name of REDIS_CREDENTIAL_PAIRS.flat()) expect(example).toContain(name);
  });
});

test.describe("check-production-config", () => {
  const base = {
    NEXT_PUBLIC_SITE_URL: "https://www.neorhiza.space",
    CONTACT_WEBHOOK_URL: "https://hooks.example/inquiry",
  };

  for (const [urlName, tokenName] of REDIS_CREDENTIAL_PAIRS) {
    test(`passes with a complete ${urlName.replace(/_URL$/, "")} pair and prints no values`, () => {
      const { code, out } = runCheck({ ...base, [urlName]: FAKE_URL, [tokenName]: FAKE_TOKEN });
      expect(out).toMatch(/PASS.*Shared rate-limit store is configured/);
      expect(out).not.toContain(FAKE_URL);
      expect(out).not.toContain(FAKE_TOKEN);
      expect(code).toBe(0);
    });
  }

  test("fails and names the missing half for an incomplete NEORHIZA_KV pair", () => {
    const { code, out } = runCheck({ ...base, NEORHIZA_KV_REST_API_URL: FAKE_URL });
    expect(code).toBe(1);
    expect(out).toMatch(/FAIL.*Shared rate-limit store is configured/);
    expect(out).toContain("missing: NEORHIZA_KV_REST_API_TOKEN");
    expect(out).not.toContain(FAKE_URL);
  });

  test("does not combine halves of different naming schemes", () => {
    const { code, out } = runCheck({ ...base, NEORHIZA_KV_REST_API_URL: FAKE_URL, KV_REST_API_TOKEN: FAKE_TOKEN });
    expect(code).toBe(1);
    expect(out).toMatch(/FAIL.*Shared rate-limit store is configured/);
    expect(out).not.toContain(FAKE_TOKEN);
  });
});

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { siteVerification } from "@/lib/verification";

/**
 * In-process tests for search-console verification metadata. No server or
 * browser; the rendered tags are covered in site-features.spec.ts.
 */

const GOOGLE = "test-google-token-123";
const BING = "TEST0BING0TOKEN";

test.describe("search verification metadata", () => {
  test("Google emits google-site-verification only", () => {
    expect(siteVerification(GOOGLE, undefined)).toEqual({ google: GOOGLE });
  });

  test("Bing emits msvalidate.01 only", () => {
    expect(siteVerification(undefined, BING)).toEqual({ other: { "msvalidate.01": BING } });
  });

  test("both together", () => {
    expect(siteVerification(GOOGLE, BING)).toEqual({ google: GOOGLE, other: { "msvalidate.01": BING } });
  });

  test("empty or whitespace-only values emit nothing", () => {
    for (const [g, b] of [
      [undefined, undefined],
      ["", ""],
      ["   ", "\n\t"],
    ] as const) {
      expect(siteVerification(g, b)).toBeUndefined();
    }
    expect(siteVerification("  ", BING)).toEqual({ other: { "msvalidate.01": BING } });
    expect(siteVerification(GOOGLE, " ")).toEqual({ google: GOOGLE });
  });

  test("values are trimmed and never logged", () => {
    const logged: unknown[] = [];
    const saved = { log: console.log, warn: console.warn, error: console.error, info: console.info };
    console.log = console.warn = console.error = console.info = (...args: unknown[]) => logged.push(args);
    try {
      expect(siteVerification(`  ${GOOGLE}\n`, `\t${BING} `)).toEqual({
        google: GOOGLE,
        other: { "msvalidate.01": BING },
      });
    } finally {
      Object.assign(console, saved);
    }
    expect(logged).toEqual([]);
  });

  test("only the root layout sets verification, so every page inherits it", () => {
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) walk(path);
        else if (/\.(ts|tsx)$/.test(name)) files.push(path);
      }
    };
    walk(join(process.cwd(), "src"));
    const setters = files
      .filter((f) => /\bverification\s*[:=,}]/.test(readFileSync(f, "utf8")))
      .map((f) => f.slice(process.cwd().length + 1).replaceAll("\\", "/"))
      .sort();
    expect(setters).toEqual(["src/app/layout.tsx"]);
  });
});

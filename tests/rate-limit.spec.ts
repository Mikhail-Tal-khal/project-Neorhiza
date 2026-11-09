import { expect, test } from "@playwright/test";
import { POST } from "@/app/api/contact/route";
import {
  REDIS_CREDENTIAL_PAIRS,
  createMemoryLimiter,
  rateLimit,
  rateLimitStoreStatus,
  resetRateLimitWarnings,
} from "@/lib/rate-limit";

/**
 * In-process tests for the shared (Upstash / Vercel KV) rate-limit store,
 * its fallbacks and production detection. fetch is mocked; no network.
 */

const ENV_KEYS = [
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "KV_REST_API_URL",
  "KV_REST_API_TOKEN",
  "NEORHIZA_KV_REST_API_URL",
  "NEORHIZA_KV_REST_API_TOKEN",
  "VERCEL_ENV",
  "RESEND_API_KEY",
  "CONTACT_TO_EMAIL",
  "CONTACT_FROM_EMAIL",
  "CONTACT_WEBHOOK_URL",
  "CONTACT_RATE_LIMIT_MAX",
  "CONTACT_RATE_LIMIT_WINDOW_SECONDS",
] as const;

const STORE_URL = "https://store.upstash.example";
const STORE_TOKEN = "upstash-secret-token";

const saved: Partial<Record<string, string>> = {};
const realFetch = globalThis.fetch;
const realConsole = { warn: console.warn, error: console.error, log: console.log };
let calls: { url: string; init: RequestInit }[] = [];
let storeReply: (n: number) => Response | Promise<Response>;
let logs: string[] = [];

/** Upstash pipeline reply: [INCR count, PEXPIRE, PTTL ms]. */
const pipeline = (count: number, ttlMs: number) =>
  Response.json([{ result: count }, { result: 1 }, { result: ttlMs }]);

let n = 0;
const key = () => `contact:test-${Date.now()}-${++n}`;

test.beforeEach(() => {
  for (const k of ENV_KEYS) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
  resetRateLimitWarnings();
  calls = [];
  storeReply = () => pipeline(1, 600_000);
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, init: init ?? {} });
    if (url.startsWith(STORE_URL)) return storeReply(calls.length);
    return new Response("{}", { status: 200 }); // email provider
  }) as typeof fetch;
  logs = [];
  for (const level of ["warn", "error", "log"] as const) {
    console[level] = (...args: unknown[]) => logs.push(args.map(String).join(" "));
  }
});

test.afterEach(() => {
  globalThis.fetch = realFetch;
  Object.assign(console, realConsole);
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

function useUpstash() {
  process.env.UPSTASH_REDIS_REST_URL = STORE_URL;
  process.env.UPSTASH_REDIS_REST_TOKEN = STORE_TOKEN;
}

function expectNoSecretsLogged() {
  const joined = logs.join("\n");
  expect(joined).not.toContain(STORE_TOKEN);
  expect(joined).not.toContain(STORE_URL);
}

test.describe("shared rate-limit store", () => {
  test("allows requests under the limit and sends a well-formed pipeline", async () => {
    useUpstash();
    const k = key();
    const result = await rateLimit(k, 5, 600_000);
    expect(result).toEqual({ allowed: true, remaining: 4, retryAfterSeconds: 0 });

    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe(`${STORE_URL}/pipeline`);
    expect(new Headers(calls[0].init.headers).get("authorization")).toBe(`Bearer ${STORE_TOKEN}`);
    expect(calls[0].init.cache).toBe("no-store");
    expect(calls[0].init.signal).toBeInstanceOf(AbortSignal);
    expect(JSON.parse(String(calls[0].init.body))).toEqual([
      ["INCR", `neorhiza:rl:${k}`],
      ["PEXPIRE", `neorhiza:rl:${k}`, "600000", "NX"],
      ["PTTL", `neorhiza:rl:${k}`],
    ]);
    expect(logs).toEqual([]);
  });

  test("rejects over the limit with Retry-After from the store's TTL", async () => {
    useUpstash();
    storeReply = () => pipeline(6, 120_000);
    expect(await rateLimit(key(), 5, 600_000)).toEqual({ allowed: false, remaining: 0, retryAfterSeconds: 120 });

    storeReply = () => pipeline(9, 1_500);
    expect((await rateLimit(key(), 5, 600_000)).retryAfterSeconds).toBe(2); // rounds up

    storeReply = () => pipeline(9, 0);
    expect((await rateLimit(key(), 5, 600_000)).retryAfterSeconds).toBe(1); // never 0
  });

  test("Vercel KV variable names are accepted", async () => {
    process.env.KV_REST_API_URL = STORE_URL;
    process.env.KV_REST_API_TOKEN = STORE_TOKEN;
    await rateLimit(key(), 5, 600_000);
    expect(calls[0].url).toBe(`${STORE_URL}/pipeline`);
    expect(rateLimitStoreStatus().store).toBe("shared");
  });

  test("NEORHIZA_-prefixed Vercel KV variable names are accepted", async () => {
    process.env.NEORHIZA_KV_REST_API_URL = ` '${STORE_URL}' `;
    process.env.NEORHIZA_KV_REST_API_TOKEN = `${STORE_TOKEN} `;
    await rateLimit(key(), 5, 600_000);
    expect(calls[0].url).toBe(`${STORE_URL}/pipeline`);
    expect(new Headers(calls[0].init.headers).get("authorization")).toBe(`Bearer ${STORE_TOKEN}`);
    expect(rateLimitStoreStatus()).toMatchObject({ store: "shared", adequate: true });
    expectNoSecretsLogged();
  });

  test("a complete NEORHIZA_KV pair is used when the other pairs are incomplete", async () => {
    process.env.VERCEL_ENV = "production";
    process.env.UPSTASH_REDIS_REST_TOKEN = "stray-token";
    process.env.KV_REST_API_URL = "https://half-configured.example";
    process.env.NEORHIZA_KV_REST_API_URL = STORE_URL;
    process.env.NEORHIZA_KV_REST_API_TOKEN = STORE_TOKEN;
    await rateLimit(key(), 5, 600_000);
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe(`${STORE_URL}/pipeline`);
    expect(new Headers(calls[0].init.headers).get("authorization")).toBe(`Bearer ${STORE_TOKEN}`);
    expect(logs).toEqual([]); // no "missing store" warning
  });

  test("existing names keep priority over NEORHIZA_KV names", async () => {
    process.env.KV_REST_API_URL = STORE_URL;
    process.env.KV_REST_API_TOKEN = STORE_TOKEN;
    process.env.NEORHIZA_KV_REST_API_URL = "https://other-store.example";
    process.env.NEORHIZA_KV_REST_API_TOKEN = "other-token";
    await rateLimit(key(), 5, 600_000);
    expect(calls[0].url).toBe(`${STORE_URL}/pipeline`);
  });

  test("incomplete credential pairs never count as configured", async () => {
    process.env.VERCEL_ENV = "production";
    for (const env of <Record<string, string>[]>[
      { UPSTASH_REDIS_REST_URL: STORE_URL },
      { UPSTASH_REDIS_REST_TOKEN: STORE_TOKEN },
      { KV_REST_API_URL: STORE_URL },
      { KV_REST_API_TOKEN: STORE_TOKEN },
      // Halves of different schemes must not be combined.
      { UPSTASH_REDIS_REST_URL: STORE_URL, KV_REST_API_TOKEN: STORE_TOKEN },
      { KV_REST_API_URL: STORE_URL, UPSTASH_REDIS_REST_TOKEN: STORE_TOKEN },
      // Blank or whitespace-only values are not credentials.
      { UPSTASH_REDIS_REST_URL: "  ", UPSTASH_REDIS_REST_TOKEN: STORE_TOKEN },
      { KV_REST_API_URL: STORE_URL, KV_REST_API_TOKEN: '""' },
      { NEORHIZA_KV_REST_API_URL: STORE_URL },
      { NEORHIZA_KV_REST_API_TOKEN: STORE_TOKEN },
      { NEORHIZA_KV_REST_API_URL: STORE_URL, NEORHIZA_KV_REST_API_TOKEN: " " },
      // The prefixed and unprefixed schemes must not be combined either.
      { NEORHIZA_KV_REST_API_URL: STORE_URL, KV_REST_API_TOKEN: STORE_TOKEN },
      { KV_REST_API_URL: STORE_URL, NEORHIZA_KV_REST_API_TOKEN: STORE_TOKEN },
      { UPSTASH_REDIS_REST_URL: STORE_URL, NEORHIZA_KV_REST_API_TOKEN: STORE_TOKEN },
    ]) {
      for (const pair of REDIS_CREDENTIAL_PAIRS) {
        for (const k of pair) delete process.env[k];
      }
      Object.assign(process.env, env);
      calls = [];
      const status = rateLimitStoreStatus();
      expect(status.store, JSON.stringify(Object.keys(env))).toBe("memory");
      expect(status.adequate).toBe(false);
      expect((await rateLimit(key(), 5, 600_000)).allowed).toBe(true);
      expect(calls, "no request is sent to a half-configured store").toHaveLength(0);
    }
    expectNoSecretsLogged();
  });

  test("a complete Upstash pair wins over a complete KV pair; values are trimmed and unquoted", async () => {
    process.env.UPSTASH_REDIS_REST_URL = ` "${STORE_URL}" `;
    process.env.UPSTASH_REDIS_REST_TOKEN = ` ${STORE_TOKEN}\n`;
    process.env.KV_REST_API_URL = "https://other-store.example";
    process.env.KV_REST_API_TOKEN = "other-token";
    await rateLimit(key(), 5, 600_000);
    expect(calls[0].url).toBe(`${STORE_URL}/pipeline`);
    expect(new Headers(calls[0].init.headers).get("authorization")).toBe(`Bearer ${STORE_TOKEN}`);
  });

  test("a complete KV pair is used when the Upstash pair is incomplete", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://half-configured.example";
    process.env.KV_REST_API_URL = STORE_URL;
    process.env.KV_REST_API_TOKEN = STORE_TOKEN;
    await rateLimit(key(), 5, 600_000);
    expect(calls[0].url).toBe(`${STORE_URL}/pipeline`);
    expect(new Headers(calls[0].init.headers).get("authorization")).toBe(`Bearer ${STORE_TOKEN}`);
  });

  test("a store timeout falls back to in-memory limiting and logs no secrets", async () => {
    useUpstash();
    storeReply = () => {
      throw new DOMException("The operation was aborted due to timeout", "TimeoutError");
    };
    const result = await rateLimit(key(), 5, 600_000);
    expect(result.allowed).toBe(true);
    expect(logs).toEqual(["Rate-limit store timed out; using in-memory fallback for this request."]);
    expectNoSecretsLogged();
  });

  test("a store error response falls back to in-memory limiting", async () => {
    useUpstash();
    storeReply = () => new Response(`{"error":"WRONGPASS ${STORE_TOKEN}"}`, { status: 401 });
    const result = await rateLimit(key(), 5, 600_000);
    expect(result.allowed).toBe(true);
    expect(logs).toEqual(["Rate-limit store unavailable; using in-memory fallback for this request."]);
    expectNoSecretsLogged();
  });

  test("the in-memory fallback still enforces the limit", async () => {
    const limiter = createMemoryLimiter();
    const k = key();
    const results = [];
    for (let i = 0; i < 6; i++) results.push(await limiter.limit(k, 5, 600_000));
    expect(results.map((r) => r.allowed)).toEqual([true, true, true, true, true, false]);
    expect(results[5].retryAfterSeconds).toBeGreaterThan(590);
    expect(results[5].retryAfterSeconds).toBeLessThanOrEqual(600);
  });
});

test.describe("production configuration", () => {
  test("production without a shared store is reported as inadequate, once per instance", async () => {
    process.env.VERCEL_ENV = "production";
    const status = rateLimitStoreStatus();
    expect(status).toMatchObject({ store: "memory", adequate: false });
    expect(status.message).toMatch(/NOT adequate production protection/);

    await rateLimit(key(), 5, 600_000);
    await rateLimit(key(), 5, 600_000);
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatch(/^\[rate-limit\] Production has no shared rate-limit store/);
  });

  test("production with a shared store is adequate and silent", async () => {
    process.env.VERCEL_ENV = "production";
    useUpstash();
    expect(rateLimitStoreStatus()).toMatchObject({ store: "shared", adequate: true });
    await rateLimit(key(), 5, 600_000);
    expect(logs).toEqual([]);
    expect(JSON.stringify(rateLimitStoreStatus())).not.toContain(STORE_TOKEN);
  });

  test("previews and development may use the in-memory limiter without warnings", async () => {
    for (const env of ["preview", "development"]) {
      process.env.VERCEL_ENV = env;
      expect(rateLimitStoreStatus()).toMatchObject({ store: "memory", adequate: true });
    }
    await rateLimit(key(), 5, 600_000);
    expect(logs).toEqual([]);
  });
});

test.describe("contact route with the shared store", () => {
  const VALID = {
    fullName: "Ada Example",
    professionalEmail: "ada@example.org",
    areaOfInterest: "Scientific collaboration",
    message: "I would like to discuss a possible scientific collaboration.",
    consent: true,
  };

  test("a store rejection becomes 429 with the store's Retry-After and nothing is sent", async () => {
    useUpstash();
    process.env.RESEND_API_KEY = "re_test";
    process.env.CONTACT_TO_EMAIL = "inquiries@neorhiza.space";
    process.env.CONTACT_FROM_EMAIL = "Project Neorhiza <website@mail.neorhiza.space>";
    storeReply = () => pipeline(6, 42_000);

    const res = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.77" },
        body: JSON.stringify(VALID),
      })
    );
    expect(res.status).toBe(429);
    expect(res.headers.get("retry-after")).toBe("42");
    expect(calls.filter((c) => c.url.includes("resend"))).toHaveLength(0);
    expect(JSON.parse(String(calls[0].init.body))[0][1]).toBe("neorhiza:rl:contact:203.0.113.77");
  });

  test("the default limit is 5 submissions per 600 seconds", async () => {
    useUpstash();
    await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(VALID),
      })
    );
    const [, expire] = JSON.parse(String(calls[0].init.body));
    expect(expire[2]).toBe("600000");
    storeReply = () => pipeline(5, 600_000);
    expect((await rateLimit(key(), 5, 600_000)).allowed).toBe(true);
    storeReply = () => pipeline(6, 600_000);
    expect((await rateLimit(key(), 5, 600_000)).allowed).toBe(false);
  });
});

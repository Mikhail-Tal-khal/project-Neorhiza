/**
 * Rate limiting for Route Handlers.
 *
 * Two stores sit behind one interface:
 *  - Upstash Redis REST (also what Vercel KV exposes), used when a complete
 *    credential pair is set (see `REDIS_CREDENTIAL_PAIRS`). Shared across
 *    serverless instances.
 *  - An in-memory sliding window, used for local development, tests and
 *    previews, and as a fallback if the remote store is unreachable. It only
 *    limits within a single server instance, so on Vercel production it is a
 *    degraded mode: `rateLimitStoreStatus()` reports it and a warning is
 *    logged (see also `npm run check:config`).
 */

import { envValue } from "@/lib/env";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export interface RateLimiter {
  readonly kind: "upstash" | "memory";
  limit(key: string, max: number, windowMs: number): Promise<RateLimitResult>;
}

/* ----------------------------- in-memory ----------------------------- */

const SWEEP_INTERVAL_MS = 5 * 60 * 1000;

export function createMemoryLimiter(): RateLimiter {
  const buckets = new Map<string, number[]>();
  let lastSweep = Date.now();

  return {
    kind: "memory",
    async limit(key, max, windowMs) {
      const now = Date.now();
      if (now - lastSweep > SWEEP_INTERVAL_MS) {
        lastSweep = now;
        for (const [k, hits] of buckets) {
          const alive = hits.filter((t) => now - t < windowMs);
          if (alive.length === 0) buckets.delete(k);
          else buckets.set(k, alive);
        }
      }

      const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
      if (hits.length >= max) {
        const oldest = Math.min(...hits);
        return {
          allowed: false,
          remaining: 0,
          retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)),
        };
      }
      hits.push(now);
      buckets.set(key, hits);
      return { allowed: true, remaining: max - hits.length, retryAfterSeconds: 0 };
    },
  };
}

/* ------------------------------ Upstash ------------------------------ */

/** Fixed-window counter via the Upstash REST pipeline endpoint. */
export function createUpstashLimiter(url: string, token: string): RateLimiter {
  const endpoint = `${url.replace(/\/$/, "")}/pipeline`;
  return {
    kind: "upstash",
    async limit(key, max, windowMs) {
      const redisKey = `neorhiza:rl:${key}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify([
          ["INCR", redisKey],
          ["PEXPIRE", redisKey, String(windowMs), "NX"],
          ["PTTL", redisKey],
        ]),
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) throw new Error(`Rate-limit store responded ${res.status}`);
      const [count, , ttl] = (await res.json()) as { result: number }[];
      const hits = Number(count.result);
      const ttlMs = Math.max(0, Number(ttl.result));
      if (hits > max) {
        return {
          allowed: false,
          remaining: 0,
          retryAfterSeconds: Math.max(1, Math.ceil(ttlMs / 1000)),
        };
      }
      return { allowed: true, remaining: max - hits, retryAfterSeconds: 0 };
    },
  };
}

/* ------------------------------ factory ------------------------------ */

const memory = createMemoryLimiter();

/**
 * Accepted names for the shared store's REST credentials, in priority order:
 * Upstash's own names, Vercel KV / Upstash-for-Vercel names, and the same
 * with the `NEORHIZA_` prefix Vercel adds when a store is connected with a
 * custom environment-variable prefix. Keep in sync with next.config.ts and
 * scripts/check-production-config.mjs (a test enforces this).
 */
export const REDIS_CREDENTIAL_PAIRS = [
  ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
  ["KV_REST_API_URL", "KV_REST_API_TOKEN"],
  ["NEORHIZA_KV_REST_API_URL", "NEORHIZA_KV_REST_API_TOKEN"],
] as const;

/**
 * The shared-store credentials, taken only from a complete pair, in the
 * order above. A half-set pair never combines with another naming scheme
 * (that would send one store's token to another store's URL).
 */
export function sharedStoreConfig() {
  for (const [urlName, tokenName] of REDIS_CREDENTIAL_PAIRS) {
    const url = envValue(urlName);
    const token = envValue(tokenName);
    if (url && token) return { url, token };
  }
  return null;
}

/**
 * True on a production deployment: Vercel's production environment, or a
 * production build (`next start`) outside Vercel. Vercel previews and
 * `next dev` are not production.
 */
export function isProductionDeployment(): boolean {
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV === "production";
  return process.env.NODE_ENV === "production";
}

export type RateLimitStoreStatus = {
  /** Which store protects the contact form right now. */
  store: "shared" | "memory";
  /** Whether that is acceptable for this environment. */
  adequate: boolean;
  /** Human-readable, secret-free explanation. */
  message: string;
};

/**
 * Secret-free description of the rate-limit configuration. Never includes
 * URLs or tokens — only whether they are present.
 */
export function rateLimitStoreStatus(): RateLimitStoreStatus {
  if (sharedStoreConfig()) {
    return { store: "shared", adequate: true, message: "Shared rate-limit store configured." };
  }
  if (isProductionDeployment()) {
    return {
      store: "memory",
      adequate: false,
      message:
        "Production has no shared rate-limit store (UPSTASH_REDIS_REST_URL/TOKEN, KV_REST_API_URL/TOKEN or NEORHIZA_KV_REST_API_URL/TOKEN). " +
        "The in-memory fallback limits each serverless instance separately and is NOT adequate production protection.",
    };
  }
  return {
    store: "memory",
    adequate: true,
    message: "In-memory rate limiting (acceptable for local development, tests and previews).",
  };
}

let warnedMissingStore = false;

/** Test hook: resets the once-per-instance warning. */
export function resetRateLimitWarnings() {
  warnedMissingStore = false;
}

/**
 * Applies the configured limiter. If the remote store fails, the in-memory
 * limiter is used for that request so the form keeps working, and the
 * failure is logged. In production without a shared store, a warning is
 * logged once per instance: in-memory limiting is a degraded mode there.
 */
export async function rateLimit(
  key: string,
  max: number,
  windowMs: number
): Promise<RateLimitResult> {
  const remote = sharedStoreConfig();
  if (remote) {
    try {
      return await createUpstashLimiter(remote.url, remote.token).limit(key, max, windowMs);
    } catch (error) {
      const reason =
        error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")
          ? "timed out"
          : "unavailable";
      console.error(`Rate-limit store ${reason}; using in-memory fallback for this request.`);
    }
  } else if (!warnedMissingStore) {
    const status = rateLimitStoreStatus();
    if (!status.adequate) {
      warnedMissingStore = true;
      console.error(`[rate-limit] ${status.message}`);
    }
  }
  return memory.limit(key, max, windowMs);
}

/** Best-effort client IP extraction from proxy headers (Vercel sets both). */
export function clientIpFrom(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") || "unknown";
}

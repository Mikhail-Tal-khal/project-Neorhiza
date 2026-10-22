/**
 * Rate limiting for Route Handlers.
 *
 * Two stores sit behind one interface:
 *  - Upstash Redis REST (also what Vercel KV exposes), used when
 *    UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_URL +
 *    KV_REST_API_TOKEN) are set. Shared across serverless instances.
 *  - An in-memory sliding window, used for local development and as a
 *    fallback if the remote store is unreachable. It only limits within a
 *    single server instance.
 */

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

function remoteConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

/**
 * Applies the configured limiter. If the remote store fails, the in-memory
 * limiter is used for that request so the form keeps working.
 */
export async function rateLimit(
  key: string,
  max: number,
  windowMs: number
): Promise<RateLimitResult> {
  const remote = remoteConfig();
  if (remote) {
    try {
      return await createUpstashLimiter(remote.url, remote.token).limit(key, max, windowMs);
    } catch {
      console.error("Rate-limit store unavailable; using in-memory fallback.");
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

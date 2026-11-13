/**
 * Idempotency for Stripe webhook events. Stripe delivers events at least
 * once, so the same event ID can arrive more than once (retries, replays
 * from the Dashboard, concurrent deliveries).
 *
 * An event is *claimed* before it is handled. If handling fails, the claim
 * is released and the handler returns 5xx so Stripe retries it later.
 *
 * Uses the same shared Redis store as the rate limiter when configured, and
 * a per-instance in-memory set otherwise (adequate for tests and previews;
 * the downstream recorder should still be idempotent on the event ID).
 */
import { sharedStoreConfig } from "@/lib/rate-limit";

/** Stripe retries for up to three days; remember events for a week. */
export const EVENT_TTL_SECONDS = 7 * 24 * 60 * 60;

const memory = new Map<string, number>();

function memoryClaim(key: string, ttlMs: number) {
  const now = Date.now();
  for (const [k, expires] of memory) if (expires <= now) memory.delete(k);
  if (memory.has(key)) return false;
  memory.set(key, now + ttlMs);
  return true;
}

async function redis(command: (string | number)[]) {
  const store = sharedStoreConfig();
  if (!store) return null;
  const res = await fetch(store.url.replace(/\/$/, ""), {
    method: "POST",
    headers: { Authorization: `Bearer ${store.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command.map(String)),
    cache: "no-store",
    signal: AbortSignal.timeout(3000),
  });
  if (!res.ok) throw new Error(`Event store responded ${res.status}`);
  return ((await res.json()) as { result: unknown }).result;
}

const keyFor = (eventId: string) => `neorhiza:stripe-event:${eventId}`;

/** Returns true when this caller should handle the event, false for a duplicate. */
export async function claimEvent(eventId: string): Promise<boolean> {
  const key = keyFor(eventId);
  if (sharedStoreConfig()) {
    try {
      // SET NX answers "OK" for the first claim and null for a duplicate.
      return (await redis(["SET", key, "1", "NX", "EX", EVENT_TTL_SECONDS])) === "OK";
    } catch {
      console.error("[stripe-webhook] Event store unavailable; using in-memory idempotency for this event.");
    }
  }
  return memoryClaim(key, EVENT_TTL_SECONDS * 1000);
}

/** Forgets a claim so a failed event can be retried by Stripe. */
export async function releaseEvent(eventId: string): Promise<void> {
  const key = keyFor(eventId);
  memory.delete(key);
  try {
    await redis(["DEL", key]);
  } catch {
    console.error("[stripe-webhook] Could not release an event claim in the event store.");
  }
}

/** Test hook. */
export function resetEventStore() {
  memory.clear();
}

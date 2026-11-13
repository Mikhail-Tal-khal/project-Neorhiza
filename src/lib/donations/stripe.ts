/**
 * Stripe client for the server. Uses Stripe's fetch-based HTTP client so
 * requests go through `globalThis.fetch` — the automated tests replace that
 * function and never reach Stripe.
 *
 * Server-only. The secret key is read from STRIPE_SECRET_KEY and never
 * logged, returned or prefixed with NEXT_PUBLIC_.
 */
import Stripe from "stripe";
import { stripeSecretKey } from "@/lib/donations/config";

export type { Stripe };

let cached: { key: string; client: Stripe } | null = null;

export function createStripeClient(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    // Look fetch up on every request (not once at construction) so tests can mock it.
    httpClient: Stripe.createFetchHttpClient(((input, init) => globalThis.fetch(input, init)) as typeof fetch),
    maxNetworkRetries: 1,
    timeout: 10_000,
    telemetry: false,
    appInfo: { name: "project-neorhiza-website" },
  });
}

/** The shared client, or null when Stripe is not configured. */
export function getStripe(): Stripe | null {
  const key = stripeSecretKey();
  if (!key) return null;
  if (cached?.key !== key) cached = { key, client: createStripeClient(key) };
  return cached.client;
}

/**
 * Secret-free description of a Stripe failure for logs: error type, code
 * and HTTP status only. Stripe's messages are never logged because some
 * (e.g. invalid-key errors) echo part of the key.
 */
export function describeStripeError(error: unknown): string {
  if (error instanceof Stripe.errors.StripeError) {
    const parts = [`type=${error.type}`];
    if (error.code) parts.push(`code=${error.code}`);
    if (error.statusCode) parts.push(`status=${error.statusCode}`);
    return parts.join(" ");
  }
  return error instanceof Error ? `type=${error.name}` : "type=unknown";
}

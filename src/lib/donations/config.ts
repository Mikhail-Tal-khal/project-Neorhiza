/**
 * Server-side donation configuration. Reads environment variables and
 * reports only whether secrets are present — never their values.
 *
 * Server-only: do not import from client components (secrets are read here;
 * Next.js would not inline them, but the intent should stay obvious).
 */
import { envValue } from "@/lib/env";
import {
  DEFAULT_DONATION_CURRENCY,
  DEFAULT_MAX_AMOUNT,
  DEFAULT_MIN_AMOUNT,
  DONATION_PRESETS,
  isSupportedCurrency,
  type DonationSettings,
} from "@/lib/donations/amount";

/** Stripe's own ceiling for a single USD-like charge is 999,999.99. */
const HARD_MAX_AMOUNT = 999_999;

function wholeUnits(name: string): number | null {
  const raw = envValue(name);
  if (!/^\d{1,6}$/.test(raw)) return null;
  const n = Number(raw);
  return n >= 1 && n <= HARD_MAX_AMOUNT ? n : null;
}

let warnedSettings = false;

/**
 * Effective donation settings. Invalid or inconsistent values fall back to
 * the documented defaults (USD, 5–50,000) and are reported once per
 * instance by name only.
 */
export function donationSettings(): DonationSettings {
  const problems: string[] = [];

  const currencyRaw = envValue("DONATION_CURRENCY").toLowerCase();
  let currency = DEFAULT_DONATION_CURRENCY as DonationSettings["currency"];
  if (currencyRaw) {
    if (isSupportedCurrency(currencyRaw)) currency = currencyRaw;
    else problems.push("DONATION_CURRENCY is not a supported currency");
  }

  let minAmount = DEFAULT_MIN_AMOUNT;
  let maxAmount = DEFAULT_MAX_AMOUNT;
  const min = envValue("DONATION_MIN_AMOUNT") ? wholeUnits("DONATION_MIN_AMOUNT") : DEFAULT_MIN_AMOUNT;
  const max = envValue("DONATION_MAX_AMOUNT") ? wholeUnits("DONATION_MAX_AMOUNT") : DEFAULT_MAX_AMOUNT;
  if (min === null) problems.push("DONATION_MIN_AMOUNT must be a whole number from 1 to 999999");
  if (max === null) problems.push("DONATION_MAX_AMOUNT must be a whole number from 1 to 999999");
  if (min !== null && max !== null) {
    if (min < max) {
      minAmount = min;
      maxAmount = max;
    } else {
      problems.push("DONATION_MIN_AMOUNT must be lower than DONATION_MAX_AMOUNT");
    }
  }

  if (problems.length && !warnedSettings) {
    warnedSettings = true;
    console.error(`[donations] Invalid donation settings, using defaults: ${problems.join("; ")}.`);
  }

  return {
    currency,
    minAmount,
    maxAmount,
    presets: DONATION_PRESETS.filter((p) => p >= minAmount && p <= maxAmount),
  };
}

/** Accepts standard (sk_) and restricted (rk_) secret keys. */
const SECRET_KEY_PATTERN = /^(sk|rk)_(test|live)_[A-Za-z0-9_]+$/;

/** The Stripe secret key, or null when absent or malformed. */
export function stripeSecretKey(): string | null {
  const key = envValue("STRIPE_SECRET_KEY");
  return SECRET_KEY_PATTERN.test(key) ? key : null;
}

/** True when online contributions can be taken (a usable secret key exists). */
export function isDonationConfigured(): boolean {
  return stripeSecretKey() !== null;
}

/** The webhook signing secret, or null when absent. */
export function stripeWebhookSecret(): string | null {
  const secret = envValue("STRIPE_WEBHOOK_SECRET");
  return secret.startsWith("whsec_") ? secret : null;
}

/** Test hook: resets the once-per-instance warning. */
export function resetDonationConfigWarnings() {
  warnedSettings = false;
}

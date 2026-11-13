/**
 * Contribution amount rules shared by the donation form (client) and the
 * checkout endpoint (server). The server is authoritative: it re-parses
 * whatever the browser sends with `parseAmountToCents` and never trusts a
 * pre-computed number of cents.
 *
 * Free of runtime dependencies so the client form can import it cheaply.
 */

/** Suggested one-time amounts, in whole currency units. */
export const DONATION_PRESETS = [25, 50, 100, 250, 500] as const;

export const DEFAULT_DONATION_CURRENCY = "usd";
export const DEFAULT_MIN_AMOUNT = 5;
export const DEFAULT_MAX_AMOUNT = 50_000;

/**
 * Currencies the flow supports. All use two minor-unit decimals in Stripe,
 * so "amount × 100" is always the correct conversion (zero-decimal
 * currencies such as JPY are deliberately excluded).
 */
export const SUPPORTED_CURRENCIES = ["usd", "eur", "gbp", "cad", "aud", "chf", "kes"] as const;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export function isSupportedCurrency(value: unknown): value is SupportedCurrency {
  return typeof value === "string" && (SUPPORTED_CURRENCIES as readonly string[]).includes(value);
}

/** Public donation settings — safe to pass to the browser. */
export type DonationSettings = {
  currency: SupportedCurrency;
  /** Whole currency units. */
  minAmount: number;
  /** Whole currency units. */
  maxAmount: number;
  /** Presets within [minAmount, maxAmount], whole currency units. */
  presets: number[];
};

export type AmountResult =
  | { ok: true; cents: number }
  | { ok: false; reason: "invalid" | "below-minimum" | "above-maximum"; message: string };

/**
 * Plain decimal: whole units with optional 1–2 decimals. No signs,
 * exponents, hex, separators, whitespace or leading zeros ("007").
 */
const AMOUNT_PATTERN = /^(0|[1-9]\d{0,8})(\.\d{1,2})?$/;

/** Formats whole or fractional currency units for display ("$50", "$12.50"). */
export function formatMoney(units: number, currency: string) {
  const whole = Number.isInteger(units);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: whole ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(units);
  } catch {
    return `${units.toFixed(whole ? 0 : 2)} ${currency.toUpperCase()}`;
  }
}

/** Formats an amount in minor units (cents). */
export function formatCents(cents: number, currency: string) {
  return formatMoney(cents / 100, currency);
}

/**
 * Parses an amount in whole currency units ("50", "12.5", 250) into an
 * integer number of cents without floating-point arithmetic, and enforces
 * the configured limits. Rejects everything that is not a plain,
 * non-negative decimal with at most two decimals.
 */
export function parseAmountToCents(
  input: unknown,
  limits: Pick<DonationSettings, "minAmount" | "maxAmount" | "currency">
): AmountResult {
  const invalid: AmountResult = {
    ok: false,
    reason: "invalid",
    message: "Please enter a valid amount, for example 50 or 75.50.",
  };

  let text: string;
  if (typeof input === "number") {
    if (!Number.isFinite(input)) return invalid;
    text = String(input); // 1e21 → "1e+21", rejected below
  } else if (typeof input === "string") {
    text = input;
  } else {
    return invalid;
  }

  const match = AMOUNT_PATTERN.exec(text);
  if (!match) return invalid;

  const whole = Number(match[1]);
  const fraction = (match[2] ?? "").slice(1).padEnd(2, "0");
  const cents = whole * 100 + Number(fraction || "0");
  if (!Number.isSafeInteger(cents)) return invalid;

  if (cents < limits.minAmount * 100) {
    return {
      ok: false,
      reason: "below-minimum",
      message: `The minimum contribution is ${formatMoney(limits.minAmount, limits.currency)}.`,
    };
  }
  if (cents > limits.maxAmount * 100) {
    return {
      ok: false,
      reason: "above-maximum",
      message: `The maximum online contribution is ${formatMoney(limits.maxAmount, limits.currency)}. For larger support, please start a funding conversation.`,
    };
  }
  return { ok: true, cents };
}

/**
 * Normalizes what a visitor typed in the custom-amount field before it is
 * sent: removes a leading currency symbol, spaces and thousands commas.
 * The server still validates the result strictly.
 */
export function normalizeTypedAmount(value: string) {
  return value.trim().replace(/^[$€£]\s*/, "").replace(/[\s,]/g, "");
}

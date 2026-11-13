/**
 * Checkout Session creation and verification. Card details are only ever
 * entered on Stripe's hosted page; this module sees amounts and IDs only.
 */
import type { Stripe } from "@/lib/donations/stripe";
import { describeStripeError } from "@/lib/donations/stripe";
import { site } from "@/lib/site";

/** Non-sensitive metadata attached to every session and payment. */
export const DONATION_METADATA = { project: "neorhiza", purpose: "research-support" } as const;

export const DONATION_PRODUCT = {
  name: "Contribution to Project Neorhiza",
  description: "One-time contribution supporting early-stage research and development.",
} as const;

/** Stripe Checkout Session IDs, e.g. cs_test_a1B2… / cs_live_a1B2… */
const SESSION_ID_PATTERN = /^cs_(test|live)_[A-Za-z0-9]{8,250}$/;

export function isCheckoutSessionId(value: unknown): value is string {
  return typeof value === "string" && SESSION_ID_PATTERN.test(value);
}

export function donationReturnUrls(origin = site.url) {
  return {
    // {CHECKOUT_SESSION_ID} is substituted by Stripe and must stay unencoded.
    success_url: `${origin}/funding/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/funding/cancelled`,
  };
}

/** Builds the session parameters entirely on the server. */
export function checkoutSessionParams(cents: number, currency: string): Stripe.Checkout.SessionCreateParams {
  return {
    mode: "payment",
    submit_type: "donate",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency,
          unit_amount: cents,
          product_data: { ...DONATION_PRODUCT },
        },
      },
    ],
    // Payment mode always collects the contributor's email on Stripe's page.
    billing_address_collection: "auto",
    metadata: { ...DONATION_METADATA },
    payment_intent_data: {
      description: DONATION_PRODUCT.name,
      metadata: { ...DONATION_METADATA },
    },
    ...donationReturnUrls(),
  };
}

export type CreateSessionResult =
  | { ok: true; url: string; sessionId: string }
  | { ok: false };

export async function createDonationCheckoutSession(
  stripe: Stripe,
  cents: number,
  currency: string
): Promise<CreateSessionResult> {
  try {
    const session = await stripe.checkout.sessions.create(checkoutSessionParams(cents, currency));
    if (!session.url || !session.url.startsWith("https://")) {
      console.error("[donations] Checkout Session returned without a usable URL.");
      return { ok: false };
    }
    return { ok: true, url: session.url, sessionId: session.id };
  } catch (error) {
    console.error(`[donations] Checkout Session creation failed (${describeStripeError(error)}).`);
    return { ok: false };
  }
}

/* ---------------------------- verification ---------------------------- */

export type VerifiedSession =
  /** Stripe reports the payment as paid. */
  | { state: "paid"; amountCents: number; currency: string; reference: string | null }
  /** Checkout completed but an asynchronous method has not settled yet. */
  | { state: "processing" }
  /** The session exists but no payment was completed. */
  | { state: "unpaid" }
  /** Missing, malformed, unknown, or not a Neorhiza contribution. */
  | { state: "invalid" }
  /** Stripe is not configured or could not be reached. */
  | { state: "unavailable" };

function paymentReference(session: Stripe.Checkout.Session): string | null {
  const pi = session.payment_intent;
  const id = typeof pi === "string" ? pi : pi?.id;
  return id && /^pi_[A-Za-z0-9]+$/.test(id) ? id : null;
}

/**
 * Retrieves the session from Stripe and decides what the success page may
 * show. The query parameter only says *which* session to look up; whether a
 * payment happened is always Stripe's answer.
 */
export async function verifyCheckoutSession(
  stripe: Stripe | null,
  sessionId: unknown
): Promise<VerifiedSession> {
  if (!isCheckoutSessionId(sessionId)) return { state: "invalid" };
  if (!stripe) return { state: "unavailable" };

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    const missing =
      typeof error === "object" && error !== null && (error as { statusCode?: number }).statusCode === 404;
    if (missing) return { state: "invalid" };
    console.error(`[donations] Checkout Session lookup failed (${describeStripeError(error)}).`);
    return { state: "unavailable" };
  }

  if (session.mode !== "payment" || session.metadata?.project !== DONATION_METADATA.project) {
    return { state: "invalid" };
  }
  if (session.payment_status === "paid" && typeof session.amount_total === "number" && session.currency) {
    return {
      state: "paid",
      amountCents: session.amount_total,
      currency: session.currency,
      reference: paymentReference(session),
    };
  }
  if (session.status === "complete" && session.payment_status === "unpaid") return { state: "processing" };
  return { state: "unpaid" };
}

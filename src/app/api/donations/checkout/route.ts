import { NextResponse } from "next/server";
import { isAllowedOrigin } from "@/lib/request-origin";
import { clientIpFrom, rateLimit } from "@/lib/rate-limit";
import { parseAmountToCents } from "@/lib/donations/amount";
import { donationSettings } from "@/lib/donations/config";
import { getStripe } from "@/lib/donations/stripe";
import { createDonationCheckoutSession } from "@/lib/donations/checkout";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The request carries an amount and a currency code; nothing larger is needed. */
const MAX_BODY_BYTES = 1024;
/** Checkout attempts per client IP per window (independent of the contact form). */
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function fail(status: number, message: string, headers?: HeadersInit) {
  return NextResponse.json({ ok: false, message }, { status, headers });
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return fail(403, "This request was not accepted. Please use the contribution form on this website.");
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return fail(415, "Invalid request format.");
  }

  const tooLarge = () => fail(413, "This request is too large.");
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return tooLarge();

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) return tooLarge();
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(400, "Invalid request format.");
  }

  const limit = await rateLimit(
    `donation-checkout:${clientIpFrom(request.headers)}`,
    RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS
  );
  if (!limit.allowed) {
    return fail(429, "Too many checkout attempts from this connection. Please try again in a few minutes.", {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  const settings = donationSettings();

  // Only the configured currency is accepted; it is optional in the request.
  const currency = body.currency === undefined ? settings.currency : body.currency;
  if (typeof currency !== "string" || currency.toLowerCase() !== settings.currency) {
    return fail(400, `Contributions are accepted in ${settings.currency.toUpperCase()} only.`);
  }

  // The amount is re-parsed and range-checked here; the browser's value is never trusted.
  const amount = parseAmountToCents(body.amount, settings);
  if (!amount.ok) return fail(400, amount.message);

  const stripe = getStripe();
  if (!stripe) {
    return fail(503, "Secure online contributions are being prepared and are not available yet.");
  }

  const session = await createDonationCheckoutSession(stripe, amount.cents, settings.currency);
  if (!session.ok) {
    return fail(502, "Secure checkout could not be started. No payment was taken. Please try again shortly.");
  }

  return NextResponse.json({ ok: true, url: session.url }, { status: 200 });
}

function methodNotAllowed() {
  return NextResponse.json({ ok: false, message: "Method not allowed." }, { status: 405, headers: { Allow: "POST" } });
}

export { methodNotAllowed as GET, methodNotAllowed as PUT, methodNotAllowed as PATCH, methodNotAllowed as DELETE };

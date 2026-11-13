import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripeWebhookSecret } from "@/lib/donations/config";
import { DONATION_METADATA } from "@/lib/donations/checkout";
import { claimEvent, releaseEvent } from "@/lib/donations/event-store";
import { donationRecorder, type DonationOutcome } from "@/lib/donations/records";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Stripe event payloads are small; anything larger is not from Stripe. */
const MAX_BODY_BYTES = 512 * 1024;

const HANDLED = {
  "checkout.session.completed": null, // outcome depends on payment_status
  "checkout.session.async_payment_succeeded": "confirmed",
  "checkout.session.async_payment_failed": "failed",
} as const satisfies Record<string, DonationOutcome | null>;

type HandledType = keyof typeof HANDLED;

function isHandled(type: string): type is HandledType {
  return Object.hasOwn(HANDLED, type);
}

function reply(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

/**
 * Stripe webhook. Response codes are chosen so Stripe retries only when a
 * retry can help: 2xx = done (including duplicates and ignored events),
 * 400 = never valid (bad signature/payload), 5xx = try again later.
 */
export async function POST(request: Request) {
  const secret = stripeWebhookSecret();
  if (!secret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is not configured; event rejected for retry.");
    return reply(503, { error: "Webhook not configured." });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return reply(400, { error: "Missing signature." });

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return reply(413, { error: "Payload too large." });
  }
  // The signature covers the exact raw body, so it must be read unparsed.
  const payload = await request.text();
  if (Buffer.byteLength(payload, "utf8") > MAX_BODY_BYTES) return reply(413, { error: "Payload too large." });

  let event: Stripe.Event;
  try {
    event = await Stripe.webhooks.constructEventAsync(payload, signature, secret);
  } catch {
    console.error("[stripe-webhook] Signature verification failed; event rejected.");
    return reply(400, { error: "Invalid signature." });
  }

  if (!isHandled(event.type)) return reply(200, { received: true, ignored: true });

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.object !== "checkout.session" || session.metadata?.project !== DONATION_METADATA.project) {
    // Another product on the same Stripe account: acknowledge and move on.
    return reply(200, { received: true, ignored: true });
  }

  if (!(await claimEvent(event.id))) {
    return reply(200, { received: true, duplicate: true });
  }

  const fixed = HANDLED[event.type];
  const outcome: DonationOutcome = fixed ?? (session.payment_status === "unpaid" ? "pending" : "confirmed");

  try {
    await donationRecorder().record({
      eventId: event.id,
      eventType: event.type,
      sessionId: session.id,
      amountTotal: session.amount_total ?? null,
      currency: session.currency ?? null,
      paymentStatus: session.payment_status ?? null,
      outcome,
      livemode: event.livemode,
    });
  } catch {
    await releaseEvent(event.id);
    console.error(`[stripe-webhook] Recording failed for event ${event.id}; Stripe will retry.`);
    return reply(500, { error: "Temporary failure." });
  }

  return reply(200, { received: true });
}

function methodNotAllowed() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405, headers: { Allow: "POST" } });
}

export { methodNotAllowed as GET, methodNotAllowed as PUT, methodNotAllowed as PATCH, methodNotAllowed as DELETE };

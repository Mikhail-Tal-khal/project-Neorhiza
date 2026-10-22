import { NextResponse } from "next/server";
import { contactSchema, fieldErrors } from "@/lib/validation";
import { rateLimit, clientIpFrom } from "@/lib/rate-limit";
import { deliverInquiry, isDeliveryConfigured } from "@/lib/contact-delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;

function envInt(name: string, fallback: number) {
  const n = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** Trim string values before validation. */
function normalize(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    out[key] = typeof value === "string" ? value.trim() : value;
  }
  return out;
}

function fail(status: number, message: string, extra?: Record<string, unknown>, headers?: HeadersInit) {
  return NextResponse.json({ ok: false, message, ...extra }, { status, headers });
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return fail(415, "Invalid request format.");
  }

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return fail(413, "This message is too large to send.");
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(400, "Invalid request format.");
  }

  // Honeypot: real users never fill this hidden field. Bots receive an
  // indistinguishable success response and nothing is delivered.
  if (String(body.companyWebsite ?? "").trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const max = envInt("CONTACT_RATE_LIMIT_MAX", 5);
  const windowSeconds = envInt("CONTACT_RATE_LIMIT_WINDOW_SECONDS", 600);
  const limit = await rateLimit(`contact:${clientIpFrom(request.headers)}`, max, windowSeconds * 1000);
  if (!limit.allowed) {
    return fail(
      429,
      "Too many inquiries from this connection. Please try again later.",
      undefined,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  const parsed = contactSchema.safeParse(normalize(body));
  if (!parsed.success) {
    return fail(400, "Please correct the highlighted fields and try again.", {
      errors: fieldErrors(parsed.error),
    });
  }

  if (!isDeliveryConfigured()) {
    console.error("Contact form submission rejected: no delivery destination is configured.");
    return fail(
      503,
      "The contact form is temporarily unavailable, so your inquiry was not sent. Please try again later."
    );
  }

  const { consent: _consent, companyWebsite: _honeypot, ...inquiry } = parsed.data;
  const result = await deliverInquiry(inquiry);
  if (result !== "delivered") {
    return fail(502, "Your inquiry could not be sent due to a server problem. Please try again later.");
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

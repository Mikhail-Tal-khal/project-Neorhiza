import { confirmationEmail, notificationEmail, type EmailContent, type Inquiry } from "@/lib/contact-email";

/**
 * Delivers a validated inquiry to every configured destination:
 *  - Webhook: CONTACT_WEBHOOK_URL (optional bearer CONTACT_WEBHOOK_TOKEN)
 *  - Email via Resend: RESEND_API_KEY + CONTACT_TO_EMAIL + CONTACT_FROM_EMAIL
 *
 * If nothing is configured the result is "unconfigured" and the route
 * reports a clear failure — the form never pretends to succeed.
 *
 * Once the inquiry has reached the project team, a confirmation email is
 * sent to the visitor (Resend only). A failed confirmation never fails the
 * inquiry. Logs carry a reason code only — never inquiry content.
 */

export type { Inquiry } from "@/lib/contact-email";

export type DeliveryResult = "delivered" | "unconfigured" | "failed";

const TIMEOUT_MS = 8000;
const RESEND_ENDPOINT = "https://api.resend.com/emails";

type ResendTarget = { apiKey: string; to: string[]; from: string };

class DeliveryError extends Error {}

function webhookTarget() {
  const url = process.env.CONTACT_WEBHOOK_URL;
  return url ? { url, token: process.env.CONTACT_WEBHOOK_TOKEN } : null;
}

function resendTarget(): ResendTarget | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = (process.env.CONTACT_TO_EMAIL ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  return apiKey && to.length > 0 && from ? { apiKey, to, from } : null;
}

export function isDeliveryConfigured(): boolean {
  return Boolean(webhookTarget() || resendTarget());
}

/** A log-safe description of a delivery error: no URLs, payloads or addresses. */
function reasonOf(error: unknown): string {
  if (error instanceof DeliveryError) return error.message;
  if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
    return "request timed out";
  }
  return "network error";
}

async function sendWebhook(target: { url: string; token?: string }, inquiry: Inquiry) {
  const res = await fetch(target.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(target.token ? { Authorization: `Bearer ${target.token}` } : {}),
    },
    body: JSON.stringify({ type: "neorhiza-inquiry", receivedAt: new Date().toISOString(), data: inquiry }),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new DeliveryError(`webhook responded ${res.status}`);
}

async function sendResend(
  target: ResendTarget,
  message: EmailContent & { to: string[]; replyTo: string }
) {
  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${target.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: target.from,
      to: message.to,
      reply_to: message.replyTo,
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  // The provider's response body is never read or logged: it can echo addresses.
  if (!res.ok) throw new DeliveryError(`email provider responded ${res.status}`);
}

export async function deliverInquiry(inquiry: Inquiry): Promise<DeliveryResult> {
  const webhook = webhookTarget();
  const resend = resendTarget();
  if (!webhook && !resend) return "unconfigured";

  const jobs: Promise<void>[] = [];
  if (webhook) jobs.push(sendWebhook(webhook, inquiry));
  if (resend) {
    jobs.push(
      sendResend(resend, {
        ...notificationEmail(inquiry),
        to: resend.to,
        replyTo: inquiry.professionalEmail,
      })
    );
  }

  const results = await Promise.allSettled(jobs);
  for (const r of results) {
    if (r.status === "rejected") console.error(`Inquiry delivery failed: ${reasonOf(r.reason)}`);
  }
  if (!results.some((r) => r.status === "fulfilled")) return "failed";

  // The inquiry is safely with the project team; confirm receipt to the visitor.
  if (resend) {
    try {
      await sendResend(resend, {
        ...confirmationEmail(),
        to: [inquiry.professionalEmail],
        replyTo: resend.to[0],
      });
    } catch (error) {
      console.error(`Inquiry confirmation email failed: ${reasonOf(error)}`);
    }
  }
  return "delivered";
}

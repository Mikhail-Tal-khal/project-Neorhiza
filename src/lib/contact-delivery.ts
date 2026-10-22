import type { ContactData } from "@/lib/validation";

/**
 * Delivers a validated inquiry to every configured destination:
 *  - Webhook: CONTACT_WEBHOOK_URL (optional bearer CONTACT_WEBHOOK_TOKEN)
 *  - Email via Resend: RESEND_API_KEY + CONTACT_TO_EMAIL + CONTACT_FROM_EMAIL
 *
 * If nothing is configured the result is "unconfigured" and the route
 * reports a clear failure — the form never pretends to succeed.
 */

export type Inquiry = Omit<ContactData, "consent" | "companyWebsite">;

export type DeliveryResult = "delivered" | "unconfigured" | "failed";

const TIMEOUT_MS = 8000;

function webhookTarget() {
  const url = process.env.CONTACT_WEBHOOK_URL;
  return url ? { url, token: process.env.CONTACT_WEBHOOK_TOKEN } : null;
}

function resendTarget() {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  return apiKey && to && from ? { apiKey, to, from } : null;
}

export function isDeliveryConfigured(): boolean {
  return Boolean(webhookTarget() || resendTarget());
}

function plainText(inquiry: Inquiry): string {
  return [
    `Area of interest: ${inquiry.areaOfInterest}`,
    `Name: ${inquiry.fullName}`,
    `Email: ${inquiry.professionalEmail}`,
    `Organization: ${inquiry.organization ?? "-"}`,
    `Role: ${inquiry.professionalRole ?? "-"}`,
    `Country: ${inquiry.country ?? "-"}`,
    "",
    inquiry.message,
  ].join("\n");
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
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

async function sendResend(target: { apiKey: string; to: string; from: string }, inquiry: Inquiry) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${target.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: target.from,
      to: target.to.split(",").map((s) => s.trim()),
      reply_to: inquiry.professionalEmail,
      subject: `[Neorhiza] ${inquiry.areaOfInterest} — ${inquiry.fullName}`,
      text: plainText(inquiry),
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Email provider responded ${res.status}`);
}

export async function deliverInquiry(inquiry: Inquiry): Promise<DeliveryResult> {
  const jobs: Promise<void>[] = [];
  const webhook = webhookTarget();
  const resend = resendTarget();
  if (webhook) jobs.push(sendWebhook(webhook, inquiry));
  if (resend) jobs.push(sendResend(resend, inquiry));
  if (jobs.length === 0) return "unconfigured";

  const results = await Promise.allSettled(jobs);
  const anyDelivered = results.some((r) => r.status === "fulfilled");
  for (const r of results) {
    // Log the failure reason only — never the submission content.
    if (r.status === "rejected") console.error(`Inquiry delivery failed: ${String(r.reason)}`);
  }
  return anyDelivered ? "delivered" : "failed";
}

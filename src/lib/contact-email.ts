import type { ContactData } from "@/lib/validation";

/**
 * Email content for contact-form delivery: the internal notification sent
 * to the project inbox and the confirmation sent to the visitor. Every
 * visitor-supplied value is HTML-escaped before it reaches markup.
 */

export type Inquiry = Omit<ContactData, "consent" | "companyWebsite">;

export type EmailContent = { subject: string; html: string; text: string };

const SITE_NAME = "Project Neorhiza";
const DESCRIPTOR = "Patient-Specific Tissue Engineering Initiative";
const TAGLINE = "Engineering New Beginnings from Living Cells";

/* Brand tokens (light theme) — email clients need literal values. */
const C = {
  page: "#f6f6f3",
  surface: "#fbfbf9",
  border: "#dfe5e5",
  heading: "#0f4c5c",
  ink: "#1c353c",
  muted: "#5a6d74",
  coral: "#e36f5c",
};

const FONT = "'Manrope', -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Collapses line breaks and runs of whitespace so a value is safe in a header. */
function headerSafe(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function layout(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.surface};border:1px solid ${C.border};border-radius:16px;">
<tr><td style="padding:28px 32px 0;font-family:${FONT};">
<p style="margin:0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${C.muted};">${SITE_NAME}</p>
<div style="margin-top:12px;height:2px;width:40px;background:${C.coral};line-height:2px;font-size:0;">&nbsp;</div>
</td></tr>
<tr><td style="padding:20px 32px 32px;font-family:${FONT};color:${C.ink};font-size:15px;line-height:1.6;">
${body}
</td></tr>
<tr><td style="padding:20px 32px 28px;border-top:1px solid ${C.border};font-family:${FONT};font-size:12px;line-height:1.6;color:${C.muted};">
${SITE_NAME}<br>${DESCRIPTOR}<br>${TAGLINE}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

/** Internal notification to the project inbox. */
export function notificationEmail(inquiry: Inquiry, receivedAt = new Date()): EmailContent {
  const subject = `[Neorhiza Inquiry] ${headerSafe(inquiry.areaOfInterest)} — ${headerSafe(inquiry.fullName)}`;

  const fields: [string, string | undefined][] = [
    ["Full name", inquiry.fullName],
    ["Professional email", inquiry.professionalEmail],
    ["Organization", inquiry.organization],
    ["Role", inquiry.professionalRole],
    ["Country", inquiry.country],
    ["Area of interest", inquiry.areaOfInterest],
  ];

  const text = [
    "New inquiry from the Project Neorhiza website",
    "",
    ...fields.map(([label, value]) => `${label}: ${value || "—"}`),
    "",
    "Message:",
    inquiry.message,
    "",
    `Received: ${receivedAt.toISOString()}`,
    "Reply to this email to respond directly to the sender.",
  ].join("\n");

  const rows = fields
    .map(
      ([label, value]) => `<tr>
<td style="padding:8px 16px 8px 0;vertical-align:top;white-space:nowrap;font-size:13px;color:${C.muted};">${label}</td>
<td style="padding:8px 0;vertical-align:top;font-size:15px;color:${C.ink};word-break:break-word;">${value ? escapeHtml(value) : "—"}</td>
</tr>`
    )
    .join("\n");

  const html = layout(
    subject,
    `<h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;font-weight:600;color:${C.heading};">New website inquiry</h1>
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
${rows}
</table>
<h2 style="margin:24px 0 8px;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${C.muted};">Message</h2>
<div style="padding:16px;border-left:2px solid ${C.coral};background:${C.page};border-radius:8px;white-space:pre-wrap;word-break:break-word;">${escapeHtml(inquiry.message)}</div>
<p style="margin:20px 0 0;font-size:13px;color:${C.muted};">Received ${escapeHtml(receivedAt.toUTCString())}. Reply to this email to respond directly to the sender.</p>`
  );

  return { subject, html, text };
}

const CONFIRMATION_PARAGRAPHS = [
  "Thank you for contacting Project Neorhiza. Your inquiry has been received and will be reviewed against the project’s professional and institutional collaboration paths. We aim to respond to qualified inquiries within ten working days.",
  "Project Neorhiza is an early-stage research initiative and does not provide medical advice, treatment, diagnosis or patient enrollment.",
];

/**
 * Confirmation to the visitor. Deliberately contains no visitor-supplied
 * text, so the form cannot be used to send arbitrary content to a third
 * party's address.
 */
export function confirmationEmail(): EmailContent {
  const subject = "We received your inquiry — Project Neorhiza";
  const text = [...CONFIRMATION_PARAGRAPHS, [SITE_NAME, DESCRIPTOR, TAGLINE].join("\n")].join("\n\n");
  const html = layout(
    subject,
    `<h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;font-weight:600;color:${C.heading};">We received your inquiry</h1>
${CONFIRMATION_PARAGRAPHS.map((p) => `<p style="margin:0 0 14px;">${escapeHtml(p)}</p>`).join("\n")}`
  );
  return { subject, html, text };
}

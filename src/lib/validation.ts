import { z } from "zod";

import { contactLimits } from "@/lib/contact-limits";
import { inquiryTypes } from "@/lib/inquiry-types";

export { inquiryTypes, type InquiryType } from "@/lib/inquiry-types";

/**
 * Removes control characters and HTML-significant characters from free text.
 * The site never renders submitted HTML; this is defense-in-depth.
 */
export function sanitizeText(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[<>]/g, "")
    .trim();
}

const nameRule = z
  .string()
  .transform(sanitizeText)
  .pipe(
    z
      .string()
      .min(contactLimits.fullName.min, "Please enter your full name.")
      .max(contactLimits.fullName.max, "Name is too long.")
  );

const optionalText = (max: number, label: string) =>
  z
    .string()
    .transform(sanitizeText)
    .pipe(z.string().max(max, `${label} is too long.`))
    .optional()
    .or(z.literal("").transform(() => undefined));

export const contactSchema = z.object({
  fullName: nameRule,
  organization: optionalText(contactLimits.organization.max, "Organization"),
  professionalRole: optionalText(contactLimits.professionalRole.max, "Professional role"),
  country: optionalText(contactLimits.country.max, "Country"),
  professionalEmail: z
    .string()
    .transform(sanitizeText)
    .pipe(z.email("Please enter a valid professional email address."))
    .pipe(z.string().max(contactLimits.professionalEmail.max, "Email is too long.")),
  areaOfInterest: z.enum(inquiryTypes, {
    message: "Please select an area of interest.",
  }),
  message: z
    .string()
    .transform(sanitizeText)
    .pipe(
      z
        .string()
        .min(contactLimits.message.min, "Please provide a short message (at least 20 characters).")
        .max(contactLimits.message.max, "Message is too long (maximum 4000 characters).")
    ),
  consent: z.literal(true, {
    message: "Please confirm consent to be contacted about this inquiry.",
  }),
  /** Honeypot — must stay empty. Hidden from humans. */
  companyWebsite: z
    .string()
    .max(0, "Submission rejected.")
    .optional()
    .or(z.literal("").transform(() => "")),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

/** Flattens a ZodError into { field: firstMessage } for form display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

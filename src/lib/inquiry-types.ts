/**
 * Inquiry types offered on the contact form (section 18). Kept free of
 * runtime dependencies so the client form doesn't bundle Zod.
 */
export const inquiryTypes = [
  "Scientific collaboration",
  "Institutional collaboration",
  "Clinical advisory",
  "Engineering collaboration",
  "Ethics and regulation",
  "Media inquiry",
  "General inquiry",
] as const;

export type InquiryType = (typeof inquiryTypes)[number];

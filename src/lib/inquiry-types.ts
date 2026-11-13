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
  "Funding and foundation support",
  "Media inquiry",
  "General inquiry",
] as const;

export type InquiryType = (typeof inquiryTypes)[number];

/**
 * Short URL slugs that preselect an area of interest, e.g.
 * /contact?interest=institutional. Unknown slugs are ignored. There is no
 * funding slug: individual support goes straight to /funding#donate.
 */
export const inquirySlugs: Record<string, InquiryType> = {
  scientific: "Scientific collaboration",
  institutional: "Institutional collaboration",
  clinical: "Clinical advisory",
  engineering: "Engineering collaboration",
  ethics: "Ethics and regulation",
  media: "Media inquiry",
  general: "General inquiry",
};

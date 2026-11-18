/**
 * Inquiry types offered on the contact form (section 18). Kept free of
 * runtime dependencies so the client form doesn't bundle Zod.
 */
export const inquiryTypes = [
  "Scientific collaboration",
  "Researcher application",
  "Institutional collaboration",
  "University collaboration",
  "Clinical advisory",
  "Engineering collaboration",
  "Ethics and regulation",
  "Research sponsorship",
  "Funding and foundation support",
  "Media inquiry",
  "General inquiry",
] as const;

export type InquiryType = (typeof inquiryTypes)[number];

/**
 * Short URL slugs that preselect an area of interest, e.g.
 * /contact?interest=institutional. Unknown slugs are ignored. Individual
 * contributions go straight to /funding#donate; "sponsorship" is for
 * organizations and professionals discussing research sponsorship.
 */
export const inquirySlugs: Record<string, InquiryType> = {
  scientific: "Scientific collaboration",
  researcher: "Researcher application",
  institutional: "Institutional collaboration",
  university: "University collaboration",
  sponsorship: "Research sponsorship",
  clinical: "Clinical advisory",
  engineering: "Engineering collaboration",
  ethics: "Ethics and regulation",
  media: "Media inquiry",
  general: "General inquiry",
};

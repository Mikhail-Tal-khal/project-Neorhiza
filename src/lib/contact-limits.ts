/**
 * Field length limits for the contact form, shared by the Zod schema
 * (server) and the client form so both validate against the same rules.
 * Kept free of runtime dependencies so the client form doesn't bundle Zod.
 */
export const contactLimits = {
  fullName: { min: 2, max: 120 },
  organization: { max: 160 },
  professionalRole: { max: 120 },
  country: { max: 80 },
  professionalEmail: { max: 200 },
  message: { min: 20, max: 4000 },
} as const;

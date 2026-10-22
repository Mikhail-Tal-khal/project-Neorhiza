/**
 * Central site configuration — Project Neorhiza.
 * All disclaimers below are required verbatim (brand spec, sections 4–19).
 */

export const site = {
  name: "Project Neorhiza",
  shortName: "Neorhiza",
  descriptor: "Patient-Specific Tissue Engineering Initiative",
  tagline: "Engineering New Beginnings from Living Cells",
  /** Set NEXT_PUBLIC_SITE_URL in the environment for canonical URLs. */
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://neorhiza.org",
  /** Optional public contact address (only published when configured). */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || undefined,
} as const;

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/why-neorhiza", label: "Why Neorhiza" },
  { href: "/our-science", label: "Our Science" },
  { href: "/roadmap", label: "Research Roadmap" },
  { href: "/human-impact", label: "Human Impact" },
  { href: "/collaboration", label: "Collaboration" },
  { href: "/updates", label: "Updates" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerLinks = [
  ...navItems.filter((n) => n.href !== "/").map((n) => n.href),
  "/privacy",
  "/terms",
  "/research-disclaimer",
] as const;

/**
 * Verbatim disclaimers — do not reword.
 */
export const disclaimers = {
  /** Hero / global treatment disclaimer (11.1) */
  services:
    "Project Neorhiza does not currently provide medical treatments, stem-cell therapies, diagnostic services or organ transplantation.",

  /** Scientific journey confidentiality note (11.4) */
  journeyConfidentiality:
    "This overview describes the general scientific pathway only. Project-specific methods, engineering parameters and experimental procedures remain confidential and subject to institutional scientific review.",

  /** Confidential methodology statement (section 4) */
  confidentialProcess:
    "Project Neorhiza is developing a controlled and scientifically reviewed process. Detailed methodologies remain confidential and will be shared only with qualified institutional collaborators under appropriate agreements.",

  /** Human impact qualification (11.6) */
  impact:
    "Project Neorhiza cannot promise that its research will directly produce treatments for these conditions. These communities represent the human need motivating the long-term research mission.",

  /** Footer disclaimer (19) */
  footer:
    "Project Neorhiza is an early-stage research initiative. It does not currently provide medical advice, diagnostic services, stem-cell treatment, organ transplantation or clinical care. Information on this website is provided for education, scientific communication and research-development purposes. Future experimental or clinical activities will require qualified institutional supervision and all applicable ethical, scientific and regulatory approvals.",

  /** Contact page — people seeking treatment (18) */
  treatment:
    "Project Neorhiza does not offer medical treatment or patient enrollment. Please contact a licensed healthcare professional for medical assistance.",
} as const;

/**
 * Central site configuration — Project Neorhiza.
 * All disclaimers below are required verbatim (brand spec, sections 4–19).
 */

export const site = {
  name: "Project Neorhiza",
  shortName: "Neorhiza",
  descriptor: "Patient-Specific Tissue Engineering Initiative",
  tagline: "Engineering New Beginnings from Living Cells",
  /** Canonical origin; NEXT_PUBLIC_SITE_URL overrides the production default. */
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.neorhiza.space",
  /**
   * The project's public, monitored inquiry mailbox. Personal addresses are
   * never published on the site or in structured data.
   */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "inquiries@neorhiza.space",
} as const;

/**
 * The operating company. Confirmed by the Founder (2026-11-17): legal name,
 * jurisdiction and business telephone only. Registration number, date,
 * registered office and officers are NOT confirmed — they are shown as
 * "pending" on the Governance page and must never be guessed.
 */
export const company = {
  /** Legal name as registered. */
  legalName: "LYSHUB LIMITED",
  /** Name as used in running text. */
  name: "Lyshub Limited",
  jurisdiction: "Kenya",
  /** Official business contact, display form. */
  phone: "+254 768 871 004",
  /** Official business contact, E.164 for tel: links and structured data. */
  phoneE164: "+254768871004",
  /** One-line operator statement used in the footer and legal pages. */
  operatorStatement:
    "Project Neorhiza is an initiative operated by Lyshub Limited, a company registered in Kenya.",
} as const;

/** Approved introduction of the initiative (corporate identity brief, section 1). */
export const introduction = [
  "Project Neorhiza is an early-stage patient-specific tissue-engineering research initiative operated by Lyshub Limited, a company registered in Kenya.",
  "The initiative is focused on establishing the scientific, organizational and institutional foundation necessary to advance patient-specific tissue engineering research.",
  "Its immediate priorities include recruiting qualified scientific professionals, developing institutional partnerships, establishing research governance and preparing a supervised feasibility programme.",
] as const;

type NavItem = { href: string; label: string };

/** Pages about the organization; grouped under "About" in the desktop menu. */
export const aboutNav: readonly NavItem[] = [
  { href: "/why-neorhiza", label: "About Neorhiza" },
  { href: "/leadership", label: "Leadership" },
  { href: "/scientific-network", label: "Scientific Network" },
  { href: "/governance", label: "Governance & Transparency" },
];

/**
 * Every primary destination, in menu order (mobile menu and footer).
 * The desktop bar shows the same set with the About group collapsed.
 */
export const navItems: readonly NavItem[] = [
  { href: "/", label: "Home" },
  aboutNav[0],
  { href: "/our-science", label: "Our Science" },
  { href: "/roadmap", label: "Research Roadmap" },
  aboutNav[1],
  aboutNav[2],
  { href: "/collaboration", label: "Collaboration" },
  { href: "/funding", label: "Funding" },
  aboutNav[3],
  { href: "/updates", label: "Updates" },
  { href: "/contact", label: "Contact" },
];

/** Top-level desktop links (the About group is inserted after Home). */
export const desktopNav: readonly NavItem[] = navItems.filter(
  (item) => !aboutNav.includes(item)
);

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

  /** Online contributions — nature of a contribution (required wording) */
  contributions:
    "Contributions support Project Neorhiza’s early-stage research and development activities. They are not investments, do not provide equity or ownership, and should not be assumed to be tax-deductible unless independently confirmed under the donor’s applicable laws.",

  /** Online contributions — how payment is handled */
  stripeProcessing:
    "Payments are processed securely by Stripe. Card details are entered on Stripe’s checkout page and are never received or stored by Project Neorhiza.",

  /**
   * Funding — legal and financial disclosure (corporate identity brief,
   * section 4). LEGAL REVIEW: wording supplied by the Founder; a Kenyan
   * advocate and accountant must approve the final classification, tax
   * wording and payment terms.
   */
  contributionTerms: [
    "Project Neorhiza operates under Lyshub Limited, Kenya. Contributions made through the Neorhiza research-support programme are received by the operating company and are intended to support the stated research-development activities.",
    "Contributions are not represented as tax-deductible charitable donations unless the relevant legal and tax requirements have been independently confirmed.",
    "Research support does not automatically confer shares, company ownership, repayment rights or financial returns. Any separate investment or commercial agreement must be documented independently.",
  ],

  /** Contact page — people seeking treatment (18) */
  treatment:
    "Project Neorhiza does not offer medical treatment or patient enrollment. Please contact a licensed healthcare professional for medical assistance.",
} as const;

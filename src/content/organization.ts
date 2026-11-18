/**
 * Organization, governance and funding content (corporate identity brief,
 * 2026-11-17). Every status below is a present fact. Change a line only
 * when an actual development supports it — never to anticipate one.
 */
import { company } from "@/lib/site";

/** Public transparency status (brief, section 9). */
export const projectStatus = [
  { label: "Organizational status", value: `Operating under ${company.name}` },
  { label: "Project status", value: "Foundation Phase" },
  { label: "Laboratory research", value: "Not yet commenced" },
  { label: "Scientific recruitment", value: "Under development" },
  { label: "Institutional partnerships", value: "Being pursued" },
  { label: "First proposed research programme", value: "Liver-tissue feasibility" },
  { label: "Clinical services", value: "Not offered" },
  { label: "Medical treatments", value: "Not offered" },
] as const;

/**
 * Company particulars. Only the name and jurisdiction are confirmed; the
 * rest stay "pending" until the Founder supplies verified details.
 */
export const companyParticulars = [
  { label: "Legal name", value: company.legalName, confirmed: true },
  { label: "Jurisdiction", value: company.jurisdiction, confirmed: true },
  { label: "Official business contact", value: company.phone, confirmed: true },
  { label: "Registration number", value: "Pending publication", confirmed: false },
  { label: "Registered office", value: "Pending publication", confirmed: false },
] as const;

/** The Founder's responsibilities (brief, section 2). */
export const founderResponsibilities = [
  "Overall strategic oversight",
  "Project development and coordination",
  "Institutional partnership development",
  "Scientific recruitment coordination",
  "Research programme development",
  "Fundraising strategy and accountability",
  "Organizational development",
] as const;

/**
 * The four kinds of relationship the Scientific Network page keeps apart.
 * Nobody is listed until they are formally appointed or confirmed and have
 * given explicit permission to be named.
 */
export const networkCategories = [
  {
    title: "Formally appointed advisers",
    status: "None at present",
    text: "Advisers formally appointed under written terms. When an appointment is made, the adviser's name, role and relevant expertise will be published here with their explicit permission.",
  },
  {
    title: "Confirmed institutional partners",
    status: "None at present",
    text: "Universities, research institutes or hospitals that have agreed a partnership in writing. No institutional partnership has been confirmed.",
  },
  {
    title: "Prospective advisers",
    status: "Being identified",
    text: "Professionals the project is in early contact with. Prospective advisers are not named, and are not presented as advisers, unless they are formally appointed and agree to be identified.",
  },
  {
    title: "Recruitment opportunities",
    status: "Open",
    text: "Disciplines the project is seeking to engage. Qualified professionals are invited to make contact.",
  },
] as const;

/** Disciplines Neorhiza intends to recruit (brief, section 3). */
export const recruitmentDisciplines = [
  "Stem-cell biology researchers",
  "PhD-level tissue-engineering specialists",
  "Regenerative medicine scientists",
  "Biomedical engineers",
  "Mechanical engineers",
  "Hepatology and liver biology specialists",
  "Vascular biology specialists",
  "Bioreactor engineers",
  "Bioethics and regulatory professionals",
] as const;

/** Funding priorities (brief, section 4). No allocations or targets. */
export const fundingPriorities = [
  {
    title: "Research programme establishment",
    text: "Defining the scope, governance and supervision of the first proposed research programme.",
  },
  {
    title: "Recruitment and engagement of qualified scientists",
    text: "Engaging researchers with the expertise the programme requires.",
  },
  {
    title: "Scientific consultation and independent review",
    text: "Commissioning qualified scrutiny of the project's direction, assumptions and proposed methods.",
  },
  {
    title: "Institutional and university partnerships",
    text: "Building relationships with institutions able to host and supervise research.",
  },
  {
    title: "Laboratory access and research facilities",
    text: "Securing access to appropriate facilities through institutional arrangements.",
  },
  {
    title: "Research equipment and bioreactor development",
    text: "Equipment needed for supervised perfusion and bioreactor research.",
  },
  {
    title: "Cell-culture materials and biomaterials",
    text: "Consumables and materials for future approved research.",
  },
  {
    title: "Feasibility studies and scientific testing",
    text: "Supervised feasibility work, once institutional and ethics approvals are in place.",
  },
  {
    title: "Ethics, biosafety and regulatory preparation",
    text: "Preparing for the ethics, biosafety and regulatory approvals research will require.",
  },
  {
    title: "Research administration, financial reporting and operational costs",
    text: "The administration, accounting and reporting that accountable research depends on.",
  },
] as const;

/** What periodic financial and progress reports will cover (brief, section 5). */
export const reportingItems = [
  "Funds received",
  "Payment processing fees",
  "Actual expenditures",
  "Research-development milestones",
  "Recruitment progress",
  "Institutional partnerships",
  "Remaining funds",
  "Changes in the research roadmap",
] as const;

/** Oversight and approvals: what exists now and what is still required. */
export const governanceStructure = [
  {
    title: "Operating company",
    text: `${company.name}, a company registered in ${company.jurisdiction}, is the operating company. Contributions made through this website are received by the company.`,
  },
  {
    title: "Research initiative",
    text: "Project Neorhiza is the research initiative the company operates.",
  },
  {
    title: "Project oversight",
    text: "The Founder currently provides overall project oversight. Neorhiza is founder-led while it builds its scientific and institutional network.",
  },
  {
    title: "Scientific advice and partnerships",
    text: "Scientific advisers and institutional partners are being recruited. None has yet been appointed or confirmed.",
  },
  {
    title: "Scientific supervision",
    text: "Research activities will require qualified scientific supervision. No research will be conducted without it.",
  },
  {
    title: "Institutional, ethics and biosafety approval",
    text: "Laboratory activities will require appropriate institutional, ethics and biosafety approvals. No such approval has been obtained, and no laboratory work has begun.",
  },
] as const;

/** Oversight that does not exist yet — stated plainly, not implied. */
export const notYetEstablished = [
  "Independent financial audit or external financial oversight",
  "An independent scientific advisory board",
  "Institutional ethics or biosafety approval for any research",
  "Charitable, public-benefit or tax-exempt status",
] as const;

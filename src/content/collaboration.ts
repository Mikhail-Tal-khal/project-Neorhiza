export type CollaborationPath = {
  slug: string;
  title: string;
  /** Why the role matters. */
  why: string;
  /** What Neorhiza is seeking. */
  seeking: string[];
  /** What information is publicly available. */
  publicInfo: string;
  /** What requires a confidential discussion. */
  confidential: string;
  /** How to submit an inquiry. */
  inquiry: string;
};

/**
 * The eight collaboration paths on the Collaboration page. Confidential
 * documents are never distributed automatically — all engagement follows a
 * professional inquiry and qualification process.
 */
export const collaborationPaths: CollaborationPath[] = [
  {
    slug: "scientific-collaborators",
    title: "Scientific collaborators",
    why: "Biology is the intellectual engine of the pathway. Scientific collaborators keep the program honest about what evidence supports, what is speculative, and what to measure first.",
    seeking: [
      "Researchers in the biological sciences",
      "Critical reviewers willing to challenge assumptions early",
      "Advisers who value disciplined, small-scale foundational work",
    ],
    publicInfo:
      "The public research overview, the high-level scientific pathway and all published educational materials.",
    confidential:
      "Detailed methods are shared only with qualified partners under agreement.",
    inquiry:
      "Submit an inquiry through the contact form selecting \"Scientific collaboration\", including your research area and institutional context.",
  },
  {
    slug: "institutional-partners",
    title: "Institutional partners",
    why: "No early-stage initiative can or should conduct laboratory research alone. Universities and research institutes provide supervision, ethics oversight, facilities and scientific credibility.",
    seeking: [
      "Universities and research institutes interested in early-stage regenerative programs",
      "Research hospitals exploring tissue-engineering collaborations",
      "Technology-transfer offices experienced with early-stage science",
    ],
    publicInfo:
      "The project's vision, roadmap, governance status and collaboration framework.",
    confidential:
      "Detailed methods are shared only with qualified partners under agreement.",
    inquiry:
      "Submit an inquiry selecting \"Institutional collaboration\"; initial discussions take place under appropriate confidentiality arrangements.",
  },
  {
    slug: "clinical-advisers",
    title: "Clinical advisers",
    why: "Clinicians ground the research in real patient needs and keep the program realistic about what medicine can and cannot use. Their perspective shapes which questions are worth asking.",
    seeking: [
      "Clinicians with an interest in regenerative medicine",
      "Advisers willing to review the proposed program",
      "Educators who can communicate responsibly about early-stage science",
    ],
    publicInfo:
      "The human-need framing, the high-level pathway and the proposed program's research question.",
    confidential:
      "Detailed methods are shared only with qualified partners under agreement.",
    inquiry:
      "Submit an inquiry selecting \"Clinical advisory\" with your specialty and clinical context.",
  },
  {
    slug: "engineering-collaborators",
    title: "Engineering collaborators",
    why: "Tissue engineering lives at the intersection of biology and engineering. Engineers turn biological questions into measurable research systems.",
    seeking: [
      "Engineers with biomedical research experience",
      "Engineers who value documentation, reproducibility and quality thinking",
    ],
    publicInfo:
      "The high-level engineering vision and the research question of the proposed program.",
    confidential:
      "Detailed methods are shared only with qualified partners under agreement.",
    inquiry:
      "Submit an inquiry selecting \"Engineering collaboration\" describing your domain and prior systems work.",
  },
  {
    slug: "ethics-advisers",
    title: "Ethics advisers",
    why: "Responsible innovation requires ethics embedded from the first day, not appended at the end. Ethics advisers help the project anticipate questions before they become problems.",
    seeking: [
      "Ethics professionals with emerging-technology or regenerative-medicine experience",
      "Advisers on responsible research conduct and public communication",
      "Thinkers who will disagree with us when it matters",
    ],
    publicInfo:
      "The project's stated values, governance commitments and public disclaimers.",
    confidential:
      "Detailed methods are shared only with qualified partners under agreement.",
    inquiry:
      "Submit an inquiry selecting \"Ethics and regulation\" with your background and areas of interest.",
  },
  {
    slug: "regulatory-advisers",
    title: "Regulatory advisers",
    why: "The long-term pathway runs through regulated territory. Early regulatory literacy prevents years of avoidable rework and keeps expectations honest.",
    seeking: [
      "Regulatory professionals familiar with advanced-therapy frameworks",
      "Quality-systems specialists",
      "Advisers able to explain pathway requirements without overpromising timelines",
    ],
    publicInfo:
      "The project's staged roadmap and its commitment to authorized clinical research only.",
    confidential:
      "Detailed methods are shared only with qualified partners under agreement.",
    inquiry:
      "Submit an inquiry selecting \"Ethics and regulation\" noting your regulatory domain.",
  },
  {
    slug: "ip-advisers",
    title: "Intellectual-property advisers",
    why: "The project deliberately protects potentially protectable work and avoids public disclosure that could compromise future options. IP advisers help keep that discipline rigorous.",
    seeking: [
      "IP professionals experienced with early-stage biomedical research",
      "Advisers on confidentiality structures and collaboration agreements",
    ],
    publicInfo:
      "The project's public materials only — deliberately free of proprietary technical content.",
    confidential:
      "Detailed methods are shared only with qualified partners under agreement.",
    inquiry:
      "Submit an inquiry selecting \"Institutional collaboration\" and mention your IP practice area.",
  },
  {
    slug: "technology-organizations",
    title: "Technology and research-supply organizations",
    why: "Research at this intersection depends on research equipment and consumables. Responsible organizations strengthen research capacity without steering the science.",
    seeking: [
      "Suppliers of research equipment and consumables",
      "Organizations interested in research partnerships with clear ethical boundaries",
    ],
    publicInfo:
      "The project's vision, public roadmap and collaboration framework.",
    confidential:
      "Detailed methods are shared only with qualified partners under agreement.",
    inquiry:
      "Submit an inquiry selecting \"Institutional collaboration\" describing your organization's role.",
  },
];

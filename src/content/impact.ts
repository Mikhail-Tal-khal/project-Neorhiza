export type ImpactGroup = {
  slug: string;
  title: string;
  text: string;
};

/**
 * The nine human communities represented on the Human Impact page and the
 * home-page impact preview. Language is dignified, accurate and carefully
 * qualified — no emotional manipulation, no promised outcomes.
 */
export const impactGroups: ImpactGroup[] = [
  {
    slug: "liver-failure",
    title: "People living with liver failure",
    text: "Chronic liver disease can progress for years while transplant waitlists remain long. Research into liver-tissue models may one day deepen the science this community's future options depend on.",
  },
  {
    slug: "kidney-disease",
    title: "People affected by kidney disease",
    text: "Dialysis sustains life at a significant cost of time and wellbeing. Kidney tissue research is a long-term scientific path toward understanding function that dialysis can only replace partially.",
  },
  {
    slug: "heart-damage",
    title: "Patients with severe heart damage",
    text: "After major cardiac injury, surviving muscle cannot regenerate meaningfully. Heart-tissue research seeks the knowledge that could eventually change that outlook.",
  },
  {
    slug: "diabetes",
    title: "People living with diabetes",
    text: "Managing blood sugar is a lifelong daily discipline. Research on insulin-producing cell populations may one day inform new scientific approaches to metabolic support.",
  },
  {
    slug: "burns",
    title: "Patients with serious burns",
    text: "Extensive burns overwhelm the body's ability to repair its largest organ. Skin and tissue research aims at deeper understanding of regeneration and repair at scale.",
  },
  {
    slug: "tissue-injuries",
    title: "People with major tissue injuries",
    text: "Trauma, surgery and disease can remove tissue the body cannot rebuild. Engineering research explores how organized tissue might eventually be studied, and one day restored.",
  },
  {
    slug: "children",
    title: "Children born with tissue or organ abnormalities",
    text: "Congenital conditions often require repeated interventions across a childhood. Research aimed at growing tissue from a patient's own cells is, ultimately, research aimed at gentler futures for children.",
  },
  {
    slug: "communities",
    title: "Communities with limited access to donor transplantation",
    text: "Where you live strongly shapes whether you receive advanced care. Scientific capacity that is not tied to donor availability could, one day, make advanced options more geographically just.",
  },
  {
    slug: "future-scientists",
    title: "Future scientists and engineers in underrepresented regions",
    text: "Scientific talent is everywhere; opportunity is not. Building open, educational research capacity is part of the mission, so that regenerative medicine is developed by many communities, not a few.",
  },
];

import type { RoadmapPhase } from "@/components/ui/roadmap-timeline";
import type { RoadmapStage } from "@/components/ui/expandable-roadmap";

/**
 * Roadmap preview phases shown on the home page (verbatim descriptions
 * from the brand specification). Foundation Phase is the current position.
 */
export const roadmapPreview: RoadmapPhase[] = [
  {
    name: "Foundation Phase",
    description:
      "Project identity, evidence review, scientific advisers and institutional relationships.",
    current: true,
  },
  {
    name: "Feasibility Phase",
    description:
      "A small, supervised tissue-engineering demonstrator with defined measurements.",
  },
  {
    name: "Integration Phase",
    description:
      "Multicellular organization, controlled perfusion and reproducibility studies.",
  },
  {
    name: "Preclinical Development",
    description:
      "Product-specific safety, manufacturing and performance evidence.",
  },
  {
    name: "Clinical Translation",
    description:
      "Only through authorized institutions, ethics bodies, regulators and properly designed clinical studies.",
  },
  {
    name: "Long-Term Objective",
    description:
      "Patient-specific functional tissues and, ultimately, replacement-organ technologies.",
  },
];

/**
 * The nine-stage research roadmap rendered on the Research Roadmap page.
 * Every stage states its purpose, expected output, advancement requirement,
 * principal risks and current status. High-level only — no laboratory
 * instructions, parameters or protocols.
 */
export const roadmapStages: RoadmapStage[] = [
  {
    number: 1,
    name: "Scientific Foundation",
    purpose:
      "Establish a rigorous, honest understanding of the field: what is established evidence, what remains experimental, and where the meaningful open questions are.",
    expectedOutput:
      "A documented evidence base, a defined set of scientific questions and a public research overview suitable for institutional discussion.",
    advancementRequirement:
      "Evidence review completed and validated by qualified external scientific readers.",
    principalRisks:
      "Misreading early evidence, overpromising, or anchoring the program to questions that are not yet answerable responsibly.",
    currentStatus:
      "In progress — this is the current position of Project Neorhiza.",
  },
  {
    number: 2,
    name: "Institutional Affiliation",
    purpose:
      "Place future laboratory work under qualified institutional supervision, with ethics oversight and appropriate agreements in place.",
    expectedOutput:
      "One or more formal affiliations with universities, research hospitals or accredited research institutions.",
    advancementRequirement:
      "An executed institutional agreement with scientific and ethical governance structures.",
    principalRisks:
      "Proceeding without supervision, or affiliations that do not provide genuine scientific scrutiny.",
    currentStatus: "Not started — depends on Stage 1 outcomes.",
  },
  {
    number: 3,
    name: "Training and Process Development",
    purpose:
      "Develop the supervised skills, documentation habits and quality mindset required before any research activity, under institutional training programs.",
    expectedOutput:
      "Trained personnel records, standard documentation practices and approved process frameworks.",
    advancementRequirement:
      "Institution-supervised training completed and signed off by responsible investigators.",
    principalRisks:
      "Skill gaps leading to unreliable work, or undocumented processes that cannot be reviewed or reproduced.",
    currentStatus: "Not started.",
  },
  {
    number: 4,
    name: "Small Tissue Demonstrator",
    purpose:
      "Conduct a small, supervised tissue-engineering demonstrator with a limited, clearly defined set of measurements.",
    expectedOutput:
      "A feasibility report describing what was measured, what worked, what did not, and why.",
    advancementRequirement:
      "Demonstrator reviewed by the supervising institution against pre-defined measurement criteria.",
    principalRisks:
      "Technical failure, ambiguous measurements, or pressure to interpret weak signals as success.",
    currentStatus: "Not started.",
  },
  {
    number: 5,
    name: "Reproducibility and Quality Studies",
    purpose:
      "Establish that observed results can be repeated consistently and documented to a reviewable quality standard.",
    expectedOutput:
      "Reproducibility records, quality documentation and an honest account of variability and limitations.",
    advancementRequirement:
      "Independent replication or institutional confirmation of reproducibility.",
    principalRisks:
      "Irreproducible results, silent negative findings, or quality systems that exist only on paper.",
    currentStatus: "Not started.",
  },
  {
    number: 6,
    name: "Scale and Integration Research",
    purpose:
      "Study how multicellular organization and transport support behave as constructs become larger and more integrated — strictly as research, not manufacturing.",
    expectedOutput:
      "Comparative research data on organization, transport behavior and consistency across study scales.",
    advancementRequirement:
      "Peer-reviewed or institutionally reviewed evidence that scaling questions are being answered reliably.",
    principalRisks:
      "Assuming small-scale observations translate to larger systems without evidence.",
    currentStatus: "Not started.",
  },
  {
    number: 7,
    name: "Preclinical Product Development",
    purpose:
      "Assemble product-specific safety, manufacturing-consistency and performance evidence under recognized quality frameworks, where justified by earlier stages.",
    expectedOutput:
      "A preclinical evidence dossier suitable for regulatory dialogue by qualified institutions.",
    advancementRequirement:
      "Institutional and regulatory readiness assessments completed successfully.",
    principalRisks:
      "Safety findings, inconsistent manufacture, or attempting this stage without the prerequisites it requires.",
    currentStatus: "Not started.",
  },
  {
    number: 8,
    name: "Authorized Clinical Research",
    purpose:
      "Enable carefully designed clinical studies — only through authorized institutions, ethics bodies and regulators, and only if all prior stages justify it.",
    expectedOutput:
      "Ethics-approved, regulator-authorized clinical study protocols conducted by qualified clinical teams.",
    advancementRequirement:
      "Formal approvals from ethics committees and competent regulatory authorities.",
    principalRisks:
      "Any attempt to bypass oversight; participant risk; premature translation of immature science.",
    currentStatus: "Not started — requires Stages 1–7 to be complete and approved.",
  },
  {
    number: 9,
    name: "Long-Term Patient Monitoring",
    purpose:
      "If authorized clinical research ever takes place, support long-term, transparent monitoring of outcomes and honest reporting of both benefits and harms.",
    expectedOutput:
      "Long-term follow-up records and public reporting of outcomes at a level of detail appropriate to the study.",
    advancementRequirement:
      "Sustained institutional follow-up capacity and transparent reporting commitments.",
    principalRisks:
      "Loss to follow-up, selective reporting, or abandoning accountability after early success.",
    currentStatus: "Not started.",
  },
];

import type { JourneyStage } from "@/components/ui/scientific-journey";

/**
 * The seven-stage scientific pathway shown on the home page (verbatim
 * stage copy from the brand specification). High-level only — no methods,
 * parameters or procedures.
 */
export const journeyStages: JourneyStage[] = [
  {
    number: 1,
    title: "Patient Cell Source",
    text: "A small, ethically obtained living-cell sample may provide the biological starting material.",
  },
  {
    number: 2,
    title: "Cellular Reprogramming",
    text: "Specialized adult cells may be returned to a pluripotent state under controlled laboratory conditions.",
  },
  {
    number: 3,
    title: "Directed Cell Development",
    text: "Stem cells may be guided toward specialized cell populations required by a selected tissue.",
  },
  {
    number: 4,
    title: "Tissue Organization",
    text: "Cells require a suitable three-dimensional environment in which to attach, communicate and organize.",
  },
  {
    number: 5,
    title: "Transport and Vascular Support",
    text: "Developing tissue requires effective delivery of oxygen and nutrients and removal of waste.",
  },
  {
    number: 6,
    title: "Controlled Maturation",
    text: "Engineered tissue may be maintained in systems that provide appropriate flow and environmental signals.",
  },
  {
    number: 7,
    title: "Functional and Safety Evaluation",
    text: "Tissue must be tested for identity, organization, performance, consistency and safety before future translation can be considered.",
  },
];

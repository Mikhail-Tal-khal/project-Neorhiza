export type ScienceTopic = {
  slug: string;
  question: string;
  title: string;
  /** Established evidence — what scientific research has demonstrated. */
  established: string;
  /** What remains experimental. */
  experimental: string;
  /** What Neorhiza proposes to explore. */
  explores: string;
  /** What Neorhiza is not yet claiming. */
  notClaiming: string;
};

/**
 * The thirteen topics of the Our Science page. Every topic separates
 * established evidence from open questions and explicit non-claims, using
 * the four-row EvidenceCard format. Content is educational and high-level;
 * no confidential methods, protocols or parameters appear anywhere.
 */
export const scienceTopics: ScienceTopic[] = [
  {
    slug: "dna-alone",
    question: "Why DNA alone cannot be grown into an organ",
    title: "Instructions are not builders",
    established:
      "Genome sequencing has shown that DNA carries the instructions cells use to build proteins and respond to signals. Developmental biology has equally shown that an organ emerges from cells that read, interpret and act on those instructions inside a structured, three-dimensional, signal-rich environment.",
    experimental:
      "No method exists to turn a genome, by itself, into organized living tissue. Assembling functional organ-level structure from component parts remains an open research frontier across the entire field.",
    explores:
      "Project Neorhiza treats living cells — not abstract genetic information — as the working material of tissue engineering, and studies how cellular communities organize themselves under controlled conditions.",
    notClaiming:
      "Neorhiza does not claim to grow organs from DNA, to possess a method for doing so, or to be close to one.",
  },
  {
    slug: "living-cells",
    question: "Why living cells are the biological starting material",
    title: "Function lives in cells, not documents",
    established:
      "Decades of cell biology demonstrate that tissue function — metabolism, transport, signaling, repair — is performed by living cells. Transplantation medicine and in-vitro tissue models both depend on viable, functioning cells as their biological foundation.",
    experimental:
      "Reliably obtaining, characterizing and maintaining clinically appropriate cell sources remains an active area of research, with open questions around consistency, identity and long-term behavior.",
    explores:
      "Neorhiza's pathway begins with a small, ethically obtained living-cell sample, handled under institutional supervision, as the biological starting point for research constructs.",
    notClaiming:
      "Neorhiza does not claim to have established clinical-grade cell sources or to manufacture cell products for any human use.",
  },
  {
    slug: "ipsc",
    question: "What induced pluripotent stem cells are",
    title: "A reset state, discovered and refined by science",
    established:
      "Induced pluripotent stem cells (iPSCs) are adult cells returned to a pluripotent-like state — a discovery recognized by the 2012 Nobel Prize. iPSCs can give rise to many specialized cell types and are now used worldwide in disease modeling and drug research.",
    experimental:
      "Producing iPSC-derived populations that are consistently mature, stable and safe remains an active research challenge. Efficiency, consistency and quality vary across cell types and laboratories.",
    explores:
      "Neorhiza's pathway includes cellular reprogramming as a conceptual stage, to be studied — if research proceeds — only under institutional supervision and applicable regulations.",
    notClaiming:
      "Neorhiza does not claim to produce iPSC lines, to operate a stem-cell bank, or to provide any iPSC-based product or therapy.",
  },
  {
    slug: "differentiation",
    question: "What directed differentiation means",
    title: "Guiding cells toward specialized roles",
    established:
      "Research has demonstrated that pluripotent cells can be guided, in stages, toward specialized identities — for example, neural, cardiac or hepatic-like populations — by mimicking aspects of natural developmental signaling.",
    experimental:
      "Achieving the precise maturity, purity and stability that functional tissue would require remains difficult. Differentiation outcomes vary, and long-term behavior requires careful study.",
    explores:
      "Neorhiza describes directed cell development as a research stage: generating specialized cell populations required by a selected tissue, with identity and behavior verified before any further step.",
    notClaiming:
      "Neorhiza does not publish differentiation methods, claim clinical-grade cell production, or promise any specific differentiation outcome.",
  },
  {
    slug: "multiple-cells",
    question: "Why organs require multiple cell populations",
    title: "Organs are societies, not single cell types",
    established:
      "Histology shows that organs are built from multiple cooperating populations — working cells, support cells, vessel-associated cells and others — whose interactions produce organ-level function. Single cell types alone do not recreate that architecture.",
    experimental:
      "Coordinating several cell populations so that they assemble, communicate and mature together remains a central unsolved problem in tissue engineering.",
    explores:
      "Neorhiza's proposed research direction explicitly includes multicellular organization: studying how defined populations behave together within supportive three-dimensional environments.",
    notClaiming:
      "Neorhiza does not claim to have produced multicellular tissue with organ-level function, or to hold validated multicellular assembly methods.",
  },
  {
    slug: "3d-organization",
    question: "Why three-dimensional organization matters",
    title: "Architecture is part of the function",
    established:
      "Organ function depends on three-dimensional architecture: where cells sit, how they contact one another, and how transport networks thread through the structure. Flat, two-dimensional cultures cannot reproduce this geometry.",
    experimental:
      "Building and maintaining accurate three-dimensional organization at meaningful sizes remains an open engineering and biological challenge.",
    explores:
      "Neorhiza treats three-dimensional environments as a core research interest — how cells attach, communicate and organize within structures designed for study.",
    notClaiming:
      "Neorhiza does not claim to have solved three-dimensional tissue assembly at organ scale.",
  },
  {
    slug: "vascularization",
    question: "Why vascularization remains difficult",
    title: "Every cell needs a delivery line",
    established:
      "In natural tissue, vessels deliver oxygen and nutrients and remove waste within tens to hundreds of micrometers of nearly every cell. Research has repeatedly shown that engineered tissue thicker than this limit fails without transport support.",
    experimental:
      "Creating stable, connected, appropriately patterned vessel-like networks inside engineered tissue is widely regarded as one of the field's greatest unsolved challenges.",
    explores:
      "Neorhiza's pathway names transport and vascular support as an explicit research stage, and controlled perfusion as a proposed subject of study in its first program.",
    notClaiming:
      "Neorhiza does not claim to have solved vascularization or to possess validated vascularization technology.",
  },
  {
    slug: "bioreactor",
    question: "What a bioreactor does",
    title: "A controlled environment for growing tissue",
    established:
      "Bioreactors are laboratory systems that maintain controlled environmental conditions — such as movement of fluids, gas exchange and physical signals — for biological cultures. They are established tools of cell culture and tissue research.",
    experimental:
      "Determining the conditions that help engineered tissue mature reliably is an active research question, and results depend strongly on tissue type and design choices.",
    explores:
      "Neorhiza's pathway includes controlled maturation in systems that provide appropriate flow and environmental signals, studied under supervision with defined measurements.",
    notClaiming:
      "Neorhiza does not publish bioreactor specifications, claim validated maturation protocols, or operate bioreactor systems at this time.",
  },
  {
    slug: "functional-testing",
    question: "Why functional testing matters",
    title: "Structure is not yet function",
    established:
      "Scientific review standards require evidence that a construct actually performs the functions of the tissue it models — measured, quantified and repeatable. Structure alone has repeatedly proven an unreliable predictor of function.",
    experimental:
      "Defining which functional measurements best predict real biological performance is itself an open research question for most engineered tissues.",
    explores:
      "Neorhiza's pathway concludes with functional and safety evaluation: identity, organization, performance, consistency and safety, all defined before future translation could be considered.",
    notClaiming:
      "Neorhiza does not claim any functional or safety results; no construct has been evaluated.",
  },
  {
    slug: "residual-pluripotent",
    question: "Why residual pluripotent cells may create safety concerns",
    title: "Undifferentiated cells are a known risk factor",
    established:
      "Published research has shown that residual pluripotent cells within a differentiated population can form unwanted tissue in laboratory models. This is a recognized safety consideration throughout the iPSC field.",
    experimental:
      "Detection and removal of residual pluripotent cells to high levels of assurance remains an active quality and safety research area.",
    explores:
      "Neorhiza's evaluation stage explicitly includes safety: any future research would be expected to address cell identity and consistency before anything else.",
    notClaiming:
      "Neorhiza does not claim to have solved residual-cell detection or removal, and makes no safety claims of any kind.",
  },
  {
    slug: "immune-risk",
    question: "Why patient-derived cells do not automatically eliminate every immune risk",
    title: "A promising direction, not a guarantee",
    established:
      "Patient-derived cells are broadly compatible with the donor's immune system, which is a major scientific advantage. However, immunology research shows that compatibility is multi-factorial: reprogramming, culture handling and maturation steps can each introduce differences.",
    experimental:
      "The full immunological behavior of patient-derived engineered tissue is not yet characterized and remains an open research question.",
    explores:
      "Neorhiza frames patient specificity as a long-term vision with genuine scientific promise — and treats immune behavior as a subject requiring dedicated study, not an assumption.",
    notClaiming:
      "Neorhiza does not claim rejection-proof tissue, individualized immune safety, or any clinical immunology result.",
  },
  {
    slug: "tissue-vs-organ",
    question: "Why engineered tissue is not automatically a replacement organ",
    title: "A stepping stone, honestly labeled",
    established:
      "Small engineered tissue constructs — organoids and tissue models — have become valuable research tools. They are, by design and by scale, research models: they do not perform the full functions of a complete organ in a body.",
    experimental:
      "Everything required to advance from research constructs toward organ-level function — scale, integration, safety, consistency — remains experimental.",
    explores:
      "Neorhiza's first proposed program is a small perfused liver-tissue research model with a focused scientific question. Its objective is knowledge, not transplantation.",
    notClaiming:
      "Neorhiza does not claim to manufacture organs, to be developing a transplantable liver, or to be near clinical application.",
  },
  {
    slug: "supervision",
    question: "Why institutional supervision is necessary",
    title: "Responsible science is supervised science",
    established:
      "Modern research governance — institutional review, ethics oversight, biosafety practice and quality systems — exists because rigorous oversight protects researchers, patients and the integrity of science itself. Leading work in this field is conducted under institutional frameworks.",
    experimental:
      "Not applicable — this is an established requirement, not an open question. Neorhiza treats it as non-negotiable.",
    explores:
      "Neorhiza is structured so that any laboratory work proceeds only under qualified institutional supervision, with ethics review and appropriate agreements.",
    notClaiming:
      "Neorhiza does not claim current accreditation, licensure or institutional affiliation. Building those relationships is part of the Foundation Phase.",
  },
];

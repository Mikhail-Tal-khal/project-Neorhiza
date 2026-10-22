import { SectionHeading } from "@/components/ui/section-heading";
import { VesselDivider } from "@/components/ui/vessel-divider";

const fields = [
  { name: "Stem-cell biology", note: "The living starting material" },
  { name: "Tissue engineering", note: "Structure that supports function" },
  { name: "Biomaterials", note: "Environments cells can inhabit" },
  { name: "Vascular biology", note: "Transport for every cell" },
  { name: "Bioreactor engineering", note: "Controlled maturation systems" },
  { name: "Functional testing", note: "Evidence over appearance" },
  { name: "Quality systems", note: "Consistency and traceability" },
  { name: "Ethical and regulatory science", note: "Responsible translation" },
];

/**
 * Vision — the disciplines of patient-specific tissue engineering shown as
 * interconnected glass cards, linked by thin teal vessel-style lines with
 * a coral node at each connection.
 */
export function VisionFields() {
  return (
    <section
      aria-labelledby="vision-heading"
      className="relative overflow-hidden py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="The long-term vision"
          title="A Future Built Around the Patient"
          lead="Instead of relying exclusively on donated organs, regenerative medicine investigates whether living cells can be guided into specialized tissues capable of restoring lost function. Project Neorhiza's long-term vision brings together:"
        />

        {/* Interconnected field cards with a decorative vessel layer behind */}
        <div className="relative mt-14">
          <svg
            aria-hidden="true"
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full text-teal-400/35"
          >
            <path
              d="M12 18 C30 18 34 40 50 40 C66 40 70 16 88 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.22"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M12 44 C28 44 36 22 50 22 C64 22 72 46 88 46"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.22"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <ul className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {fields.map((field) => (
              <li
                key={field.name}
                className="glass reveal-view relative rounded-2xl p-5"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-1.5 left-5 size-3 rounded-full border-2 border-background bg-coral-500"
                />
                <h3 className="font-semibold tracking-[0.01em] text-teal-700 dark:text-teal-50">
                  {field.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-mist-200">
                  {field.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <VesselDivider className="mt-20" />
    </section>
  );
}

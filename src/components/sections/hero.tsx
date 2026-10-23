import { GlassButton } from "@/components/ui/glass-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ResearchDisclaimer } from "@/components/ui/research-disclaimer";
import { HeroVessel } from "@/components/sections/hero-vessel";
import { disclaimers, site } from "@/lib/site";

/**
 * Hero — calm cinematic brand moment with the root-vessel progression
 * illustration, required status badge, copy and treatment disclaimer.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="hero-wash relative overflow-hidden"
    >

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-16 pt-10 md:px-8 md:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-24">
        <div className="motion-safe:animate-fade-up">
          <StatusBadge>Early-Stage Research Initiative</StatusBadge>

          <h1
            id="hero-heading"
            className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-[0.01em] text-heading md:text-5xl lg:text-[3.5rem]"
          >
            Engineering New Beginnings from Living Cells
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink md:text-xl">
            Project Neorhiza is building the scientific partnerships,
            engineering framework and research foundation needed to advance
            patient-specific tissue and organ engineering.
          </p>
          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted md:text-lg">
            Our long-term vision is a future in which living cells obtained
            from a patient may contribute to the development of functional
            replacement tissue designed for that same patient.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <GlassButton href="/our-science" size="lg">
              Explore the Vision
            </GlassButton>
            <GlassButton href="/collaboration" variant="secondary" size="lg">
              Collaborate With Neorhiza
            </GlassButton>
          </div>

          <ResearchDisclaimer className="mt-8 max-w-xl">
            {disclaimers.services}
          </ResearchDisclaimer>
        </div>

        {/* Brand moment: the mark's visual language on a calm glass panel */}
        <div className="relative lg:justify-self-end">
          <div className="glass relative overflow-hidden rounded-3xl p-6 md:p-10">
            <p className="label-caps relative">
              {site.descriptor}
            </p>
            <HeroVessel className="relative mt-2 w-full text-teal-700 dark:text-teal-200" />
            <div
              aria-hidden="true"
              className="relative mt-4 grid grid-cols-4 gap-3 text-center"
            >
              {["One cell", "A cluster", "Organized tissue", "A vessel tree"].map(
                (label) => (
                  <span
                    key={label}
                    className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted"
                  >
                    {label}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { GlassButton } from "@/components/ui/glass-button";
import { BrandMark } from "@/components/ui/brand-mark";

/**
 * Final call to action (section 11.11) — a solid deep-teal panel. The
 * stacked lockup has no reversed version, so it sits on its own solid
 * light tile.
 */
export function FinalCta() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8 md:py-28"
    >
      <div className="surface-deep relative overflow-hidden rounded-3xl px-6 py-16 text-center md:px-16 md:py-24">
        {/* Faint coral halo — restrained glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral-500/8 blur-3xl"
        />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center">
          <div className="logo-tile px-6 py-5">
            <BrandMark variant="stacked" height={104} decorative />
          </div>
          <h2
            id="cta-heading"
            className="mt-8 text-balance text-3xl font-semibold leading-tight tracking-[0.01em] text-white md:text-4xl"
          >
            The Future of Regenerative Medicine Will Be Built Through
            Collaboration
          </h2>
          <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-mist-200 md:text-lg">
            Project Neorhiza is seeking scientists, institutions, clinicians,
            engineers and responsible research organizations that understand
            that meaningful medical innovation begins with disciplined
            foundational work.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <GlassButton
              href="/collaboration"
              variant="coral"
              size="lg"
            >
              Collaborate With Neorhiza
            </GlassButton>
            <GlassButton
              href="/contact"
              size="lg"
              className="bg-white/10 text-white hover:bg-white/20 dark:bg-white/10 dark:text-white"
            >
              Join the Professional Network
            </GlassButton>
            <GlassButton
              href="/contact"
              size="lg"
              className="border border-white/30 bg-transparent text-white hover:bg-white/10 dark:bg-transparent dark:text-white"
            >
              Request a Meeting
            </GlassButton>
          </div>

          <p className="mt-10 text-xs leading-relaxed text-mist-200/80">
            Project Neorhiza does not currently provide medical treatments,
            stem-cell therapies, diagnostic services or organ transplantation.
          </p>
        </div>
      </div>
    </section>
  );
}

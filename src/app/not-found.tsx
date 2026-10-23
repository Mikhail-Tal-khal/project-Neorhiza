import Link from "next/link";
import { BrandMark } from "@/components/ui/brand-mark";
import { GlassButton } from "@/components/ui/glass-button";

/** Custom 404 — reversed horizontal logo on a deep-teal panel. */
export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 pb-24 pt-16 text-center md:px-8">
      <div className="surface-deep w-full rounded-3xl px-6 py-14 md:py-20">
        <BrandMark variant="horizontal" height={72} decorative tone="reversed" className="mx-auto" />
        <p className="label-caps mt-8 text-mist-200">Error 404</p>
        <h1 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-[0.01em] text-white md:text-4xl">
          This branch hasn&apos;t grown yet
        </h1>
        <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-mist-200">
          The page you are looking for does not exist or may have moved.
          Let&apos;s guide you back to the trunk.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <GlassButton href="/" size="lg" variant="coral">
            Back to home
          </GlassButton>
          <GlassButton
            href="/updates"
            size="lg"
            className="border border-white/30 bg-transparent text-white hover:bg-white/10 dark:bg-transparent dark:text-white"
          >
            Read the updates
          </GlassButton>
        </div>
      </div>
      <p className="mt-6 text-sm text-muted">
        Looking for something specific? The{" "}
        <Link
          href="/"
          className="font-medium text-teal-700 underline underline-offset-4 dark:text-teal-200"
        >
          home page
        </Link>{" "}
        links to every section of the site.
      </p>
    </div>
  );
}

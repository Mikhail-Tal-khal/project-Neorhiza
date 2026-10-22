"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";

/** Global error boundary — brand-styled, with recovery action. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for observability tooling; never exposes internals to users.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 pb-24 pt-16 text-center md:px-8">
      <div className="glass w-full rounded-3xl px-6 py-14 md:rounded-[2.5rem] md:py-20">
        <p className="label-caps">Something went wrong</p>
        <h1 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-[0.01em] text-teal-700 md:text-4xl dark:text-teal-50">
          An unexpected error interrupted this page
        </h1>
        <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-slate-500 dark:text-mist-200">
          The interruption has been noted. You can retry the page — if the
          problem persists, please try again later.
        </p>
        <div className="mt-8 flex justify-center">
          <GlassButton onClick={reset} size="lg">
            <RotateCcw aria-hidden="true" className="size-4" />
            Try again
          </GlassButton>
        </div>
      </div>
    </div>
  );
}

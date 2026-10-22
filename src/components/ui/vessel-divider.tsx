import { cn } from "@/lib/utils";

/**
 * VesselDivider — a thin branching-line section divider drawn in the
 * logo's root-vessel style: tapered teal rounded strokes ending in a
 * coral living-cell node. Decorative only.
 */
export function VesselDivider({
  className,
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none mx-auto w-full max-w-md px-8",
        flip && "-scale-x-100",
        className
      )}
    >
      <svg
        viewBox="0 0 320 40"
        fill="none"
        className="h-10 w-full text-teal-400/70 dark:text-teal-400/50"
      >
        <path
          d="M4 20 H210"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M210 20 C228 20 240 14 252 8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M210 20 C228 20 240 26 252 32"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M252 8 C262 8 268 5 274 2"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M252 32 C262 32 268 35 274 38"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <circle cx="278" cy="2" r="3" className="fill-coral-500" />
        <circle cx="278" cy="38" r="3" className="fill-coral-500" />
        <circle cx="216" cy="20" r="2.4" className="fill-coral-300" />
      </svg>
    </div>
  );
}

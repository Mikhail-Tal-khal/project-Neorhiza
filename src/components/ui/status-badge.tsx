import { cn } from "@/lib/utils";

/**
 * Off-white pill with a hairline border and a small coral dot — used for status such as
 * "Early-Stage Research Initiative". Meaning never relies on color alone:
 * the label text carries the information.
 */
export function StatusBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium tracking-[0.06em] text-heading",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="size-2 rounded-full bg-coral-500"
      />
      {children}
    </span>
  );
}

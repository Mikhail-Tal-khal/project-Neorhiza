import { cn } from "@/lib/utils";

/**
 * Teal glass pill with a small coral dot — used for status such as
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
        "glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-medium tracking-[0.06em] text-teal-700 dark:text-mist-200",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="size-2 rounded-full bg-coral-500 shadow-[0_0_0_3px_rgb(227_111_92/0.18)]"
      />
      {children}
    </span>
  );
}

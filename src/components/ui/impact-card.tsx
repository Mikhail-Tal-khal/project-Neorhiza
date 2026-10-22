import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-panel";

/**
 * ImpactCard — a human community this research may one day reach.
 * Simple line icon in the logo's rounded-stroke style; no anatomical imagery.
 */
export function ImpactCard({
  icon,
  title,
  text,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  className?: string;
}) {
  return (
    <GlassCard as="li" interactive className={cn("flex flex-col gap-4", className)}>
      <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-white/5 dark:text-teal-100">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold tracking-[0.01em] text-teal-700 dark:text-teal-50">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-mist-200">
          {text}
        </p>
      </div>
    </GlassCard>
  );
}

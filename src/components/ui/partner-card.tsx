import { CheckCircle2, Lock, FileText, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-panel";

type PartnerCardProps = {
  title: string;
  /** Why the role matters. */
  why: string;
  /** What Neorhiza is seeking. */
  seeking: string[];
  /** What information is publicly available. */
  publicInfo: string;
  /** What requires a confidential discussion. */
  confidential: string;
  /** How to submit an inquiry. */
  inquiry: string;
  className?: string;
};

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-xl bg-tint text-heading"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <h4 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-heading">
          {label}
        </h4>
        <div className="mt-1 text-sm leading-relaxed text-muted">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * PartnerCard — one collaboration path with the four required sections:
 * why the role matters, what is public, what is confidential and how to
 * inquire. Confidential documents are never distributed automatically.
 */
export function PartnerCard({
  title,
  why,
  seeking,
  publicInfo,
  confidential,
  inquiry,
  className,
}: PartnerCardProps) {
  return (
    <GlassCard as="article" className={cn("flex flex-col gap-6", className)}>
      <div>
        <h3 className="text-xl font-semibold tracking-[0.01em] text-heading">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/85">
          {why}
        </p>
      </div>

      <div className="flex gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-xl bg-tint text-heading"
        >
          <CheckCircle2 className="size-4" />
        </span>
        <div>
          <h4 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-heading">
            What Neorhiza is seeking
          </h4>
          <ul className="mt-2 space-y-1.5">
            {seeking.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm leading-relaxed text-muted"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-coral-500"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Row icon={<FileText className="size-4" />} label="Publicly available">
          {publicInfo}
        </Row>
        <Row icon={<Lock className="size-4" />} label="Confidential discussion">
          {confidential}
        </Row>
      </div>

      <Row icon={<Send className="size-4" />} label="How to inquire">
        {inquiry}
      </Row>
    </GlassCard>
  );
}

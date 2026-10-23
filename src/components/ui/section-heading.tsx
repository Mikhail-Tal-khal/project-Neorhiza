import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
};

/**
 * Consistent section header: optional small-caps eyebrow, strong but
 * restrained heading, optional lead paragraph.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  as = "h2",
  className,
}: SectionHeadingProps) {
  const Tag = as;
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && <p className="label-caps mb-3">{eyebrow}</p>}
      <Tag
        className={cn(
          "text-balance font-semibold tracking-[0.01em] text-heading",
          as === "h1"
            ? "text-4xl leading-[1.12] md:text-5xl lg:text-[3.4rem]"
            : "text-3xl leading-tight md:text-4xl"
        )}
      >
        {title}
      </Tag>
      {lead && (
        <p
          className={cn(
            "mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted md:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

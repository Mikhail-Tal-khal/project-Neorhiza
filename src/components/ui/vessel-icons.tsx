import { cn } from "@/lib/utils";

/**
 * Vessel-style line icon set drawn in the logo's visual language:
 * uniform rounded strokes, organic curves, coral living-cell node accents.
 * No anatomical, graphic-medical or clinical imagery.
 *
 * All icons: 24×24 grid, stroke 1.7, round caps/joins, `currentColor` for
 * line work, token-based coral accents.
 */

type IconProps = { className?: string; "aria-hidden"?: boolean };

function base(className?: string) {
  return cn("size-6", className);
}

function Svg({
  className,
  children,
  label,
}: IconProps & { children: React.ReactNode; label: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={label}
      className={base(className)}
    >
      {children}
    </svg>
  );
}

/** Person held by a supportive arc (living with organ failure). */
export function IconSupportedPerson({ className }: IconProps) {
  return (
    <Svg className={className} label="Person supported by a caring arc">
      <circle cx="12" cy="7.5" r="3" />
      <path d="M6.5 20v-1.5a5.5 5.5 0 0 1 11 0V20" />
      <path d="M3 14.5c1.2-4 4.8-6.5 9-6.5s7.8 2.5 9 6.5" opacity="0.55" />
      <circle cx="21" cy="13.4" r="1.3" className="fill-coral-500 stroke-none" />
    </Svg>
  );
}

/** Two people, one arc (pairs affected by chronic disease). */
export function IconPairedPersons({ className }: IconProps) {
  return (
    <Svg className={className} label="Two people standing together">
      <circle cx="8.5" cy="8" r="2.6" />
      <circle cx="15.5" cy="9.5" r="2.2" opacity="0.7" />
      <path d="M4 19.5v-1a4.5 4.5 0 0 1 9 0v1" />
      <path d="M14.5 19.5v-.8a3.6 3.6 0 0 1 5.5-3.1" opacity="0.7" />
      <circle cx="20.2" cy="6.2" r="1.2" className="fill-coral-500 stroke-none" />
    </Svg>
  );
}

/** Open rounded heart with a single living cell (heart damage). */
export function IconOpenHeart({ className }: IconProps) {
  return (
    <Svg className={className} label="Open heart outline with a single cell">
      <path d="M12 19.5S4.5 15 4.5 9.6A4.1 4.1 0 0 1 12 7.3a4.1 4.1 0 0 1 7.5 2.3c0 5.4-7.5 9.9-7.5 9.9Z" />
      <circle cx="9.4" cy="10.6" r="1.5" className="fill-coral-500 stroke-none" />
    </Svg>
  );
}

/** Rounded droplet with cell node (diabetes and metabolic care). */
export function IconDropletCell({ className }: IconProps) {
  return (
    <Svg className={className} label="Rounded droplet with a cell node">
      <path d="M12 4.5c3.2 3.7 5.4 6.6 5.4 9.3a5.4 5.4 0 0 1-10.8 0c0-2.7 2.2-5.6 5.4-9.3Z" />
      <circle cx="12" cy="14.2" r="1.6" className="fill-coral-500 stroke-none" />
    </Svg>
  );
}

/** Layered tissue arcs in regeneration (serious burns). */
export function IconLayeredRenewal({ className }: IconProps) {
  return (
    <Svg className={className} label="Layered arcs suggesting tissue renewal">
      <path d="M5 15.5c2.2-1.4 4.6-2.1 7-2.1s4.8.7 7 2.1" />
      <path d="M5.8 18.4c2-1.1 4-1.6 6.2-1.6s4.2.5 6.2 1.6" opacity="0.6" />
      <path d="M12 13V5.5" />
      <path d="M12 5.5c1.8.6 3.2 2 3.8 3.8" opacity="0.75" />
      <circle cx="12" cy="9.2" r="1.5" className="fill-coral-500 stroke-none" />
    </Svg>
  );
}

/** Interlocking rounded forms repairing (major tissue injuries). */
export function IconInterlockingRepair({ className }: IconProps) {
  return (
    <Svg className={className} label="Interlocking rounded forms suggesting repair">
      <path d="M8.5 4.5h4a4 4 0 0 1 0 8h-4a4 4 0 0 1 0-8Z" />
      <path d="M11.5 11.5h4a4 4 0 0 1 0 8h-4a4 4 0 0 1 0-8Z" opacity="0.8" />
      <circle cx="19" cy="6" r="1.3" className="fill-coral-500 stroke-none" />
    </Svg>
  );
}

/** Seedling in the root-vessel style (children, growth, new beginnings). */
export function IconSeedlingGrowth({ className }: IconProps) {
  return (
    <Svg className={className} label="Seedling growing from a curved stem">
      <path d="M12 20v-7" />
      <path d="M12 13c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6Z" />
      <path d="M12 15c0-2.5-2-4.5-4.5-4.5 0 2.5 2 4.5 4.5 4.5Z" opacity="0.8" />
      <circle cx="18.6" cy="5.4" r="1.2" className="fill-coral-500 stroke-none" />
    </Svg>
  );
}

/** Globe with vessel meridians (communities with limited access). */
export function IconCommunityGlobe({ className }: IconProps) {
  return (
    <Svg className={className} label="Globe with connecting vessel lines">
      <circle cx="12" cy="12" r="7.5" />
      <path d="M4.5 12h15" opacity="0.7" />
      <path d="M12 4.5c2.6 2.2 4 4.6 4 7.5s-1.4 5.3-4 7.5c-2.6-2.2-4-4.6-4-7.5s1.4-5.3 4-7.5Z" opacity="0.7" />
      <circle cx="17.6" cy="6.6" r="1.2" className="fill-coral-500 stroke-none" />
    </Svg>
  );
}

/** Open book with growing line (research education, capacity-building). */
export function IconOpenKnowledge({ className }: IconProps) {
  return (
    <Svg className={className} label="Open book with a growing line">
      <path d="M12 6.5C10.4 5.2 8.3 4.5 5.5 4.5c-.6 0-1 .4-1 1v11c0 .6.4 1 1 1 2.8 0 4.9.7 6.5 2 1.6-1.3 3.7-2 6.5-2 .6 0 1-.4 1-1v-11c0-.6-.4-1-1-1-2.8 0-4.9.7-6.5 2Z" />
      <path d="M12 6.5V19" opacity="0.5" />
      <circle cx="15.8" cy="9.2" r="1.2" className="fill-coral-500 stroke-none" />
    </Svg>
  );
}

/** Branching vessel (the core mark motif, for science content). */
export function IconVesselBranch({ className }: IconProps) {
  return (
    <Svg className={className} label="Branching vessel line">
      <path d="M12 20v-6.5" />
      <path d="M12 13.5C12 9.5 9 7 5.5 6.5" />
      <path d="M12 13.5c0-4 3-6.5 6.5-7" />
      <circle cx="5" cy="6" r="1.5" className="fill-coral-500 stroke-none" />
      <circle cx="19" cy="6" r="1.5" className="fill-coral-500 stroke-none" />
    </Svg>
  );
}

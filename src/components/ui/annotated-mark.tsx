/**
 * AnnotatedMark — the official mark (verbatim geometry from
 * neorhiza-icon.svg) with a short, simple annotated view:
 * trunk (the foundation), branching (vascular networks and growth) and
 * coral tips (living cells). Decorative leader lines + text labels.
 *
 * The paths below are the official mark's own paths — only the placement
 * transform and theme-aware stroke classes are added.
 */
export function AnnotatedMark({ className }: { className?: string }) {
  return (
    <figure className={className}>
      <svg
        viewBox="0 0 560 300"
        role="img"
        aria-label="The Neorhiza mark annotated: a trunk labeled the foundation, branches labeled vascular networks and growth, and coral tips labeled living cells"
        className="w-full max-w-xl"
      >
        {/* The official mark, scaled and placed left. */}
        <g transform="translate(24 26) scale(1.2)">
          <g
            transform="translate(0 8)"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-teal-700 dark:text-teal-200"
          >
            <path d="M100 12 L100 58" strokeWidth="11" />
            <path d="M100 58 C100 80 70 85 52 108" strokeWidth="8" />
            <path d="M100 58 C100 80 130 85 148 108" strokeWidth="8" />
            <path d="M100 58 L100 100" strokeWidth="7" />
            <path d="M52 108 C48 120 38 126 30 138" strokeWidth="5" />
            <path d="M52 108 C58 126 66 140 62 160" strokeWidth="5" />
            <path d="M100 100 C100 130 84 150 82 176" strokeWidth="4.5" />
            <path d="M100 100 C100 130 116 150 118 176" strokeWidth="4.5" />
            <path d="M148 108 C142 126 134 140 139 158" strokeWidth="5" />
            <path d="M148 108 C152 120 162 126 170 140" strokeWidth="5" />
          </g>
          <g transform="translate(0 8)">
            <circle cx="30" cy="138" r="7" className="fill-coral-500" />
            <circle cx="62" cy="160" r="7" className="fill-coral-500" />
            <circle cx="82" cy="176" r="7" className="fill-coral-500" />
            <circle cx="118" cy="176" r="7" className="fill-coral-500" />
            <circle cx="139" cy="158" r="7" className="fill-coral-500" />
            <circle cx="170" cy="140" r="7" className="fill-coral-500" />
          </g>
        </g>

        {/* Annotations */}
        <g
          fontSize="13"
          fontFamily="inherit"
          fontWeight="500"
          className="text-slate-500 dark:text-mist-200"
        >
          {/* Trunk — the foundation (trunk center x≈144, y≈48–79) */}
          <circle cx="164" cy="62" r="3" className="fill-coral-500" />
          <line
            x1="170"
            y1="62"
            x2="280"
            y2="62"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          <text x="288" y="66" className="fill-slate-500 dark:fill-mist-200">
            The foundation — a new biological base
          </text>

          {/* Branching — vascular networks (fork region y≈163) */}
          <circle cx="222" cy="160" r="3" className="fill-coral-500" />
          <line
            x1="228"
            y1="160"
            x2="280"
            y2="160"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          <text x="288" y="164" className="fill-slate-500 dark:fill-mist-200">
            Branching — vascular networks, growth
          </text>

          {/* Coral tips — living cells (lowest tips y≈251) */}
          <circle cx="190" cy="252" r="3" className="fill-coral-500" />
          <line
            x1="196"
            y1="252"
            x2="280"
            y2="252"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          <text x="288" y="256" className="fill-slate-500 dark:fill-mist-200">
            Coral tips — living cells
          </text>
        </g>
      </svg>
      <figcaption className="sr-only">
        The Neorhiza mark: a trunk representing the foundation, branches
        representing vascular networks and growth, and coral tips
        representing living cells.
      </figcaption>
    </figure>
  );
}

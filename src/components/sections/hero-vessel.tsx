/**
 * HeroVessel — the hero illustration: an abstract progression from a single
 * living cell (coral) into a small cluster, then organized tissue, then a
 * branching vascular structure in the logo's root-vessel style. Vector,
 * animated once on load (branches drawing outward, nodes fading in),
 * fully static under prefers-reduced-motion. Decorative: aria-hidden.
 */
export function HeroVessel({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 380"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* --- connecting vessel line across the progression --- */}
      <path
        d="M74 216 C150 216 160 176 240 176 C320 176 330 240 400 240 C470 240 480 120 560 110"
        stroke="currentColor"
        className="text-teal-400/60"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* --- stage 1: a single living cell --- */}
      <circle
        cx="74"
        cy="216"
        r="24"
        className="fill-coral-500 motion-safe:animate-[pop-in_0.6s_cubic-bezier(0.34,1.56,0.64,1)_both]"
        style={{ animationDelay: "0.15s" }}
      />
      <circle
        cx="66"
        cy="208"
        r="7"
        className="fill-coral-300/80 motion-safe:animate-[pop-in_0.5s_ease-out_both]"
        style={{ animationDelay: "0.5s" }}
      />

      {/* --- stage 2: a small cluster --- */}
      <g
        className="motion-safe:animate-[pop-in_0.6s_cubic-bezier(0.34,1.56,0.64,1)_both]"
        style={{ animationDelay: "0.55s" }}
      >
        <circle cx="240" cy="176" r="16" className="fill-coral-500" />
        <circle cx="264" cy="160" r="10" className="fill-coral-300" />
        <circle cx="220" cy="158" r="9" className="fill-coral-300" />
        <circle cx="258" cy="190" r="8" className="fill-coral-300/90" />
        <circle cx="226" cy="194" r="7" className="fill-coral-300/80" />
      </g>

      {/* --- stage 3: organized tissue --- */}
      <g
        className="motion-safe:animate-[pop-in_0.7s_cubic-bezier(0.34,1.56,0.64,1)_both]"
        style={{ animationDelay: "0.9s" }}
      >
        <circle cx="400" cy="240" r="12" className="fill-coral-500" />
        <circle cx="378" cy="228" r="9" className="fill-coral-300" />
        <circle cx="422" cy="228" r="9" className="fill-coral-300" />
        <circle cx="378" cy="252" r="9" className="fill-coral-300/90" />
        <circle cx="422" cy="252" r="9" className="fill-coral-300/90" />
        <circle cx="400" cy="216" r="8" className="fill-coral-300/80" />
        <circle cx="400" cy="264" r="8" className="fill-coral-300/80" />
        {/* thin tissue boundary */}
        <ellipse
          cx="400"
          cy="240"
          rx="44"
          ry="38"
          className="stroke-teal-400/50"
          strokeWidth="1.5"
          strokeDasharray="3 7"
          strokeLinecap="round"
        />
      </g>

      {/* --- stage 4: branching vascular structure --- */}
      <g className="vessel-draw" data-animate="true">
        <path
          d="M560 348 C560 320 558 300 556 284"
          stroke="currentColor"
          className="text-teal-700 dark:text-teal-400"
          strokeWidth="7"
          strokeLinecap="round"
          style={
            {
              pathLength: 1,
              "--draw-delay": "1s",
              "--draw-duration": "0.7s",
            } as React.CSSProperties
          }
        />
        <path
          d="M556 284 C552 254 540 226 518 202"
          stroke="currentColor"
          className="text-teal-700 dark:text-teal-400"
          strokeWidth="5"
          strokeLinecap="round"
          style={
            {
              pathLength: 1,
              "--draw-delay": "1.55s",
              "--draw-duration": "0.7s",
            } as React.CSSProperties
          }
        />
        <path
          d="M518 202 C506 188 498 172 494 152"
          stroke="currentColor"
          className="text-teal-700 dark:text-teal-400"
          strokeWidth="3.4"
          strokeLinecap="round"
          style={
            {
              pathLength: 1,
              "--draw-delay": "2.2s",
              "--draw-duration": "0.55s",
            } as React.CSSProperties
          }
        />
        <path
          d="M518 202 C530 190 544 184 562 182"
          stroke="currentColor"
          className="text-teal-700 dark:text-teal-400"
          strokeWidth="3.4"
          strokeLinecap="round"
          style={
            {
              pathLength: 1,
              "--draw-delay": "2.2s",
              "--draw-duration": "0.55s",
            } as React.CSSProperties
          }
        />
        <path
          d="M556 284 C566 262 582 248 606 242"
          stroke="currentColor"
          className="text-teal-700 dark:text-teal-400"
          strokeWidth="5"
          strokeLinecap="round"
          style={
            {
              pathLength: 1,
              "--draw-delay": "1.7s",
              "--draw-duration": "0.7s",
            } as React.CSSProperties
          }
        />
      </g>
      {/* coral nodes at branch tips */}
      <g className="motion-safe:animate-[pop-in_0.5s_cubic-bezier(0.34,1.56,0.64,1)_both]" style={{ animationDelay: "2.75s" }}>
        <circle cx="493" cy="145" r="8" className="fill-coral-500" />
        <circle cx="570" cy="181" r="7.5" className="fill-coral-500" />
        <circle cx="614" cy="241" r="8" className="fill-coral-500" />
      </g>
    </svg>
  );
}

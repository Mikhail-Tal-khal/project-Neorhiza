/**
 * Brand color constants mirroring the CSS design tokens (src/styles/globals.css).
 * Used only in non-CSS contexts (ImageResponse/OG rendering, scripts) where
 * CSS variables are unavailable. UI components must use token classes instead.
 */

export const brand = {
  teal700: "#0F4C5C",
  teal900: "#0A3540",
  teal950: "#06222A",
  coral500: "#E36F5C",
  mist: "#BFD3D8",
  foregroundDark: "#EAF2F3",
  /** Light-mode page background (--bg). */
  pearl: "#F6F6F3",
  /** Dark-mode page background (--bg). */
  slateTeal: "#0D262C",
} as const;

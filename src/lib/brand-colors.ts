/**
 * Brand color constants mirroring the CSS design tokens (src/styles/globals.css).
 * Used only in non-CSS contexts (ImageResponse/OG rendering, scripts) where
 * CSS variables are unavailable. UI components must use token classes instead.
 */

export const brand = {
  teal50: "#E8F1F2",
  teal200: "#BFD3D8",
  teal700: "#0F4C5C",
  teal900: "#0A3540",
  teal950: "#06222A",
  coral500: "#E36F5C",
  mist: "#BFD3D8",
  foregroundDark: "#EAF2F3",
  sage50: "#F4F7F2",
} as const;

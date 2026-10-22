import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand-colors";

/**
 * Brand Open Graph image — deep-teal gradient, the sanctioned reversed
 * horizontal logo (transparent variant) and Manrope typography. Generated dynamically at request
 * time and cached by Next.js.
 */

export const alt = "Project Neorhiza — Patient-Specific Tissue Engineering Initiative";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadAssets() {
  const [logo, fontMedium, fontSemiBold, fontBold] = await Promise.all([
    readFile(path.join(process.cwd(), "src/assets/og/neorhiza-horizontal-reversed.png")),
    readFile(path.join(process.cwd(), "src/assets/fonts/Manrope-500.ttf")),
    readFile(path.join(process.cwd(), "src/assets/fonts/Manrope-600.ttf")),
    readFile(path.join(process.cwd(), "src/assets/fonts/Manrope-700.ttf")),
  ]);
  return {
    logo: `data:image/png;base64,${logo.toString("base64")}`,
    fonts: [
      { name: "Manrope", data: fontMedium, weight: 500 as const, style: "normal" as const },
      { name: "Manrope", data: fontSemiBold, weight: 600 as const, style: "normal" as const },
      { name: "Manrope", data: fontBold, weight: 700 as const, style: "normal" as const },
    ],
  };
}

export default async function OpengraphImage() {
  const { logo, fonts } = await loadAssets();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: `linear-gradient(150deg, ${brand.teal900} 0%, ${brand.teal950} 78%)`,
          color: `${brand.foregroundDark}`,
          fontFamily: "Manrope",
        }}
      >
        {/* soft coral halo */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -180,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: "rgba(227,111,92,0.08)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <img src={logo} width={420} height={140} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 22,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: `${brand.mist}`,
              fontWeight: 500,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 9999,
                background: `${brand.coral500}`,
                display: "flex",
              }}
            />
            Early-Stage Research Initiative
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              lineHeight: 1.15,
              fontWeight: 700,
              maxWidth: 920,
            }}
          >
            Engineering New Beginnings from Living Cells
          </div>
          <div style={{ display: "flex", fontSize: 28, color: `${brand.mist}`, fontWeight: 500 }}>
            Patient-Specific Tissue Engineering Initiative
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}

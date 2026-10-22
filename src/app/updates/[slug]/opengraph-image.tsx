import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand-colors";

/**
 * Per-article Open Graph image — the brand template with the article
 * title. Uses the sanctioned reversed horizontal logo and brand colors.
 */

export const alt = "Project Neorhiza — Updates";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ArticleOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [{ getArticle }, logoFile, fontMedium, fontSemiBold, fontBold] =
    await Promise.all([
      import("@/lib/articles"),
      readFile(path.join(process.cwd(), "src/assets/og/neorhiza-horizontal-reversed.png")),
      readFile(path.join(process.cwd(), "src/assets/fonts/Manrope-500.ttf")),
      readFile(path.join(process.cwd(), "src/assets/fonts/Manrope-600.ttf")),
      readFile(path.join(process.cwd(), "src/assets/fonts/Manrope-700.ttf")),
    ]);

  const article = await getArticle(slug);
  const logo = `data:image/png;base64,${logoFile.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          background: `linear-gradient(150deg, ${brand.teal900} 0%, ${brand.teal950} 78%)`,
          color: `${brand.foregroundDark}`,
          fontFamily: "Manrope",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -280,
            right: -220,
            width: 680,
            height: 680,
            borderRadius: 9999,
            background: "rgba(227,111,92,0.08)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img src={logo} width={360} height={120} alt="" />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 19,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: `${brand.mist}`,
              fontWeight: 500,
              border: "1px solid rgba(191,211,216,0.35)",
              borderRadius: 9999,
              padding: "10px 22px",
            }}
          >
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: 9999,
                background: `${brand.coral500}`,
                display: "flex",
              }}
            />
            {article.category}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: article.title.length > 62 ? 52 : 60,
              lineHeight: 1.18,
              fontWeight: 700,
              maxWidth: 980,
            }}
          >
            {article.title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: `${brand.mist}`,
              fontWeight: 500,
            }}
          >
            Project Neorhiza — Updates
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Manrope", data: fontMedium, weight: 500, style: "normal" },
        { name: "Manrope", data: fontSemiBold, weight: 600, style: "normal" },
        { name: "Manrope", data: fontBold, weight: 700, style: "normal" },
      ],
    }
  );
}

import type { Metadata } from "next";
import { site } from "@/lib/site";

type PageMetaInput = {
  title: string;
  description: string;
  /** Route path beginning with "/" — used for canonical + OG URL. */
  path: string;
  /** Override the shared OG image path if the page has its own. */
  ogImage?: string;
  /** Open Graph type; articles use "article". */
  type?: "website" | "article";
  /** ISO publication date for articles. */
  publishedTime?: string;
};

/**
 * Builds consistent per-page metadata: title, description, canonical URL,
 * Open Graph and Twitter cards referencing the brand OG image.
 */
export function createMetadata({
  title,
  description,
  path,
  ogImage,
  type = "website",
  publishedTime,
}: PageMetaInput): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}`;
  const image = ogImage || `${site.url}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — ${site.shortName}`,
      description,
      url,
      siteName: site.name,
      type,
      ...(publishedTime ? { publishedTime } : {}),
      images: [{ url: image, width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${site.shortName}`,
      description,
      images: [image],
    },
  };
}

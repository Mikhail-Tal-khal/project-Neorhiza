import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { brand } from "@/lib/brand-colors";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.descriptor}`,
    short_name: site.shortName,
    description: site.tagline,
    start_url: "/",
    display: "standalone",
    background_color: brand.pearl,
    theme_color: brand.teal700,
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

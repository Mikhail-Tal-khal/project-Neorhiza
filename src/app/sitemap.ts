import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/why-neorhiza",
    "/our-science",
    "/roadmap",
    "/human-impact",
    "/collaboration",
    "/updates",
    "/contact",
    "/privacy",
    "/terms",
    "/research-disclaimer",
  ].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" || route === "/updates" ? "weekly" : "monthly") as
      | "weekly"
      | "monthly",
    priority: route === "" ? 1 : route === "/updates" ? 0.9 : 0.7,
  }));

  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await getAllArticles();
    articleRoutes = articles.map((article) => ({
      url: `${site.url}/updates/${article.slug}`,
      lastModified: new Date(`${article.date}T00:00:00Z`),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    // Sitemap still generates if content is temporarily unavailable.
  }

  return [...staticRoutes, ...articleRoutes];
}

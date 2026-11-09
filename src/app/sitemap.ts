import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { pageDates, type StaticRoute } from "@/lib/page-dates";
import { site } from "@/lib/site";

const utc = (isoDate: string) => new Date(`${isoDate}T00:00:00Z`);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let articles: Awaited<ReturnType<typeof getAllArticles>> = [];
  try {
    articles = await getAllArticles();
  } catch {
    // Sitemap still generates if content is temporarily unavailable.
  }
  const newestArticle = articles[0]?.date;

  const staticRoutes = (Object.keys(pageDates) as StaticRoute[]).map((route) => {
    // The Updates index changes whenever a newer article is published.
    const date =
      route === "/updates" && newestArticle && newestArticle > pageDates[route]
        ? newestArticle
        : pageDates[route];
    return {
      url: route === "/" ? site.url : `${site.url}${route}`,
      lastModified: utc(date),
      changeFrequency: (route === "/" || route === "/updates" ? "weekly" : "monthly") as
        | "weekly"
        | "monthly",
      priority: route === "/" ? 1 : route === "/updates" ? 0.9 : 0.7,
    };
  });

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${site.url}/updates/${article.slug}`,
    lastModified: utc(article.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes];
}

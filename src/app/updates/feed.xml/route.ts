import { getAllArticles } from "@/lib/articles";
import { site } from "@/lib/site";

/**
 * RSS 2.0 feed of every published article, generated at build time.
 * Dates come from article frontmatter, never from the build clock.
 */
export const dynamic = "force-static";

function xml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const rfc822 = (isoDate: string) => new Date(`${isoDate}T00:00:00Z`).toUTCString();

export async function GET() {
  const articles = await getAllArticles();
  const feedUrl = `${site.url}/updates/feed.xml`;
  const latest = articles[0]?.date;

  const items = articles
    .map((article) => {
      const url = `${site.url}/updates/${article.slug}`;
      return `    <item>
      <title>${xml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(article.date)}</pubDate>
      <category>${xml(article.category)}</category>
      <description>${xml(article.excerpt)}</description>
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(`${site.name} — Updates`)}</title>
    <link>${site.url}/updates</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>${xml("Project updates, plain-language scientific education and governance notes from Project Neorhiza, an early-stage patient-specific tissue engineering initiative.")}</description>
    <language>en</language>${latest ? `\n    <lastBuildDate>${rfc822(latest)}</lastBuildDate>` : ""}
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArticleCard } from "@/components/mdx";
import { getAllArticles, articleCategories } from "@/lib/articles";
import { createMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = createMetadata({
  title: "Updates",
  description:
    "Project updates, plain-language scientific education, collaboration announcements, research commentary and ethics and governance notes from Project Neorhiza.",
  path: "/updates",
});

const breadcrumb = breadcrumbJsonLd([{ name: "Updates", path: "/updates" }]);

export default async function UpdatesPage() {
  const articles = await getAllArticles();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-24 md:px-8">
      <section aria-labelledby="updates-heading" className="py-14 lg:py-20">
        <SectionHeading
          as="h1"
          eyebrow="Updates"
          title="Notes From the Foundation Phase"
          lead="Project updates, plain-language scientific education, collaboration announcements and governance notes. Scientific progress is not guaranteed — and this page will say so when it isn't."
        />
        <ul className="mt-10 flex flex-wrap justify-center gap-2.5">
          {articleCategories.map((category) => (
            <li
              key={category}
              className="glass rounded-full px-4 py-2 text-xs font-medium tracking-[0.06em] text-teal-700 dark:text-mist-200"
            >
              {category}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="articles-heading">
        <h2 id="articles-heading" className="sr-only">
          All articles
        </h2>
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <li key={article.slug} className="flex">
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      </section>

      <JsonLd data={breadcrumb} />
    </div>
  );
}

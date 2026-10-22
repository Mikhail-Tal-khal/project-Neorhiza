import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ArticleBody, ArticleMeta } from "@/components/mdx";
import { StatusBadge } from "@/components/ui/status-badge";
import { ResearchDisclaimer } from "@/components/ui/research-disclaimer";
import { getArticle, getArticleSlugs } from "@/lib/articles";
import { createMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";
import { disclaimers, site } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  return createMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/updates/${article.slug}`,
    ogImage: `${site.url}/updates/${article.slug}/opengraph-image`,
    type: "article",
    publishedTime: article.date,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  /** Article structured data — an educational article, not medical advice. */
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: `${site.url}/updates/${article.slug}`,
    inLanguage: "en",
    isAccessibleForFree: true,
    about: article.category,
    image: `${site.url}/updates/${article.slug}/opengraph-image`,
  };
  const breadcrumb = breadcrumbJsonLd([
    { name: "Updates", path: "/updates" },
    { name: article.title, path: `/updates/${article.slug}` },
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 md:px-8">
      <article className="py-12 lg:py-16">
        <Link
          href="/updates"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-400 dark:text-teal-200 dark:hover:text-white"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          All updates
        </Link>

        <header className="mt-8">
          <StatusBadge>{article.category}</StatusBadge>
          <h1 className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-[0.01em] text-teal-700 md:text-4xl dark:text-teal-50">
            {article.title}
          </h1>
          <p className="mt-4 text-pretty leading-relaxed text-slate-500 md:text-lg dark:text-mist-200">
            {article.excerpt}
          </p>
          <div className="mt-5">
            <ArticleMeta article={article} />
          </div>
        </header>

        <hr className="mt-8 border-teal-100/70 dark:border-white/10" />

        <div className="mdx-body">
          <ArticleBody article={article} />
        </div>

        <ResearchDisclaimer className="mt-12" title="Research disclaimer">
          {disclaimers.footer}
        </ResearchDisclaimer>
      </article>

      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumb} />
    </div>
  );
}

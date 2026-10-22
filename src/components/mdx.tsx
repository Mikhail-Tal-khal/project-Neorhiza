import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Article, ArticleFrontmatter } from "@/lib/articles";
import { formatDate } from "@/lib/articles";
import { StatusBadge } from "@/components/ui/status-badge";
import { GlassCard } from "@/components/ui/glass-panel";

/** Typography mapping for article MDX content. */
const mdxComponents = {
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="mt-10 text-2xl font-semibold tracking-[0.01em] text-teal-700 dark:text-teal-50"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3
      className="mt-8 text-xl font-semibold tracking-[0.01em] text-teal-700 dark:text-teal-50"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="mt-5 leading-relaxed text-ink/90 dark:text-teal-50/85" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mt-5 space-y-2.5" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="mt-5 list-decimal space-y-2.5 pl-5" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li
      className="flex gap-3 leading-relaxed text-ink/90 before:mt-[0.6rem] before:size-1.5 before:shrink-0 before:rounded-full before:bg-coral-500 dark:text-teal-50/85 [&>ol]:mt-0"
      {...props}
    />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-semibold text-teal-700 dark:text-teal-50" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="mt-6 border-l-2 border-coral-300 pl-5 text-lg font-medium leading-relaxed text-teal-700 dark:border-coral-500/60 dark:text-teal-50"
      {...props}
    />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="font-medium text-teal-700 underline underline-offset-4 hover:text-teal-400 dark:text-teal-200 dark:hover:text-white"
      {...props}
    />
  ),
  hr: () => <hr className="mt-10 border-teal-100/70 dark:border-white/10" />,
};

export function ArticleBody({ article }: { article: Article }) {
  return (
    <MDXRemote source={article.content} components={mdxComponents} />
  );
}

export function ArticleMeta({ article }: { article: ArticleFrontmatter }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-mist-200">
      <time dateTime={article.date}>{formatDate(article.date)}</time>
      <span aria-hidden="true" className="size-1 rounded-full bg-coral-500" />
      <span>{article.readingMinutes} min read</span>
    </div>
  );
}

export function ArticleCard({ article }: { article: ArticleFrontmatter }) {
  return (
    <GlassCard as="article" interactive className="flex w-full flex-col">
      <StatusBadge className="self-start">{article.category}</StatusBadge>
      <h3 className="mt-4 text-xl font-semibold leading-snug tracking-[0.01em] text-teal-700 dark:text-teal-50">
        <Link
          href={`/updates/${article.slug}`}
          className="hover:text-teal-400 dark:hover:text-white"
        >
          {article.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500 dark:text-mist-200">
        {article.excerpt}
      </p>
      <div className="mt-5">
        <ArticleMeta article={article} />
      </div>
    </GlassCard>
  );
}

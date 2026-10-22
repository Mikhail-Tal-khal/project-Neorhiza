import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import { notFound } from "next/navigation";

/**
 * Lightweight MDX content system for the Updates page.
 * Articles live in src/content/articles as .mdx files with frontmatter.
 * All reads happen at build time (pages are statically generated).
 */

const ARTICLES_DIR = path.join(process.cwd(), "src/content/articles");

export type ArticleFrontmatter = {
  title: string;
  slug: string;
  category:
    | "Project Updates"
    | "Scientific Education"
    | "Collaboration Announcements"
    | "Research Commentary"
    | "Ethics and Governance"
    | "Events"
    | "Opportunities";
  excerpt: string;
  /** ISO date, e.g. 2026-01-12 */
  date: string;
  readingMinutes: number;
};

export type Article = ArticleFrontmatter & { content: string };

export const articleCategories: ArticleFrontmatter["category"][] = [
  "Project Updates",
  "Scientific Education",
  "Collaboration Announcements",
  "Research Commentary",
  "Ethics and Governance",
  "Events",
  "Opportunities",
];

const frontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: z.enum(articleCategories as [ArticleFrontmatter["category"], ...ArticleFrontmatter["category"][]]),
  excerpt: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  readingMinutes: z.number().int().positive(),
});

/** Splits `---` YAML frontmatter from the MDX body and validates it. */
async function readArticleFile(fileName: string): Promise<Article> {
  const raw = await readFile(path.join(ARTICLES_DIR, fileName), "utf8");
  const match = raw.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`${fileName}: missing frontmatter`);
  const parsed = frontmatterSchema.safeParse(parseYaml(match[1]));
  if (!parsed.success) throw new Error(`${fileName}: invalid frontmatter — ${parsed.error.message}`);
  if (`${parsed.data.slug}.mdx` !== fileName) throw new Error(`${fileName}: slug does not match file name`);
  return { ...parsed.data, content: match[2] };
}

function byDateDesc(a: Article, b: Article) {
  return b.date.localeCompare(a.date);
}

export async function getAllArticles(): Promise<ArticleFrontmatter[]> {
  const files = (await readdir(ARTICLES_DIR)).filter((f) => f.endsWith(".mdx"));
  const articles = await Promise.all(files.map(readArticleFile));
  return articles.sort(byDateDesc);
}

export async function getArticle(slug: string): Promise<Article> {
  const files = (await readdir(ARTICLES_DIR)).filter((f) => f.endsWith(".mdx"));
  const articles = await Promise.all(files.map(readArticleFile));
  const match = articles.find((a) => a.slug === slug);
  if (!match) notFound();
  return match;
}

export async function getArticleSlugs(): Promise<string[]> {
  const files = (await readdir(ARTICLES_DIR)).filter((f) => f.endsWith(".mdx"));
  const articles = await Promise.all(files.map(readArticleFile));
  return articles.map((a) => a.slug);
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { z } from "zod";

/**
 * News loader — the ONLY module that reads content/actualites.
 *
 *   files (YYYY-MM-DD-*.md)
 *        │  read + parse frontmatter (gray-matter)
 *        ▼
 *   validate ── missing date prefix ─────────┐
 *        │      prefix ≠ frontmatter date ────┤─► throw (fails the build)
 *        │      duplicate slug (post-override)─┘
 *        ▼
 *   sort by date desc ──► PostMeta[]
 *        │
 *        └─ getPostBySlug ─► render body markdown → html
 *
 * The home page (latest 3), /actualites (all), /actualites/[slug] (one), and
 * generateStaticParams all consume this — no page touches the filesystem.
 */

const POSTS_DIR = path.join(process.cwd(), "content", "actualites");
const FILENAME_RE = /^(\d{4}-\d{2}-\d{2})-(.+)\.md$/;

const FrontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  excerpt: z.string().min(1),
  cover: z.string().optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case").optional(),
});

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO YYYY-MM-DD, canonical for sort + display
  excerpt: string;
  cover?: string;
};

export type Post = PostMeta & { contentHtml: string };

type RawPost = PostMeta & { body: string };

// Exported for unit tests so validation/sort branches can run against fixtures.
export function loadRawPostsFrom(dir: string): RawPost[] {
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const seen = new Map<string, string>(); // slug -> filename, for collision reporting
  const posts: RawPost[] = [];

  for (const filename of files) {
    const match = FILENAME_RE.exec(filename);
    if (!match) {
      throw new Error(
        `News loader: "${filename}" is missing a YYYY-MM-DD- date prefix. Rename it, e.g. 2026-06-15-${filename}.`,
      );
    }
    const [, filenameDate, derivedSlug] = match;

    const raw = fs.readFileSync(path.join(dir, filename), "utf8");
    const parsed = matter(raw);
    const fm = FrontmatterSchema.safeParse(parsed.data);
    if (!fm.success) {
      throw new Error(
        `News loader: invalid frontmatter in "${filename}": ${fm.error.issues
          .map((i) => `${i.path.join(".")} ${i.message}`)
          .join("; ")}`,
      );
    }

    if (fm.data.date !== filenameDate) {
      throw new Error(
        `News loader: "${filename}" filename date (${filenameDate}) disagrees with frontmatter date (${fm.data.date}).`,
      );
    }

    // Explicit slug wins; otherwise the date-stripped filename. Explicit slug lets
    // recurring annual events avoid colliding (tournoi-interne 2026 vs 2027).
    const slug = fm.data.slug ?? derivedSlug;
    const prev = seen.get(slug);
    if (prev) {
      throw new Error(
        `News loader: duplicate slug "${slug}" from "${filename}" and "${prev}". ` +
          `Set an explicit "slug:" in one file's frontmatter to disambiguate.`,
      );
    }
    seen.set(slug, filename);

    posts.push({
      slug,
      title: fm.data.title,
      date: fm.data.date,
      excerpt: fm.data.excerpt,
      cover: fm.data.cover,
      body: parsed.content,
    });
  }

  // Newest first. Date is canonical; tie-break on slug for a stable order.
  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug < b.slug ? 1 : -1));
  return posts;
}

function loadRawPosts(): RawPost[] {
  return loadRawPostsFrom(POSTS_DIR);
}

function toMeta(p: RawPost): PostMeta {
  const { body: _body, ...meta } = p;
  return meta;
}

/** All posts, newest first, metadata only (no rendered body). */
export function getAllPosts(): PostMeta[] {
  return loadRawPosts().map(toMeta);
}

/** The N latest posts (default 3), for the home page. */
export function getLatestPosts(limit = 3): PostMeta[] {
  return getAllPosts().slice(0, limit);
}

/** One post with rendered HTML body, or null if the slug is unknown. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const raw = loadRawPosts().find((p) => p.slug === slug);
  if (!raw) return null;
  const processed = await remark().use(html).process(raw.body);
  return { ...toMeta(raw), contentHtml: processed.toString() };
}

export function formatFrenchDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

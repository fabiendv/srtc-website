import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  loadRawPostsFrom,
  getAllPosts,
  getLatestPosts,
  getPostBySlug,
  formatFrenchDate,
} from "./news";

let dir: string;

function write(name: string, frontmatter: Record<string, string>, body = "Corps du post.") {
  const fm = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: "${v}"`)
    .join("\n");
  fs.writeFileSync(path.join(dir, name), `---\n${fm}\n---\n\n${body}\n`, "utf8");
}

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "srtc-news-"));
});

afterEach(() => {
  fs.rmSync(dir, { recursive: true, force: true });
});

describe("loadRawPostsFrom — happy path", () => {
  it("returns posts sorted newest-first with derived slugs", () => {
    write("2026-01-10-hiver.md", { title: "Hiver", date: "2026-01-10", excerpt: "a" });
    write("2026-06-15-ete.md", { title: "Ete", date: "2026-06-15", excerpt: "b" });

    const posts = loadRawPostsFrom(dir);
    expect(posts.map((p) => p.slug)).toEqual(["ete", "hiver"]); // desc by date
    expect(posts[0].title).toBe("Ete");
  });

  it("returns [] for a missing directory", () => {
    expect(loadRawPostsFrom(path.join(dir, "does-not-exist"))).toEqual([]);
  });
});

describe("loadRawPostsFrom — validation (build-breaking)", () => {
  it("throws when the filename has no date prefix", () => {
    write("tournoi-interne.md", { title: "T", date: "2026-06-15", excerpt: "x" });
    expect(() => loadRawPostsFrom(dir)).toThrow(/date prefix/i);
  });

  it("throws when the filename date disagrees with the frontmatter date", () => {
    write("2026-06-15-t.md", { title: "T", date: "2026-06-16", excerpt: "x" });
    expect(() => loadRawPostsFrom(dir)).toThrow(/disagrees/i);
  });

  it("throws on invalid frontmatter (missing excerpt)", () => {
    write("2026-06-15-t.md", { title: "T", date: "2026-06-15" });
    expect(() => loadRawPostsFrom(dir)).toThrow(/frontmatter/i);
  });

  it("throws on a duplicate derived slug (recurring annual event)", () => {
    write("2026-06-15-tournoi-interne.md", { title: "2026", date: "2026-06-15", excerpt: "x" });
    write("2027-06-15-tournoi-interne.md", { title: "2027", date: "2027-06-15", excerpt: "y" });
    expect(() => loadRawPostsFrom(dir)).toThrow(/duplicate slug/i);
  });
});

describe("loadRawPostsFrom — explicit slug override", () => {
  it("lets recurring events disambiguate without colliding", () => {
    write("2026-06-15-tournoi-interne.md", {
      title: "2026",
      date: "2026-06-15",
      excerpt: "x",
      slug: "tournoi-interne-2026",
    });
    write("2027-06-15-tournoi-interne.md", {
      title: "2027",
      date: "2027-06-15",
      excerpt: "y",
      slug: "tournoi-interne-2027",
    });

    const slugs = loadRawPostsFrom(dir).map((p) => p.slug);
    expect(slugs).toContain("tournoi-interne-2026");
    expect(slugs).toContain("tournoi-interne-2027");
    expect(slugs).toHaveLength(2);
  });
});

describe("public API against real content", () => {
  it("getAllPosts returns posts newest-first", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
  });

  it("getLatestPosts caps the count", () => {
    expect(getLatestPosts(2).length).toBeLessThanOrEqual(2);
  });

  it("getPostBySlug returns a post with rendered HTML for a known slug", async () => {
    const slug = getAllPosts()[0].slug;
    const post = await getPostBySlug(slug);
    expect(post).not.toBeNull();
    expect(post!.contentHtml).toContain("<p>");
  });

  it("getPostBySlug returns null for an unknown slug", async () => {
    expect(await getPostBySlug("ce-slug-nexiste-pas")).toBeNull();
  });
});

describe("formatFrenchDate", () => {
  it("formats an ISO date in French", () => {
    expect(formatFrenchDate("2026-06-15")).toMatch(/15 juin 2026/);
  });
});

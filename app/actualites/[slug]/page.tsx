import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllPosts, getPostBySlug, formatFrenchDate } from "@/lib/news";

// Every post is built ahead of time; an unknown slug returns the French 404.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/actualites/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <Link href="/actualites" className="inline-flex items-center gap-1 text-sm font-medium text-clay hover:gap-2">
        <ArrowLeft size={16} /> Toutes les actualités
      </Link>

      <header className="mt-6">
        <time dateTime={post.date} className="text-sm uppercase tracking-wide text-muted">
          {formatFrenchDate(post.date)}
        </time>
        <h1 className="mt-2 font-serif text-4xl leading-tight text-forest sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-lg text-muted">{post.excerpt}</p>
      </header>

      {post.cover && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-line">
          <Image src={post.cover} alt="" fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
        </div>
      )}

      <div
        className="prose-srtc mt-10"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}

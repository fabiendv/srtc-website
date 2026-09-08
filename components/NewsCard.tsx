import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatFrenchDate, type PostMeta } from "@/lib/news";

export function NewsCard({ post }: { post: PostMeta }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white/40 transition-shadow hover:shadow-md">
      {post.cover && (
        <Link href={`/actualites/${post.slug}`} className="relative block aspect-[3/2] overflow-hidden">
          <Image
            src={post.cover}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
      )}
      <div className="flex flex-1 flex-col p-5">
        <time dateTime={post.date} className="text-xs uppercase tracking-wide text-muted">
          {formatFrenchDate(post.date)}
        </time>
        <h3 className="mt-2 font-serif text-xl leading-snug text-forest">
          <Link href={`/actualites/${post.slug}`} className="hover:text-clay">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm text-muted">{post.excerpt}</p>
        <Link
          href={`/actualites/${post.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-clay hover:gap-2"
        >
          Lire la suite
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}

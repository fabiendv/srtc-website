import type { Metadata } from "next";
import { getAllPosts } from "@/lib/news";
import { NewsCard } from "@/components/NewsCard";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Toutes les nouvelles du Saint Rambert Tennis Club : tournois, stages, vie du club.",
  alternates: { canonical: "/actualites" },
};

export default function ActualitesPage() {
  const posts = getAllPosts();

  return (
    <>
      <PageHero
        eyebrow="Actualités"
        title="La vie du club"
        intro="Tournois, stages, créneaux, événements : tout ce qui se passe au Saint Rambert Tennis Club."
      />
      <section className="mx-auto max-w-6xl px-5 py-16">
        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <NewsCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-muted">Pas encore d&apos;actualités. Revenez bientôt.</p>
        )}
      </section>
    </>
  );
}

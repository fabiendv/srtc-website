import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Lightbulb, Home, LayoutGrid, ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { getLatestPosts } from "@/lib/news";
import { NewsCard } from "@/components/NewsCard";

export const dynamic = "force-static";

const FEATURES = [
  { icon: LayoutGrid, title: `${site.courts.count} courts`, text: "Quatre courts entretenus, ouverts aux membres toute l'année." },
  { icon: Lightbulb, title: "Éclairage nocturne", text: "On joue jusqu'à 22h en semaine grâce à l'éclairage des courts." },
  { icon: Home, title: "Club-house", text: "Un lieu convivial pour se retrouver avant et après le jeu." },
];

export default function HomePage() {
  const latest = getLatestPosts(3);

  return (
    <>
      {/* Hero — the LCP element. next/image with priority (preloaded, not lazy). */}
      <section className="relative isolate">
        <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden">
          <Image
            src="/photos/hero.jpg"
            alt="Les courts du Saint Rambert Tennis Club"
            fill
            priority
            sizes="100vw"
            placeholder="empty"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/30 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-6xl px-5 pb-12">
              <p className="text-sm font-medium uppercase tracking-widest text-cream/80">
                Lyon 9e — Saint-Rambert
              </p>
              <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight text-cream sm:text-6xl">
                Le tennis au pied des coteaux
              </h1>
              <p className="mt-4 max-w-xl text-lg text-cream/90">{site.tagline}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/le-club"
                  className="rounded-full bg-clay px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-clay-dark"
                >
                  Rejoindre le club
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-cream/40 px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-cream/10"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest news */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-clay">Actualités</p>
            <h2 className="mt-2 font-serif text-3xl text-forest">Les dernières nouvelles du club</h2>
          </div>
          <Link href="/actualites" className="hidden shrink-0 items-center gap-1 text-sm font-medium text-clay hover:gap-2 sm:inline-flex">
            Toutes les actualités <ArrowRight size={16} />
          </Link>
        </div>

        {latest.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((post) => (
              <NewsCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-muted">Pas encore d&apos;actualités. Revenez bientôt.</p>
        )}
      </section>

      {/* Courts summary */}
      <section className="bg-cream-deep/40 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-medium uppercase tracking-widest text-clay">Le club</p>
          <h2 className="mt-2 max-w-2xl font-serif text-3xl text-forest">
            Quatre courts, un club-house, et de quoi jouer du matin au soir
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-line bg-white/40 p-6">
                <f.icon className="text-clay" size={28} strokeWidth={1.5} />
                <h3 className="mt-4 font-serif text-xl text-forest">{f.title}</h3>
                <p className="mt-2 text-sm text-muted">{f.text}</p>
              </div>
            ))}
          </div>
          <Link href="/les-courts" className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-clay hover:gap-2">
            Découvrir les courts <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Address + hours */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-clay">Nous trouver</p>
            <h2 className="mt-2 font-serif text-3xl text-forest">Adresse &amp; horaires</h2>
            <div className="mt-6 space-y-4 text-ink">
              <p className="flex items-start gap-3">
                <MapPin className="mt-1 shrink-0 text-clay" size={20} />
                <span>
                  {site.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </p>
              <div className="flex items-start gap-3">
                <Clock className="mt-1 shrink-0 text-clay" size={20} />
                <ul className="space-y-1">
                  {site.hours.map((h) => (
                    <li key={h.label} className="flex justify-between gap-6">
                      <span>{h.label}</span>
                      <span className="text-muted">{h.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <a
            href={site.address.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-2xl border border-line"
            aria-label="Ouvrir l'emplacement du club sur la carte"
          >
            <Image
              src="/photos/entree.jpg"
              alt="Entrée du club"
              width={1200}
              height={800}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <span className="absolute bottom-4 left-4 rounded-full bg-cream px-4 py-2 text-sm font-medium text-forest shadow">
              Voir sur la carte
            </span>
          </a>
        </div>
      </section>

      {/* Contact banner — swappable for the Metadot ticket widget in phase 2. */}
      <section className="bg-forest">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl text-cream">Une question, une envie de jouer ?</h2>
            <p className="mt-2 max-w-xl text-cream/80">
              Écrivez-nous, on vous répond vite. Membres, futurs membres, ou simple curieux : tout le monde est le bienvenu.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-full bg-clay px-7 py-3 text-sm font-medium text-cream transition-colors hover:bg-clay-dark"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </>
  );
}

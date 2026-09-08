import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, Lightbulb, Home, Clock } from "lucide-react";
import { site } from "@/content/site";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Les courts",
  description: "Quatre courts éclairés, un club-house et les infos pratiques du Saint Rambert Tennis Club.",
  alternates: { canonical: "/les-courts" },
};

const DETAILS = [
  { icon: LayoutGrid, title: "Quatre courts", text: "Quatre courts entretenus tout au long de l'année, réservables par les membres." },
  { icon: Lightbulb, title: "Éclairage nocturne", text: "L'éclairage permet de jouer jusqu'à 22h en semaine, même quand les jours raccourcissent." },
  { icon: Home, title: "Club-house", text: "Un espace pour se poser, boire un verre et refaire le match entre amis." },
  { icon: Clock, title: "Accès", text: "Réservation des créneaux au club-house. Priorité aux membres, invités bienvenus selon disponibilité." },
];

export default function LesCourtsPage() {
  return (
    <>
      <PageHero
        eyebrow="Les courts"
        title="Quatre courts, éclairés, ouverts toute l'année"
        intro="Tout ce qu'il faut pour jouer au pied des coteaux de Saint-Rambert, du printemps à l'hiver."
      />

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-line">
          <Image
            src="/photos/courts.jpg"
            alt="Les courts du club"
            fill
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover"
          />
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {DETAILS.map((d) => (
            <div key={d.title} className="flex gap-4 rounded-2xl border border-line bg-white/40 p-6">
              <d.icon className="mt-1 shrink-0 text-clay" size={26} strokeWidth={1.5} />
              <div>
                <h2 className="font-serif text-xl text-forest">{d.title}</h2>
                <p className="mt-1 text-sm text-muted">{d.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-cream-deep/50 p-8">
          <h2 className="font-serif text-2xl text-forest">Horaires d&apos;ouverture</h2>
          <ul className="mt-4 max-w-md space-y-2">
            {site.hours.map((h) => (
              <li key={h.label} className="flex justify-between border-b border-line pb-2 last:border-0">
                <span>{h.label}</span>
                <span className="text-muted">{h.value}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            Une question sur les créneaux ou une réservation ?{" "}
            <Link href="/contact" className="font-medium text-clay underline">
              Contactez-nous
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}

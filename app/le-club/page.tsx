import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { site } from "@/content/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Le club",
  description: "L'histoire, le bureau et comment rejoindre le Saint Rambert Tennis Club à Lyon 9e.",
  alternates: { canonical: "/le-club" },
};

export default function LeClubPage() {
  return (
    <>
      <PageHero
        eyebrow="Le club"
        title="Un club de quartier, au pied de Fourvière"
        intro="Depuis Saint-Rambert, le SRTC réunit joueuses et joueurs de tous niveaux autour d'un tennis convivial."
      />

      <section className="mx-auto max-w-3xl px-5 py-14">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-line">
          <Image
            src="/photos/club.jpg"
            alt="Le club-house"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        <div className="prose-srtc mt-10">
          <h2>Notre histoire</h2>
          <p>
            Le Saint Rambert Tennis Club, c&apos;est d&apos;abord un lieu : quatre courts nichés dans le 9e
            arrondissement de Lyon, entre le Rhône et les coteaux. On y vient pour jouer, bien sûr, mais aussi
            pour la vie de club, les tournois de l&apos;été et les soirées au club-house.
          </p>
          {site.fftAffiliated && (
            <p>
              Le club est affilié à la Fédération Française de Tennis, ce qui permet à ses membres de
              participer aux compétitions officielles et de bénéficier d&apos;un encadrement diplômé.
            </p>
          )}

          <h2>Le bureau</h2>
          <p>
            Le club est animé par une équipe de bénévoles. Présidence, trésorerie, secrétariat et
            commission sportive font tourner le SRTC au quotidien.
            {" "}
            <em>Les noms du bureau seront précisés ici prochainement.</em>
          </p>

          <h2>Nous rejoindre</h2>
          <p>
            L&apos;adhésion est ouverte toute l&apos;année, aux joueuses et joueurs de tous niveaux, enfants
            comme adultes. Les tarifs et le bulletin d&apos;adhésion arrivent bientôt sur le site. En
            attendant, le plus simple est de nous écrire : on vous explique tout.
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-forest p-8 text-cream">
          <h2 className="font-serif text-2xl">Envie de nous rejoindre ?</h2>
          <p className="mt-2 text-cream/80">
            Écrivez-nous pour connaître les modalités d&apos;adhésion et venir essayer.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-block rounded-full bg-clay px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-clay-dark"
          >
            Contactez-nous
          </Link>
        </div>
      </section>
    </>
  );
}

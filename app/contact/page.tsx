import type { Metadata } from "next";
import { MapPin, Clock, Mail, Phone } from "lucide-react";
import { site } from "@/content/site";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "./ContactForm";
import { ThirdPartyWidgets } from "@/components/ThirdPartyWidgets";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez le Saint Rambert Tennis Club : formulaire, adresse, horaires et téléphone.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Écrivez-nous"
        intro="Une question, une envie d'adhérer, une réservation ? On vous répond vite."
      />

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <ContactForm />
          {/* Phase 2: the Metadot ticket widget mounts here (page-scoped, not site-wide). */}
          <ThirdPartyWidgets />
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-line bg-white/40 p-6">
            <h2 className="font-serif text-xl text-forest">Coordonnées</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 shrink-0 text-clay" size={18} />
                <span>
                  {site.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                  <a
                    href={site.address.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-clay underline"
                  >
                    Voir sur la carte
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="shrink-0 text-clay" size={18} />
                <a href={`mailto:${site.email}`} className="underline hover:text-clay">
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="shrink-0 text-clay" size={18} />
                <a href={`tel:${site.phone}`} className="hover:text-clay">
                  {site.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-white/40 p-6">
            <h2 className="flex items-center gap-2 font-serif text-xl text-forest">
              <Clock className="text-clay" size={18} /> Horaires
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {site.hours.map((h) => (
                <li key={h.label} className="flex justify-between border-b border-line pb-2 last:border-0">
                  <span>{h.label}</span>
                  <span className="text-muted">{h.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}

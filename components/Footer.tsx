import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-24 bg-forest text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-xl">{site.name}</p>
          <p className="mt-2 text-sm text-cream/70">{site.tagline}</p>
          {site.fftAffiliated && (
            <p className="mt-4 text-xs text-cream/60">Club affilié à la Fédération Française de Tennis</p>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-cream/60">Adresse</h2>
          <address className="mt-3 text-sm not-italic text-cream/90">
            {site.address.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <a
            href={site.address.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-cream/70 underline hover:text-cream"
          >
            Voir sur la carte
          </a>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-cream/60">Contact</h2>
          <ul className="mt-3 space-y-1 text-sm text-cream/90">
            <li>
              <a href={`mailto:${site.email}`} className="underline hover:text-cream">
                {site.email}
              </a>
            </li>
            <li>
              <a href={`tel:${site.phone}`} className="hover:text-cream">
                {site.phoneDisplay}
              </a>
            </li>
          </ul>
          {site.socials.length > 0 && (
            <ul className="mt-3 flex gap-4 text-sm text-cream/80">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-cream">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-cream/60">Horaires</h2>
          <ul className="mt-3 space-y-1 text-sm text-cream/90">
            {site.hours.map((h) => (
              <li key={h.label} className="flex justify-between gap-4">
                <span>{h.label}</span>
                <span className="text-cream/70">{h.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-5 py-5 text-xs text-cream/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <Link href="/mentions-legales" className="underline hover:text-cream">
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  );
}

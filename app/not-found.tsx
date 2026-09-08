import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-5 py-28 text-center">
      <p className="font-serif text-6xl text-clay">404</p>
      <h1 className="mt-4 font-serif text-3xl text-forest">Cette page n&apos;existe pas</h1>
      <p className="mt-3 text-muted">
        La page que vous cherchez a peut-être été déplacée, ou n&apos;a jamais existé. Retour au filet.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-clay px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-clay-dark"
      >
        Retour à l&apos;accueil
      </Link>
    </section>
  );
}

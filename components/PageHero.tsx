export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="border-b border-line bg-cream-deep/40">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        {eyebrow && (
          <p className="text-sm font-medium uppercase tracking-widest text-clay">{eyebrow}</p>
        )}
        <h1 className="mt-2 max-w-3xl font-serif text-4xl leading-tight text-forest sm:text-5xl">
          {title}
        </h1>
        {intro && <p className="mt-4 max-w-2xl text-lg text-muted">{intro}</p>}
      </div>
    </header>
  );
}

const workSamples = [
  "Selected project",
  "Case study",
  "Media feature",
  "Archive item",
];

export default function WorkPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Work
        </p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
          A browsable home for featured work samples.
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          Use this route for projects, outcomes, artifacts, media, or any
          portfolio evidence the owner wants to highlight.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {workSamples.map((sample) => (
          <article
            className="rounded-sm border border-foreground/10 bg-surface p-6"
            key={sample}
          >
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
              Work sample
            </p>
            <h2 className="mt-8 text-2xl font-semibold">{sample}</h2>
            <p className="mt-3 leading-7 text-muted">
              Placeholder for a CMS-powered summary, context, links, and media.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

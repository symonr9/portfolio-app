export default function AboutPage() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[0.78fr_1fr] lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          About
        </p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
          Profile details, experience, and expertise in one adaptable place.
        </h1>
      </div>
      <div className="space-y-6 text-lg leading-8 text-muted">
        <p>
          This page is reserved for a flexible personal narrative that can work
          for any portfolio owner, regardless of discipline, industry, or career
          stage.
        </p>
        <p>
          Future Contentful fields can provide biography, location, availability,
          expertise tags, credentials, testimonials, and resume-style history.
        </p>
      </div>
    </section>
  );
}

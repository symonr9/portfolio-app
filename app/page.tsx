import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="border-b border-foreground/10 bg-[linear-gradient(135deg,var(--surface),var(--background)_44%,var(--surface-warm))]">
        <div className="mx-auto grid min-h-[calc(100vh-73px)] w-full max-w-6xl items-center gap-12 px-5 py-16 sm:min-h-[680px] lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Editable personal portfolio
            </p>
            <h1 className="text-5xl font-semibold leading-[1.02] text-foreground sm:text-6xl lg:text-7xl">
              A flexible home for work, writing, experience, and contact.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              This foundation is ready for Contentful-backed content while
              keeping the interface calm, adaptable, and independent of any
              single career path or audience.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/work"
                className="inline-flex h-12 items-center justify-center rounded-sm bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                View work
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center justify-center rounded-sm border border-foreground/15 px-5 text-sm font-semibold transition-colors hover:bg-foreground/6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Learn more
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {["Profile", "Work samples", "Writing", "Experience"].map(
              (label, index) => (
                <div
                  className="rounded-sm border border-foreground/10 bg-background/72 p-5 shadow-[0_18px_60px_rgba(31,41,55,0.08)] backdrop-blur"
                  key={label}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-sm font-semibold">{label}</span>
                    <span className="font-mono text-xs text-muted">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-foreground/8">
                    <div
                      className="h-2 rounded-full bg-accent"
                      style={{ width: `${70 - index * 10}%` }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-16 md:grid-cols-3 lg:px-8">
        {[
          {
            title: "Structured content",
            body: "Profile details, work samples, writing, expertise tags, and experience can map cleanly to CMS entries.",
          },
          {
            title: "Reusable routes",
            body: "The starter navigation covers the core portfolio surfaces without assuming a specific profession or service model.",
          },
          {
            title: "Quiet visual system",
            body: "Neutral typography, restrained contrast, and a few warm accents establish direction without crowding future content.",
          },
        ].map((item) => (
          <article
            className="rounded-sm border border-foreground/10 bg-surface p-6"
            key={item.title}
          >
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-3 leading-7 text-muted">{item.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

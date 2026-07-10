export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Contact
        </p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
          A dedicated path for inquiries, collaboration, or conversation.
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          Connect this route to editable site settings for preferred contact
          methods, social links, and availability notes.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {["Email", "Social", "Availability"].map((item) => (
          <article
            className="rounded-sm border border-foreground/10 bg-surface p-6"
            key={item}
          >
            <h2 className="text-xl font-semibold">{item}</h2>
            <p className="mt-3 leading-7 text-muted">
              Placeholder for site settings content.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

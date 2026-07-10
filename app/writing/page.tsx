import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/site";

const posts = ["Long-form note", "Field reflection", "Resource roundup"];

export const metadata: Metadata = buildPageMetadata({
  title: "Writing",
  description:
    "Browse long-form entries, notes, updates, and resources from the portfolio.",
  path: "/writing",
});

export default function WritingPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Writing
        </p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
          A simple index for essays, updates, and notes.
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          This route can support blog posts, talks, resources, announcements,
          or other long-form entries from Contentful.
        </p>
      </div>

      <div className="mt-10 divide-y divide-foreground/10 border-y border-foreground/10">
        {posts.map((post) => (
          <article className="grid gap-3 py-6 md:grid-cols-[1fr_auto]" key={post}>
            <div>
              <h2 className="text-2xl font-semibold">{post}</h2>
              <p className="mt-2 leading-7 text-muted">
                Placeholder excerpt for a publishable content entry.
              </p>
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
              Draft
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

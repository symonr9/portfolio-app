import Link from "next/link";
import { getHomePageData } from "@/lib/contentful";
import { ContentfulImage, MediaPlaceholder } from "./_components/contentful-image";

export default async function Home() {
  const { expertiseTags, featuredPosts, featuredWork, profile } =
    await getHomePageData();

  return (
    <div>
      <section className="border-b border-foreground/10 bg-[linear-gradient(135deg,var(--surface),var(--background)_48%,rgba(49,95,114,0.16))]">
        <div className="mx-auto grid min-h-[calc(100vh-73px)] w-full max-w-6xl items-center gap-12 px-5 py-16 sm:min-h-[680px] lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              {profile.name}
            </p>
            <h1 className="text-5xl font-semibold leading-[1.02] text-foreground sm:text-6xl lg:text-7xl">
              {profile.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              {profile.shortBio}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/work"
                className="inline-flex h-12 items-center justify-center rounded-sm bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                View work
              </Link>
              <Link
                href="/blog"
                className="inline-flex h-12 items-center justify-center rounded-sm border border-foreground/15 px-5 text-sm font-semibold transition-colors hover:bg-foreground/6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Read blog
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {featuredWork.map((sample, index) => (
              <Link
                className="group rounded-sm border border-foreground/10 bg-background/72 p-5 shadow-[0_18px_60px_rgba(31,41,55,0.08)] backdrop-blur transition-transform hover:-translate-y-1"
                href={`/work/${sample.slug}`}
                key={sample.slug}
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-sm font-semibold">{sample.title}</span>
                  <span className="font-mono text-xs text-muted">
                    0{index + 1}
                  </span>
                </div>
                {sample.featuredImage ? (
                  <ContentfulImage
                    className="mb-5 aspect-[16/9] w-full rounded-sm object-cover"
                    image={sample.featuredImage}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                ) : (
                  <MediaPlaceholder className="mb-5 aspect-[16/9] rounded-sm" />
                )}
                <p className="leading-7 text-muted">{sample.summary}</p>
                <span className="mt-4 inline-flex text-sm font-semibold text-accent group-hover:text-foreground">
                  View detail
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[0.72fr_1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Featured expertise
          </p>
          <h2 className="mt-4 text-3xl font-semibold">
            Editable content across the core portfolio surfaces.
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {expertiseTags.map((tag) => (
              <span
                className="rounded-sm border border-foreground/10 bg-surface px-3 py-2 text-sm text-muted"
                key={tag.slug}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
        <div className="divide-y divide-foreground/10 border-y border-foreground/10">
          {featuredPosts.map((post) => (
            <article className="py-6" key={post.slug}>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                {post.publishDate} / {post.readingTime}
              </p>
              <h3 className="mt-3 text-2xl font-semibold">{post.title}</h3>
              <p className="mt-3 leading-7 text-muted">{post.excerpt}</p>
              <Link
                className="mt-4 inline-flex text-sm font-semibold text-accent hover:text-foreground"
                href={`/blog/${post.slug}`}
              >
                Read post
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

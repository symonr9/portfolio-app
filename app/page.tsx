import Link from "next/link";
import Image from "next/image";
import { getContentfulDraftOptions, getHomePageData } from "@/lib/contentful";
import { ContentfulImage, MediaPlaceholder } from "./_components/contentful-image";

export default async function Home() {
  const contentfulOptions = await getContentfulDraftOptions();
  const { expertiseTags, featuredPosts, featuredWork, profile } =
    await getHomePageData(contentfulOptions);

  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-foreground/10 bg-foreground">
        <Image
          src="/filoli.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-black/62" />
        <div className="mx-auto flex min-h-[calc(78vh-73px)] w-full max-w-6xl items-center px-5 py-20 sm:min-h-[560px] sm:py-24 lg:px-8">
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-white/75">
              {profile.name}
            </p>
            <h1 className="break-words text-2xl font-semibold leading-snug text-white sm:text-3xl">
              {profile.headline}
            </h1>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/work"
                className="inline-flex h-12 items-center justify-center rounded-sm bg-white px-5 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                View portfolio
              </Link>
              <Link
                href="/blog"
                className="inline-flex h-12 items-center justify-center rounded-sm border border-white/55 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Read blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-foreground/10 bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="max-w-3xl flex-1 text-lg leading-8 text-muted">
            {profile.shortBio}
          </p>
          {profile.avatar ? (
            <ContentfulImage
              className="size-36 shrink-0 rounded-sm border border-foreground/10 object-cover shadow-[0_18px_60px_rgba(31,41,55,0.08)] sm:size-40 lg:size-44"
              image={profile.avatar}
              sizes="(min-width: 1024px) 176px, (min-width: 640px) 160px, 144px"
            />
          ) : null}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-5 py-16 lg:grid-cols-3 lg:px-8">
        {featuredWork.map((sample, index) => (
          <Link
            className="group rounded-sm border border-foreground/10 bg-background/72 p-5 shadow-[0_18px_60px_rgba(31,41,55,0.08)] backdrop-blur transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            href={`/work/${sample.slug}`}
            key={sample.slug}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="break-words text-sm font-semibold">{sample.title}</span>
              <span className="font-mono text-xs text-muted">
                0{index + 1}
              </span>
            </div>
            {sample.featuredImage ? (
              <ContentfulImage
                className="mb-5 aspect-[16/9] w-full rounded-sm object-cover"
                image={sample.featuredImage}
                sizes="(min-width: 1024px) 33vw, 100vw"
              />
            ) : (
              <MediaPlaceholder className="mb-5 aspect-[16/9] rounded-sm" />
            )}
            <p className="leading-7 text-muted">{sample.summary}</p>
            <span className="mt-4 inline-flex text-sm font-semibold text-accent group-hover:text-foreground group-focus-visible:text-foreground">
              View detail
            </span>
          </Link>
        ))}
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[0.72fr_1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Featured expertise
          </p>
          <h2 className="mt-4 break-words text-3xl font-semibold">
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
              <p className="break-words font-mono text-xs uppercase tracking-[0.16em] text-muted">
                {post.publishDate} / {post.readingTime}
              </p>
              <h3 className="mt-3 break-words text-2xl font-semibold">{post.title}</h3>
              <p className="mt-3 leading-7 text-muted">{post.excerpt}</p>
              <Link
                className="mt-4 inline-flex rounded-sm text-sm font-semibold text-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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

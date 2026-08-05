import Link from "next/link";
import Image from "next/image";
import { getContentfulDraftOptions, getHomePageData } from "@/lib/contentful";
import { summarizeText } from "@/lib/summarize-text";
import { ContentfulImage, MediaPlaceholder } from "./_components/contentful-image";

export default async function Home() {
  const contentfulOptions = await getContentfulDraftOptions();
  const { featuredWork, profile } = await getHomePageData(contentfulOptions);

  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-foreground/10 bg-foreground">
        <Image
          src="/coverphoto.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-hero-overlay/62" />
        <div className="mx-auto flex min-h-[calc(78vh-73px)] w-full max-w-6xl items-center px-5 py-20 sm:min-h-[560px] sm:py-24 lg:px-8">
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-foreground-light/75">
              {profile.name}
            </p>
            <h1 className="break-words text-3xl font-semibold leading-snug text-foreground-light sm:text-4xl">
              {profile.smallHeadline ?? profile.headline}
            </h1>
            {profile.smallHeadline ? (
              <p className="mt-5 max-w-3xl text-lg leading-8 text-foreground-light/85">
                {profile.headline}
              </p>
            ) : null}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/work"
                className="inline-flex h-12 items-center justify-center rounded-sm bg-foreground-light px-5 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                My portfolio
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center justify-center rounded-sm border border-foreground-light/55 px-5 text-sm font-semibold text-foreground-light transition-colors hover:bg-foreground-light/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                About me
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-sm border border-foreground-light/55 px-5 text-sm font-semibold text-foreground-light transition-colors hover:bg-foreground-light/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Contact me
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-foreground/10 bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="max-w-3xl flex-1 text-lg leading-8 text-muted">
            {summarizeText(profile.shortBio)}
          </p>
          {profile.avatar ? (
            <ContentfulImage
              className="size-36 shrink-0 rounded-sm border border-foreground/10 object-cover shadow-[0_18px_60px_var(--shadow-soft)] sm:size-40 lg:size-44"
              image={profile.avatar}
              sizes="(min-width: 1024px) 176px, (min-width: 640px) 160px, 144px"
            />
          ) : null}
        </div>
      </section>

      {featuredWork.length > 0 ? (
        <section className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-text">
            Featured work
          </p>
          <h2 className="mt-4 break-words text-3xl font-semibold">
            Selected work
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredWork.map((sample, index) => (
              <Link
                className="group rounded-sm border border-foreground/10 bg-background/22 p-5 shadow-[0_18px_60px_var(--shadow-soft)] backdrop-blur transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                href={`/work/${sample.slug}`}
                key={sample.slug}
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="break-words text-sm font-semibold">
                    {sample.title}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                {sample.featuredImage ? (
                  <ContentfulImage
                    className="mb-5 aspect-[16/9] w-full rounded-sm object-cover"
                    image={sample.featuredImage}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                ) : (
                  <MediaPlaceholder className="mb-5 aspect-[16/9] rounded-sm" />
                )}
                <p className="leading-7 text-muted">{sample.summary}</p>
                <span className="mt-4 inline-flex text-sm font-semibold text-accent-text group-hover:text-foreground group-focus-visible:text-foreground">
                  View detail
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

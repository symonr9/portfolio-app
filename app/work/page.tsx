import Link from "next/link";
import { getWorkSamples } from "@/lib/contentful";
import { ContentfulImage, MediaPlaceholder } from "../_components/contentful-image";
import { TagFilterNav } from "../_components/tag-filter-nav";
import type { Tag } from "@/lib/contentful";

type WorkPageProps = {
  searchParams: Promise<{ tag?: string | string[] }>;
};

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const selectedTag = getSelectedTag((await searchParams).tag);
  const workSamples = await getWorkSamples();
  const tags = getUniqueTags(workSamples.flatMap((sample) => sample.tags));
  const filteredSamples = selectedTag
    ? workSamples.filter((sample) =>
        sample.tags.some((tag) => tag.slug === selectedTag),
      )
    : workSamples;

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Work
        </p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
          Selected work samples with context, process, and outcomes.
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          Selected entries from Contentful with summaries, tags, roles,
          outcomes, and detail-page narratives.
        </p>
        <TagFilterNav basePath="/work" selectedTag={selectedTag} tags={tags} />
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {filteredSamples.map((sample) => (
          <Link
            className="group rounded-sm border border-foreground/10 bg-surface p-6 transition-transform hover:-translate-y-1"
            href={`/work/${sample.slug}`}
            key={sample.slug}
          >
            {sample.featuredImage ? (
              <ContentfulImage
                className="mb-6 aspect-[16/9] w-full rounded-sm object-cover"
                image={sample.featuredImage}
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            ) : (
              <MediaPlaceholder className="mb-6 aspect-[16/9] rounded-sm" />
            )}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                {sample.type}
              </span>
              {sample.featured ? (
                <span className="rounded-sm bg-accent px-2 py-1 text-xs font-semibold text-accent-contrast">
                  Featured
                </span>
              ) : null}
            </div>
            <h2 className="mt-8 text-2xl font-semibold">{sample.title}</h2>
            <p className="mt-3 leading-7 text-muted">
              {sample.summary}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {sample.tags.map((tag) => (
                <span
                  className="rounded-sm border border-foreground/10 px-2 py-1 text-xs text-muted"
                  key={tag.slug}
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <span className="mt-6 inline-flex text-sm font-semibold text-accent group-hover:text-foreground">
              View case detail
            </span>
          </Link>
        ))}
      </div>
      {!filteredSamples.length ? (
        <p className="mt-10 rounded-sm border border-foreground/10 bg-surface p-6 text-muted">
          No work samples match this tag.
        </p>
      ) : null}
    </section>
  );
}

function getSelectedTag(tag?: string | string[]) {
  return Array.isArray(tag) ? tag[0] : tag;
}

function getUniqueTags(tags: Tag[]) {
  return Array.from(new Map(tags.map((tag) => [tag.slug, tag])).values()).sort(
    (first, second) => first.name.localeCompare(second.name),
  );
}

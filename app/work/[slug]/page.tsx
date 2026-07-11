import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getContentfulDraftOptions,
  getWorkSampleBySlug,
  getWorkSampleSlugParams,
} from "@/lib/contentful";
import { buildPageMetadata } from "@/lib/site";
import { ContentfulImage, MediaPlaceholder } from "../../_components/contentful-image";
import { MediaEmbed } from "../../_components/media-embed";
import { RichTextRenderer } from "../../_components/rich-text-renderer";

type WorkDetailProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export function generateStaticParams() {
  return getWorkSampleSlugParams();
}

export async function generateMetadata({
  params,
}: WorkDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const contentfulOptions = await getContentfulDraftOptions();
  const sample = await getWorkSampleBySlug(slug, contentfulOptions);

  if (!sample) {
    return {};
  }

  return buildPageMetadata({
    title: sample.title,
    description: sample.summary,
    image: sample.featuredImage?.url,
    path: `/work/${sample.slug}`,
    type: "article",
  });
}

export default async function WorkDetailPage({ params }: WorkDetailProps) {
  const { slug } = await params;
  const contentfulOptions = await getContentfulDraftOptions();
  const sample = await getWorkSampleBySlug(slug, contentfulOptions);

  if (!sample) {
    notFound();
  }

  return (
    <article>
      <section className="border-b border-foreground/10">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[0.92fr_0.58fr] lg:px-8">
          <div>
            <Link
              className="inline-flex rounded-sm text-sm font-semibold text-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              href="/work"
            >
              Back to portfolio
            </Link>
            <p className="mt-8 break-words font-mono text-xs uppercase tracking-[0.16em] text-muted">
              {sample.type} / {sample.publishDate}
            </p>
            <h1 className="mt-4 break-words text-4xl font-semibold leading-tight sm:text-6xl">
              {sample.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              {sample.summary}
            </p>
          </div>
          <aside className="rounded-sm border border-foreground/10 bg-surface p-5 sm:p-6">
            {sample.featuredImage ? (
              <ContentfulImage
                className="mb-6 aspect-[16/9] w-full rounded-sm object-cover"
                image={sample.featuredImage}
                priority
                sizes="(min-width: 1024px) 34vw, 100vw"
              />
            ) : (
              <MediaPlaceholder className="mb-6 aspect-[16/9] rounded-sm" />
            )}
            <dl className="grid gap-4 text-sm">
              {[
                ["Organization", sample.organization],
                ["Role", sample.role],
                ["Published", sample.publishDate],
              ]
                .filter(([, value]) => Boolean(value))
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                      {label}
                    </dt>
                    <dd className="mt-1 break-words font-semibold">{value}</dd>
                  </div>
                ))}
            </dl>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[0.65fr_1fr] lg:px-8">
        <div>
          <h2 className="break-words text-3xl font-semibold">Overview</h2>
          <p className="mt-4 leading-7 text-muted">
            {sample.beforeText ?? sample.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {sample.tags.map((tag) => (
              <span
                className="rounded-sm border border-foreground/10 bg-surface px-3 py-2 text-sm text-muted break-words"
                key={tag.slug}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h2 className="break-words text-3xl font-semibold">Detail</h2>
          <RichTextRenderer
            className="mt-6 space-y-6"
            content={sample.body}
            fallback={sample.afterText}
          />
          <MediaEmbed
            embedUrl={sample.embedUrl}
            title={`${sample.title} media`}
            videoUrl={sample.videoUrl}
          />
          {sample.gallery.length ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {sample.gallery.map((image) => (
                <ContentfulImage
                  className="aspect-[4/3] w-full rounded-sm border border-foreground/10 object-cover"
                  image={image}
                  key={image.id}
                  sizes="(min-width: 640px) 50vw, 100vw"
                />
              ))}
            </div>
          ) : null}
          {sample.outcome ? (
            <div className="mt-10 rounded-sm border border-foreground/10 bg-surface p-6">
              <h2 className="text-2xl font-semibold">Outcome</h2>
              <p className="mt-4 leading-7 text-muted">{sample.outcome}</p>
            </div>
          ) : null}
        </div>
      </section>
    </article>
  );
}

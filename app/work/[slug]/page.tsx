import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getContentfulDraftOptions,
  getWorkSampleBySlug,
  getWorkSampleSlugParams,
} from "@/lib/contentful";
import { buildPageMetadata } from "@/lib/site";
import { formatDate } from "@/lib/format-date";
import type { RichTextNode } from "@/lib/contentful";
import { MediaGallery } from "../../_components/media-gallery";
import {
  ExternalMediaCard,
  MediaEmbed,
} from "../../_components/media-embed";
import {
  MarkdownInline,
  MarkdownRenderer,
} from "../../_components/markdown-renderer";
import { RichTextRenderer } from "../../_components/rich-text-renderer";
import { WorkDetailTabs, type WorkDetailPanel } from "./work-detail-tabs";
import styles from "./work-detail.module.css";

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

  const primaryMediaUrl = sample.embedUrl ?? sample.videoUrl;
  const galleryItems =
    sample.gallery.length > 0
      ? sample.gallery
      : sample.featuredImage
        ? [
            {
              ...sample.featuredImage,
              fileName: "",
            },
          ]
        : [];
  const displayedMediaUrls = sample.gallery.length
    ? sample.gallery.map((item) => item.url)
    : primaryMediaUrl
      ? [primaryMediaUrl]
      : sample.featuredImage
        ? [sample.featuredImage.url]
        : [];
  const showPrimaryMediaInLinks = Boolean(
    primaryMediaUrl &&
      !displayedMediaUrls.some((url) =>
        urlsReferToSameResource(primaryMediaUrl, url),
      ),
  );
  const showExternalUrlInLinks = Boolean(
    sample.externalUrl &&
      !displayedMediaUrls.some((url) =>
        urlsReferToSameResource(sample.externalUrl, url),
      ) &&
      !urlsReferToSameResource(sample.externalUrl, primaryMediaUrl),
  );
  const hasDetails = Boolean(
    sample.afterText?.trim() ||
      sample.body?.json?.content?.some(hasRichTextNodeContent),
  );
  const hasLinksPanel = showPrimaryMediaInLinks || showExternalUrlInLinks;
  const panels: WorkDetailPanel[] = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div>
          <h2 className="text-xl font-semibold">Overview</h2>
          <MarkdownRenderer className="mt-3 space-y-3 text-sm">
            {sample.beforeText ?? sample.summary}
          </MarkdownRenderer>
          <dl className="mt-5 grid gap-3 border-t border-foreground/10 pt-4 text-sm sm:grid-cols-2">
            {[
              ["Organization", sample.organization],
              ["Role", sample.role],
              ["Published", formatDate(sample.publishDate)],
            ]
              .filter(([, value]) => Boolean(value))
              .map(([label, value]) => (
                <div className="min-w-0" key={label}>
                  <dt className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">
                    {label}
                  </dt>
                  <dd className="mt-1 break-words font-semibold">{value}</dd>
                </div>
              ))}
          </dl>
          {sample.tags.length ? (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {sample.tags.map((tag) => (
                <span
                  className="break-words rounded-sm border border-foreground/10 bg-background px-2.5 py-1.5 text-xs text-muted"
                  key={tag.slug}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ),
    },
    ...(hasDetails
      ? [
          {
            id: "detail",
            label: "Details",
            content: (
              <div>
                <h2 className="text-xl font-semibold">Details</h2>
                <RichTextRenderer
                  className="mt-3 space-y-4 text-sm"
                  content={sample.body}
                  fallback={sample.afterText}
                />
              </div>
            ),
          },
        ]
      : []),
    ...(hasLinksPanel
      ? [
          {
            id: "links",
            label: "Links & media",
            content: (
              <div>
                <h2 className="text-xl font-semibold">Links & media</h2>
                <div className="mt-4 space-y-4">
                  {showPrimaryMediaInLinks ? (
                    <MediaEmbed
                      embedUrl={sample.embedUrl}
                      previewImage={sample.featuredImage}
                      title={`${sample.title} media`}
                      videoUrl={sample.videoUrl}
                    />
                  ) : null}
                  {showExternalUrlInLinks && sample.externalUrl ? (
                    <ExternalMediaCard
                      previewImage={sample.featuredImage}
                      sourceUrl={sample.externalUrl}
                    />
                  ) : null}
                </div>
              </div>
            ),
          },
        ]
      : []),
    ...(sample.outcome
      ? [
          {
            id: "outcome",
            label: "Outcome",
            content: (
              <div>
                <h2 className="text-xl font-semibold">Outcome</h2>
                <MarkdownRenderer className="mt-3 space-y-3 text-sm">
                  {sample.outcome}
                </MarkdownRenderer>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <article className={`${styles.shell} work-detail-shell`}>
      <header className={styles.identity}>
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <Link
              className="inline-flex shrink-0 rounded-sm text-xs font-semibold text-accent-text hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              href="/work"
            >
              ← Portfolio
            </Link>
            <p className="break-words font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
              {formatType(sample.type)} · {formatDate(sample.publishDate)}
            </p>
          </div>
          <h1 className="mt-1 break-words text-xl font-semibold leading-tight sm:text-2xl">
            {sample.title}
          </h1>
          <p className="mt-1 break-words text-sm leading-5 text-muted">
            <MarkdownInline>{sample.summary}</MarkdownInline>
          </p>
        </div>

        <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
          <dl className="hidden gap-x-4 text-xs xl:flex">
            {[
              ["Organization", sample.organization],
              ["Role", sample.role],
            ]
              .filter(([, value]) => Boolean(value))
              .map(([label, value]) => (
                <div className="min-w-0" key={label}>
                  <dt className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">
                    {label}
                  </dt>
                  <dd className="max-w-44 break-words font-semibold leading-5">
                    {value}
                  </dd>
                </div>
              ))}
          </dl>
          {primaryMediaUrl ? (
            <a
              className="inline-flex min-h-9 items-center rounded-sm border border-foreground/15 px-3 text-xs font-semibold transition-colors hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              href={primaryMediaUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open media
            </a>
          ) : null}
          {sample.externalUrl ? (
            <a
              className="inline-flex min-h-9 items-center rounded-sm bg-foreground px-3 text-xs font-semibold text-background transition-colors hover:bg-accent hover:text-accent-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              href={sample.externalUrl}
              rel="noreferrer"
              target="_blank"
            >
              Visit project
            </a>
          ) : null}
        </div>
      </header>

      <div className={styles.workspace}>
        <div className="min-h-0">
          {sample.gallery.length ? (
            <MediaGallery items={sample.gallery} />
          ) : primaryMediaUrl ? (
            <div className="flex h-full min-h-0 flex-col overflow-auto rounded-sm border border-foreground/10 bg-surface p-3">
              <div className="mb-2 flex items-center justify-between gap-4 px-1">
                <h2 className="text-sm font-semibold">Featured media</h2>
                <span className="font-mono text-xs text-muted">1 / 1</span>
              </div>
              <div className="min-h-0 flex-1">
                <MediaEmbed
                  embedUrl={sample.embedUrl}
                  previewImage={sample.featuredImage}
                  priority
                  title={`${sample.title} media`}
                  videoUrl={sample.videoUrl}
                />
              </div>
            </div>
          ) : galleryItems.length ? (
            <MediaGallery items={galleryItems} />
          ) : (
            <div className={styles.emptyMedia}>
              <div className="p-6 text-center">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                  Work sample
                </p>
                <p className="mt-2 text-lg font-semibold">{sample.title}</p>
              </div>
            </div>
          )}
        </div>

        <div className="min-h-0">
          <WorkDetailTabs panels={panels} />
        </div>
      </div>
    </article>
  );
}

function formatType(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function hasRichTextNodeContent(node: RichTextNode): boolean {
  if (node.nodeType === "text") {
    return Boolean(node.value?.trim());
  }

  if (node.nodeType === "embedded-asset-block") {
    return true;
  }

  return Boolean(node.content?.some(hasRichTextNodeContent));
}

function urlsReferToSameResource(
  firstUrl: string | null,
  secondUrl: string | null,
) {
  if (!firstUrl || !secondUrl) {
    return false;
  }

  try {
    return normalizeComparableUrl(firstUrl) === normalizeComparableUrl(secondUrl);
  } catch {
    return firstUrl === secondUrl;
  }
}

function normalizeComparableUrl(value: string) {
  const url = new URL(value);
  const pathname = url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "");
  return `${url.origin}${pathname}${url.search}${url.hash}`;
}

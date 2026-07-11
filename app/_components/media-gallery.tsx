import { ContentfulImage } from "./contentful-image";
import type {
  ContentfulImage as ContentfulImageData,
  ContentfulMediaAsset,
} from "@/lib/contentful";

type MediaGalleryProps = {
  items: ContentfulMediaAsset[];
};

const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];

export function MediaGallery({ items }: MediaGalleryProps) {
  if (!items.length) {
    return null;
  }

  return (
    <section aria-labelledby="work-gallery-heading" className="mt-10">
      <h2 id="work-gallery-heading" className="break-words text-3xl font-semibold">
        Gallery
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <GalleryItem item={item} key={item.id} />
        ))}
      </div>
    </section>
  );
}

function GalleryItem({ item }: { item: ContentfulMediaAsset }) {
  if (isImage(item)) {
    const image = toContentfulImage(item);

    return (
      <figure className="overflow-hidden rounded-sm border border-foreground/10 bg-surface">
        <ContentfulImage
          className="aspect-[4/3] w-full object-cover"
          image={image}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <MediaCaption item={item} />
      </figure>
    );
  }

  if (isVideo(item)) {
    return (
      <figure className="overflow-hidden rounded-sm border border-foreground/10 bg-surface">
        <video
          className="aspect-video w-full bg-foreground/5"
          controls
          preload="metadata"
          src={item.url}
        >
          <a href={item.url}>Open video</a>
        </video>
        <MediaCaption item={item} />
      </figure>
    );
  }

  return (
    <article className="flex min-h-36 flex-col justify-between rounded-sm border border-foreground/10 bg-surface p-5">
      <div>
        <p className="break-words text-lg font-semibold">{item.title}</p>
        {item.description ? (
          <p className="mt-2 break-words text-sm leading-6 text-muted">
            {item.description}
          </p>
        ) : null}
        <p className="mt-3 break-words font-mono text-xs uppercase tracking-[0.16em] text-muted">
          {formatContentType(item.contentType)}
        </p>
      </div>
      <a
        className="mt-5 inline-flex w-fit rounded-sm bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent hover:text-accent-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        download={item.fileName}
        href={item.url}
        rel="noreferrer"
        target="_blank"
      >
        Download file
      </a>
    </article>
  );
}

function MediaCaption({ item }: { item: ContentfulMediaAsset }) {
  if (!item.title && !item.description) {
    return null;
  }

  return (
    <figcaption className="space-y-1 p-4">
      <p className="break-words text-sm font-semibold">{item.title}</p>
      {item.description ? (
        <p className="break-words text-sm leading-6 text-muted">
          {item.description}
        </p>
      ) : null}
    </figcaption>
  );
}

function isImage(item: ContentfulMediaAsset) {
  return Boolean(
    item.contentType?.startsWith("image/") && item.width && item.height,
  );
}

function toContentfulImage(item: ContentfulMediaAsset): ContentfulImageData {
  return {
    id: item.id,
    url: item.url,
    title: item.title,
    description: item.description,
    width: item.width ?? 1,
    height: item.height ?? 1,
    contentType: item.contentType,
  };
}

function isVideo(item: ContentfulMediaAsset) {
  if (item.contentType?.startsWith("video/")) {
    return true;
  }

  const pathname = safePathname(item.url);
  return videoExtensions.some((extension) => pathname.endsWith(extension));
}

function safePathname(url: string) {
  try {
    return new URL(url).pathname.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function formatContentType(contentType: string | null) {
  return contentType?.replace("/", " / ") ?? "File";
}

import { ContentfulImage } from "./contentful-image";
import type { ContentfulImage as ContentfulImageData } from "@/lib/contentful";

type MediaEmbedProps = {
  embedUrl?: string | null;
  previewImage?: ContentfulImageData | null;
  videoUrl?: string | null;
  title: string;
};

const directVideoExtensions = [".mp4", ".webm", ".ogg"];

export function MediaEmbed({
  embedUrl,
  previewImage,
  title,
  videoUrl,
}: MediaEmbedProps) {
  const sourceUrl = embedUrl ?? videoUrl;

  if (!sourceUrl) {
    return null;
  }

  const embed = getEmbedUrl(sourceUrl);

  if (embed) {
    return (
      <div className="overflow-hidden rounded-sm border border-foreground/10 bg-surface">
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="aspect-video w-full"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          src={embed}
          title={title}
        />
      </div>
    );
  }

  if (isDirectVideo(sourceUrl)) {
    return (
      <video
        className="aspect-video w-full rounded-sm border border-foreground/10 bg-foreground/5"
        controls
        preload="metadata"
        src={sourceUrl}
      >
        <a href={sourceUrl}>Open video</a>
      </video>
    );
  }

  return (
    <ExternalMediaCard previewImage={previewImage} sourceUrl={sourceUrl} />
  );
}

export function ExternalMediaCard({
  previewImage,
  sourceUrl,
}: {
  previewImage?: ContentfulImageData | null;
  sourceUrl: string;
}) {
  const metadata = getExternalPageMetadata(sourceUrl);

  if (!metadata) {
    return null;
  }

  return (
    <article className="mt-6 min-w-0 max-w-full overflow-hidden rounded-sm border border-foreground/10 bg-surface">
      <div className="relative aspect-video overflow-hidden border-b border-foreground/10 bg-[linear-gradient(135deg,var(--surface-warm),var(--background))]">
        {previewImage ? (
          <ContentfulImage
            className="h-full min-w-0 max-w-full object-contain"
            image={previewImage}
            sizes="(min-width: 1024px) 640px, 100vw"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center p-6 text-center"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                Featured image unavailable
              </p>
              <p className="mt-2 break-all text-lg font-semibold">
                {metadata.hostname}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
            External page
          </p>
          <p className="mt-1 truncate font-semibold">{metadata.hostname}</p>
          <p className="mt-1 truncate text-sm text-muted">{metadata.path}</p>
        </div>
        <a
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-sm bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent hover:text-accent-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          href={metadata.url}
          rel="noreferrer"
          target="_blank"
        >
          Open media
          <span className="sr-only"> from {metadata.hostname}</span>
        </a>
      </div>
    </article>
  );
}

function getExternalPageMetadata(sourceUrl: string) {
  try {
    const url = new URL(sourceUrl);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return {
      hostname: url.hostname.replace(/^www\./, ""),
      path: `${url.pathname}${url.search}` || "/",
      url: url.toString(),
    };
  } catch {
    return null;
  }
}

function getEmbedUrl(sourceUrl: string) {
  try {
    const url = new URL(sourceUrl);
    const hostname = url.hostname.replace(/^www\./, "");

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (hostname === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (hostname === "player.vimeo.com") {
      return url.toString();
    }

    if (hostname === "vimeo.com") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }

    if (hostname.endsWith("spotify.com") && url.pathname.includes("/embed/")) {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}

function isDirectVideo(sourceUrl: string) {
  try {
    const pathname = new URL(sourceUrl).pathname.toLowerCase();
    return directVideoExtensions.some((extension) => pathname.endsWith(extension));
  } catch {
    return false;
  }
}

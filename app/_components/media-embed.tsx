type MediaEmbedProps = {
  embedUrl?: string | null;
  videoUrl?: string | null;
  title: string;
};

const directVideoExtensions = [".mp4", ".webm", ".ogg"];

export function MediaEmbed({ embedUrl, title, videoUrl }: MediaEmbedProps) {
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
    <a
      className="inline-flex break-words rounded-sm font-semibold text-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      href={sourceUrl}
      rel="noreferrer"
      target="_blank"
    >
      Open media
    </a>
  );
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

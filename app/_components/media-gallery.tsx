"use client";

import { useState } from "react";
import { ContentfulImage } from "./contentful-image";
import { GalleryVideo } from "./gallery-video";
import type {
  ContentfulImage as ContentfulImageData,
  ContentfulMediaAsset,
} from "@/lib/contentful";
import { MarkdownRenderer } from "./markdown-renderer";

type MediaGalleryProps = {
  items: ContentfulMediaAsset[];
};

const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];

export function MediaGallery({ items }: MediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items.length) {
    return null;
  }

  const activeItem = items[Math.min(activeIndex, items.length - 1)];

  function showPrevious() {
    setActiveIndex((index) => (index - 1 + items.length) % items.length);
  }

  function showNext() {
    setActiveIndex((index) => (index + 1) % items.length);
  }

  return (
    <section
      aria-label="Work sample gallery"
      aria-roledescription="carousel"
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-sm border border-foreground/10 bg-surface"
    >
      <div className="flex items-center justify-between gap-4 border-b border-foreground/10 px-4 py-2.5">
        <h2 className="text-sm font-semibold">Gallery</h2>
        <p aria-live="polite" className="font-mono text-xs text-muted">
          {activeIndex + 1} / {items.length}
        </p>
      </div>

      <div className="min-h-0 flex-1">
        <GalleryItem item={activeItem} />
      </div>

      {items.length > 1 ? (
        <div
          aria-label="Choose gallery item"
          className="flex items-center justify-between gap-3 border-t border-foreground/10 px-3 py-2"
          role="group"
        >
          <button
            aria-label="Show previous gallery item"
            className="inline-flex min-h-9 items-center rounded-sm border border-foreground/15 px-3 text-sm font-semibold transition-colors hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={showPrevious}
            type="button"
          >
            ← Previous
          </button>
          <div aria-hidden="true" className="flex min-w-0 gap-1.5">
            {items.slice(0, 9).map((item, index) => (
              <span
                className={[
                  "h-1.5 rounded-full transition-[width,background-color]",
                  index === activeIndex
                    ? "w-6 bg-accent"
                    : "w-1.5 bg-foreground/20",
                ].join(" ")}
                key={item.id}
              />
            ))}
          </div>
          <button
            aria-label="Show next gallery item"
            className="inline-flex min-h-9 items-center rounded-sm border border-foreground/15 px-3 text-sm font-semibold transition-colors hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={showNext}
            type="button"
          >
            Next →
          </button>
        </div>
      ) : null}
    </section>
  );
}

function GalleryItem({ item }: { item: ContentfulMediaAsset }) {
  if (isImage(item)) {
    return (
      <figure className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto]">
        <div className="relative min-h-0 bg-foreground/5">
          <ContentfulImage
            className="absolute inset-0 h-full w-full object-contain"
            image={toContentfulImage(item)}
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
          />
        </div>
        <MediaCaption item={item} />
      </figure>
    );
  }

  if (isVideo(item)) {
    return (
      <figure className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto]">
        <div className="min-h-0 overflow-hidden">
          <GalleryVideo
            height={item.height}
            title={item.title}
            url={item.url}
            width={item.width}
          />
        </div>
        <MediaCaption item={item} />
      </figure>
    );
  }

  return (
    <article className="flex h-full min-h-0 flex-col items-center justify-center overflow-auto p-6 text-center">
      <p className="break-words text-lg font-semibold">{item.title}</p>
      {item.description ? (
        <p className="mt-2 max-w-xl break-words text-sm leading-6 text-muted">
          {item.description}
        </p>
      ) : null}
      <p className="mt-3 break-words font-mono text-xs uppercase tracking-[0.16em] text-muted">
        {formatContentType(item.contentType)}
      </p>
      <a
        className="mt-5 inline-flex min-h-11 items-center rounded-sm bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent hover:text-accent-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
    <figcaption className="max-h-20 overflow-auto border-t border-foreground/10 px-4 py-2.5 text-sm">
      <p className="break-words font-semibold">{item.title}</p>
      {item.description ? (
        <p className="mt-0.5 break-words leading-5 text-muted">
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

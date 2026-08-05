"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type Poem = {
  filename: string;
  title: string;
  description: string;
};

function toId(title: string) {
  return `poem-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
}

export function PoemGallery({ poems }: { poems: Poem[] }) {
  const [currentIndex, setCurrentIndex] = useState(-1);

  const updateCurrentPoem = useCallback(() => {
    const readingLine = Math.min(160, window.innerHeight * 0.25);
    let activeIndex = -1;

    poems.forEach((poem, index) => {
      const section = document.getElementById(toId(poem.title));

      if (section && section.getBoundingClientRect().top <= readingLine) {
        activeIndex = index;
      }
    });

    setCurrentIndex(activeIndex);
  }, [poems]);

  useEffect(() => {
    const initialFrame = window.requestAnimationFrame(updateCurrentPoem);
    window.addEventListener("scroll", updateCurrentPoem, { passive: true });
    window.addEventListener("resize", updateCurrentPoem);

    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.removeEventListener("scroll", updateCurrentPoem);
      window.removeEventListener("resize", updateCurrentPoem);
    };
  }, [updateCurrentPoem]);

  if (poems.length === 0) {
    return (
      <p className="mx-auto w-full max-w-6xl px-5 pb-20 text-muted lg:px-8">
        No poems are available yet.
      </p>
    );
  }

  const isLastPoem = currentIndex === poems.length - 1;
  const targetIndex = Math.min(currentIndex + 1, poems.length - 1);
  const targetPoem = poems[targetIndex];

  function scrollToTarget() {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const targetId = isLastPoem ? "poems-top" : toId(targetPoem.title);

    document.getElementById(targetId)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <>
      <div className="border-t border-foreground/10">
        {poems.map((poem, index) => {
          const poemNumber = String(index + 1).padStart(2, "0");
          const poemId = toId(poem.title);

          return (
            <article
              className="scroll-mt-12 border-b border-foreground/10 md:scroll-mt-0"
              id={poemId}
              key={poem.filename}
            >
              <h2 className="sr-only">{poem.title}</h2>
              <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 md:grid-cols-[minmax(0,1fr)_15rem] md:items-start lg:gap-12 lg:px-8 lg:py-20">
                <figure className="min-w-0">
                  <Image
                    alt={`Illustrated presentation of “${poem.title}”`}
                    className="h-auto w-full"
                    height={2048}
                    priority={index === 0}
                    sizes="(max-width: 767px) calc(100vw - 2.5rem), (max-width: 1199px) calc(100vw - 20rem), 840px"
                    src={`/poems/${poem.filename}`}
                    width={1582}
                  />
                </figure>

                <aside
                  aria-label={`About “${poem.title}”`}
                  className="border-t border-foreground/15 pt-5 md:sticky md:top-28"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                    Poem {poemNumber}
                  </p>
                  <p
                    aria-hidden="true"
                    className="mt-3 break-words text-2xl font-semibold leading-tight"
                  >
                    {poem.title}
                  </p>
                  <p className="mt-4 leading-7 text-muted">{poem.description}</p>
                  <a
                    className="mt-5 inline-flex rounded-sm text-sm font-semibold text-accent-text underline decoration-foreground/20 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    href={`#${poemId}`}
                  >
                    Link to this poem
                  </a>
                </aside>
              </div>
            </article>
          );
        })}
      </div>

      <button
        aria-label={
          isLastPoem
            ? "Go back to the top of the poems page"
            : `Go to ${targetPoem.title}`
        }
        className="group fixed bottom-5 right-5 z-40 flex min-h-12 max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-full bg-foreground px-5 py-3 text-left text-background shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:bottom-7 sm:right-7"
        onClick={scrollToTarget}
        type="button"
      >
        <span className="min-w-0">
          <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.16em] opacity-70">
            {isLastPoem ? "Finished reading" : "Up next"}
          </span>
          <span className="block truncate text-sm font-semibold">
            {isLastPoem ? "Back to top" : targetPoem.title}
          </span>
        </span>
        <svg
          aria-hidden="true"
          className={`size-4 shrink-0 ${isLastPoem ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </button>
    </>
  );
}

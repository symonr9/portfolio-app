"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ContentfulImage, MediaPlaceholder } from "@/app/_components/contentful-image";
import type { RichTextNode, WorkSample } from "@/lib/contentful";

type PortfolioBrowserProps = {
  samples: WorkSample[];
};

type PortfolioCategory = {
  label: string;
  type: string;
};

type SortField = "title" | "publishDate";
type SortDirection = "asc" | "desc";

const categories: PortfolioCategory[] = [
  { label: "Writing", type: "writing" },
  { label: "Social Media", type: "social-media" },
  { label: "Publishing", type: "publishing" },
  { label: "Photography", type: "photography" },
  { label: "Art", type: "art" },
];

const defaultSortField: SortField = "publishDate";
const defaultSortDirection: SortDirection = "desc";

export function PortfolioBrowser({ samples }: PortfolioBrowserProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>(defaultSortField);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(defaultSortDirection);

  const activeCategory = categories[activeIndex];
  const queryText = query.trim().toLowerCase();

  const visibleSamples = useMemo(() => {
    return samples
      .filter((sample) => sample.type === activeCategory.type)
      .filter((sample) => matchesQuery(sample, queryText))
      .sort((first, second) =>
        compareSamples(first, second, sortField, sortDirection),
      );
  }, [activeCategory.type, queryText, samples, sortDirection, sortField]);

  function selectCategory(index: number) {
    setActiveIndex(index);
    setQuery("");
    setSortField(defaultSortField);
    setSortDirection(defaultSortDirection);
  }

  return (
    <div className="mt-10">
      <div
        aria-label="Portfolio categories"
        className="relative grid rounded-sm border border-foreground/10 bg-surface p-1 shadow-[0_18px_60px_rgba(31,41,55,0.06)] sm:grid-cols-5"
        role="tablist"
      >
        <span
          aria-hidden="true"
          className="absolute left-1 top-1 hidden h-[calc(100%-0.5rem)] rounded-sm bg-foreground transition-transform duration-500 ease-out sm:block"
          style={{
            transform: `translateX(${activeIndex * 100}%)`,
            width: `calc((100% - 0.5rem) / ${categories.length})`,
            cursor: `pointer`,
          }}
        />
        {categories.map((category, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              aria-controls={`portfolio-panel-${category.type}`}
              aria-selected={isActive}
              className={[
                "relative z-10 min-h-11 cursor-pointer rounded-sm px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                isActive
                  ? "bg-foreground text-background sm:bg-transparent"
                  : "text-muted hover:bg-foreground/6 hover:text-foreground",
              ].join(" ")}
              id={`portfolio-tab-${category.type}`}
              key={category.type}
              onClick={() => selectCategory(index)}
              role="tab"
              type="button"
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 rounded-sm border border-foreground/10 bg-surface p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
        <label className="grid gap-2 text-sm font-semibold" htmlFor="portfolio-search">
          Search {activeCategory.label}
          <input
            className="min-h-11 rounded-sm border border-foreground/15 bg-background px-3 text-base font-normal text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent sm:text-sm"
            id="portfolio-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by name, summary, body, or organization"
            type="search"
            value={query}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold" htmlFor="portfolio-sort-field">
          Sort by
          <select
            className="min-h-11 rounded-sm border border-foreground/15 bg-background px-3 text-sm font-normal text-foreground outline-none transition-colors focus:border-accent"
            id="portfolio-sort-field"
            onChange={(event) => setSortField(event.target.value as SortField)}
            value={sortField}
          >
            <option value="title">Name</option>
            <option value="publishDate">Publish date</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold" htmlFor="portfolio-sort-direction">
          Direction
          <select
            className="min-h-11 rounded-sm border border-foreground/15 bg-background px-3 text-sm font-normal text-foreground outline-none transition-colors focus:border-accent"
            id="portfolio-sort-direction"
            onChange={(event) =>
              setSortDirection(event.target.value as SortDirection)
            }
            value={sortDirection}
          >
            <option value="asc">ASC</option>
            <option value="desc">DESC</option>
          </select>
        </label>
      </div>

      <div className="mt-8 overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {categories.map((category) => (
            <section
              aria-labelledby={`portfolio-tab-${category.type}`}
              className="w-full shrink-0"
              id={`portfolio-panel-${category.type}`}
              key={category.type}
              role="tabpanel"
            >
              {category.type === activeCategory.type ? (
                <PortfolioSampleList
                  categoryLabel={category.label}
                  query={queryText}
                  samples={visibleSamples}
                />
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function PortfolioSampleList({
  categoryLabel,
  query,
  samples,
}: {
  categoryLabel: string;
  query: string;
  samples: WorkSample[];
}) {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted">
          {samples.length} {samples.length === 1 ? "sample" : "samples"}
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {samples.map((sample) => (
          <Link
            className="group rounded-sm border border-foreground/10 bg-surface p-5 transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:p-6"
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
              <span className="break-words font-mono text-xs uppercase tracking-[0.16em] text-muted">
                {formatType(sample.type)}
              </span>
              {sample.featured ? (
                <span className="rounded-sm bg-accent px-2 py-1 text-xs font-semibold text-accent-contrast">
                  Featured
                </span>
              ) : null}
            </div>
            <h2 className="mt-8 break-words text-2xl font-semibold">
              {sample.title}
            </h2>
            <p className="mt-3 leading-7 text-muted">{sample.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {sample.organization ? (
                <span className="rounded-sm border border-foreground/10 px-2 py-1 text-xs text-muted break-words">
                  {sample.organization}
                </span>
              ) : null}
              {sample.tags.map((tag) => (
                <span
                  className="rounded-sm border border-foreground/10 px-2 py-1 text-xs text-muted break-words"
                  key={tag.slug}
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <span className="mt-6 inline-flex text-sm font-semibold text-accent group-hover:text-foreground group-focus-visible:text-foreground">
              View detail
            </span>
          </Link>
        ))}
      </div>
      {!samples.length ? (
        <p className="rounded-sm border border-foreground/10 bg-surface p-6 text-muted">
          No {categoryLabel.toLowerCase()} samples
          {query ? " match this search." : " are available yet."}
        </p>
      ) : null}
    </>
  );
}

function matchesQuery(sample: WorkSample, query: string) {
  if (!query) {
    return true;
  }

  return [
    sample.title,
    sample.summary,
    sample.organization,
    richTextToSearchText(sample.body?.json),
  ]
    .filter(Boolean)
    .some((value) => value?.toLowerCase().includes(query));
}

function compareSamples(
  first: WorkSample,
  second: WorkSample,
  sortField: SortField,
  sortDirection: SortDirection,
) {
  const direction = sortDirection === "asc" ? 1 : -1;

  if (sortField === "title") {
    return direction * first.title.localeCompare(second.title);
  }

  return direction * (dateValue(first.publishDate) - dateValue(second.publishDate));
}

function dateValue(date: string | null) {
  return date ? new Date(date).getTime() : 0;
}

function richTextToSearchText(node?: RichTextNode | null): string {
  if (!node) {
    return "";
  }

  return [node.value, ...(node.content ?? []).map(richTextToSearchText)]
    .filter(Boolean)
    .join(" ");
}

function formatType(type: string) {
  return type.replaceAll("-", " ");
}

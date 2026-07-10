import Link from "next/link";
import type { Tag } from "@/lib/contentful";

type TagFilterNavProps = {
  basePath: string;
  selectedTag?: string;
  tags: Tag[];
};

export function TagFilterNav({
  basePath,
  selectedTag,
  tags,
}: TagFilterNavProps) {
  if (!tags.length) {
    return null;
  }

  return (
    <nav aria-label="Filter by tag" className="mt-8 flex flex-wrap gap-2">
      <Link
        className={getClassName(!selectedTag)}
        href={basePath}
      >
        All
      </Link>
      {tags.map((tag) => (
        <Link
          className={getClassName(selectedTag === tag.slug)}
          href={`${basePath}?tag=${encodeURIComponent(tag.slug)}`}
          key={tag.slug}
        >
          {tag.name}
        </Link>
      ))}
    </nav>
  );
}

function getClassName(active: boolean) {
  return [
    "inline-flex h-9 items-center rounded-sm border px-3 text-sm font-semibold transition-colors",
    active
      ? "border-accent bg-accent text-accent-contrast"
      : "border-foreground/10 bg-surface text-muted hover:text-foreground",
  ].join(" ");
}

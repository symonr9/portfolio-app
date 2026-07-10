import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts, getContentfulDraftOptions } from "@/lib/contentful";
import { buildPageMetadata } from "@/lib/site";
import { ContentfulImage } from "../_components/contentful-image";
import { TagFilterNav } from "../_components/tag-filter-nav";
import type { BlogPost, Tag } from "@/lib/contentful";

type BlogPageProps = {
  searchParams: Promise<{ tag?: string | string[] }>;
};

export const metadata: Metadata = buildPageMetadata({
  title: "Blog",
  description:
    "Browse notes, essays, resources, and updates published through the portfolio.",
  path: "/blog",
});

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const selectedTag = getSelectedTag((await searchParams).tag);
  const contentfulOptions = await getContentfulDraftOptions();
  const blogPosts = await getBlogPosts(contentfulOptions);
  const tags = getUniqueTags(blogPosts.flatMap((post) => post.tags));
  const filteredPosts = selectedTag
    ? blogPosts.filter((post) =>
        post.tags.some((tag) => tag.slug === selectedTag),
      )
    : blogPosts;

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Blog
        </p>
        <h1 className="mt-4 break-words text-4xl font-semibold sm:text-5xl">
          Notes, essays, and resources for the portfolio.
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          Published posts from Contentful with dates, excerpts, tags, related
          work, and detail-page body content.
        </p>
        <TagFilterNav basePath="/blog" selectedTag={selectedTag} tags={tags} />
      </div>

      <div className="mt-10 divide-y divide-foreground/10 border-y border-foreground/10">
        {filteredPosts.map((post) => (
          <article
            className="grid gap-5 py-7 md:grid-cols-[10rem_minmax(0,1fr)_12rem]"
            key={post.slug}
          >
            <PostCover post={post} />
            <div>
              <p className="break-words font-mono text-xs uppercase tracking-[0.16em] text-muted">
                {post.publishDate} / {post.readingTime}
              </p>
              <h2 className="mt-3 break-words text-2xl font-semibold">{post.title}</h2>
              <p className="mt-3 leading-7 text-muted">{post.excerpt}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    className="rounded-sm border border-foreground/10 bg-surface px-2 py-1 text-xs text-muted break-words"
                    key={tag.slug}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="md:text-right">
              <Link
                className="inline-flex rounded-sm text-sm font-semibold text-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                href={`/blog/${post.slug}`}
              >
                Read post
              </Link>
            </div>
          </article>
        ))}
      </div>
      {!filteredPosts.length ? (
        <p className="mt-10 rounded-sm border border-foreground/10 bg-surface p-6 text-muted">
          No posts match this tag.
        </p>
      ) : null}
    </section>
  );
}

function PostCover({ post }: { post: BlogPost }) {
  if (!post.coverImage) {
    return <div className="hidden rounded-sm bg-surface-warm md:block" />;
  }

  return (
    <ContentfulImage
      className="aspect-[4/3] w-full rounded-sm object-cover"
      image={post.coverImage}
      sizes="(min-width: 768px) 160px, 100vw"
    />
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

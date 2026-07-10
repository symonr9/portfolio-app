import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBlogPostBySlug,
  getBlogPostSlugParams,
  getContentfulDraftOptions,
} from "@/lib/contentful";
import { buildPageMetadata } from "@/lib/site";
import { ContentfulImage } from "../../_components/contentful-image";
import { RichTextRenderer } from "../../_components/rich-text-renderer";

type BlogDetailProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export function generateStaticParams() {
  return getBlogPostSlugParams();
}

export async function generateMetadata({
  params,
}: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const contentfulOptions = await getContentfulDraftOptions();
  const post = await getBlogPostBySlug(slug, contentfulOptions);

  if (!post) {
    return {};
  }

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    image: post.coverImage?.url,
    path: `/blog/${post.slug}`,
    type: "article",
  });
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const contentfulOptions = await getContentfulDraftOptions();
  const post = await getBlogPostBySlug(slug, contentfulOptions);

  if (!post) {
    notFound();
  }

  const relatedWork = post.relatedWorkSamples;

  return (
    <article>
      <header className="border-b border-foreground/10">
        <div className="mx-auto w-full max-w-3xl px-5 py-16 lg:px-8">
          <Link
            className="text-sm font-semibold text-accent hover:text-foreground"
            href="/blog"
          >
            Back to blog
          </Link>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.16em] text-muted">
            {post.publishDate} / {post.readingTime}
          </p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight sm:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted">{post.excerpt}</p>
          {post.coverImage ? (
            <ContentfulImage
              className="mt-8 aspect-[16/9] w-full rounded-sm border border-foreground/10 object-cover"
              image={post.coverImage}
              priority
              sizes="(min-width: 768px) 768px, 100vw"
            />
          ) : null}
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                className="rounded-sm border border-foreground/10 bg-surface px-3 py-2 text-sm text-muted"
                key={tag.slug}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-8">
        <RichTextRenderer
          className="mx-auto max-w-3xl space-y-6 text-lg"
          content={post.body}
        />

        <aside className="h-fit rounded-sm border border-foreground/10 bg-surface p-6">
          <h2 className="text-lg font-semibold">Related work</h2>
          <div className="mt-4 space-y-4">
            {relatedWork.map((sample) => (
              <Link
                className="block border-t border-foreground/10 pt-4 hover:text-accent"
                href={`/work/${sample.slug}`}
                key={sample.slug}
              >
                <span className="font-semibold">{sample.title}</span>
                <span className="mt-1 block text-sm leading-6 text-muted">
                  {sample.summary}
                </span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </article>
  );
}

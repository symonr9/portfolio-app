import type { Metadata } from "next";
import { getAboutPageData, getContentfulDraftOptions } from "@/lib/contentful";
import { buildPageMetadata } from "@/lib/site";
import { formatMonthYear } from "@/lib/format-date";
import { ContentfulImage } from "../_components/contentful-image";
import { RichTextRenderer } from "../_components/rich-text-renderer";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description:
    "Learn more about the portfolio owner, their background, and recent experience.",
  path: "/about",
  type: "profile",
});

export default async function AboutPage() {
  const contentfulOptions = await getContentfulDraftOptions();
  const { experiences, profile } = await getAboutPageData(contentfulOptions);

  return (
    <div>
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[0.78fr_1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-text">
            About
          </p>
          <h1 className="mt-4 break-words text-4xl font-semibold sm:text-5xl">
            My Story
          </h1>
          {profile.portrait ? (
            <ContentfulImage
              className="mt-8 aspect-[4/5] w-full max-w-sm rounded-sm border border-foreground/10 object-cover"
              image={profile.portrait}
              priority
              sizes="(min-width: 1024px) 360px, 100vw"
            />
          ) : null}
        </div>
        <RichTextRenderer
          className="space-y-6 text-lg"
          content={profile.longBio}
          fallback={profile.shortBio}
        />
      </section>
    </div>
  );
}

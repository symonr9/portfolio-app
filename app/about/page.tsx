import type { Metadata } from "next";
import { getAboutPageData, getContentfulDraftOptions } from "@/lib/contentful";
import { buildPageMetadata } from "@/lib/site";
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
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            About
          </p>
          <h1 className="mt-4 break-words text-4xl font-semibold sm:text-5xl">
            {profile.headline}
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

      <section className="border-t border-foreground/10 bg-surface">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[0.42fr_1fr] lg:px-8">
          <div>
            <h2 className="break-words text-3xl font-semibold">Recent experience</h2>
            <p className="mt-4 leading-7 text-muted">
              A compact preview of resume-style entries powered by the same
              Contentful experience data as the resume page.
            </p>
          </div>
          <div className="grid gap-4">
            {experiences.slice(0, 2).map((experience) => (
              <article
                className="rounded-sm border border-foreground/10 bg-background p-6"
                key={`${experience.title}-${experience.organization}`}
              >
                <p className="break-words font-mono text-xs uppercase tracking-[0.16em] text-muted">
                  {experience.startDate} -{" "}
                  {experience.current ? "Present" : experience.endDate}
                </p>
                <h3 className="mt-3 break-words text-2xl font-semibold">
                  {experience.title}
                </h3>
                <p className="mt-2 break-words text-muted">
                  {[experience.organization, experience.location]
                    .filter(Boolean)
                    .join(" / ")}
                </p>
                <p className="mt-4 leading-7 text-muted">
                  {experience.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

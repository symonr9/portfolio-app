import type { Metadata } from "next";
import { getContentfulDraftOptions, getResumePageData } from "@/lib/contentful";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Resume",
  description:
    "Review experience, capabilities, highlights, and contact details from the portfolio.",
  path: "/resume",
});

export default async function ResumePage() {
  const contentfulOptions = await getContentfulDraftOptions();
  const { experiences, expertiseTags, profile } =
    await getResumePageData(contentfulOptions);

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
      <div className="border-b border-foreground/10 pb-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Resume
            </p>
            <h1 className="mt-4 break-words text-4xl font-semibold sm:text-5xl">
              Experience, capabilities, and selected highlights.
            </h1>
          </div>
          {profile.resumePdf ? (
            <a
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-sm bg-accent px-5 text-sm font-semibold text-accent-contrast transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              download
              href="/resume/download"
            >
              Download Resume
            </a>
          ) : null}
        </div>
        <div className="mt-8 text-lg leading-8 text-muted">
          <p>{profile.shortBio}</p>
          <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                Location
              </dt>
              <dd className="mt-1 break-words font-semibold text-foreground">
                {profile.location ?? "Available by request"}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                Contact
              </dt>
              <dd className="mt-1 break-words font-semibold text-foreground">
                {profile.email ?? "Add contact details in Contentful"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-b border-foreground/10 py-10">
        <h2 className="text-xl font-semibold">Expertise</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {expertiseTags.map((tag) => (
            <span
              className="inline-flex rounded-sm border border-foreground/10 bg-surface px-3 py-2 text-sm text-muted"
              key={tag.slug}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>

      <div className="divide-y divide-foreground/10">
        {experiences.map((experience) => {
          const tags = [
            ...(experience.category ? [experience.category] : []),
            ...experience.skillsUsed.map((tag) => tag.name),
          ];

          return (
            <article
              className="py-8"
              key={`${experience.title}-${experience.organization}-${experience.startDate}`}
            >
              <h2 className="break-words text-2xl font-semibold">
                {experience.title}
              </h2>
              <p className="mt-2 break-words text-muted">
                {[experience.organization, experience.location]
                  .filter(Boolean)
                  .join(" / ")}
              </p>
              <p className="mt-3 break-words font-mono text-xs uppercase tracking-[0.16em] text-muted">
                {formatExperienceDate(
                  experience.startDate,
                  experience.current ? "Present" : experience.endDate,
                )}
              </p>
              {tags.length > 0 ? (
                <div className="mt-5 flex w-full flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      className="inline-flex rounded-sm border border-foreground/10 bg-surface px-3 py-2 text-sm text-muted"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
              {experience.description ? (
                <p className="mt-5 leading-7 text-muted">
                  {experience.description}
                </p>
              ) : null}
              <ul className="mt-5 list-disc space-y-3 pl-5">
                {experience.achievements.map((achievement) => (
                  <li className="leading-7 text-muted" key={achievement}>
                    {achievement}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function formatExperienceDate(
  startDate: string | null,
  endDate: string | null,
) {
  if (startDate && endDate) {
    return `${startDate} - ${endDate}`;
  }

  return startDate ?? endDate ?? "Date unavailable";
}

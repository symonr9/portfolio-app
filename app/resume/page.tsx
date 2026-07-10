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
      <div className="grid gap-10 border-b border-foreground/10 pb-12 lg:grid-cols-[0.72fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Resume
          </p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Experience, capabilities, and selected highlights.
          </h1>
        </div>
        <div className="text-lg leading-8 text-muted">
          <p>{profile.shortBio}</p>
          <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                Location
              </dt>
              <dd className="mt-1 font-semibold text-foreground">
                {profile.location ?? "Available by request"}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                Contact
              </dt>
              <dd className="mt-1 font-semibold text-foreground">
                {profile.email ?? "Add contact details in Contentful"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid gap-10 py-12 lg:grid-cols-[16rem_1fr]">
        <aside>
          <h2 className="text-xl font-semibold">Expertise</h2>
          <div className="mt-5 flex flex-wrap gap-2 lg:block lg:space-y-2">
            {expertiseTags.map((tag) => (
              <span
                className="inline-flex rounded-sm border border-foreground/10 bg-surface px-3 py-2 text-sm text-muted lg:flex"
                key={tag.slug}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </aside>

        <div className="divide-y divide-foreground/10 border-y border-foreground/10">
          {experiences.map((experience) => (
            <article
              className="grid gap-5 py-7 md:grid-cols-[12rem_1fr]"
              key={`${experience.title}-${experience.organization}`}
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                  {experience.startDate} -{" "}
                  {experience.current ? "Present" : experience.endDate}
                </p>
                {experience.category ? (
                  <p className="mt-2 text-sm font-semibold text-accent">
                    {experience.category}
                  </p>
                ) : null}
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{experience.title}</h2>
                <p className="mt-1 text-muted">
                  {[experience.organization, experience.location]
                    .filter(Boolean)
                    .join(" / ")}
                </p>
                {experience.description ? (
                  <p className="mt-4 leading-7 text-muted">
                    {experience.description}
                  </p>
                ) : null}
                <ul className="mt-5 space-y-3">
                  {experience.achievements.map((achievement) => (
                    <li className="leading-7 text-muted" key={achievement}>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

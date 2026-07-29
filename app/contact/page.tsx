import type { Metadata } from "next";
import { ContactForm } from "@/app/contact/contact-form";
import { getContactPageData, getContentfulDraftOptions } from "@/lib/contentful";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Find the best way to reach the portfolio owner for inquiries, collaboration, or conversation.",
  path: "/contact",
});

export default async function ContactPage() {
  const contentfulOptions = await getContentfulDraftOptions();
  const { contactCta, profile } = await getContactPageData(contentfulOptions);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const linkedIn = profile.socialLinks.find(
    ({ label }) => label.toLowerCase() === "linkedin",
  );
  const contactItems: [string, string | null | undefined][] = [
    ["Location", profile.location],
    ["Profile", profile.name],
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-text">
          Contact
        </p>
        <h1 className="mt-4 break-words text-4xl font-semibold sm:text-5xl">
          Let&apos;s talk about your next project or opportunity.
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          {contactCta ??
            "I welcome inquiries about new work, creative collaborations, and other opportunities."}
        </p>
        <p className="mt-3 text-lg leading-8 text-muted">
          The contact form is the best way to reach me. Include a little context
          about what you have in mind and your timeline.
        </p>
      </div>

      <div className="mt-10 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div className="grid min-w-0 gap-4">
          {linkedIn || profile.resumePdf ? (
            <section
              aria-label="Social links and resume"
              className="grid grid-cols-2 gap-4"
            >
              {linkedIn ? (
                <a
                  className="inline-flex h-12 min-w-0 items-center justify-center gap-2 rounded-sm border border-foreground/15 bg-background px-4 text-sm font-semibold transition-transform hover:-translate-y-0.5 hover:border-foreground/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  href={linkedIn.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.42v1.57h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.41a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.04H3.54V8.98H7.1v11.47ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z" />
                  </svg>
                  <span className="truncate">LinkedIn</span>
                </a>
              ) : null}
              {profile.resumePdf ? (
                <a
                  className="inline-flex h-12 min-w-0 items-center justify-center rounded-sm bg-accent px-4 text-center text-sm font-semibold text-accent-contrast transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  download
                  href="/resume/download"
                >
                  Download Resume
                </a>
              ) : null}
            </section>
          ) : null}

          <ContactForm turnstileSiteKey={turnstileSiteKey} />
        </div>

        <div className="grid min-w-0 gap-4">
          {contactItems.map(([item, value]) => (
            <article
              className="rounded-sm border border-foreground/10 bg-surface p-6"
              key={item}
            >
              <h2 className="break-words text-xl font-semibold">{item}</h2>
              <ContactValue value={value} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactValue({ value }: { value?: string | null }) {
  return (
    <p className="mt-3 break-words leading-7 text-muted">
      {value ?? "Add this detail in Contentful."}
    </p>
  );
}

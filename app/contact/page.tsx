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
          A dedicated path for inquiries, collaboration, or conversation.
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          {contactCta ??
            "Use the available contact details for inquiries, collaboration, or conversation."}
        </p>
      </div>

      <div className="mt-10 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <ContactForm turnstileSiteKey={turnstileSiteKey} />

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

import type { Metadata } from "next";
import { getContentfulDraftOptions, getWorkSamples } from "@/lib/contentful";
import { buildPageMetadata } from "@/lib/site";
import { PortfolioBrowser } from "./_components/portfolio-browser";

export const metadata: Metadata = buildPageMetadata({
  title: "Portfolio",
  description:
    "Explore portfolio samples by category with searchable summaries, narratives, organizations, and publish dates.",
  path: "/work",
});

export default async function WorkPage() {
  const contentfulOptions = await getContentfulDraftOptions();
  const workSamples = await getWorkSamples(contentfulOptions);

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Portfolio
        </p>
        <p className="mt-5 text-lg leading-8 text-muted">
          Take a look at my stuff!
        </p>
      </div>

      <PortfolioBrowser samples={workSamples} />
    </section>
  );
}

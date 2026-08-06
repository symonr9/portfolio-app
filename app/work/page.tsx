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
      <div className="w-full">
        <h1 className="mt-4 break-words text-4xl font-semibold sm:text-5xl">
          Portfolio
        </h1>
        <p className="mt-5 w-full text-lg leading-8 text-muted">
          This is a space where I get to share all my passions. 
          Feel free to explore the different categories to learn more about who I am.
        </p>
      </div>

      <PortfolioBrowser samples={workSamples} />
    </section>
  );
}

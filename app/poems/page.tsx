import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/site";
import { PoemGallery, type Poem } from "./poem-gallery";

const poems: Poem[] = [
  {
    filename: "(1)_How_Do_You_Live.png",
    title: "How Do You Live?",
    description:
      "An ode to Hayao Miyazaki that asks what responsibility looks like in a world shaped by environmental change.",
  },
  {
    filename: "(2)_Fate_of_the_Butterfly.png",
    title: "Fate of the Butterfly",
    description:
      "A butterfly-shaped reflection on transformation, fragility, and nature’s power to lead us through change.",
  },
  {
    filename: "(3)_Old_Frugivorous.png",
    title: "Old Frugivorous",
    description:
      "A playful character portrait of a devoted worker whose richest reward is a colorful abundance of fruit.",
  },
  {
    filename: "(4)_Nails.png",
    title: "Nails",
    description:
      "A meditation on beauty, learned habits, intimacy, and heartbreak told through the small rituals of painted nails.",
  },
  {
    filename: "(5)_To_Serve_a_Cup_of_Poetry.png",
    title: "To Serve a Cup of Poetry",
    description:
      "A coffee-shop metaphor for the creative process and the uncertainty of sharing something carefully made.",
  },
].sort((a, b) => poemOrder(a.filename) - poemOrder(b.filename));

function poemOrder(filename: string) {
  return Number(filename.match(/^\((\d+)\)/)?.[1] ?? Number.MAX_SAFE_INTEGER);
}

export const metadata: Metadata = buildPageMetadata({
  title: "Poems",
  description: "Read a collection of illustrated poems from the portfolio.",
  path: "/poems",
});

export default function PoemsPage() {
  return (
    <div id="poems-top">
      <header className="mx-auto w-full max-w-6xl px-5 pb-12 pt-16 lg:px-8 lg:pb-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-text">
          Poems
        </p>
        <h1 className="mt-4 max-w-3xl break-words text-4xl font-semibold sm:text-5xl">
          Words shaped for the page.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
          A collection of illustrated poems. Scroll through the complete series,
          or use the floating control to move from one poem to the next.
        </p>
      </header>

      <PoemGallery poems={poems} />
    </div>
  );
}

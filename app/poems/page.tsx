import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/site";
import { PoemGallery, type Poem } from "./poem-gallery";

const poems: Poem[] = [
  {
    filename: "(1)_How_Do_You_Live.png",
    title: "How Do You Live?",
    description:
      "In this \"Persona Poem\", I was tasked with writing from the perspective of a well-known figure. I chose Hayao Miyazaki, the director of many famous Studio Ghibli films. His latest release, \"The Boy and the Heron\", is titled \"How Do You Live?\" in its original language. I found the original title to be much stronger, especially because the question is present across all of Miyazaki's works. His films demand us to look inwardly at ourselves and human nature, especially in our relationship with the environment and the damage that continually causes. Weaving haikus throughout the piece, I directed this question towards the focus of a different film for every stanza, journeying through his stories and worlds along the way while reflecting on our own reality.",
  },
  {
    filename: "(2)_Fate_of_the_Butterfly.png",
    title: "Fate of the Butterfly",
    description:
      "In this poem, the goal was to write a poem that appears to be about one thing on the surface, but really refers to another underneath. At a glance, this poem is about butterflies and the change that nature forces. Truly, it is about Lupus, a disease known by the \"butterfly rash\" it leaves on the faces of patients. To me, the butterfly is a powerful symbol of beauty and acceptance through uncertainty and change.",
  },
  {
    filename: "(3)_Old_Frugivorous.png",
    title: "Old Frugivorous",
    description:
      "The goal was to write a poem based on a word that you assume has one meaning when it actually has a different one. I chose \"frugivorous\", which sounded to me like someone who is greedy or tight-fisted. Of course, it really just refers to an animal that primarily eats fruit! So I naturally wrote about a man who is very greedy for fruit.",
  },
  {
    filename: "(4)_Nails.png",
    title: "Nails",
    description:
      "Nails is a poem about obsession: first of biting nails, then of a person. One appears to cure another, but it becomes a problem of its own, until the speaker reverts to their original habits. The nails also serve as a symbol for breakage not only in a literal sense, but also of a heart, which is hanging on by a thread.",
  },
  {
    filename: "(5)_To_Serve_a_Cup_of_Poetry.png",
    title: "To Serve a Cup of Poetry",
    description:
      "Ars Poetica: A poem that explains how/why poetry is written. This is accomplished through the lens of my former job as a barista: the insecurities that go along with serving up something complex and subjective, and the satisfaction of seeing a happy customer as a result.",
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
        <h1 className="mt-4 max-w-3xl break-words text-4xl font-semibold sm:text-5xl">
          Poems
        </h1>
        <p className="mt-5 w-full text-lg leading-8 text-muted">
          This collection of poems examines topics of identity, change, and personal reflection through the lenses
       of different styles. Accompanying them are my own illustrations designed to help bring them to life.
        </p>
      </header>

      <PoemGallery poems={poems} />
    </div>
  );
}

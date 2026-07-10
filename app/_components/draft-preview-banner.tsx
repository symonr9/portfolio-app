import { draftMode } from "next/headers";

export async function DraftPreviewBanner() {
  const { isEnabled } = await draftMode();

  if (!isEnabled) {
    return null;
  }

  return (
    <aside
      className="border-b border-foreground/10 bg-accent px-5 py-3 text-sm text-accent-contrast"
      role="status"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold">Contentful draft preview is active.</p>
        <form action="/api/draft/contentful/disable" method="post">
          <button
            className="inline-flex h-9 items-center rounded-sm border border-accent-contrast/35 px-3 text-sm font-semibold transition-colors hover:bg-accent-contrast hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-contrast"
            type="submit"
          >
            Exit preview
          </button>
        </form>
      </div>
    </aside>
  );
}

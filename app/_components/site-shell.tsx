import Link from "next/link";
import { DraftPreviewBanner } from "./draft-preview-banner";
import { NavLinks } from "./nav-links";

export function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        className="sr-only z-[60] rounded-sm bg-foreground px-4 py-3 text-sm font-semibold text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        href="#main-content"
      >
        Skip to content
      </a>
      <DraftPreviewBanner />
      <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Link
            href="/"
            className="group inline-flex w-fit items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            aria-label="Portfolio home"
          >
            <span className="grid size-10 place-items-center rounded-sm border border-foreground/15 bg-foreground text-sm font-semibold text-background shadow-sm transition-transform group-hover:-translate-y-0.5">
              P
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-sm font-semibold">Portfolio</span>
              <span className="mt-1 text-xs text-muted">Personal site system</span>
            </span>
          </Link>

          <NavLinks />
        </div>
      </header>

      <main className="flex-1" id="main-content" tabIndex={-1}>
        {children}
      </main>

      <footer className="border-t border-foreground/10">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-8 text-sm text-muted sm:grid-cols-[1fr_auto] sm:items-center lg:px-8">
          <p>
            Built as a reusable portfolio foundation for editable profile,
            work, writing, and experience content.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link className="rounded-sm hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" href="/contact">
              Connect
            </Link>
            <Link className="rounded-sm hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" href="/work">
              Explore work
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

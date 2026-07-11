import Link from "next/link";
import type { Profile } from "@/lib/contentful";
import { ContentfulImage } from "./contentful-image";
import { DraftPreviewBanner } from "./draft-preview-banner";
import { NavLinks } from "./nav-links";

export function SiteShell({
  children,
  profile,
}: Readonly<{
  children: React.ReactNode;
  profile: Pick<Profile, "avatar" | "headline" | "name" | "smallHeadline">;
}>) {
  const profileInitial = profile.name.trim().charAt(0).toUpperCase();
  const navHeadline = profile.smallHeadline ?? profile.headline;

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
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-5 gap-y-2 px-5 py-2.5 lg:px-8">
          <Link
            href="/"
            className="group inline-flex min-w-0 max-w-full items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:max-w-[44%] lg:max-w-[46%]"
            aria-label="Portfolio home"
          >
            {profile.avatar ? (
              <ContentfulImage
                className="size-8 shrink-0 rounded-sm border border-foreground/15 object-cover shadow-sm transition-transform group-hover:-translate-y-0.5"
                image={profile.avatar}
                sizes="32px"
              />
            ) : (
              <span className="grid size-8 shrink-0 place-items-center rounded-sm border border-foreground/15 bg-foreground text-xs font-semibold text-background shadow-sm transition-transform group-hover:-translate-y-0.5">
                {profileInitial}
              </span>
            )}
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-semibold">{profile.name}</span>
              <span className="truncate text-xs text-muted">{navHeadline}</span>
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

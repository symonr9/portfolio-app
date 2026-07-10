import Link from "next/link";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Link
            href="/"
            className="group inline-flex w-fit items-center gap-3"
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

          <nav aria-label="Main navigation">
            <ul className="flex flex-wrap items-center gap-1">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex h-9 items-center rounded-sm px-3 text-sm font-medium text-muted transition-colors hover:bg-foreground/6 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-foreground/10">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-8 text-sm text-muted sm:grid-cols-[1fr_auto] sm:items-center lg:px-8">
          <p>
            Built as a reusable portfolio foundation for editable profile,
            work, writing, and experience content.
          </p>
          <div className="flex items-center gap-4">
            <Link className="hover:text-foreground" href="/contact">
              Connect
            </Link>
            <Link className="hover:text-foreground" href="/work">
              Explore work
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

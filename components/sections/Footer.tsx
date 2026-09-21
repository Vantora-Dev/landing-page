import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="on-dark border-t border-ink-700 bg-ink-950">
      <div className="shell py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="type-label !text-[0.8125rem] !tracking-[0.14em] font-medium text-paper">
              {site.name}
            </p>
            <p className="mt-5 max-w-[38ch] text-[0.9375rem] leading-relaxed text-graphite-400">
              {site.name} installs and operates digital revenue systems for
              independent laundromats in the United States.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <a
                href={`mailto:${site.email}`}
                className="text-[0.9375rem] text-paper underline underline-offset-4 hover:text-signal"
              >
                {site.email}
              </a>
              <a
                href={`tel:${site.phoneHref}`}
                className="text-[0.9375rem] text-paper underline underline-offset-4 hover:text-signal"
              >
                {site.phone}
              </a>
            </div>

            <a
              href={site.linkedin}
              target="_blank"
              // noopener closes the window.opener hole; noreferrer keeps the
              // referrer off a third party we don't control.
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2.5 text-[0.9375rem] text-graphite-400 transition-colors hover:text-paper"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-[1.05rem] w-[1.05rem] shrink-0"
                fill="currentColor"
              >
                <path d="M6.94 5.5a2.44 2.44 0 1 1-4.88 0 2.44 2.44 0 0 1 4.88 0ZM7 9.24H2.5V22H7V9.24Zm7.32 0h-4.4V22h4.4v-6.7c0-4.08 5.32-4.42 5.32 0V22H24v-8.22c0-6.87-7.86-6.62-9.68-3.24V9.24Z" />
              </svg>
              LinkedIn
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>

          <div className="md:col-span-4">
            <h2 className="type-label text-graphite-400">On this page</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-[0.9375rem] text-graphite-400 transition-colors hover:text-paper"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="type-label text-graphite-400">Legal</h2>
            {/* TODO(launch): write these two pages and link them properly.
                Left visible-but-inert rather than linking to a 404. */}
            <ul className="mt-5 space-y-3 text-[0.9375rem] text-graphite-400">
              <li>Privacy policy — coming before launch</li>
              <li>Terms of service — coming before launch</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-ink-700 pt-8 text-[0.8125rem] text-graphite-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Month to month. Your customer data is yours.</p>
        </div>
      </div>
    </footer>
  );
}

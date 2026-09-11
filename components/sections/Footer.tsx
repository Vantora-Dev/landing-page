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
            <a
              href={`mailto:${site.email}`}
              className="mt-6 inline-block text-[0.9375rem] text-paper underline underline-offset-4 hover:text-signal"
            >
              {site.email}
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

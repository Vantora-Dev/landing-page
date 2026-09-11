"use client";

import { useEffect, useState } from "react";
import { CTA_HREF, CTA_PRIMARY, nav, site } from "@/lib/site";

/**
 * Transparent over the dark hero, solid once the page starts scrolling.
 *
 * No hamburger: on phones the nav links collapse away and only the wordmark
 * and the single call-to-action remain, which is the only thing that matters
 * on this page anyway.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      // `on-dark` while transparent over the hero: it flips the focus ring to
      // amber. The default deep-amber ring is near-invisible on near-black.
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "border-b border-line bg-paper/90 backdrop-blur-md"
          : "on-dark border-b border-transparent"
      }`}
    >
      <div className="shell flex h-[4.5rem] items-center justify-between gap-6">
        <a
          href="#top"
          className={`type-label !text-[0.8125rem] !tracking-[0.14em] font-medium transition-colors ${
            scrolled ? "text-graphite-900" : "text-paper"
          }`}
        >
          {site.name}
        </a>

        <nav aria-label="Sections" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`text-[0.875rem] tracking-[-0.01em] transition-colors ${
                    scrolled
                      ? "text-graphite-600 hover:text-graphite-900"
                      : "text-graphite-400 hover:text-paper"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={CTA_HREF}
          className={`inline-flex min-h-[2.75rem] items-center rounded-md px-4 text-[0.875rem] font-medium transition-colors ${
            scrolled
              ? "bg-ink-950 text-paper hover:bg-ink-800"
              : "border border-ink-700 text-paper hover:border-graphite-400 hover:bg-white/[0.06]"
          }`}
        >
          <span className="hidden sm:inline">{CTA_PRIMARY}</span>
          <span className="sm:hidden">Book a call</span>
        </a>
      </div>
    </header>
  );
}

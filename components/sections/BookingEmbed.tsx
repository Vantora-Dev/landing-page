"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

/**
 * Cal.com booking, loaded late and never on first paint.
 *
 * On tablet and up the iframe loads when the section scrolls into view; on
 * phones it waits for a tap, so a third-party frame never competes with the
 * page on a mid-range device or a metered connection.
 *
 * TODO(launch): set NEXT_PUBLIC_CAL_LINK (e.g. "laundrogrid/15min") in the
 * Vercel project. Until it is set, this renders a clearly marked placeholder
 * rather than a broken frame.
 */
export function BookingEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!site.calLink) return;
    const element = containerRef.current;
    if (!element) return;

    // Phones wait for an explicit tap.
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (!site.calLink) {
    return (
      <div
        ref={containerRef}
        className="flex min-h-[22rem] flex-col items-start justify-center rounded-lg border border-dashed border-ink-700 bg-white/[0.02] p-8"
      >
        <p className="type-label text-signal">Calendar embed placeholder</p>
        <p className="mt-5 max-w-[34ch] text-[0.9375rem] leading-relaxed text-graphite-400">
          The Cal.com booking calendar drops in here once{" "}
          <code className="font-mono text-[0.875rem] text-paper">
            NEXT_PUBLIC_CAL_LINK
          </code>{" "}
          is set. Until then, the form beside this is live and reaches us the
          same way.
        </p>
        <a
          href={`mailto:${site.email}?subject=15-minute%20call`}
          className="mt-8 text-[0.9375rem] font-medium text-signal underline underline-offset-4 hover:text-paper"
        >
          Or email {site.email}
        </a>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-[22rem]">
      {loaded ? (
        <iframe
          title="Book a 15-minute call with LaundroGrid"
          src={`https://cal.com/${site.calLink}?embed=true&theme=dark`}
          loading="lazy"
          className="h-[38rem] w-full rounded-lg border border-ink-700 bg-ink-900"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="flex min-h-[22rem] w-full flex-col items-start justify-center rounded-lg border border-ink-700 bg-white/[0.02] p-8 text-left transition-colors hover:border-graphite-400"
        >
          <span className="type-label text-signal">Booking calendar</span>
          <span className="mt-5 max-w-[30ch] text-[1.0625rem] leading-relaxed text-paper">
            Tap to load the calendar and pick a time.
          </span>
          <span className="mt-3 text-[0.8125rem] text-graphite-400">
            Loaded only when you ask for it, so the page stays fast on data.
          </span>
        </button>
      )}
    </div>
  );
}

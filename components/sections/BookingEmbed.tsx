"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

/**
 * Cal.com booking, loaded late and never on first paint.
 *
 * When no Cal.com handle is configured this renders **nothing** — a visitor
 * must never be shown scaffolding about unset environment variables. The
 * section around it leads with the phone number and the form instead, both of
 * which work whether or not a calendar exists.
 *
 * Set NEXT_PUBLIC_CAL_LINK (e.g. "laundrogrid/15min") to switch it on.
 */
export function BookingEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!site.calLink) return;
    const element = containerRef.current;
    if (!element) return;

    // Phones wait for an explicit tap; a third-party frame should never
    // compete with the page on a mid-range device or a metered connection.
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

  if (!site.calLink) return null;

  return (
    <div ref={containerRef} className="mb-12 border-b border-ink-700 pb-12">
      <h3 className="type-label mb-5 text-graphite-400">Pick a time</h3>
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
          className="flex w-full flex-col items-start rounded-lg border border-ink-700 bg-white/[0.02] p-6 text-left transition-colors hover:border-graphite-400"
        >
          <span className="text-[1.0625rem] leading-relaxed text-paper">
            Tap to load the calendar and pick a time
          </span>
          <span className="mt-2 text-[0.8125rem] text-graphite-400">
            Loaded only when you ask for it, so the page stays fast on data.
          </span>
        </button>
      )}
    </div>
  );
}

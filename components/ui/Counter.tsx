"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type CounterProps = {
  to: number;
  /** Rendered before/after the number, e.g. a "+" or "×". */
  suffix?: string;
  className?: string;
  durationMs?: number;
};

/**
 * Counts up once, when scrolled into view.
 *
 * Only ever used for counts of things we actually provide (streams, parts of
 * the system). Never for revenue, customer numbers or percentages — see the
 * non-claims list in the README.
 *
 * Reduced motion snaps straight to the final value.
 *
 * The server renders the real number, not 0. Crawlers and AI agents read the
 * served HTML, and an animated counter that starts at zero tells them this
 * page offers "0 ways to bill". The count only resets to zero on the client,
 * after hydration and while still off-screen, so people still see it count.
 */
export function Counter({ to, suffix = "", className, durationMs = 900 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(to);
  const [armed, setArmed] = useState(false);

  // Reset to zero after hydration, only if the counter isn't already visible.
  useEffect(() => {
    if (reduced || inView) return;
    setValue(0);
    setArmed(true);
    // Runs once on mount; later in-view changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
    if (!inView || !armed) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      // easeOutQuint — decelerates hard, no overshoot
      const eased = 1 - Math.pow(1 - t, 5);
      setValue(Math.round(eased * to));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, armed, to, durationMs]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}

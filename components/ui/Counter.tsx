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
 */
export function Counter({ to, suffix = "", className, durationMs = 900 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? to : 0);

  useEffect(() => {
    if (!inView || reduced) {
      if (reduced) setValue(to);
      return;
    }

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
  }, [inView, reduced, to, durationMs]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}

"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger within a group, in seconds. Keep under ~0.3 total. */
  delay?: number;
  className?: string;
  /** Sideways reveals for horizontal rails; default rises from below. */
  from?: "below" | "left";
};

/**
 * The single scroll-reveal primitive. Every section uses this so timing and
 * distance are identical site-wide — 12px, 380ms, once, no bounce.
 *
 * Under prefers-reduced-motion the element renders in its final state with no
 * transition at all, rather than a faster version of the same animation.
 */
export function Reveal({ children, delay = 0, className, from = "below" }: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const offset = from === "left" ? { x: -14, y: 0 } : { x: 0, y: 12 };

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.38, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}

"use client";

import { m, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger within a group, in seconds. Keep under ~0.3 total. */
  delay?: number;
  className?: string;
  /** Sideways reveals for horizontal rails; default rises from below. */
  from?: "below" | "left";
};

/** An element counts as seen once it is 12% above the bottom of the screen. */
const VIEWPORT_MARGIN = "0px 0px -12% 0px";
const FOLD = 0.88;

/**
 * The single scroll-reveal primitive. Every section uses this so timing and
 * distance are identical site-wide — 12px, 380ms, once, no bounce.
 *
 * The server renders the element VISIBLE. It is only hidden on the client,
 * after hydration and only if it is still below the fold, so people still see
 * it rise in. Rendering `opacity: 0` on the server and relying on JavaScript
 * to undo it blanked every section after the hero for anyone whose browser
 * could not run our bundle — an iPhone older than iOS 16.4, an in-app browser,
 * a content blocker — and crawlers read the same invisible HTML.
 *
 * Under prefers-reduced-motion the element renders in its final state with no
 * transition at all, rather than a faster version of the same animation.
 */
export function Reveal({ children, delay = 0, className, from = "below" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: VIEWPORT_MARGIN });
  const reduced = useReducedMotion();
  const [armed, setArmed] = useState(false);

  // Hide after hydration, only if the element isn't already on screen. Read
  // the geometry directly: useInView is still false on the first effect, even
  // for an element in plain view, which would make it flicker out and back.
  useEffect(() => {
    const element = ref.current;
    if (reduced || !element) return;
    if (element.getBoundingClientRect().top < window.innerHeight * FOLD) return;
    setArmed(true);
    // Runs once on mount; later in-view changes are handled by `inView`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const offset = from === "left" ? { x: -14, y: 0 } : { x: 0, y: 12 };
  const hidden = armed && !inView;

  return (
    <m.div
      ref={ref}
      className={className}
      initial={false}
      animate={hidden ? { opacity: 0, ...offset } : { opacity: 1, x: 0, y: 0 }}
      transition={
        hidden ? { duration: 0 } : { duration: 0.38, delay, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </m.div>
  );
}

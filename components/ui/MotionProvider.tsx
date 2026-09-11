"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * `strict` forbids the full `motion.*` components, which would pull the whole
 * feature bundle back into the initial chunk. Every animated element on this
 * site uses `m.*` instead.
 */
const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { HERO_BAND_HEIGHT } from "./hero.config";
import { useCapabilityGate } from "./useCapabilityGate";

/**
 * Owns the hero backdrop: the static poster, the decision to load WebGL, and
 * the crossfade between them.
 *
 * The poster arrives as a slot from the server component, so its grid geometry
 * and ~20KB of SVG are rendered on the server and never enter the client
 * bundle — this file only decides whether to fade it out.
 *
 * `ssr: false` lives here rather than in a Server Component, which Next
 * requires and which also guarantees three.js is never in the server render.
 */
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

export function HeroBackdrop({ poster }: { poster: ReactNode }) {
  const allowed = useCapabilityGate();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(true);

  // Hero-relative scroll, written to a ref so the 3D loop can read it without
  // re-rendering React on every scroll event.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const height = element.offsetHeight || window.innerHeight;
      const travelled = -element.getBoundingClientRect().top;
      scrollRef.current = Math.min(Math.max(travelled / height, 0), 1);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Stop rendering entirely when the hero is off screen or the tab is hidden.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let visible = true;
    let onScreen = true;

    const sync = () => setActive(visible && onScreen);

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin: "10% 0px" },
    );
    observer.observe(element);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const showScene = allowed === true && !failed;

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Ground colour and horizon glow. Painted before anything else, and
          kept underneath the canvas — the WebGL layer renders with alpha. */}
      <div className="absolute inset-0 bg-ink-950" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 78%, rgba(251,191,36,0.10) 0%, rgba(251,191,36,0.03) 32%, transparent 62%)",
        }}
      />

      {/* The grid is a floor along the bottom of the hero, never a wallpaper
          behind the headline. Poster and canvas share this frame so the
          crossfade lands on the same composition. */}
      <div className={`absolute inset-x-0 bottom-0 ${HERO_BAND_HEIGHT}`}>
        <div
          className="absolute inset-0 transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ opacity: ready && showScene ? 0 : 1 }}
        >
          {poster}
        </div>

        {showScene ? (
          <div
            className="absolute inset-0 transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ opacity: ready ? 1 : 0 }}
          >
            <HeroScene
              scrollRef={scrollRef}
              active={active}
              onReady={() => setReady(true)}
              onFail={() => {
                setFailed(true);
                setReady(false);
              }}
            />
          </div>
        ) : null}
      </div>

      {/* Vignette and the seam into the section below */}
      <div className="absolute inset-0 bg-[radial-gradient(110%_75%_at_50%_50%,transparent_35%,rgba(8,8,10,0.55)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

/**
 * Decides whether this device gets the WebGL hero at all.
 *
 * Deliberately conservative: the static poster is a complete hero, so a false
 * negative costs a visitor nothing, while a false positive costs a mid-range
 * phone its frame budget during the most important seconds of the page.
 *
 * Returns null while undecided — the check runs at idle so it never competes
 * with the largest contentful paint.
 */
export function useCapabilityGate(): boolean | null {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    const decide = () => {
      if (cancelled) return;

      const nav = navigator as NavigatorWithHints;

      // QA escape hatch: ?gl=force renders the scene regardless, so the WebGL
      // hero can be inspected in a headless browser or on a machine the gate
      // would otherwise (correctly) turn away. ?gl=off does the opposite.
      const override = new URLSearchParams(window.location.search).get("gl");
      if (override === "force") {
        setAllowed(true);
        return;
      }
      if (override === "off") {
        setAllowed(false);
        return;
      }

      // Someone who asked for less motion should not get a live 3D scene.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setAllowed(false);
        return;
      }

      if (nav.connection?.saveData) {
        setAllowed(false);
        return;
      }

      const effectiveType = nav.connection?.effectiveType;
      if (effectiveType === "slow-2g" || effectiveType === "2g") {
        setAllowed(false);
        return;
      }

      // Both hints are absent on some browsers (notably Safari); absence is
      // not treated as failure, only a reported-low value is.
      if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) {
        setAllowed(false);
        return;
      }

      if (
        typeof nav.hardwareConcurrency === "number" &&
        nav.hardwareConcurrency > 0 &&
        nav.hardwareConcurrency < 4
      ) {
        setAllowed(false);
        return;
      }

      // Last and most important: can we actually get a usable context?
      let supported = false;
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2", {
          failIfMajorPerformanceCaveat: true,
        });

        if (gl) {
          // `failIfMajorPerformanceCaveat` does not reliably reject software
          // rasterisers — Chrome happily hands back SwiftShader — so check the
          // renderer by name. Software WebGL means a hot, stuttering hero on a
          // device that can least afford it, and three.js costs seconds of
          // script evaluation to get there. The poster is the better hero.
          const info = gl.getExtension("WEBGL_debug_renderer_info");
          const renderer = String(
            info
              ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL)
              : gl.getParameter(gl.RENDERER),
          );

          supported =
            !/swiftshader|llvmpipe|softpipe|software|basic render|generic renderer/i.test(
              renderer,
            );
        }

        // Release the probe context immediately; browsers cap how many exist.
        gl?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        supported = false;
      }

      setAllowed(supported);
    };

    // requestIdleCallback is still missing in Safari at the time of writing.
    const supportsIdle = typeof window.requestIdleCallback === "function";
    const handle = supportsIdle
      ? window.requestIdleCallback(decide, { timeout: 2000 })
      : window.setTimeout(decide, 1200);

    return () => {
      cancelled = true;
      if (supportsIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  return allowed;
}

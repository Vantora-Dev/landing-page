import { site } from "./site";

/**
 * Google Analytics (GA4), kept to the one call this site needs.
 *
 * `trackEvent` writes to the same `dataLayer` queue the Google tag reads, so
 * it is safe to call before the tag has finished loading — the event is held
 * and sent once it has. With no measurement ID configured it does nothing.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (!site.gaId || typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  // gtag's queue expects the raw `arguments` object, not an array.
  (function gtag(..._args: unknown[]) {
    window.dataLayer!.push(arguments);
  })("event", name, params);
}

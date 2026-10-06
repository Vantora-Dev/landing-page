import Script from "next/script";
import { site } from "@/lib/site";

/**
 * The Google tag. The library itself loads after hydration so it never
 * competes with first paint. Renders nothing until NEXT_PUBLIC_GA_ID is set.
 *
 * Every full page load sends a `page_view`, which is how a visit to
 * `/confirmed` shows up as a booking. See `lib/analytics.ts` for events.
 */
export function Analytics() {
  if (!site.gaId) return null;

  return (
    <>
      {/* Inline and first, so the tag is configured before any component can
          queue an event; events queued ahead of `config` have no destination. */}
      <script
        // Build-time constant — no user input reaches this string.
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(site.gaId)});`,
        }}
      />
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`} />
    </>
  );
}

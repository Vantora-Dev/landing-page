import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Minimal manifest. Not an SEO ranking factor on its own, but it gives the
 * site a proper name and icon when someone adds it to a phone home screen,
 * and it's one of the installability signals Lighthouse looks for.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#08080a",
    theme_color: "#08080a",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

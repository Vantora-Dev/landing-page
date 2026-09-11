import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * One page, so one entry. When marketing pages are added (a city landing page,
 * a case study once a real one exists), list them here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

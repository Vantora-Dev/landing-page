import type { MetadataRoute } from "next";
import { publishedGuides } from "@/lib/guides";
import { site } from "@/lib/site";

/**
 * The homepage, the legal pages, and every published guide. Unpublished
 * guides never appear here, and /guides itself only appears once it has
 * something in it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const guides = publishedGuides();
  const latestGuide = guides[0]?.dateUpdated;

  return [
    {
      url: site.url,
      lastModified: new Date(site.contentUpdatedAt),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...(guides.length
      ? [
          {
            url: `${site.url}/guides`,
            lastModified: new Date(latestGuide),
            changeFrequency: "weekly" as const,
            priority: 0.8,
          },
        ]
      : []),
    ...guides.map((guide) => ({
      url: `${site.url}/guides/${guide.slug}`,
      lastModified: new Date(guide.dateUpdated),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${site.url}/privacy`,
      lastModified: new Date(site.legalUpdatedAt),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${site.url}/terms`,
      lastModified: new Date(site.legalUpdatedAt),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}

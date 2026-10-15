import type { MetadataRoute } from "next";
import { publishedPosts } from "@/lib/blog";
import { site } from "@/lib/site";

/**
 * The homepage, the legal pages, and every published post. Unpublished
 * posts never appear here, and /blog itself only appears once it has
 * something in it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = publishedPosts();
  const latestPost = posts[0]?.dateUpdated;

  return [
    {
      url: site.url,
      lastModified: new Date(site.contentUpdatedAt),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...(posts.length
      ? [
          {
            url: `${site.url}/blog`,
            lastModified: new Date(latestPost),
            changeFrequency: "weekly" as const,
            priority: 0.8,
          },
        ]
      : []),
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.dateUpdated),
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

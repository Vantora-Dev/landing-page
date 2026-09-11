import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nothing to index behind the contact endpoint.
      disallow: "/api/",
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}

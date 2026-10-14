/**
 * Guides: the articles and blog posts the keyword plan is built around.
 *
 * How it works
 * ------------
 * Every article is one entry in `guides` below. It renders at
 * /guides/<slug>, gets Article + BreadcrumbList (+ FAQPage when it has
 * questions) JSON-LD, and goes into the sitemap — but only once
 * `published: true`. Until the first guide is published, /guides 404s and the
 * "Guides" nav link stays hidden, so Google never sees an empty or thin page.
 *
 * Each guide belongs to one hub (a topic cluster). One primary keyword per
 * guide, never shared with another guide or the homepage: two URLs chasing
 * the same search split the ranking between them.
 *
 * The same copy rules as the rest of the site apply (see README): no invented
 * revenue figures, customer counts, percentages or testimonials, and never
 * "you don't need staff".
 */

export type GuideSection = {
  /** Becomes an h2 and an in-page anchor. Phrase it the way people search. */
  heading: string;
  /** Plain paragraphs. Keep each one short. */
  paragraphs: string[];
};

export type Guide = {
  slug: string;
  hub: HubKey;
  /** The h1 and the <title>. */
  title: string;
  /** Meta description and the card blurb on /guides. ~150 characters. */
  description: string;
  /** The single search this page is built to rank for. */
  primaryKeyword: string;
  /** Close variants this page also answers. Never another guide's primary. */
  secondaryKeywords: string[];
  /** ISO date. Bump `updated` only when the content meaningfully changes. */
  published: boolean;
  datePublished: string;
  dateUpdated: string;
  /** One or two sentences that answer the question outright, first thing. */
  answer: string;
  sections: GuideSection[];
  faq?: { q: string; a: string }[];
};

/**
 * The topic clusters. Each hub's `keywords` is the planning list it owns; the
 * guides that cover them are added to `guides` as they're written.
 */
export const hubs = {
  memberships: {
    name: "Memberships and recurring revenue",
    keywords: [
      "laundromat membership plans",
      "laundromat membership plan",
      "laundromat membership program",
      "laundromat subscription service",
      "recurring laundry plan",
      "wash and fold memberships",
      "laundromat recurring revenue",
    ],
  },
  washAndFold: {
    name: "Wash and fold",
    keywords: [
      "add wash and fold service laundromat",
      "laundromat wash and fold",
      "wash and fold business",
      "launch wash and fold drop off",
      "how to price wash and fold service",
      "laundromat wash and fold rates",
      "wash and fold laundromat staffing",
    ],
  },
  delivery: {
    name: "Pickup and delivery",
    keywords: [
      "laundromat pickup and delivery",
      "laundromat pickup delivery service",
      "laundromat delivery service",
      "wash and fold delivery",
      "wash fold pickup service",
      "wash and fold delivery logistics",
      "start laundry delivery business",
      "laundromat delivery app",
    ],
  },
  apps: {
    name: "Competing with laundry apps",
    keywords: [
      "compete with laundry delivery apps",
      "laundromat vs rinse vs poplin",
      "local laundromat vs laundry app",
    ],
  },
  revenue: {
    name: "Growing revenue",
    keywords: [
      "increase laundromat revenue",
      "grow laundromat income",
      "laundromat revenue growth",
      "laundromat profit without expansion",
    ],
  },
  retention: {
    name: "Customers and retention",
    keywords: [
      "laundromat customer retention",
      "laundromat customer database",
      "capture laundromat customer info",
      "laundromat email marketing",
      "laundromat marketing automation",
    ],
  },
  localSearch: {
    name: "Google and local search",
    keywords: [
      "local seo for laundromats",
      "laundromat google business profile",
      "google reviews laundromat",
      "laundromat digital marketing",
    ],
  },
  software: {
    name: "Software and systems",
    keywords: [
      "best app for laundromat owners",
      "laundromat operations software",
      "laundromat service software",
      "laundromat automation",
      "laundromat online ordering",
      "laundromat online booking",
      "laundromat website setup",
    ],
  },
} as const;

export type HubKey = keyof typeof hubs;

/**
 * Add articles here. Leave `published: false` while drafting; it stays out of
 * the build, the sitemap and the nav until it's flipped.
 */
export const guides: Guide[] = [];

export const publishedGuides = (): Guide[] =>
  guides
    .filter((guide) => guide.published)
    .sort((a, b) => b.dateUpdated.localeCompare(a.dateUpdated));

export const hasPublishedGuides = (): boolean => publishedGuides().length > 0;

export const getGuide = (slug: string): Guide | undefined =>
  publishedGuides().find((guide) => guide.slug === slug);

export const sectionId = (heading: string): string =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

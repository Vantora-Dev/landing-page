/**
 * Single source of truth for site-wide facts.
 * TODO(launch): confirm the email address before going live.
 */

/**
 * The env var is optional — the default below is the real production value,
 * so the site deploys correctly with nothing configured.
 *
 * It is also normalised, because the likely way to mistype it fails silently
 * rather than loudly: a trailing slash produces
 * `https://laundrogrid.com//sitemap.xml` in robots.txt and doubled slashes in
 * every JSON-LD @id.
 */
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://laundrogrid.com")
  .trim()
  .replace(/\/+$/, "");

export const site = {
  name: "LaundroGrid",
  domain: "laundrogrid.com",
  url: siteUrl,
  email: "hello@laundrogrid.com",

  /**
   * Displayed as written; `phoneHref` is the same number in E.164 for tel:
   * links. Keep the two in sync — they are the same number, formatted for a
   * human and for a dialler respectively.
   */
  phone: "+44 800 820 3356",
  phoneHref: "+448008203356",

  /**
   * Public profiles. Listed in JSON-LD `sameAs`, which is how Google ties this
   * site and that profile to the same organisation — so the URL must match the
   * canonical one exactly, trailing slash included.
   */
  linkedin: "https://www.linkedin.com/company/laundrogrid/",

  /**
   * GA4 measurement ID ("G-XXXXXXXXXX"). Empty means no analytics script is
   * loaded at all.
   */
  gaId: (process.env.NEXT_PUBLIC_GA_ID ?? "").trim(),

  /**
   * Date the page's content last meaningfully changed — used for sitemap
   * `lastmod`. Deliberately a constant rather than `new Date()`: a lastmod
   * that moves on every deploy tells Google the page changed when it didn't,
   * and a crawler that learns your lastmod is meaningless starts ignoring it.
   * Bump this when the copy actually changes.
   */
  contentUpdatedAt: "2026-10-15",

  /** Last change to /privacy or /terms. Shown on both pages and in the sitemap. */
  legalUpdatedAt: "2026-10-14",

  /** The registered business behind the site, as named on the legal pages. */
  legalEntity: "Laundrogrid",
  legalAddress: "2, Street 84, G-6/4, Islamabad 44000, Pakistan",

  tagline: "Digital growth for laundromats and launderettes",
  description:
    "LaundroGrid runs the digital side of independent laundromats and launderettes: website, Google listing and reviews to win new customers, plus online wash-and-fold ordering, pickup and delivery, memberships and automated follow-ups to keep them coming back. You keep running the store.",
} as const;

/**
 * Rooted at "/" so the same links work from /blog and the legal pages. On
 * the homepage a browser treats "/#system" as an in-page jump, no reload.
 */
export const nav = [
  { label: "The problem", href: "/#problem" },
  { label: "What we run", href: "/#system" },
  { label: "Revenue", href: "/#revenue" },
  { label: "How it works", href: "/#process" },
  { label: "What it costs", href: "/#cost" },
  { label: "FAQ", href: "/#faq" },
] as const;

/** Shown in the header and footer only once a post is published. */
export const blogNavItem = { label: "Blog", href: "/blog" } as const;

export const legalNav = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of use", href: "/terms" },
] as const;

export const CTA_PRIMARY = "Book a 15-minute call";
export const CTA_HREF = "/#book";

/** Where a successful booking lands. Analytics counts a view of it as a lead. */
export const CONFIRMED_PATH = "/confirmed";

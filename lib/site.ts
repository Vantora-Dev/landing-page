/**
 * Single source of truth for site-wide facts.
 * TODO(launch): confirm email + Cal.com handle before going live.
 */

/**
 * Both env vars are optional — the defaults below are the real production
 * values, so the site deploys correctly with nothing configured.
 *
 * Both are also normalised, because the two likely ways to mistype them fail
 * silently rather than loudly: a trailing slash on the site URL produces
 * `https://laundrogrid.com//sitemap.xml` in robots.txt and doubled slashes in
 * every JSON-LD @id, and pasting a whole cal.com URL instead of the handle
 * produces `https://cal.com/https://cal.com/...` in the booking iframe.
 */
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://laundrogrid.com")
  .trim()
  .replace(/\/+$/, "");

const calLink = (process.env.NEXT_PUBLIC_CAL_LINK ?? "")
  .trim()
  .replace(/^https?:\/\/(www\.)?cal\.com/i, "")
  .replace(/^\/+|\/+$/g, "");

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
  phone: "+92 333 0500600",
  phoneHref: "+923330500600",

  /**
   * Public profiles. Listed in JSON-LD `sameAs`, which is how Google ties this
   * site and that profile to the same organisation — so the URL must match the
   * canonical one exactly, trailing slash included.
   */
  linkedin: "https://www.linkedin.com/company/laundrogrid/",

  /**
   * Cal.com booking handle, e.g. "laundrogrid/15min".
   * The booking embed renders a clearly-marked placeholder until this is set.
   */
  calLink,

  /**
   * Date the page's content last meaningfully changed — used for sitemap
   * `lastmod`. Deliberately a constant rather than `new Date()`: a lastmod
   * that moves on every deploy tells Google the page changed when it didn't,
   * and a crawler that learns your lastmod is meaningless starts ignoring it.
   * Bump this when the copy actually changes.
   */
  contentUpdatedAt: "2026-09-21",

  tagline: "Digital revenue systems for US laundromats",
  description:
    "LaundroGrid installs and operates the digital revenue system for independent US laundromats — website, online wash-and-fold ordering, pickup and delivery, memberships, customer database and marketing automation. You keep running the store.",
} as const;

export const nav = [
  { label: "The problem", href: "#problem" },
  { label: "What we install", href: "#system" },
  { label: "Revenue", href: "#revenue" },
  { label: "How it works", href: "#process" },
  { label: "What it costs", href: "#cost" },
  { label: "FAQ", href: "#faq" },
] as const;

export const CTA_PRIMARY = "Book a 15-minute call";
export const CTA_HREF = "#book";

/**
 * Single source of truth for site-wide facts.
 * TODO(launch): confirm email + Cal.com handle before going live.
 */
export const site = {
  name: "LaundroGrid",
  domain: "laundrogrid.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://laundrogrid.com",
  email: "hello@laundrogrid.com",

  /**
   * Cal.com booking handle, e.g. "laundrogrid/15min".
   * The booking embed renders a clearly-marked placeholder until this is set.
   */
  calLink: process.env.NEXT_PUBLIC_CAL_LINK ?? "",

  tagline: "Digital revenue systems for US laundromats",
  description:
    "LaundroGrid installs and operates the digital revenue system for independent US laundromats — website, online wash-and-fold ordering, pickup and delivery, memberships, customer database and marketing automation. You keep running the store.",
} as const;

export const nav = [
  { label: "The problem", href: "#problem" },
  { label: "What we install", href: "#system" },
  { label: "Revenue", href: "#revenue" },
  { label: "How it works", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export const CTA_PRIMARY = "Book a 15-minute call";
export const CTA_HREF = "#book";

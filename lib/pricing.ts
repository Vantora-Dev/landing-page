/**
 * Pricing.
 *
 * Everything routes to a call — there is no checkout, no self-signup.
 * Edit the numbers here and nowhere else.
 *
 * Deliberately absent: setup fees (quoted per store on the call) and any
 * claim about what a tier will earn. We do not promise revenue figures.
 */
export type Tier = {
  id: string;
  name: string;
  /** Monthly price floor, USD. Rendered as "from $X/month". */
  from: number;
  /** One line on who the tier is for. */
  summary: string;
  /** What this tier adds on top of the one before it. */
  inherits?: string;
  features: string[];
  emphasis?: boolean;
  /** Shown instead of "most common" on the emphasised tier. */
  flag?: string;
};

export const tiers: Tier[] = [
  {
    id: "essential",
    name: "Essential",
    from: 497,
    summary:
      "A real storefront online, found on Google, collecting reviews. The base every other stream sits on.",
    features: [
      "Website designed, built and hosted",
      "Mobile-first, fast, maintained by us",
      "Google Business Profile set up and managed",
      "Review generation and monitoring",
      "Monthly performance report",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    from: 997,
    summary:
      "Where the store stops being anonymous. Orders come in online and every one of them creates a customer record.",
    inherits: "Everything in Essential, plus",
    emphasis: true,
    flag: "Most common starting point",
    features: [
      "Online wash-and-fold ordering and payment",
      "Customer database that builds itself from orders",
      "Automated SMS and email — order ready, win-back, review requests",
      "Local SEO for your service area",
      "Order and customer reporting",
    ],
  },
  {
    id: "revenue",
    name: "Revenue",
    from: 1997,
    summary:
      "The full system, including the part that puts a floor under the month: memberships.",
    inherits: "Everything in Growth, plus",
    features: [
      "Monthly membership plans, built and billed",
      "Pickup and delivery booking with time windows",
      "Retention and win-back campaign management",
      "Commercial account support",
      "Monthly growth consulting call",
    ],
  },
];

/** Honesty signal. Shown in plain type under the tiers — not as fine print. */
export const pricingNote = {
  heading: "Two things we say up front",
  items: [
    {
      title: "Advertising budget is separate",
      body: "If you choose to run ads, that budget is paid by you, directly to Google or Meta. We never mark it up and we never take a cut of it. What you pay us is what's on this page.",
    },
    {
      title: "Setup is quoted on the call",
      body: "It depends on how many locations you have and what already exists. We'd rather quote it after seeing your store than put a number here that turns out to be wrong.",
    },
  ],
};

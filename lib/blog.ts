/**
 * The blog: the articles the keyword plan is built around.
 *
 * How it works
 * ------------
 * Every article is one entry in `posts` below. It renders at
 * /blog/<slug>, gets Article + BreadcrumbList (+ FAQPage when it has
 * questions) JSON-LD, and goes into the sitemap — but only once
 * `published: true`. Until the first post is published, /blog 404s and the
 * "Blog" nav link stays hidden, so Google never sees an empty or thin page.
 *
 * Each post belongs to one hub (a topic cluster). One primary keyword per
 * post, never shared with another post or the homepage: two URLs chasing
 * the same search split the ranking between them.
 *
 * The same copy rules as the rest of the site apply (see README): no invented
 * revenue figures, customer counts, percentages or testimonials, and never
 * "you don't need staff".
 */

export type PostSection = {
  /** Becomes an h2 and an in-page anchor. Phrase it the way people search. */
  heading: string;
  /** Plain paragraphs. Keep each one short. */
  paragraphs: string[];
};

export type Post = {
  slug: string;
  hub: HubKey;
  /** The h1 and the <title>. */
  title: string;
  /** Meta description and the card blurb on /blog. ~150 characters. */
  description: string;
  /** The single search this page is built to rank for. */
  primaryKeyword: string;
  /** Close variants this page also answers. Never another post's primary. */
  secondaryKeywords: string[];
  /** ISO date. Bump `updated` only when the content meaningfully changes. */
  published: boolean;
  datePublished: string;
  dateUpdated: string;
  /** One or two sentences that answer the question outright, first thing. */
  answer: string;
  sections: PostSection[];
  faq?: { q: string; a: string }[];
};

/**
 * The topic clusters. Each hub's `keywords` is the planning list it owns; the
 * posts that cover them are added to `posts` as they're written.
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
export const posts: Post[] = [
  {
    slug: "laundromat-membership-plans",
    hub: "memberships",
    title: "Laundromat membership plans: how to design one your store can deliver",
    description:
      "How to build a monthly membership plan for a laundromat or launderette: what to include, how to price it, and the rules that keep it from costing you money.",
    primaryKeyword: "laundromat membership plans",
    secondaryKeywords: [
      "laundromat membership program",
      "laundromat subscription service",
      "recurring laundry plan",
      "wash and fold memberships",
    ],
    published: true,
    datePublished: "2026-10-15",
    dateUpdated: "2026-10-15",
    answer:
      "A laundromat membership plan is a fixed monthly payment for a set amount of service, usually wash-and-fold, often with pickup and delivery included. It works when the allowance is something your store can reliably deliver, the price is built from your real costs, and the rules on unused allowance, pausing and cancelling are written down before the first member signs up.",
    sections: [
      {
        heading: "What a laundromat membership plan is",
        paragraphs: [
          "A membership turns your best regulars into a monthly payment. Instead of paying per load or per bag, a member pays the same amount every month and gets a set allowance in return: so much wash-and-fold, a number of collections, or both.",
          "For the store, the value is timing. Self-service takes whatever the week brings in. A membership bills on the same day every month, whether it rains, whether it's a holiday week, and whether a new store opened down the road.",
          "It is not a loyalty card. A stamp card rewards people after they've paid. A membership is paid in advance, which is why it needs more care to set up.",
        ],
      },
      {
        heading: "Who a membership is for",
        paragraphs: [
          "Start with the people who already use your wash-and-fold or service wash every week or two: busy households, people without a machine at home, students, and anyone who already books collection. They know the service and they're already paying for it piece by piece.",
          "Self-service customers who only use the machines are a harder sell. Most of them came for the machines and the price, and a monthly plan asks them to change how they do laundry. They're better reached first with wash-and-fold, and offered a membership once they're regulars.",
          "If your store doesn't offer wash-and-fold or collection yet, add that first. A membership with nothing to draw on is just a prepaid voucher.",
        ],
      },
      {
        heading: "What to put in the plan",
        paragraphs: [
          "Keep the allowance in the unit your counter already uses. If you charge wash-and-fold by weight, the plan is a weight per month. If you charge by the bag, it's bags. Members should be able to check what they've used without doing sums.",
          "Decide whether collection and delivery are included or charged on top. Including them makes the plan simple to explain, but every included collection is a driver's time, so cap the number per month.",
          "Two or three plans are enough: one for a single person, one for a household, and perhaps one with collection included. More choice than that slows people down at the moment they're deciding.",
        ],
      },
      {
        heading: "How to price it",
        paragraphs: [
          "Build the price up from your costs, not down from a competitor's. Work out what one unit of wash-and-fold costs you in labour, utilities, detergent and bags, add what a collection costs in driver time and fuel, then price the monthly allowance so that a member who uses all of it still leaves you a margin.",
          "A small saving against the pay-as-you-go price gives people a reason to commit. Don't make the discount so deep that your heaviest users become your least profitable customers.",
          "Overage needs a price too. When a member goes over their allowance, charge the extra at your normal rate, or at a member rate slightly below it. Write that down before launch so the counter never has to decide on the spot.",
        ],
      },
      {
        heading: "The rules to write down before launch",
        paragraphs: [
          "Unused allowance. The simplest rule is that it doesn't roll over: each month's allowance is for that month. Rollover sounds generous but builds up a liability of service you owe and can't plan staff around.",
          "Pausing and cancelling. Let members pause for a month or cancel from their phone, and tell them before each renewal if your plan runs for longer than a month. Auto-renewing payments are regulated in many places, the UK and many US states included. Making cancellation as easy as signing up is the safe default and the one that keeps goodwill.",
          "Missed payments. Decide what happens when a card fails: whether the member can keep ordering while you retry, and for how long. A plan that still hands out allowance after the payment has failed is giving the service away.",
        ],
      },
      {
        heading: "Running memberships once they're live",
        paragraphs: [
          "Every member's usage should be visible at the counter and on the member's phone. Disputes about what someone has left almost always come from one side not being able to see the number.",
          "Watch which members are using little of their allowance. They're the ones most likely to cancel, and a short message offering a collection is cheaper than winning them back later.",
          "Launch to your regulars first, in person and by message, before you advertise to anyone else. They're the people most likely to join, and they'll tell you what's unclear before strangers do.",
        ],
      },
    ],
    faq: [
      {
        q: "Do laundromat memberships work for self-service-only stores?",
        a: "Not on their own. A membership needs a service to draw on, which is usually wash-and-fold or collection and delivery. A self-service-only store should add one of those first, then offer a membership to the customers who use it regularly.",
      },
      {
        q: "Should unused membership allowance roll over?",
        a: "Usually not. A no-rollover rule keeps the plan simple and stops you owing a growing amount of service you can't staff for. Say so clearly at sign-up so nobody feels short-changed.",
      },
      {
        q: "How many membership plans should a launderette offer?",
        a: "Two or three. One for a single person, one for a household, and optionally one with collection included. More options make the choice harder without adding many members.",
      },
    ],
  },
  {
    slug: "add-wash-and-fold-to-a-laundromat",
    hub: "washAndFold",
    title: "How to add wash-and-fold to a self-service laundromat",
    description:
      "A step-by-step plan for adding wash-and-fold or a service wash to a laundromat or launderette: hours, pricing, staffing, policies and taking orders online.",
    primaryKeyword: "add wash and fold service laundromat",
    secondaryKeywords: [
      "laundromat wash and fold",
      "launch wash and fold drop off",
      "wash and fold laundromat staffing",
    ],
    published: true,
    datePublished: "2026-10-15",
    dateUpdated: "2026-10-15",
    answer:
      "Start small: offer drop-off wash-and-fold during set hours when someone is already in the store, price it by weight or by bag from your real costs, write down your turnaround and damage policies, and let people order and pay online. Hire for it only once the orders show the demand is there.",
    sections: [
      {
        heading: "Why wash-and-fold is the natural next service",
        paragraphs: [
          "Wash-and-fold, called a service wash in much of the UK, uses the machines you already own. The customer drops off a bag, you wash, dry and fold it, and they collect it later or have it delivered.",
          "It reaches people self-service doesn't: those who don't have time to sit with a load, or who would rather pay than spend an evening at the store. It's also the service most customers expect to book and pay for on a phone, which means each order can leave you a name and a way to reach them again.",
          "It does need people. Every bag has to be weighed, washed, folded and handed back by someone, so the question isn't whether to staff it but how much, and when.",
        ],
      },
      {
        heading: "Step 1: Start with limited hours",
        paragraphs: [
          "You don't have to offer wash-and-fold all day. Pick drop-off hours when someone is already in the store, such as the morning shift, and promise a turnaround you can keep from those hours alone.",
          "If the store is unattended today, consider a fixed drop-off window on a few days a week, staffed by one person who also covers cleaning and maintenance during it. That gives you real orders to measure before any new hire.",
        ],
      },
      {
        heading: "Step 2: Price it from your costs",
        paragraphs: [
          "Most stores charge by weight, per pound in the US and per kilo in the UK, or by a standard bag. Weight is fairer on mixed loads; a bag price is easier to explain and needs no scale at the counter.",
          "Work out what one unit costs you: the attendant's time to wash and fold it, water, power, detergent and the bag it goes home in. Price above that with a margin, then check where you sit against nearby stores. Set a minimum order so one shirt doesn't take a machine and a person's time for almost nothing.",
          "Decide what costs extra before the first order arrives: duvets and bulky items, delicates, ironing, and same-day turnaround.",
        ],
      },
      {
        heading: "Step 3: Write the policies down",
        paragraphs: [
          "Every load is washed on its own, so one customer's clothes never mix with another's. Tag each bag with the customer's name and order as it comes in.",
          "Write a short policy on lost or damaged items, items left in pockets, and garments you won't accept, and show it before people pay. It protects you and it saves the conversation at the counter.",
          "Say how long you'll keep an order that hasn't been collected, and what happens after that.",
        ],
      },
      {
        heading: "Step 4: Let customers order and pay online",
        paragraphs: [
          "A drop-off service that only works at the counter is limited to people who already walk past. Online ordering lets customers book a drop-off or a collection, choose options and pay before they arrive.",
          "Paying in advance cuts no-shows and disputes about price. And each online order gives you a name, contact details and an order history, which a cash drop-off doesn't.",
        ],
      },
      {
        heading: "Step 5: Measure, then staff up",
        paragraphs: [
          "Track orders by day and by hour for the first few months. The pattern tells you when to extend hours, when a second person would pay for themselves, and whether collection and delivery are worth adding.",
          "Hire for the demand you can see, not the demand you hope for. Adding hours one block at a time is slower than hiring a team on day one, but it doesn't leave you paying people to wait for bags.",
        ],
      },
    ],
    faq: [
      {
        q: "Can an unattended laundromat offer wash-and-fold?",
        a: "Yes, with set drop-off hours. Someone has to be in the store to take, wash and fold each order, but that can be a few staffed windows a week rather than a full day, and it can grow as orders do.",
      },
      {
        q: "Is a service wash the same as wash-and-fold?",
        a: "Yes. Service wash is the usual UK name for the same drop-off service: the store washes, dries and folds your laundry for you.",
      },
      {
        q: "Should I charge wash-and-fold by weight or by bag?",
        a: "Weight is fairer when loads vary and is what many customers expect. A bag price is simpler and needs no scale. Either works if it's built from your costs and the minimum order covers the time each load takes.",
      },
    ],
  },
  {
    slug: "laundromat-google-business-profile",
    hub: "localSearch",
    title: "Laundromat Google Business Profile: setting it up and keeping it right",
    description:
      "How to set up and run a Google Business Profile for a laundromat or launderette: categories, hours, services, photos and reviews, within Google's rules.",
    primaryKeyword: "laundromat google business profile",
    secondaryKeywords: ["google reviews laundromat", "local seo for laundromats"],
    published: true,
    datePublished: "2026-10-15",
    dateUpdated: "2026-10-15",
    answer:
      "Claim and verify the profile, use your real business name, choose Laundromat as the primary category, list every service you offer, keep regular and holiday hours exact, add recent photos of the store, and ask every customer for a review in the same way, answering each one. Most searches for a laundromat are answered from this profile before anyone sees a website.",
    sections: [
      {
        heading: "Why the profile matters more than the website",
        paragraphs: [
          "When someone searches for a laundromat or launderette near them, Google usually answers with a map and a short list of stores. That list is built from Google Business Profiles. Many people choose a store from it, call it or ask for directions, and never open a website at all.",
          "Google ranks those results on three things: how relevant the profile is to the search, how close the store is to the person searching, and how prominent the business is, which includes its reviews. You can't move your store closer, so relevance and prominence are where the work goes.",
        ],
      },
      {
        heading: "Set up the basics correctly",
        paragraphs: [
          "Use the name on your signage and nothing else. Adding words like 'cheap' or '24 hour laundry' to the business name breaks Google's guidelines and can get the profile suspended.",
          "Choose Laundromat as the primary category, then add secondary categories only for services you actually offer, such as dry cleaning or a laundry service. The categories are among the strongest signals Google uses to decide which searches you appear in.",
          "Keep the address and phone number identical everywhere they appear: the profile, your website, social pages and directories. Different versions of the same details make Google less sure which is right.",
        ],
      },
      {
        heading: "Hours, services and attributes",
        paragraphs: [
          "Hours are what most people check. Set regular hours exactly, and add holiday hours before every public holiday. A customer who arrives at a locked door because the profile was wrong leaves a review about it.",
          "If you run wash-and-fold or a service wash, collection and delivery, or commercial accounts, list each one as a service with a short, plain description. Add attributes that are true for your store, such as accessibility, payment types or free Wi-Fi.",
          "Link the profile to the page where people can order or book, not just to your homepage, so a search turns into an order in one step.",
        ],
      },
      {
        heading: "Photos and posts",
        paragraphs: [
          "Add real photos: the outside as people see it from the street, so they can find you, the machines, the folding area and the counter. Replace them when the store changes. Stock images don't help, and outdated ones make the store look neglected.",
          "Posts are short updates shown on the profile. Use them for things a customer would act on: new hours, a new service, a membership launch or a holiday closure.",
        ],
      },
      {
        heading: "Reviews: asking, answering and staying within the rules",
        paragraphs: [
          "The steady way to earn reviews is to ask every customer, at a natural moment such as after a wash-and-fold order is collected. A short message with a direct link to the review form works better than a sign on the wall.",
          "Ask everyone the same way. Google's policies forbid offering discounts or anything else in return for a review, and forbid asking only the customers you expect to be happy. Fake or paid reviews are also unlawful in many places, the US and the UK included.",
          "Answer every review, good and bad, in a calm and specific way. A clear reply to a complaint is read by every future customer who sees it, and often says more about the store than the complaint does.",
        ],
      },
      {
        heading: "Keeping it right over time",
        paragraphs: [
          "Anyone can suggest edits to your profile, including hours and phone numbers, and Google sometimes accepts them. Check the profile regularly and correct anything that has changed without you.",
          "Answer questions people leave on the profile, and update it the same day anything changes in the store: a new service, new hours or new prices. A profile that's kept current is one Google and customers can both trust.",
        ],
      },
    ],
    faq: [
      {
        q: "What category should a laundromat use on Google Business Profile?",
        a: "Laundromat as the primary category, with secondary categories only for services the store really offers, such as dry cleaning or a laundry service. Categories are among the main signals Google uses to match a profile to searches.",
      },
      {
        q: "Can I offer a discount for Google reviews?",
        a: "No. Google's policies forbid offering anything in exchange for a review, and forbid asking only happy customers. Ask every customer the same way, with a direct link, and answer the reviews you get.",
      },
      {
        q: "Does a launderette need a website if it has a Google Business Profile?",
        a: "The profile wins the search, but it can't take an order or keep a customer's details. A website that takes wash-and-fold and collection orders is what turns a search into a booking, and a booking into a regular.",
      },
    ],
  },
];

export const publishedPosts = (): Post[] =>
  posts
    .filter((post) => post.published)
    .sort((a, b) => b.dateUpdated.localeCompare(a.dateUpdated));

export const hasPublishedPosts = (): boolean => publishedPosts().length > 0;

export const getPost = (slug: string): Post | undefined =>
  publishedPosts().find((post) => post.slug === slug);

export const sectionId = (heading: string): string =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/**
 * Section copy.
 *
 * Kept out of the JSX so wording can be edited without touching components.
 *
 * Hard constraints on anything written here (see README):
 *  - no revenue-per-machine or machine-level analytics claims
 *  - never "you don't need staff" — wash-and-fold needs people, say so
 *  - no specific customer counts, revenue figures, percentages or multiples
 *  - no testimonials, client logos or case studies until real ones exist
 */

export const hero = {
  eyebrow: "Digital growth for laundromats and launderettes",
  headline: ["We bring them in.", "We bring them back."],
  lead: "LaundroGrid runs the digital side of your store. Your website, Google listing and reviews win new customers; online ordering, delivery, memberships and follow-ups keep them coming back. You keep running the floor.",
  trust: [
    "Built for independent laundromats and launderettes",
    "Month to month",
    "Your data is yours",
  ],
  /** Read by screen readers in place of the decorative canvas. */
  canvasDescription:
    "An abstract grid of laundry machines. Grey, unconnected nodes light up one by one and link together as new visitors become regular customers.",
};

export const problem = {
  label: "01 / The problem",
  heading: "Most laundromats run on walk-ins and luck.",
  beats: [
    {
      n: "01",
      title: "New customers can't find you.",
      body: "An out-of-date Google listing, reviews nobody asked for, and a website that can't take an order. Someone nearby searches for wash-and-fold and books a delivery app instead.",
    },
    {
      n: "02",
      title: "Regulars drift off without a word.",
      body: "You don't have their name or number, so you can't remind them, thank them or win them back. When they stop coming, you don't find out. You just earn less.",
    },
    {
      n: "03",
      title: "Every month starts from zero.",
      body: "Nothing bills on the 1st. A holiday, a wet week or a new store down the road decides the month, and you find out as it happens.",
    },
  ],
  closer: "That isn't a marketing problem. It's a missing system.",
};

export const system = {
  label: "02 / What we run",
  heading: "Eight parts. One system. We build it, then we run it.",
  lead: "Every part feeds the same customer record, so a first order turns into a second, and a regular turns into a member.",
  parts: [
    {
      key: "site",
      name: "A website that takes orders",
      body: "Built for your store, fast on a phone, hosted and kept accurate by us. You never log into anything.",
    },
    {
      key: "ordering",
      name: "Online wash-and-fold ordering",
      body: "Customers order and pay from their phone, on your pricing, turnaround and service area.",
    },
    {
      key: "delivery",
      name: "Pickup and delivery booking",
      body: "Time-window booking for the routes you actually run, with addresses, access notes and repeat schedules handled in the booking.",
    },
    {
      key: "memberships",
      name: "Monthly membership plans",
      body: "Recurring plans built around what your store can deliver. This is the part that changes the shape of your revenue.",
      accent: true,
    },
    {
      key: "database",
      name: "A customer record that builds itself",
      body: "Every order, booking and membership adds a name, contact details and history. No data entry, and it's yours.",
      accent: true,
    },
    {
      key: "automation",
      name: "Automated texts and email",
      body: "Order-ready alerts, win-back messages for regulars who've gone quiet, and review requests after a good visit, in your store's voice.",
    },
    {
      key: "google",
      name: "Google listing and reviews",
      body: "Hours, photos and services kept current. Review requests going out steadily, and every review answered.",
    },
    {
      key: "dashboard",
      name: "A dashboard you can read",
      body: "Orders, active members and revenue by stream, live whenever you want it and summed up in a monthly report.",
    },
  ],
};

export const streams = {
  label: "03 / Revenue streams",
  heading: "Self-service is your floor. It shouldn't be your ceiling.",
  lead: "The machines keep doing what they do. We add the streams around them that can be booked, tracked and billed.",
  base: {
    name: "Self-service",
    body: "Already running and left exactly as it is. Everything else stacks on top.",
  },
  items: [
    {
      name: "Wash and fold",
      body: "Priced, ordered and paid online instead of sorted out at the counter.",
      staffing: "Needs people",
    },
    {
      name: "Pickup and delivery",
      body: "A booked route with time windows, reaching people who'd never walk into a laundromat.",
      staffing: "Needs people and a vehicle",
    },
    {
      name: "Commercial accounts",
      body: "Salons, gyms, restaurants and short-term rentals. Steady weekly volume, invoiced rather than paid by the load.",
      staffing: "Needs capacity",
    },
  ],
  membership: {
    label: "The headline stream",
    name: "Memberships",
    heading: "Money that arrives on the 1st.",
    body: "A plan your regulars pay every month: a set amount of wash-and-fold, delivery included, shaped around your store. It bills when it rains and it bills over a holiday. It's a floor under the month.",
    footnote:
      "It's also the hardest one to add, so it's the last thing we switch on, not the first.",
  },
  honesty:
    "Wash-and-fold and delivery need hands. Before you commit to a stream, we'll tell you what staffing it takes: hours, headcount and cost.",
};

export const process = {
  label: "04 / How it works",
  heading: "You send your details and photos. We handle the rest.",
  lead: "Four steps. Your part is a couple of calls and a few decisions only you can make.",
  steps: [
    {
      n: "01",
      title: "Discovery call",
      duration: "15 minutes",
      body: "We look at your store, your area and what you already do. You leave knowing whether this is worth doing, even when the answer is no.",
      you: "Answer questions about your store",
    },
    {
      n: "02",
      title: "We build and set up everything",
      duration: "Our work, not yours",
      body: "Website, ordering, delivery windows, memberships, automations and your Google listing. We write it, build it, connect it and test it.",
      you: "Send business details and photos",
    },
    {
      n: "03",
      title: "We train your staff",
      duration: "One short session",
      body: "A walk-through of taking online orders, plus a one-page reference for the counter. We stay reachable after.",
      you: "Give us an hour with your team",
    },
    {
      n: "04",
      title: "We run it and report monthly",
      duration: "Ongoing",
      body: "Monitoring, automation tuning, reviews, campaigns and changes. A report and a call every month. It stays our job.",
      you: "Read the report. Take the call.",
    },
  ],
  quote: "You send your details and photos. We handle the rest.",
};

/**
 * Replaces the old pricing table.
 *
 * The section still answers "what does it cost?" head-on rather than pretending
 * a skeptical buyer won't ask. It just answers it straight: the number depends
 * on the store. The advertising-budget note is kept because it is the strongest
 * trust signal on the page.
 */
export const cost = {
  label: "05 / What it costs",
  heading: "Pricing depends on your store. So we quote it on a call, not on a page.",
  lead: "A two-location operator already doing wash-and-fold and an unattended single store need different systems. A price list can't tell them apart. Fifteen minutes on the phone can.",
  notes: [
    {
      title: "Ad budget is separate",
      body: "If you run ads, you pay Google or Meta directly. We never mark it up or take a cut.",
    },
    {
      title: "Setup is quoted after we've seen the store",
      body: "It depends on how many locations you have and what already exists, so we look before we quote.",
    },
    {
      title: "Month to month",
      body: "No lock-in. Your customer list, order history and contact details are yours to export and take with you.",
    },
  ],
  callPrompt: "Prefer to just talk?",
};

export const fit = {
  label: "06 / Who this is for",
  heading: "Two ways in. Pick the one that fits your store.",
  lead: "Where you start depends on what your store already does.",
  paths: [
    {
      key: "wf",
      condition: "You already do wash-and-fold",
      title: "We make it bigger, and put it online.",
      body: "You have the equipment, the space and the people. What's missing is a way for customers to find it, order it and pay for it without standing at your counter.",
      steps: [
        "Wash-and-fold ordering live on your own site",
        "Every order builds your customer record",
        "Delivery added to reach past your own streets",
        "Memberships switched on for your regulars",
      ],
    },
    {
      key: "unattended",
      condition: "You're unattended and want more",
      title: "We help you get there, step by step.",
      body: "You run self-service today and you're open to more, but you won't hire a team on a hunch. So we build the base first and add streams once the demand and the staffing are there.",
      steps: [
        "Website, Google listing and reviews first",
        "Demand measured before you hire anyone",
        "Wash-and-fold introduced with limited hours",
        "Delivery and memberships once volume supports it",
      ],
    },
  ],
  notForYou: {
    title: "If you're coin-only and want to stay that way, we're not a fit.",
    body: "With no plans for wash-and-fold, delivery or memberships, this system has nothing to do, and you'd be paying us monthly for a brochure. We'd rather say so on a 15-minute call than three months into an invoice.",
  },
};

export const finalCta = {
  label: "08 / Next step",
  heading: "Fifteen minutes. We'll tell you whether it's worth doing.",
  lead: "No deck, no pressure. We look at your store and your area, and you leave with a straight answer either way.",
  points: [
    "What your store could realistically add, and in what order",
    "What each stream would take to staff",
    "Roughly what it costs and how long it takes",
  ],
};

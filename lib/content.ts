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
  eyebrow: "Digital revenue systems for US laundromats",
  headline: ["Your laundromat has customers.", "It doesn't have a customer list."],
  lead: "We install and operate the digital system that turns anonymous walk-ins into members who pay you every month. You keep running the store.",
  trust: [
    "Built and operated for independent US laundromats",
    "Month to month",
    "Your data is yours",
  ],
  /** Read by screen readers in place of the decorative canvas. */
  canvasDescription:
    "An abstract grid of laundry machines. Grey, unconnected nodes light up one by one and link together as anonymous visitors become known customers.",
};

export const problem = {
  label: "01 — The problem",
  heading: "Coins go in. Laundry comes out. Nobody knows who anyone is.",
  beats: [
    {
      n: "01",
      title: "Nobody knows who walks in.",
      body: "Someone can use your store every week for two years and you will never learn their name, their number or their address. You can't call them. You can't text them. When they stop coming, you don't find out — you just quietly earn less.",
    },
    {
      n: "02",
      title: "Every visit starts from zero.",
      body: "You win a customer on Tuesday, then win them again from scratch on Saturday. Nothing accumulates. There's no list, so there's nothing to build on, nothing to sell to, and nothing that carries from one month into the next.",
    },
    {
      n: "03",
      title: "This month is whoever showed up.",
      body: "No baseline, no forecast, nothing that arrives whether or not it rains. A holiday, a competitor down the road, a bad week of weather — and the month is simply different. You find out as it happens.",
    },
  ],
  closer: "That isn't a marketing problem. It's a missing system.",
};

export const system = {
  label: "02 — What we install",
  heading: "Eight parts. One system. We build it, then we run it.",
  lead: "Not a website with things bolted on. Every part writes to the same customer record — the thing your store has never had — and that record is what makes the rest of it work.",
  parts: [
    {
      key: "site",
      name: "A real website, built and hosted",
      body: "Designed and built for your store, fast on a phone, live early. We host it, maintain it and keep it accurate. You never log into anything.",
    },
    {
      key: "ordering",
      name: "Online wash-and-fold ordering",
      body: "Customers place and pay for wash-and-fold from their phone — your pricing, your turnaround, your service area, your rules.",
    },
    {
      key: "delivery",
      name: "Pickup and delivery booking",
      body: "Time-window booking for the routes you actually run. Addresses, access notes and repeat scheduling handled in the booking, not over the phone.",
    },
    {
      key: "memberships",
      name: "Monthly membership plans",
      body: "Recurring plans, billed monthly, built around what your store can deliver. This is the part that changes the shape of your revenue.",
      accent: true,
    },
    {
      key: "database",
      name: "A customer database that builds itself",
      body: "Every order, booking and membership writes a name, contact details and full history to one record. No data entry. No spreadsheet. It's yours.",
      accent: true,
    },
    {
      key: "automation",
      name: "Automated SMS and email",
      body: "Order ready. A customer who hasn't been in for a while. A polite review request to someone who just had a good experience. Sent automatically, in your store's voice.",
    },
    {
      key: "google",
      name: "Google Business Profile and reviews",
      body: "Hours, photos, services and questions kept current. Review requests going out steadily instead of never, and replies actually written.",
    },
    {
      key: "dashboard",
      name: "A dashboard that shows what's happening",
      body: "Orders, active memberships, revenue by stream and what the automations did. Live whenever you want it, summarised in a report every month.",
    },
  ],
};

export const streams = {
  label: "03 — Revenue streams",
  heading: "Self-service is your floor. It shouldn't be your ceiling.",
  lead: "The machines keep doing what they do. We add the streams around them that can be booked, tracked and billed — and that leave a customer record behind.",
  base: {
    name: "Self-service",
    body: "Already running. Untouched. It stays exactly as it is — this is the base everything else stacks on.",
  },
  items: [
    {
      name: "Wash and fold",
      body: "Priced, ordered and paid online instead of negotiated at the counter. Every order names a customer.",
      staffing: "Needs people",
    },
    {
      name: "Pickup and delivery",
      body: "A booked route with time windows, reaching customers who would never walk into a laundromat at all.",
      staffing: "Needs people and a vehicle",
    },
    {
      name: "Commercial accounts",
      body: "Salons, gyms, restaurants, short-term rentals. Steady weekly volume, invoiced rather than paid by the load.",
      staffing: "Needs capacity",
    },
  ],
  membership: {
    label: "The headline stream",
    name: "Memberships",
    heading: "Money that arrives on the 1st.",
    body: "A plan your regulars pay every month — a set amount of wash-and-fold, delivery included, whatever shape fits your store. It bills when it rains. It bills over a holiday. It's the difference between a store that earns whatever walked in this week and a store with a floor under the month.",
    footnote:
      "It's also the hardest one to add, which is why it's the last thing we turn on rather than the first.",
  },
  honesty:
    "Wash-and-fold and delivery need hands. Before you commit to a stream, we'll tell you plainly what staffing it takes — hours, headcount and what it costs you.",
};

export const process = {
  label: "04 — How it works",
  heading: "You give us your business details and photos. We handle the rest.",
  lead: "Four steps. Your total time commitment is a couple of calls and a few decisions only you can make.",
  steps: [
    {
      n: "01",
      title: "Discovery call",
      duration: "15 minutes",
      body: "We look at your store, your market and what you already do. You leave knowing whether this is worth doing — including when the answer is that it isn't.",
      you: "Answer questions about your store",
    },
    {
      n: "02",
      title: "We build and configure everything",
      duration: "Our work, not yours",
      body: "Website, ordering, delivery windows, membership structure, automations, Google profile. We write it, build it, connect it and test it end to end.",
      you: "Send business details and photos",
    },
    {
      n: "03",
      title: "We train your staff",
      duration: "One short session",
      body: "A practical walk-through of taking online orders through the system, plus a one-page reference that lives at the counter. We stay reachable when something comes up.",
      you: "Give us an hour with your team",
    },
    {
      n: "04",
      title: "We run it and report monthly",
      duration: "Ongoing",
      body: "We operate it: monitoring, automation tuning, review management, campaigns and changes. A report and a call every month. It stays our job, not yours.",
      you: "Read the report. Take the call.",
    },
  ],
  quote: "You give us your business details and photos. We handle the rest.",
};

/**
 * Replaces the old pricing table.
 *
 * The section still answers "what does it cost?" head-on rather than pretending
 * a skeptical buyer won't ask — it just answers it honestly, which is that the
 * number depends on the store. The advertising-budget note is kept from the
 * old pricing block because it is the strongest trust signal on the page.
 */
export const cost = {
  label: "05 — What it costs",
  heading: "Pricing depends on your store. So we quote it on a call, not on a page.",
  lead: "A two-location operator already running wash-and-fold and an unattended single store need different systems — and a price list can't tell the difference between them. Fifteen minutes on the phone can.",
  notes: [
    {
      title: "Advertising budget is separate",
      body: "If you choose to run ads, that budget is paid by you, directly to Google or Meta. We never mark it up and we never take a cut of it.",
    },
    {
      title: "Setup is quoted after we've seen the store",
      body: "It depends on how many locations you have and what already exists. We'd rather quote it having looked than give you a number that turns out to be wrong.",
    },
    {
      title: "Month to month",
      body: "No lock-in and no long contract. Your customer list, order history and contact details are yours, and you can export them and go.",
    },
  ],
  callPrompt: "Prefer to just talk?",
};

export const fit = {
  label: "06 — Who this is for",
  heading: "Two ways in. Both of them honest.",
  lead: "Where you start depends on what your store already does. Neither path is better — they just begin in different places.",
  paths: [
    {
      key: "wf",
      condition: "You already do wash-and-fold",
      title: "We make it bigger, and put it online.",
      body: "You've got the equipment, the space and the people. What you don't have is a way for customers to find it, order it and pay for it without standing at your counter — or a record of who they were afterwards.",
      steps: [
        "Wash-and-fold ordering live on your own site",
        "Every order builds the customer database",
        "Delivery added to reach past your immediate blocks",
        "Memberships turned on for your regulars",
      ],
    },
    {
      key: "unattended",
      condition: "You're unattended and want more",
      title: "We help you get there, step by step.",
      body: "You run coin-op today and you're open to more, but you're not going to hire a team on a hunch. So we don't ask you to. We build the base first and add streams only when the demand and the staffing are actually there.",
      steps: [
        "Website, Google presence and reviews first",
        "Demand measured before you hire anyone",
        "Wash-and-fold introduced with limited hours",
        "Delivery and memberships once volume supports it",
      ],
    },
  ],
  notForYou: {
    title: "And if you're coin-only and want to stay that way — we're not a fit.",
    body: "If you have no intention of adding wash-and-fold, delivery or memberships, there's no customer to capture and nothing for this system to do. You'd be paying us monthly for a brochure. We'd rather say that on a 15-minute call than three months into an invoice.",
  },
};

export const finalCta = {
  label: "08 — Next step",
  heading: "Fifteen minutes. We'll tell you whether it's worth doing.",
  lead: "No deck, no pressure. We look at your store and your market, and you leave with a straight answer either way — including when the answer is no.",
  points: [
    "What your store could realistically add, and in what order",
    "What each stream would take to staff",
    "Roughly what it costs and roughly how long it takes",
  ],
};

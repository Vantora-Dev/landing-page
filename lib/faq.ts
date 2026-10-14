/**
 * Objections, answered in the same voice as the rest of the page.
 * This array is the single source for both the on-page accordion and the
 * FAQPage JSON-LD in lib/schema.ts — edit once, both stay in sync.
 */
export type FaqItem = { q: string; a: string };

export const faq: FaqItem[] = [
  {
    q: "I already have a website.",
    a: "Then you have a brochure. It shows your hours and where to park, but it doesn't take an order, remember who visited or bill anyone on the 1st. What we run brings a customer in, keeps them and charges them again. If your current site already does that, you don't need us.",
  },
  {
    q: "My customers pay cash. They're not going online.",
    a: "Some won't, and that's fine; self-service keeps running as it does today. But a cash customer leaves no name and no way to reach them. Wash-and-fold, delivery and memberships are the services people already expect to book and pay for on a phone. We're not moving your coin business online. We're building the part that sits next to it.",
  },
  {
    q: "I don't have staff for wash-and-fold.",
    a: "Then don't start there. Wash-and-fold and delivery need people, and anyone who says software removes that is selling you something. We start with your website, Google listing and reviews, then help you get to wash-and-fold in stages: the hours, what to charge, who to hire and when the volume justifies it.",
  },
  {
    q: "Do you work outside the US?",
    a: "Yes. We work with independent laundromats and launderettes in the UK and the US first, and anywhere our ordering, payment and delivery partners operate. On the call we'll tell you straight whether your area is covered.",
  },
  {
    q: "How fast does this happen?",
    a: "The website goes live first because it needs the least from you. Ordering, the customer record and the automations follow, and the full system comes together over weeks, not months. The pace depends mostly on how quickly we get your details, photos and pricing decisions.",
  },
  {
    q: "Am I locked in?",
    a: "No. It's month to month, and your customer list, order history and contact details are yours. If you leave, you take them with you in a standard export.",
  },
];

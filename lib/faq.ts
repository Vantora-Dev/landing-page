/**
 * Objections, answered in the same voice as the rest of the page.
 * This array is the single source for both the on-page accordion and the
 * FAQPage JSON-LD in lib/schema.ts — edit once, both stay in sync.
 */
export type FaqItem = { q: string; a: string };

export const faq: FaqItem[] = [
  {
    q: "I already have a website.",
    a: "Then you have a brochure. It tells people your hours and where to park. It doesn't take an order, it doesn't remember anyone who visited, and it doesn't bill anybody on the 1st. A brochure is a page. What we install is a system that captures a customer, keeps them, and charges them again. If your current site already does that, you don't need us.",
  },
  {
    q: "My customers pay cash. They're not going online.",
    a: "Some won't, and that's fine — self-service keeps running exactly as it does today. But cash is precisely the problem we solve: a cash customer leaves no name, no number and no way to reach them. The streams we add — wash-and-fold, delivery, memberships — are the ones people already expect to book and pay for on a phone. We're not trying to move your coin business online. We're building the part that sits next to it.",
  },
  {
    q: "I don't have staff for wash-and-fold.",
    a: "Then don't start there. Wash-and-fold and delivery need people — we won't pretend otherwise, and any agency that tells you software removes that is selling you something. We start with the website, your Google presence and reviews, and we help you get to wash-and-fold in stages: what the hours actually look like, what to charge, what to hire for, and when the volume justifies it.",
  },
  {
    q: "How fast does this happen?",
    a: "The website goes live early — it's the piece with the fewest dependencies on you. Ordering, the customer database and the automations follow. The full system, including memberships and delivery, comes together over a matter of weeks rather than months. The pace depends mostly on how quickly we get your details, photos and pricing decisions, and on which streams you're ready to staff.",
  },
  {
    q: "Am I locked in?",
    a: "No. It's month to month. And your data is yours — the customer list, the order history, the contact details. If you leave, you take it with you in a standard export. A customer list you can't take with you isn't really yours, and we're not going to build our retention on holding it hostage.",
  },
];

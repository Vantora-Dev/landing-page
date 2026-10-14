import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/guides/LegalPage";
import { site } from "@/lib/site";

/**
 * DRAFT FOR LAWYER REVIEW before this ships.
 *
 * Written from what this site actually does (see app/api/book, lib/booking-*,
 * lib/google-calendar.ts, lib/lead-webhook.ts, components/ui/Analytics.tsx).
 * It covers the marketing site only. Data LaundroGrid processes on behalf of
 * client stores is covered by each client's contract and data processing
 * agreement, not by this page. If the site starts collecting anything new,
 * this page changes in the same commit.
 */
export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${site.name} handles the personal information you give us on ${site.domain}.`,
  alternates: { canonical: "/privacy" },
};

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      `${site.domain} is run by ${site.legalEntity}, ${site.legalAddress}. We are responsible for the personal information collected through this website. You can reach us about anything on this page at ${site.email}.`,
    ],
  },
  {
    heading: "What we collect",
    paragraphs: [
      "When you book a call, we collect the details you type into the form: your name, your business name, email address, phone number, town or city and country, the type of call you chose, the time you picked, your time zone and anything you add in the message box.",
      "If analytics is switched on, Google Analytics records how the site is used: pages viewed, the device and browser type, approximate location from your IP address, and whether a booking was completed. We don't use it to identify you personally.",
      "We don't collect payment details on this website, and we don't buy contact lists.",
    ],
  },
  {
    heading: "Why we use it",
    paragraphs: [
      "We use your booking details to arrange and hold the call you asked for, to send you a confirmation, and to follow up about our services afterwards. Our lawful basis is your request to be contacted and our legitimate interest in replying to business enquiries.",
      "We use analytics to understand which pages are useful and to improve the site. Our lawful basis is your consent where the law requires it, and our legitimate interest otherwise.",
    ],
  },
  {
    heading: "Who we share it with",
    paragraphs: [
      "We share your details only with the services that run this site and our bookings: Vercel, which hosts the website; Resend, which sends the booking emails; Google, for our calendar and email (Google Workspace) and for Google Analytics; and, where we've set one up, a team messaging tool that receives a copy of each booking so it isn't missed.",
      "Each of these providers processes the data on our instructions. We don't sell your information, and we don't share it with anyone for their own marketing.",
    ],
  },
  {
    heading: "International transfers",
    paragraphs: [
      "Our team is based in Pakistan and our providers store data in the United States and elsewhere. Where personal information from the UK or the European Economic Area is transferred, we rely on the safeguards our providers offer, such as standard contractual clauses.",
    ],
  },
  {
    heading: "How long we keep it",
    paragraphs: [
      "We keep booking details for as long as we're talking about working together, and for up to 24 months after our last contact if we don't. If you become a client, your details move under your contract with us. Analytics data is kept for the period set in Google Analytics, currently 14 months.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      "You can ask for a copy of the personal information we hold about you, ask us to correct it, delete it or stop using it, and object to marketing at any time. Email us at the address above and we'll reply within one month.",
      "If you're in the UK, you can also complain to the Information Commissioner's Office (ico.org.uk). In the EU, you can contact your local data protection authority. We'd appreciate the chance to sort it out with you first.",
    ],
  },
  {
    heading: "Cookies",
    paragraphs: [
      "This site sets no advertising cookies. Google Analytics, when switched on, uses cookies to tell one visit from another. You can block or delete cookies in your browser settings at any time, and the site will keep working.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "If we change how we handle your information, we'll update this page and the date at the top.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro={`This page explains what personal information ${site.name} collects through this website, why, and what you can ask us to do with it.`}
      sections={sections}
    />
  );
}

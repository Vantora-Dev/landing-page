import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/guides/LegalPage";
import { site } from "@/lib/site";

/**
 * DRAFT FOR LAWYER REVIEW before this ships.
 *
 * Terms for using the website only. The services themselves are governed by
 * each client's signed contract, which this page defers to. Governing law
 * follows the client contracts (England and Wales); confirm with counsel.
 */
export const metadata: Metadata = {
  title: "Terms of use",
  description: `The terms for using ${site.domain}.`,
  alternates: { canonical: "/terms" },
};

const sections: LegalSection[] = [
  {
    heading: "About these terms",
    paragraphs: [
      `These terms cover your use of ${site.domain}, run by ${site.legalEntity}, ${site.legalAddress}. By using the site you agree to them. If you don't agree, please don't use the site.`,
      "They cover the website only. If you become a client, our services are governed by the contract you sign with us, and that contract takes priority over anything here.",
    ],
  },
  {
    heading: "What's on the site",
    paragraphs: [
      "The site and our guides describe our services and offer general information about running a laundromat or launderette. It's not financial, legal or tax advice, and it isn't tailored to your store. Check anything important with a qualified adviser before you act on it.",
      "We try to keep everything accurate and current, but we don't promise that it always will be, and we may change or remove content at any time.",
    ],
  },
  {
    heading: "Booking a call",
    paragraphs: [
      "Booking a call doesn't commit you to anything, and it doesn't commit us to providing services. Any work starts only once we've both signed a contract.",
      "Please give accurate details when you book so we can reach you. We may decline or rearrange a booking if a slot becomes unavailable.",
    ],
  },
  {
    heading: "Our content",
    paragraphs: [
      `The text, design, graphics and code on this site belong to ${site.name} or the people who licensed them to us. You're welcome to read, share links to and quote short parts of our guides with credit. Please don't copy the site, or large parts of it, without asking us first.`,
    ],
  },
  {
    heading: "Using the site properly",
    paragraphs: [
      "Don't misuse the site: no attempts to break or overload it, no automated scraping of the booking form, no false bookings, and nothing unlawful.",
    ],
  },
  {
    heading: "Links to other sites",
    paragraphs: [
      "We sometimes link to other websites. We don't control them and aren't responsible for their content or how they handle your data.",
    ],
  },
  {
    heading: "Liability",
    paragraphs: [
      "The site is provided as it is. To the extent the law allows, we aren't liable for any loss that comes from using it or relying on its content. Nothing in these terms limits liability that can't be limited by law, such as for fraud, or for death or personal injury caused by negligence.",
    ],
  },
  {
    heading: "Privacy",
    paragraphs: [
      "How we handle the details you give us is explained in our privacy policy at /privacy.",
    ],
  },
  {
    heading: "Changes and governing law",
    paragraphs: [
      "We may update these terms from time to time; the date at the top shows the latest version.",
      "These terms are governed by the laws of England and Wales, and the courts of England and Wales have jurisdiction over any dispute about them.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      intro={`The short version: use the site in good faith, treat our guides as general information, and know that our services are governed by a signed contract, not by this page.`}
      sections={sections}
    />
  );
}

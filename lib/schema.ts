import { faq } from "./faq";
import { site } from "./site";

/**
 * JSON-LD.
 *
 * Deliberately NOT LocalBusiness: LaundroGrid has no public storefront
 * address, and emitting LocalBusiness without a real, verifiable address is
 * both a Google guidelines risk and contradicts the honesty this page sells.
 * Organization + Service + FAQPage describe the business accurately.
 */

const organization = {
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  description: site.description,
  email: site.email,
  telephone: site.phoneHref,
  // Ties this domain and the LinkedIn page to one entity for Google.
  sameAs: [site.linkedin],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: site.phoneHref,
    email: site.email,
    areaServed: "US",
    availableLanguage: ["en"],
  },
  areaServed: { "@type": "Country", name: "United States" },
  knowsAbout: [
    "Laundromat marketing",
    "Wash and fold ordering",
    "Laundry pickup and delivery",
    "Laundromat membership programs",
    "Customer relationship management for laundromats",
  ],
};

const website = {
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: site.url,
  name: site.name,
  publisher: { "@id": `${site.url}/#organization` },
  inLanguage: "en-US",
};

const service = {
  "@type": "Service",
  "@id": `${site.url}/#service`,
  name: "Digital revenue system for laundromats",
  serviceType: "Laundromat digital operations and marketing",
  provider: { "@id": `${site.url}/#organization` },
  areaServed: { "@type": "Country", name: "United States" },
  audience: {
    "@type": "BusinessAudience",
    name: "Independent laundromat owners in the United States",
  },
  description:
    "Website, online wash-and-fold ordering, pickup and delivery booking, monthly membership plans, a self-building customer database, SMS and email automation, Google Business Profile management and monthly reporting — installed and operated for the owner.",
};

const faqPage = {
  "@type": "FAQPage",
  "@id": `${site.url}/#faq`,
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [organization, website, service, faqPage],
};

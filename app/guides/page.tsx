import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, SubpageShell } from "@/components/guides/SubpageShell";
import { hubs, publishedGuides, type HubKey } from "@/lib/guides";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guides for laundromat and launderette owners",
  description:
    "Practical guides on wash-and-fold, pickup and delivery, memberships, retention and local search for independent laundromats and launderettes.",
  alternates: { canonical: "/guides" },
};

export default function GuidesIndex() {
  const guides = publishedGuides();
  // No published guides yet: 404 rather than an empty, thin page.
  if (guides.length === 0) notFound();

  const byHub = (Object.keys(hubs) as HubKey[])
    .map((key) => ({ key, hub: hubs[key], items: guides.filter((g) => g.hub === key) }))
    .filter((group) => group.items.length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${site.url}/guides#page`,
    url: `${site.url}/guides`,
    name: "Guides for laundromat and launderette owners",
    isPartOf: { "@id": `${site.url}/#website` },
    hasPart: guides.map((g) => ({
      "@type": "Article",
      headline: g.title,
      url: `${site.url}/guides/${g.slug}`,
    })),
  };

  return (
    <SubpageShell>
      <div className="shell section-pad">
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
        <h1 className="type-display mt-8 max-w-[16ch] text-graphite-900">
          Guides for laundromat and launderette owners
        </h1>
        <p className="type-lead mt-7 max-w-[52ch] text-graphite-600">
          How to add wash-and-fold, run delivery, price memberships and keep
          customers coming back. Written for owners, not marketers.
        </p>

        <div className="mt-16 space-y-16">
          {byHub.map((group) => (
            <section key={group.key} aria-labelledby={`hub-${group.key}`}>
              <h2 id={`hub-${group.key}`} className="type-label text-graphite-600">
                {group.hub.name}
              </h2>
              <ul className="mt-6 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
                {group.items.map((g) => (
                  <li key={g.slug} className="bg-paper">
                    <a
                      href={`/guides/${g.slug}`}
                      className="group block h-full p-7 transition-colors hover:bg-paper-alt"
                    >
                      <h3 className="type-h3 text-graphite-900 group-hover:underline group-hover:underline-offset-4">
                        {g.title}
                      </h3>
                      <p className="mt-3 text-[0.9375rem] leading-relaxed text-graphite-600">
                        {g.description}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        // Static, build-time constant; no user input reaches this string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </SubpageShell>
  );
}

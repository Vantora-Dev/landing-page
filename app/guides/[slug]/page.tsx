import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, SubpageShell } from "@/components/guides/SubpageShell";
import { getGuide, hubs, publishedGuides, sectionId } from "@/lib/guides";
import { site } from "@/lib/site";

/** Only published guides exist; anything else is a 404, not a runtime render. */
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata(props: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      url: `${site.url}/guides/${guide.slug}`,
      publishedTime: guide.datePublished,
      modifiedTime: guide.dateUpdated,
    },
  };
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );

export default async function GuidePage(props: PageProps<"/guides/[slug]">) {
  const { slug } = await props.params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const url = `${site.url}/guides/${guide.slug}`;
  const related = publishedGuides()
    .filter((g) => g.hub === guide.hub && g.slug !== guide.slug)
    .slice(0, 3);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: guide.title,
      description: guide.description,
      datePublished: guide.datePublished,
      dateModified: guide.dateUpdated,
      mainEntityOfPage: url,
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      about: guide.primaryKeyword,
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${site.url}/guides` },
        { "@type": "ListItem", position: 3, name: guide.title, item: url },
      ],
    },
  ];
  if (guide.faq?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: guide.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return (
    <SubpageShell>
      <article className="shell section-pad">
        <div className="mx-auto max-w-[44rem]">
          <Breadcrumbs
            trail={[
              { label: "Home", href: "/" },
              { label: "Guides", href: "/guides" },
              { label: hubs[guide.hub].name },
            ]}
          />
          <h1 className="type-h2 mt-8 text-graphite-900">{guide.title}</h1>
          <p className="mt-5 text-[0.875rem] text-graphite-600">
            Updated {formatDate(guide.dateUpdated)} · {site.name}
          </p>

          {/* The direct answer first: what search snippets and AI answers lift. */}
          <div className="mt-10 rounded-lg border border-line bg-signal-wash p-6">
            <p className="type-label text-signal-deep">Short answer</p>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-graphite-900">
              {guide.answer}
            </p>
          </div>

          {guide.sections.length > 2 ? (
            <nav aria-label="On this page" className="mt-10 border-l border-line pl-5">
              <p className="type-label text-graphite-600">On this page</p>
              <ol className="mt-4 space-y-2 text-[0.9375rem]">
                {guide.sections.map((section) => (
                  <li key={section.heading}>
                    <a
                      href={`#${sectionId(section.heading)}`}
                      className="text-graphite-700 underline-offset-4 hover:underline"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          <div className="mt-12 space-y-12">
            {guide.sections.map((section) => (
              <section key={section.heading} id={sectionId(section.heading)}>
                <h2 className="type-h3 text-graphite-900">{section.heading}</h2>
                <div className="mt-5 space-y-5 text-[1.0625rem] leading-[1.7] text-graphite-700">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {guide.faq?.length ? (
            <section className="mt-16 border-t border-line pt-12" aria-labelledby="guide-faq">
              <h2 id="guide-faq" className="type-h3 text-graphite-900">
                Common questions
              </h2>
              <dl className="mt-6 space-y-8">
                {guide.faq.map((item) => (
                  <div key={item.q}>
                    <dt className="font-medium text-graphite-900">{item.q}</dt>
                    <dd className="mt-2 leading-relaxed text-graphite-700">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {related.length ? (
            <section className="mt-16 border-t border-line pt-12" aria-labelledby="guide-related">
              <h2 id="guide-related" className="type-label text-graphite-600">
                More on {hubs[guide.hub].name.toLowerCase()}
              </h2>
              <ul className="mt-5 space-y-3">
                {related.map((g) => (
                  <li key={g.slug}>
                    <a
                      href={`/guides/${g.slug}`}
                      className="text-[1.0625rem] text-graphite-900 underline underline-offset-4 hover:text-signal-deep"
                    >
                      {g.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </article>
      <script
        type="application/ld+json"
        // Static, build-time constant; no user input reaches this string.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
        }}
      />
    </SubpageShell>
  );
}

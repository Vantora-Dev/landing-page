import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, SubpageShell } from "@/components/subpage/SubpageShell";
import { getPost, hubs, publishedPosts, sectionId } from "@/lib/blog";
import { site } from "@/lib/site";

/** Only published posts exist; anything else is a 404, not a runtime render. */
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${site.url}/blog/${post.slug}`,
      publishedTime: post.datePublished,
      modifiedTime: post.dateUpdated,
    },
  };
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );

export default async function PostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${site.url}/blog/${post.slug}`;
  const related = publishedPosts()
    .filter((g) => g.hub === post.hub && g.slug !== post.slug)
    .slice(0, 3);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: post.title,
      description: post.description,
      datePublished: post.datePublished,
      dateModified: post.dateUpdated,
      mainEntityOfPage: url,
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      about: post.primaryKeyword,
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
  if (post.faq?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: post.faq.map((item) => ({
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
              { label: "Blog", href: "/blog" },
              { label: hubs[post.hub].name },
            ]}
          />
          <h1 className="type-h2 mt-8 text-graphite-900">{post.title}</h1>
          <p className="mt-5 text-[0.875rem] text-graphite-600">
            Updated {formatDate(post.dateUpdated)} · {site.name}
          </p>

          {/* The direct answer first: what search snippets and AI answers lift. */}
          <div className="mt-10 rounded-lg border border-line bg-signal-wash p-6">
            <p className="type-label text-signal-deep">Short answer</p>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-graphite-900">
              {post.answer}
            </p>
          </div>

          {post.sections.length > 2 ? (
            <nav aria-label="On this page" className="mt-10 border-l border-line pl-5">
              <p className="type-label text-graphite-600">On this page</p>
              <ol className="mt-4 space-y-2 text-[0.9375rem]">
                {post.sections.map((section) => (
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
            {post.sections.map((section) => (
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

          {post.faq?.length ? (
            <section className="mt-16 border-t border-line pt-12" aria-labelledby="post-faq">
              <h2 id="post-faq" className="type-h3 text-graphite-900">
                Common questions
              </h2>
              <dl className="mt-6 space-y-8">
                {post.faq.map((item) => (
                  <div key={item.q}>
                    <dt className="font-medium text-graphite-900">{item.q}</dt>
                    <dd className="mt-2 leading-relaxed text-graphite-700">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {related.length ? (
            <section className="mt-16 border-t border-line pt-12" aria-labelledby="post-related">
              <h2 id="post-related" className="type-label text-graphite-600">
                More on {hubs[post.hub].name.toLowerCase()}
              </h2>
              <ul className="mt-5 space-y-3">
                {related.map((g) => (
                  <li key={g.slug}>
                    <a
                      href={`/blog/${g.slug}`}
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

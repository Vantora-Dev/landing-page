import { Breadcrumbs, SubpageShell } from "@/components/subpage/SubpageShell";
import { site } from "@/lib/site";

export type LegalSection = { heading: string; paragraphs: string[] };

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );

export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <SubpageShell cta={false}>
      <article className="shell section-pad">
        <div className="mx-auto max-w-[44rem]">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: title }]} />
          <h1 className="type-h2 mt-8 text-graphite-900">{title}</h1>
          <p className="mt-5 text-[0.875rem] text-graphite-600">
            Last updated {formatDate(site.legalUpdatedAt)}
          </p>
          <p className="mt-8 text-[1.0625rem] leading-[1.7] text-graphite-700">{intro}</p>
          <div className="mt-12 space-y-10">
            {sections.map((section, index) => (
              <section key={section.heading}>
                <h2 className="type-h3 text-graphite-900">
                  {index + 1}. {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-[1rem] leading-[1.7] text-graphite-700">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </article>
    </SubpageShell>
  );
}

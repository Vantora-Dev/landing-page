import type { ReactNode } from "react";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import { hasPublishedPosts } from "@/lib/blog";
import { CTA_HREF, CTA_PRIMARY } from "@/lib/site";

/**
 * Layout for every page that isn't the homepage: posts and legal pages.
 * The header starts solid because there's no dark hero behind it.
 */
export function SubpageShell({
  children,
  cta = true,
}: {
  children: ReactNode;
  /** The closing "book a call" band. Off for legal pages. */
  cta?: boolean;
}) {
  const showBlog = hasPublishedPosts();
  return (
    <>
      <Header solid showBlog={showBlog} />
      <main id="main" className="flex-1 bg-paper pt-[4.5rem]">
        {children}
        {cta ? (
          <section className="on-dark bg-ink-950">
            <div className="shell flex flex-col gap-8 py-20 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[34rem]">
                <h2 className="type-h2 text-paper">Want this running in your store?</h2>
                <p className="type-lead mt-5 text-graphite-400">
                  Fifteen minutes. We look at your store and your area, and you leave
                  with a straight answer either way.
                </p>
              </div>
              <Button href={CTA_HREF} tone="dark" variant="primary">
                {CTA_PRIMARY}
              </Button>
            </div>
          </section>
        ) : null}
      </main>
      <Footer showBlog={showBlog} />
    </>
  );
}

/** "Home / Blog / …" trail. The JSON-LD version is built separately. */
export function Breadcrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="type-label text-graphite-600">
      <ol className="flex flex-wrap items-center gap-2">
        {trail.map((crumb, index) => (
          <li key={crumb.label} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {crumb.href ? (
              <a href={crumb.href} className="transition-colors hover:text-graphite-900">
                {crumb.label}
              </a>
            ) : (
              <span aria-current="page" className="text-graphite-900">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

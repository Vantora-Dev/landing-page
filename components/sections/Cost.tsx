import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { cost } from "@/lib/content";
import { CTA_HREF, CTA_PRIMARY, site } from "@/lib/site";

/**
 * Sits where the pricing table used to. Removing published prices leaves an
 * obvious question hanging for a buyer who has already been pitched three
 * times, so this section names that question in its own heading and answers it
 * rather than routing around it.
 *
 * Dark, to give the one mid-page call to action the weight it needs between
 * four light sections.
 */
export function Cost() {
  return (
    <section id="cost" className="on-dark relative overflow-hidden bg-ink-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 70% at 50% 100%, rgba(251,191,36,0.09) 0%, transparent 60%)",
        }}
      />

      <div className="shell section-pad relative">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <p className="type-label flex items-center gap-3 text-graphite-400">
                <span aria-hidden="true" className="inline-block h-px w-6 bg-signal" />
                {cost.label}
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="type-h2 mt-8 max-w-[18ch] text-paper">{cost.heading}</h2>
            </Reveal>
          </div>
          <div className="md:col-span-5 md:pt-16">
            <Reveal delay={0.1}>
              <p className="type-lead max-w-[46ch] text-graphite-400">{cost.lead}</p>
            </Reveal>
          </div>
        </div>

        <ul className="mt-16 grid gap-px border-t border-ink-700 md:mt-24 md:grid-cols-3 md:gap-12 md:border-t-0">
          {cost.notes.map((note, index) => (
            <li key={note.title} className="border-b border-ink-700 md:border-b-0">
              <Reveal
                delay={0.05 * index}
                className="py-10 md:border-t md:border-ink-700 md:pb-0 md:pt-8"
              >
                <h3 className="text-[1.0625rem] font-medium tracking-[-0.015em] text-paper">
                  {note.title}
                </h3>
                <p className="mt-3 max-w-[38ch] text-[0.9375rem] leading-relaxed text-graphite-400">
                  {note.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.08}>
          <div className="mt-16 flex flex-col gap-6 border-t border-ink-700 pt-12 md:mt-20 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="type-label text-graphite-400">{cost.callPrompt}</p>
              <a
                href={`tel:${site.phoneHref}`}
                className="type-h3 mt-3 inline-block text-paper transition-colors hover:text-signal"
              >
                {site.phone}
              </a>
            </div>

            <Button href={CTA_HREF} tone="dark" variant="primary">
              {CTA_PRIMARY}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

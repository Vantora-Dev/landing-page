import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { streams } from "@/lib/content";
import { CTA_HREF, CTA_PRIMARY } from "@/lib/site";

export function Streams() {
  return (
    <section id="revenue" className="section-pad border-b border-line bg-paper">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <SectionLabel>{streams.label}</SectionLabel>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="type-h2 mt-8 max-w-[16ch] text-graphite-900">
                {streams.heading}
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-5 md:pt-16">
            <Reveal delay={0.1}>
              <p className="type-lead max-w-[46ch] text-graphite-600">{streams.lead}</p>
              <p className="mt-6 text-[0.9375rem] text-graphite-600">
                <Counter
                  to={5}
                  className="type-h3 mr-2 align-middle tabular-nums text-signal-deep"
                />
                <span className="align-middle">
                  ways to bill, all feeding one customer record.
                </span>
              </p>
            </Reveal>
          </div>
        </div>

        {/* The base layer: what already exists, drawn as unchanged */}
        <Reveal delay={0.06}>
          <div className="mt-16 flex flex-col gap-3 rounded-lg border border-dashed border-line bg-paper-alt p-6 sm:flex-row sm:items-baseline sm:gap-8 md:mt-24">
            <span className="type-label shrink-0 text-graphite-600">Base layer</span>
            <div>
              <h3 className="text-[1.0625rem] font-medium tracking-[-0.015em] text-graphite-900">
                {streams.base.name}
              </h3>
              <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-graphite-600">
                {streams.base.body}
              </p>
            </div>
          </div>
        </Reveal>

        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          {streams.items.map((item, index) => (
            <li key={item.name}>
              <Reveal
                delay={0.05 * index}
                className="flex h-full flex-col rounded-lg border border-line bg-white p-6"
              >
                <h3 className="text-[1.0625rem] font-medium tracking-[-0.015em] text-graphite-900">
                  {item.name}
                </h3>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-graphite-600">
                  {item.body}
                </p>
                <p className="type-label mt-6 text-graphite-600">{item.staffing}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* The headline stream gets the one dark card in a light section */}
        <Reveal delay={0.08}>
          <div className="on-dark mt-4 overflow-hidden rounded-lg bg-ink-950 p-8 md:p-14">
            <div className="grid gap-10 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-7">
                <p className="type-label flex items-center gap-3 text-signal">
                  <span aria-hidden="true" className="inline-block h-px w-6 bg-signal" />
                  {streams.membership.label}
                </p>
                <h3 className="type-h2 mt-8 max-w-[14ch] text-paper">
                  {streams.membership.heading}
                </h3>
              </div>
              <div className="md:col-span-5 md:pt-20">
                <p className="text-[1.0625rem] leading-relaxed text-graphite-400">
                  {streams.membership.body}
                </p>
                <p className="mt-6 border-l border-ink-700 pl-5 text-[0.9375rem] leading-relaxed text-graphite-400">
                  {streams.membership.footnote}
                </p>
                <Button
                  href={CTA_HREF}
                  tone="dark"
                  variant="primary"
                  className="mt-8"
                >
                  {CTA_PRIMARY}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <p className="mt-10 max-w-[62ch] border-l-2 border-signal-deep pl-5 text-[0.9375rem] leading-relaxed text-graphite-700">
            {streams.honesty}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

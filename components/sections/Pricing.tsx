import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { pricingNote, tiers } from "@/lib/pricing";
import { CTA_HREF } from "@/lib/site";

export function Pricing() {
  return (
    <section id="pricing" className="section-pad border-b border-line bg-paper">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <SectionLabel>05 — Pricing</SectionLabel>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="type-h2 mt-8 max-w-[16ch] text-graphite-900">
                Three ways in. All of them end in a conversation.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-5 md:pt-16">
            <Reveal delay={0.1}>
              <p className="type-lead max-w-[44ch] text-graphite-600">
                Monthly, no lock-in. Where you start depends on how much of the
                system your store is ready to run — which is exactly what the
                call is for.
              </p>
            </Reveal>
          </div>
        </div>

        <ul className="mt-16 grid gap-4 md:mt-24 md:grid-cols-3">
          {tiers.map((tier, index) => (
            <li key={tier.id}>
              <Reveal
                delay={0.06 * index}
                className={`flex h-full flex-col rounded-lg border bg-white p-7 md:p-8 ${
                  tier.emphasis
                    ? "border-graphite-900"
                    : "border-line"
                }`}
              >
                {tier.emphasis ? (
                  <span
                    aria-hidden="true"
                    className="mb-6 block h-[3px] w-12 bg-signal"
                  />
                ) : (
                  <span aria-hidden="true" className="mb-6 block h-[3px] w-12 bg-line" />
                )}

                {/* Fixed-height slots keep the name, price and feature list on
                    the same baseline across all three cards. */}
                <div className="min-h-[1.25rem]">
                  {tier.flag ? (
                    <span className="type-label text-signal-deep">{tier.flag}</span>
                  ) : null}
                </div>

                <h3 className="type-h3 mt-3 text-graphite-900">{tier.name}</h3>

                <p className="mt-4 min-h-[5.25rem] text-[0.9375rem] leading-relaxed text-graphite-600">
                  {tier.summary}
                </p>

                <p className="mt-6 flex items-baseline gap-2">
                  <span className="type-label text-graphite-600">from</span>
                  <span className="text-[2.5rem] font-medium leading-none tracking-[-0.03em] tabular-nums text-graphite-900">
                    ${tier.from.toLocaleString("en-US")}
                  </span>
                  <span className="text-[0.9375rem] text-graphite-600">/month</span>
                </p>

                <p className="mt-7 min-h-[1.25rem] text-[0.8125rem] font-medium text-graphite-900">
                  {tier.inherits ?? ""}
                </p>

                <ul className="mt-3 flex-1 space-y-3 border-t border-line pt-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.55rem] h-px w-3 shrink-0 bg-signal-deep"
                      />
                      <span className="text-[0.9375rem] leading-relaxed text-graphite-700">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  href={CTA_HREF}
                  variant={tier.emphasis ? "primary" : "secondary"}
                  className="mt-8 w-full"
                >
                  Book a 15-minute call
                </Button>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* Honesty signals, in plain type. Not fine print. */}
        <Reveal delay={0.08}>
          <div className="mt-16 border-t border-line pt-12">
            <h3 className="type-label text-graphite-600">{pricingNote.heading}</h3>
            <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
              {pricingNote.items.map((item) => (
                <div key={item.title}>
                  <p className="text-[1.0625rem] font-medium tracking-[-0.015em] text-graphite-900">
                    {item.title}
                  </p>
                  <p className="mt-3 max-w-[48ch] text-[0.9375rem] leading-relaxed text-graphite-600">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

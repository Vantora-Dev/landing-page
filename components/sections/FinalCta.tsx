import { Reveal } from "@/components/ui/Reveal";
import { finalCta } from "@/lib/content";
import { BookingEmbed } from "./BookingEmbed";
import { ContactForm } from "./ContactForm";

export function FinalCta() {
  return (
    <section id="book" className="on-dark relative overflow-hidden bg-ink-950">
      {/* Echo of the hero grid, still and quiet — the same idea, at rest. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(251,191,36,0.14) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage:
            "radial-gradient(120% 90% at 50% 0%, rgba(0,0,0,0.9), transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 50% 0%, rgba(0,0,0,0.9), transparent 70%)",
        }}
      />

      <div className="shell section-pad relative">
        <div className="grid gap-14 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <Reveal>
              <p className="type-label flex items-center gap-3 text-graphite-400">
                <span aria-hidden="true" className="inline-block h-px w-6 bg-signal" />
                {finalCta.label}
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="type-h2 mt-8 max-w-[15ch] text-paper">
                {finalCta.heading}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="type-lead mt-8 max-w-[40ch] text-graphite-400">
                {finalCta.lead}
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <ul className="mt-10 space-y-4 border-t border-ink-700 pt-8">
                {finalCta.points.map((point) => (
                  <li key={point} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-[0.6rem] h-px w-4 shrink-0 bg-signal"
                    />
                    <span className="text-[0.9375rem] leading-relaxed text-graphite-400">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            <Reveal delay={0.08}>
              <h3 className="type-label text-graphite-400">Pick a time</h3>
              <div className="mt-5">
                <BookingEmbed />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-12 border-t border-ink-700 pt-12">
                <h3 className="type-label text-graphite-400">
                  Or leave your details and we&rsquo;ll call you
                </h3>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

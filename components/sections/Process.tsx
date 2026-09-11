import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { process } from "@/lib/content";

export function Process() {
  return (
    <section id="process" className="section-pad border-b border-line bg-paper-alt">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <SectionLabel>{process.label}</SectionLabel>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="type-h2 mt-8 max-w-[15ch] text-graphite-900">
                {process.heading}
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-5 md:pt-16">
            <Reveal delay={0.1}>
              <p className="type-lead max-w-[44ch] text-graphite-600">{process.lead}</p>
            </Reveal>
          </div>
        </div>

        {/* A rail on desktop, a stack on phones. The hairline above the numbers
            is the connecting line — no decorative arrows. */}
        <ol className="mt-16 grid gap-x-8 md:mt-24 md:grid-cols-4">
          {process.steps.map((step, index) => (
            <li key={step.n} className="border-t border-line">
              <Reveal delay={0.06 * index} from="left" className="relative pb-10 pt-8">
                <span
                  aria-hidden="true"
                  className="absolute -top-[3px] left-0 block h-[5px] w-[5px] rounded-full bg-signal-deep"
                />
                <div className="flex items-baseline gap-3">
                  <span className="type-label tabular-nums text-signal-deep">
                    {step.n}
                  </span>
                  <span className="type-label text-graphite-600">{step.duration}</span>
                </div>
                <h3 className="type-h3 mt-5 text-graphite-900">{step.title}</h3>
                <p className="mt-3 max-w-[38ch] text-[0.9375rem] leading-relaxed text-graphite-600">
                  {step.body}
                </p>
                <p className="mt-5 text-[0.8125rem] text-graphite-700">
                  <span className="text-graphite-400">Your part: </span>
                  {step.you}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={0.08}>
          <blockquote className="mt-16 border-t border-line pt-12 md:mt-24">
            <p className="type-h2 max-w-[22ch] text-graphite-900">
              &ldquo;{process.quote}&rdquo;
            </p>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}

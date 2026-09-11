import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { problem } from "@/lib/content";

export function Problem() {
  return (
    <section id="problem" className="section-pad border-b border-line bg-paper">
      <div className="shell">
        <Reveal>
          <SectionLabel>{problem.label}</SectionLabel>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="type-h2 mt-8 max-w-[17ch] text-graphite-900">
            {problem.heading}
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px border-t border-line md:mt-24 md:grid-cols-3 md:gap-12 md:border-t-0">
          {problem.beats.map((beat, index) => (
            <Reveal key={beat.n} delay={0.06 * index}>
              <div className="border-b border-line py-10 md:border-b-0 md:border-t md:pb-0 md:pt-8">
                <span className="type-label text-signal-deep">{beat.n}</span>
                <h3 className="type-h3 mt-6 text-graphite-900">{beat.title}</h3>
                <p className="mt-4 max-w-[38ch] text-[1.0625rem] leading-relaxed text-graphite-600">
                  {beat.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-20 md:mt-28">
            <span
              aria-hidden="true"
              className="block h-px w-16 bg-signal-deep"
            />
            <p className="type-h2 mt-8 max-w-[20ch] text-graphite-900">
              {problem.closer}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

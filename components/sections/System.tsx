import { SystemDiagram } from "@/components/diagrams/SystemDiagram";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { system } from "@/lib/content";

export function System() {
  return (
    <section id="system" className="section-pad border-b border-line bg-paper-alt">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <SectionLabel>{system.label}</SectionLabel>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="type-h2 mt-8 max-w-[16ch] text-graphite-900">
                {system.heading}
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-5 md:pt-16">
            <Reveal delay={0.1}>
              <p className="type-lead max-w-[46ch] text-graphite-600">{system.lead}</p>
            </Reveal>
          </div>
        </div>

        {/* Diagram keeps its own scroll on narrow screens rather than shrinking
            its labels below a readable size. */}
        <Reveal delay={0.08}>
          <div className="mt-16 md:mt-24">
            <div className="-mx-5 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
              <div className="min-w-[46rem]">
                <SystemDiagram />
              </div>
            </div>
            <p className="mt-3 text-[0.8125rem] text-graphite-600 md:hidden">
              Scroll the diagram sideways to see the whole system →
            </p>
          </div>
        </Reveal>

        <ol className="mt-20 grid gap-x-12 gap-y-px border-t border-line md:mt-28 md:grid-cols-2">
          {system.parts.map((part, index) => (
            <li key={part.key} className="border-b border-line">
              <Reveal delay={0.03 * (index % 4)} className="flex gap-6 py-7">
                <span
                  className={`type-label mt-1.5 shrink-0 tabular-nums ${
                    part.accent ? "text-signal-deep" : "text-graphite-400"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[1.0625rem] font-medium tracking-[-0.015em] text-graphite-900">
                    {part.name}
                  </h3>
                  <p className="mt-2 max-w-[44ch] text-[0.9375rem] leading-relaxed text-graphite-600">
                    {part.body}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

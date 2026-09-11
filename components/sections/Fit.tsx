import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { fit } from "@/lib/content";

export function Fit() {
  return (
    <section id="fit" className="section-pad border-b border-line bg-paper-alt">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <SectionLabel>{fit.label}</SectionLabel>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="type-h2 mt-8 max-w-[16ch] text-graphite-900">
                {fit.heading}
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-5 md:pt-16">
            <Reveal delay={0.1}>
              <p className="type-lead max-w-[44ch] text-graphite-600">{fit.lead}</p>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:mt-24 md:grid-cols-2">
          {fit.paths.map((path, index) => (
            <Reveal
              key={path.key}
              delay={0.06 * index}
              className="flex h-full flex-col rounded-lg border border-line bg-white p-7 md:p-9"
            >
              <p className="type-label text-signal-deep">
                If — {path.condition}
              </p>
              <h3 className="type-h3 mt-6 max-w-[20ch] text-graphite-900">
                {path.title}
              </h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-graphite-600">
                {path.body}
              </p>

              <ol className="mt-8 space-y-4 border-t border-line pt-7">
                {path.steps.map((step, stepIndex) => (
                  <li key={step} className="flex gap-4">
                    <span className="type-label mt-1 shrink-0 tabular-nums text-graphite-400">
                      {String(stepIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.9375rem] leading-relaxed text-graphite-700">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          ))}
        </div>

        {/* Qualification, said out loud. This is here to send the wrong-fit
            visitor away before they book a call, not to hedge. */}
        <Reveal delay={0.08}>
          <div className="mt-12 border-t border-line pt-12">
            <h3 className="type-h3 max-w-[30ch] text-graphite-900">
              {fit.notForYou.title}
            </h3>
            <p className="mt-4 max-w-[62ch] text-[1.0625rem] leading-relaxed text-graphite-600">
              {fit.notForYou.body}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

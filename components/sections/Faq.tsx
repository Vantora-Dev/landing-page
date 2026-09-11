import { AccordionItem } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { faq } from "@/lib/faq";

export function Faq() {
  return (
    <section id="faq" className="section-pad border-b border-line bg-paper">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <SectionLabel>07 — Objections</SectionLabel>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="type-h2 mt-8 max-w-[12ch] text-graphite-900">
                The things owners actually ask.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-[36ch] text-[0.9375rem] leading-relaxed text-graphite-600">
                Answered the way we&rsquo;d answer them on the phone, including
                the ones where the honest answer isn&rsquo;t the flattering one.
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            <Reveal delay={0.06}>
              <div className="border-t border-line">
                {faq.map((item, index) => (
                  <AccordionItem
                    key={item.q}
                    question={item.q}
                    answer={item.a}
                    defaultOpen={index === 0}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

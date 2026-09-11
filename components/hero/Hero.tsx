import { Button } from "@/components/ui/Button";
import { hero } from "@/lib/content";
import { CTA_HREF, CTA_PRIMARY } from "@/lib/site";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroPoster } from "./HeroPoster";

export function Hero() {
  return (
    <section
      id="top"
      className="on-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink-950"
    >
      {/* The poster is rendered here, on the server, and handed to the client
          component as a slot so its markup never ships as component code. */}
      <HeroBackdrop poster={<HeroPoster />} />

      {/* Bottom padding keeps the type clear of the near rows; only the
          distant, dimmest part of the floor sits behind the trust strip. */}
      <div className="shell relative z-10 flex flex-1 flex-col justify-center pb-[7svh] pt-28 sm:pb-[26svh] md:pb-[30svh] md:pt-32">
        <p className="type-label flex items-center gap-3 text-graphite-400">
          <span aria-hidden="true" className="inline-block h-px w-6 bg-signal" />
          {hero.eyebrow}
        </p>

        {/* Two deliberate lines: the setup in grey, the turn in white. */}
        <h1 className="type-display mt-7 max-w-[22ch] md:mt-8 md:max-w-none">
          <span className="block text-graphite-400">{hero.headline[0]}</span>
          <span className="block text-paper">{hero.headline[1]}</span>
        </h1>

        <p className="type-lead mt-7 max-w-[42ch] text-graphite-400 md:mt-8 md:max-w-[50ch]">
          {hero.lead}
        </p>

        {/* The canvas is decorative; this is what a screen reader gets instead. */}
        <p className="sr-only">{hero.canvasDescription}</p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button href={CTA_HREF} tone="dark" variant="primary">
            {CTA_PRIMARY}
          </Button>
          <Button href="#process" tone="dark" variant="secondary">
            See how it works
          </Button>
        </div>

        <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8125rem] text-graphite-400 md:mt-16">
          {hero.trust.map((item, index) => (
            <li key={item} className="flex items-center gap-6">
              {index > 0 ? (
                <span aria-hidden="true" className="hidden h-3 w-px bg-ink-700 md:block" />
              ) : null}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

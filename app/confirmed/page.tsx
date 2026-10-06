import type { Metadata } from "next";
import { ConfirmedSummary } from "@/components/confirmed/ConfirmedSummary";
import { CallButton } from "@/components/ui/CallButton";
import { site } from "@/lib/site";

/**
 * Where a successful booking lands, and the page analytics counts as a lead.
 *
 * Kept out of search results and out of the sitemap: nobody should arrive
 * here from Google, and every stray visit would read as a booking.
 */
export const metadata: Metadata = {
  title: "Booking confirmed",
  description: `Your call with ${site.name} is booked.`,
  alternates: { canonical: "/confirmed" },
  robots: { index: false, follow: false },
};

const next = [
  "At that time we call the number you gave us. Nothing to install or join.",
  "Need to move it? Email or call us and we'll find another time.",
];

export default function ConfirmedPage() {
  return (
    <main id="main" className="on-dark flex flex-1 flex-col bg-ink-950">
      <div className="shell flex h-[4.5rem] items-center">
        <a
          href="/"
          className="type-label !text-[0.8125rem] !tracking-[0.14em] font-medium text-paper"
        >
          {site.name}
        </a>
      </div>

      <div className="shell section-pad flex-1">
        <div className="max-w-[46rem]">
          <p className="type-label flex items-center gap-3 text-graphite-400">
            <span aria-hidden="true" className="inline-block h-px w-6 bg-signal" />
            Booked
          </p>

          <ConfirmedSummary />

          <h2 className="type-label mt-12 text-graphite-400">What happens next</h2>
          <ul className="mt-5 space-y-4 border-t border-ink-700 pt-8">
            {next.map((step) => (
              <li key={step} className="flex gap-4">
                <span aria-hidden="true" className="mt-[0.6rem] h-px w-4 shrink-0 bg-signal" />
                <span className="text-[0.9375rem] leading-relaxed text-graphite-400">{step}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="/"
              className="inline-flex min-h-[3.25rem] items-center justify-center rounded-md bg-signal px-7 text-[1rem] font-medium tracking-[-0.01em] text-ink-950 transition-colors hover:bg-[#fcd34d]"
            >
              Back to the homepage
            </a>
            <CallButton tone="quiet" />
          </div>

          <p className="mt-8 text-[0.875rem] text-graphite-400">
            Questions before the call? Email{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-paper underline underline-offset-4 hover:text-signal"
            >
              {site.email}
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

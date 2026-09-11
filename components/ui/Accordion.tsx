"use client";

import { useId, useState } from "react";

type AccordionItemProps = {
  question: string;
  answer: string;
  /** First item opens by default so the pattern is obvious. */
  defaultOpen?: boolean;
};

/**
 * Native <details>/<summary>.
 *
 * Chosen over a div/aria-expanded implementation because it is keyboard and
 * screen-reader correct with no JS, works before hydration, and is findable by
 * the browser's in-page search when collapsed. The only client state is the
 * open flag, used to rotate the marker.
 */
export function AccordionItem({ question, answer, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <details
      open={defaultOpen}
      onToggle={(event) => setOpen((event.currentTarget as HTMLDetailsElement).open)}
      className="group border-b border-line"
    >
      <summary
        aria-controls={id}
        className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden"
      >
        <h3 className="type-h3 max-w-[42rem] text-graphite-900">{question}</h3>
        <span
          aria-hidden="true"
          className="relative mt-1 h-4 w-4 shrink-0 text-signal-deep"
        >
          <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
          <span
            className={`absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? "scale-y-0" : "scale-y-100"
            }`}
          />
        </span>
      </summary>
      <div id={id} className="pb-8 pr-10">
        <p className="max-w-[46rem] text-[1.0625rem] leading-relaxed text-graphite-600">
          {answer}
        </p>
      </div>
    </details>
  );
}

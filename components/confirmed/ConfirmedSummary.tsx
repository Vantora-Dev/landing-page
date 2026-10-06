"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { bookingTypes, formatSlot } from "@/lib/booking";
import { readReceipt, saveReceipt, type BookingReceipt } from "@/lib/booking-receipt";

/**
 * The booking-specific half of the confirmation page: what was booked and
 * when, read from the receipt the form left behind.
 *
 * It also reports the conversion. `generate_lead` is sent once per booking —
 * only when a receipt exists and hasn't been reported — so a refresh, a
 * bookmark or someone typing the URL can't inflate the lead count the way a
 * bare page view can.
 */
export function ConfirmedSummary() {
  const [receipt, setReceipt] = useState<BookingReceipt | null>(null);

  useEffect(() => {
    const stored = readReceipt();
    if (!stored) return;
    setReceipt(stored);

    if (!stored.tracked) {
      trackEvent("generate_lead", { booking_type: stored.type });
      saveReceipt({ ...stored, tracked: true });
    }
  }, []);

  if (!receipt) {
    return (
      <>
        <h1 className="type-h2 mt-8 text-paper">Your booking is confirmed.</h1>
        <p className="type-lead mt-6 max-w-[44ch] text-graphite-400">
          Thanks for booking with us. We&rsquo;ll call you at the time you chose.
        </p>
      </>
    );
  }

  const kind = bookingTypes[receipt.type];

  return (
    <>
      <h1 className="type-h2 mt-8 text-paper">
        {receipt.firstName ? `Thanks, ${receipt.firstName}. ` : ""}Your{" "}
        {kind.label.toLowerCase()} is confirmed.
      </h1>
      <p className="type-lead mt-6 max-w-[44ch] text-graphite-400">
        We&rsquo;ll call you at the time below, on the number you gave us.
      </p>

      <dl className="mt-10 grid gap-6 rounded-lg border border-ink-700 bg-white/[0.02] p-6 sm:grid-cols-2 md:p-8">
        <div>
          <dt className="type-label text-graphite-400">When</dt>
          <dd className="mt-3 text-[1.0625rem] leading-relaxed text-paper">
            {formatSlot(receipt.startsAt)}
          </dd>
        </div>
        <div>
          <dt className="type-label text-graphite-400">What</dt>
          <dd className="mt-3 text-[1.0625rem] leading-relaxed text-paper">
            {kind.label}, {kind.minutes} minutes
          </dd>
        </div>
      </dl>

      {receipt.confirmationSent ? (
        <p className="mt-6 text-[0.9375rem] leading-relaxed text-graphite-400">
          We&rsquo;ve emailed you a confirmation with a calendar file attached.
          If it isn&rsquo;t in your inbox, check spam.
        </p>
      ) : null}
    </>
  );
}

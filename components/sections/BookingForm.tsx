"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  bookingTypes,
  upcomingSlots,
  validateBooking,
  type BookingResponse,
  type BookingType,
} from "@/lib/booking";
import { saveReceipt } from "@/lib/booking-receipt";
import { CONFIRMED_PATH } from "@/lib/site";

type Status = "idle" | "submitting" | "error";

const fields = [
  { name: "name", label: "Your name", type: "text", autoComplete: "name", required: true },
  { name: "business", label: "Laundromat name", type: "text", autoComplete: "organization", required: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", required: true },
  { name: "location", label: "City and state", type: "text", autoComplete: "address-level2", required: true },
] as const;

const inputClass =
  "w-full rounded-md border border-ink-700 bg-ink-900 px-4 py-3 text-[0.9375rem] text-paper placeholder:text-graphite-600 transition-colors hover:border-graphite-600 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/40";

const labelClass = "block text-[0.8125rem] font-medium text-graphite-400";

/** The visitor's own calendar day for a slot, as a sortable "YYYY-MM-DD". */
function localDay(slot: string): string {
  const date = new Date(slot);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** "2026-10-07" → "Wed, Oct 7", read as a local calendar day. */
function dayLabel(day: string): string {
  const [year, month, date] = day.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(year, month - 1, date));
}

/** A slot's start in the visitor's local time, e.g. "2:30 PM". */
function timeLabel(slot: string): string {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(
    new Date(slot),
  );
}

export function BookingForm() {
  const formId = useId();
  const [type, setType] = useState<BookingType>("call");
  // Filled in after mount: which slots are still free comes from the server,
  // and which local day and time each lands on is only known in the browser.
  const [slots, setSlots] = useState<string[]>([]);
  const [day, setDay] = useState("");
  const [timezone, setTimezone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function loadSlots() {
    try {
      const response = await fetch("/api/slots");
      if (!response.ok) throw new Error(String(response.status));
      setSlots(((await response.json()) as { slots: string[] }).slots);
    } catch {
      // Availability is a courtesy; the route still refuses a taken slot.
      setSlots(upcomingSlots());
    }
  }

  useEffect(() => {
    void loadSlots();
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);

    // Coming back from the confirmation page can restore this page from the
    // back/forward cache mid-submit; without this the button stays disabled.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setStatus("idle");
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const { day: _day, ...rest } = Object.fromEntries(new FormData(form).entries());
    const payload = { ...rest, timezone };

    // Same validator the route runs, so the common mistakes are caught without
    // a round trip — and the server still has the final say.
    const parsed = validateBooking(payload);
    if (!parsed.ok) {
      setFieldErrors(parsed.fieldErrors);
      setStatus("error");
      setMessage("Some details need another look.");
      return;
    }

    setStatus("submitting");
    setFieldErrors({});

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const result = (await response.json()) as BookingResponse;

      if (!response.ok || !result.ok) {
        setFieldErrors(("fieldErrors" in result && result.fieldErrors) || {});
        setStatus("error");
        // Taken while they were filling the form in: show what's left now.
        if (response.status === 409) void loadSlots();
        setMessage(
          ("error" in result && result.error) ||
            "Something went wrong. Please email us instead.",
        );
        return;
      }

      saveReceipt({
        type: parsed.data.type,
        startsAt: parsed.data.startsAt,
        firstName: parsed.data.name.split(/\s+/)[0],
        confirmationSent: result.confirmationSent === true,
      });
      // A full page load rather than a client-side transition, so analytics
      // records the confirmation as an ordinary page view with no extra setup.
      window.location.assign(CONFIRMED_PATH);
    } catch {
      setStatus("error");
      setMessage("Couldn't book that. Please email us instead.");
    }
  }

  const slotError = fieldErrors.startsAt;

  // Slots grouped by the visitor's calendar day, which can differ from the UK
  // one: 9 AM in London is still the evening before in Honolulu.
  const byDay = useMemo(() => {
    const groups = new Map<string, string[]>();
    for (const slot of slots) {
      const key = localDay(slot);
      groups.set(key, [...(groups.get(key) ?? []), slot]);
    }
    return groups;
  }, [slots]);
  const times = byDay.get(day) ?? [];

  return (
    <form onSubmit={onSubmit} noValidate className="on-dark">
      <fieldset>
        <legend className={labelClass}>What would you like to book?</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {(Object.keys(bookingTypes) as BookingType[]).map((key) => {
            const option = bookingTypes[key];
            return (
              <label
                key={key}
                className={`flex cursor-pointer flex-col rounded-md border px-4 py-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-signal/40 ${
                  type === key
                    ? "border-signal bg-signal/10"
                    : "border-ink-700 bg-ink-900 hover:border-graphite-600"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={key}
                  checked={type === key}
                  onChange={() => setType(key)}
                  className="sr-only"
                />
                <span className="text-[0.9375rem] font-medium text-paper">
                  {option.label} · {option.minutes} min
                </span>
                <span className="mt-1 text-[0.8125rem] text-graphite-400">{option.blurb}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-day`} className={labelClass}>
            Day
          </label>
          <select
            id={`${formId}-day`}
            name="day"
            required
            value={day}
            onChange={(event) => setDay(event.target.value)}
            disabled={slots.length === 0}
            aria-invalid={slotError ? true : undefined}
            aria-describedby={`${formId}-slot-note`}
            className={`mt-2 ${inputClass} ${slotError ? "border-signal" : ""}`}
          >
            <option value="" disabled>
              Pick a day
            </option>
            {[...byDay.keys()].map((key) => (
              <option key={key} value={key}>
                {dayLabel(key)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${formId}-time`} className={labelClass}>
            Time
          </label>
          <select
            id={`${formId}-time`}
            name="startsAt"
            required
            // Remounted per day so a time picked for another day can't linger.
            key={day}
            defaultValue=""
            disabled={!day}
            aria-invalid={slotError ? true : undefined}
            aria-describedby={`${formId}-slot-note`}
            className={`mt-2 ${inputClass} ${slotError ? "border-signal" : ""}`}
          >
            <option value="" disabled>
              Pick a time
            </option>
            {times.map((slot) => (
              <option key={slot} value={slot}>
                {timeLabel(slot)}
              </option>
            ))}
          </select>
        </div>

        <p
          id={`${formId}-slot-note`}
          className={`text-[0.8125rem] sm:col-span-2 ${slotError ? "text-signal" : "text-graphite-400"}`}
        >
          {slotError ||
            (timezone
              ? `Times are shown in your time zone (${timezone.replace(/_/g, " ")}). We keep UK office hours.`
              : "Times are shown in your own time zone. We keep UK office hours.")}
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const id = `${formId}-${field.name}`;
          const error = fieldErrors[field.name];
          return (
            <div
              key={field.name}
              className={field.name === "location" ? "sm:col-span-2" : ""}
            >
              <label htmlFor={id} className={labelClass}>
                {field.label}
              </label>
              <input
                id={id}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                required={field.required}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`mt-2 ${inputClass} ${error ? "border-signal" : ""}`}
              />
              {error ? (
                <p id={`${id}-error`} className="mt-2 text-[0.8125rem] text-signal">
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}

        <div className="sm:col-span-2">
          <label htmlFor={`${formId}-message`} className={labelClass}>
            Anything you want covered (optional)
          </label>
          <textarea
            id={`${formId}-message`}
            name="message"
            rows={2}
            className={`mt-2 ${inputClass} resize-y`}
            placeholder="Wash-and-fold, delivery, memberships — or where you're stuck."
          />
        </div>
      </div>

      {/* Honeypot. Hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${formId}-company`}>Company</label>
        <input id={`${formId}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-md bg-signal px-7 text-[1rem] font-medium tracking-[-0.01em] text-ink-950 transition-colors hover:bg-[#fcd34d] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {status === "submitting" ? "Booking…" : `Book my ${type === "demo" ? "demo" : "call"}`}
          {status === "submitting" ? null : (
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-[0.9rem] w-[0.9rem]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <p className="text-[0.8125rem] text-graphite-400">
          No obligation. We never share your details.
        </p>
      </div>

      {/* Announced to screen readers without stealing focus */}
      {message ? (
        <p
          role="status"
          aria-live="polite"
          className="mt-5 rounded-md border border-ink-700 bg-white/[0.03] px-4 py-3 text-[0.875rem] leading-relaxed text-graphite-400"
        >
          {message}
        </p>
      ) : (
        <p role="status" aria-live="polite" className="sr-only" />
      )}
    </form>
  );
}

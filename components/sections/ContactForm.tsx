"use client";

import { useId, useState } from "react";
import { validateContact, type ContactResponse } from "@/lib/contact-schema";

type Status = "idle" | "submitting" | "success" | "error";

const fields = [
  { name: "name", label: "Your name", type: "text", autoComplete: "name", required: true },
  { name: "business", label: "Laundromat name", type: "text", autoComplete: "organization", required: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { name: "phone", label: "Phone (optional)", type: "tel", autoComplete: "tel", required: false },
  { name: "location", label: "City and state", type: "text", autoComplete: "address-level2", required: true },
] as const;

const inputClass =
  "w-full rounded-md border border-ink-700 bg-ink-900 px-4 py-3 text-[0.9375rem] text-paper placeholder:text-graphite-600 transition-colors hover:border-graphite-600 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/40";

export function ContactForm() {
  const formId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    // Same validator the route runs, so the common mistakes are caught without
    // a round trip — and the server still has the final say.
    const parsed = validateContact(payload);
    if (!parsed.ok) {
      setFieldErrors(parsed.fieldErrors);
      setStatus("error");
      setMessage("Some details need another look.");
      return;
    }

    setStatus("submitting");
    setFieldErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const result = (await response.json()) as ContactResponse;

      if (!response.ok || !result.ok) {
        setFieldErrors(("fieldErrors" in result && result.fieldErrors) || {});
        setStatus("error");
        setMessage(
          ("error" in result && result.error) ||
            "Something went wrong. Please email us instead.",
        );
        return;
      }

      form.reset();
      setStatus("success");
      setMessage("Got it. We'll be in touch within one business day.");
    } catch {
      setStatus("error");
      setMessage("Couldn't send that. Please email us instead.");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="on-dark">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const id = `${formId}-${field.name}`;
          const error = fieldErrors[field.name];
          return (
            <div
              key={field.name}
              className={field.name === "location" ? "sm:col-span-2" : ""}
            >
              <label
                htmlFor={id}
                className="block text-[0.8125rem] font-medium text-graphite-400"
              >
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
          <label
            htmlFor={`${formId}-message`}
            className="block text-[0.8125rem] font-medium text-graphite-400"
          >
            What you&rsquo;re hoping to add (optional)
          </label>
          <textarea
            id={`${formId}-message`}
            name="message"
            rows={3}
            className={`mt-2 ${inputClass} resize-y`}
            placeholder="Wash-and-fold, delivery, memberships — or just tell us where you're stuck."
          />
        </div>
      </div>

      {/* Honeypot. Hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${formId}-company`}>Company</label>
        <input id={`${formId}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-7 inline-flex min-h-[3rem] w-full items-center justify-center rounded-md bg-signal px-6 text-[0.9375rem] font-medium text-ink-950 transition-colors hover:bg-[#fcd34d] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Request a call"}
      </button>

      {/* Announced to screen readers without stealing focus */}
      <p
        role="status"
        aria-live="polite"
        className={`mt-4 text-[0.875rem] ${
          status === "success" ? "text-signal" : "text-graphite-400"
        }`}
      >
        {message}
      </p>
    </form>
  );
}

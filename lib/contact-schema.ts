/**
 * Contact validation, shared by the client form and the API route.
 *
 * Hand-written rather than schema-library-backed on purpose: this is six
 * string fields, and the client half of a shared Zod schema was adding ~50KB
 * gzipped to the initial bundle of a page whose whole point is loading fast on
 * a phone. One module, used by both sides, so the rules can't drift.
 */

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  business: string;
  location: string;
  message: string;
  /** Honeypot — must stay empty. Real people never see this field. */
  company: string;
};

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export type ValidationResult =
  | { ok: true; data: ContactInput }
  | { ok: false; fieldErrors: Record<string, string> };

/** Intentionally permissive: it rejects typos, not unusual-but-valid addresses. */
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateContact(payload: unknown): ValidationResult {
  const input = (payload ?? {}) as Record<string, unknown>;

  const data: ContactInput = {
    name: str(input.name),
    email: str(input.email),
    phone: str(input.phone),
    business: str(input.business),
    location: str(input.location),
    message: str(input.message),
    company: str(input.company),
  };

  const fieldErrors: Record<string, string> = {};

  if (data.name.length < 2) fieldErrors.name = "Please enter your name.";
  else if (data.name.length > 80) fieldErrors.name = "That name is too long.";

  if (!EMAIL.test(data.email)) {
    fieldErrors.email = "That doesn't look like an email address.";
  } else if (data.email.length > 160) {
    fieldErrors.email = "That email address is too long.";
  }

  if (data.business.length < 2) {
    fieldErrors.business = "Please tell us the name of your laundromat.";
  } else if (data.business.length > 120) {
    fieldErrors.business = "That name is too long.";
  }

  if (data.location.length < 2) fieldErrors.location = "City and state, roughly.";
  else if (data.location.length > 120) fieldErrors.location = "That's too long.";

  // Required, because the form's promise is a callback. Deliberately loose:
  // it rejects an empty or obviously-not-a-number field, not unusual formats.
  const phoneDigits = data.phone.replace(/[^0-9]/g, "");
  if (phoneDigits.length < 7) {
    fieldErrors.phone = "We need a number to call you on.";
  } else if (data.phone.length > 40) {
    fieldErrors.phone = "That phone number is too long.";
  }
  if (data.message.length > 2000) {
    fieldErrors.message = "Please keep this under 2000 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };
  return { ok: true, data };
}

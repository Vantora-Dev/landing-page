/**
 * Booking rules and validation, shared by the client form and the API route.
 *
 * Hand-written rather than schema-library-backed on purpose: this is a handful
 * of string fields, and the client half of a shared Zod schema was adding
 * ~50KB gzipped to the initial bundle of a page whose whole point is loading
 * fast on a phone. One module, used by both sides, so the rules can't drift.
 *
 * Bookable hours are UK office hours (`bookingRules.timeZone`). The form shows
 * each slot converted to the **visitor's** local time — a laundromat owner in
 * Ohio sees "9:30 AM" and means their 9:30 AM — and sends the exact instant
 * plus their IANA zone. The route re-checks that instant against these same
 * rules in UK time, so a hand-crafted request can't book 3 AM on a Sunday.
 */

export const bookingRules = {
  /** The zone the hours below are in, and the one the team reads its inbox in. */
  timeZone: "Europe/London",
  /** First and last bookable start, in `timeZone` (24h). */
  firstSlot: "09:00",
  lastSlot: "17:30",
  slotMinutes: 30,
  /** How many bookable weekdays to offer, starting tomorrow. */
  daysAhead: 15,
} as const;

export const bookingTypes = {
  call: { label: "Intro call", minutes: 15, blurb: "A straight answer on fit" },
  demo: { label: "Product demo", minutes: 30, blurb: "See the system working" },
} as const;

export type BookingType = keyof typeof bookingTypes;

export type BookingInput = {
  name: string;
  email: string;
  phone: string;
  business: string;
  location: string;
  type: BookingType;
  /** The chosen start as an ISO instant (UTC). */
  startsAt: string;
  /** Visitor's IANA zone, e.g. "America/Chicago". */
  timezone: string;
  message: string;
  /** Honeypot — must stay empty. Real people never see this field. */
  company: string;
};

/** A validated booking with the honeypot stripped. */
export type Booking = Omit<BookingInput, "company">;

export type BookingResponse =
  /** `confirmationSent`: whether the visitor was emailed their calendar invite. */
  | { ok: true; confirmationSent?: boolean }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export type ValidationResult =
  | { ok: true; data: BookingInput }
  | { ok: false; fieldErrors: Record<string, string> };

/** Intentionally permissive: it rejects typos, not unusual-but-valid addresses. */
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

const DAY_MS = 86_400_000;

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function minutesOf(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Every bookable start time in a day, as "HH:MM". */
export function slotTimes(): string[] {
  const times: string[] = [];
  const last = minutesOf(bookingRules.lastSlot);
  for (let m = minutesOf(bookingRules.firstSlot); m <= last; m += bookingRules.slotMinutes) {
    times.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
  }
  return times;
}

/** The wall-clock fields of an instant, as read in `timeZone`. */
function wallClock(instant: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(instant));
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";

  return {
    weekday: part("weekday"),
    year: Number(part("year")),
    month: Number(part("month")),
    day: Number(part("day")),
    minutes: Number(part("hour")) * 60 + Number(part("minute")),
  };
}

/** A wall-clock time in `timeZone` to the instant it names. */
function zonedInstant(
  year: number,
  month: number,
  day: number,
  minutes: number,
  timeZone: string,
): number {
  const asUtc = Date.UTC(year, month - 1, day, 0, minutes);
  const seen = wallClock(asUtc, timeZone);
  // How far the zone's clock runs ahead of UTC at that moment. Office hours
  // never fall in a daylight-saving changeover, so one pass is exact.
  const offset = Date.UTC(seen.year, seen.month - 1, seen.day, 0, seen.minutes) - asUtc;
  return asUtc - offset;
}

/**
 * Every bookable slot as an ISO instant, soonest first: office hours on the
 * next `daysAhead` UK weekdays, starting tomorrow (UK time).
 */
export function upcomingSlots(now: number = Date.now()): string[] {
  const { timeZone, daysAhead } = bookingRules;
  const today = wallClock(now, timeZone);
  const times = slotTimes().map(minutesOf);
  const slots: string[] = [];

  // Noon UTC is the same calendar day in the UK all year, so stepping it by
  // whole days walks the UK calendar without daylight-saving drift.
  let cursor = Date.UTC(today.year, today.month - 1, today.day, 12);
  for (let days = 0; days < daysAhead; ) {
    cursor += DAY_MS;
    const date = new Date(cursor);
    const weekday = date.getUTCDay();
    if (weekday === 0 || weekday === 6) continue;
    days += 1;

    for (const minutes of times) {
      const instant = zonedInstant(
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        date.getUTCDate(),
        minutes,
        timeZone,
      );
      slots.push(new Date(instant).toISOString());
    }
  }

  return slots;
}

export function isTimeZone(zone: string): boolean {
  if (!zone) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}

/** e.g. "Wednesday, October 7 at 2:30 PM CDT" */
export function formatSlot(startsAt: string, timeZone?: string): string {
  const date = new Date(startsAt);
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
  return `${day} at ${time}`;
}

/** Why a slot can't be booked, or `null` when it can. */
function slotError(startsAt: string, timezone: string, now: number): string | null {
  const instant = new Date(startsAt).getTime();
  if (!startsAt || Number.isNaN(instant)) return "Please pick a day and a time.";
  if (!isTimeZone(timezone)) return "We couldn't read your time zone. Please call us instead.";
  if (instant <= now) return "That time has already passed. Please pick another.";

  // Generous upper bound: `daysAhead` weekdays plus the weekends between them.
  const horizon = now + (bookingRules.daysAhead * 1.4 + 4) * DAY_MS;
  if (instant > horizon) return "That's too far ahead. Please pick a nearer day.";

  const { weekday, minutes } = wallClock(instant, bookingRules.timeZone);
  const offset = minutes - minutesOf(bookingRules.firstSlot);

  if (
    weekday === "Sat" ||
    weekday === "Sun" ||
    offset < 0 ||
    minutes > minutesOf(bookingRules.lastSlot) ||
    offset % bookingRules.slotMinutes !== 0
  ) {
    return "That time isn't available. Please pick another.";
  }

  return null;
}

export function validateBooking(payload: unknown, now: number = Date.now()): ValidationResult {
  const input = (payload ?? {}) as Record<string, unknown>;
  const type = str(input.type);

  const data: BookingInput = {
    name: str(input.name),
    email: str(input.email),
    phone: str(input.phone),
    business: str(input.business),
    location: str(input.location),
    type: type in bookingTypes ? (type as BookingType) : "call",
    startsAt: str(input.startsAt),
    timezone: str(input.timezone),
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

  // Required, because the booking is a phone call. Deliberately loose: it
  // rejects an empty or obviously-not-a-number field, not unusual formats.
  const phoneDigits = data.phone.replace(/[^0-9]/g, "");
  if (phoneDigits.length < 7) {
    fieldErrors.phone = "We need a number to call you on.";
  } else if (data.phone.length > 40) {
    fieldErrors.phone = "That phone number is too long.";
  }

  if (!(type in bookingTypes)) fieldErrors.type = "Please choose a call or a demo.";

  const slot = slotError(data.startsAt, data.timezone, now);
  if (slot) fieldErrors.startsAt = slot;

  if (data.message.length > 2000) {
    fieldErrors.message = "Please keep this under 2000 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };
  return { ok: true, data };
}

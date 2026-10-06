import { createSign } from "node:crypto";
import { bookingRules, bookingTypes, formatSlot, upcomingSlots, type Booking } from "./booking";
import { site } from "./site";

/**
 * Google Calendar, as the record of which slots are taken.
 *
 * Server-only. Authenticates as a service account that the team calendar has
 * been shared with, using a hand-signed JWT and plain `fetch` rather than the
 * `googleapis` package, which is far larger than the two calls made here:
 * free/busy to hide slots that are gone, and an insert to claim one.
 *
 * Everything here is optional. With the env vars unset, or with Google
 * unreachable, every slot is offered and bookings still go out by email — a
 * calendar outage must never be the reason a lead can't book.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API = "https://www.googleapis.com/calendar/v3";
const SCOPE = "https://www.googleapis.com/auth/calendar";
const TIMEOUT_MS = 8000;
const SLOT_MS = bookingRules.slotMinutes * 60_000;

/** How long a free/busy answer is reused before asking Google again. */
const BUSY_CACHE_MS = 30_000;

type Range = { start: number; end: number };

function config() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  // Env editors store the PEM's line breaks as literal "\n".
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, "\n").trim();
  if (!email || !key) return null;

  return { email, key, calendarId: process.env.GOOGLE_CALENDAR_ID?.trim() || site.email };
}

export function calendarConfigured(): boolean {
  return config() !== null;
}

let token: { value: string; expiresAt: number } | null = null;

async function accessToken(account: { email: string; key: string }): Promise<string> {
  if (token && Date.now() < token.expiresAt) return token.value;

  const now = Math.floor(Date.now() / 1000);
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const unsigned = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({
    iss: account.email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(account.key, "base64url");

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`token exchange ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }

  const body = (await response.json()) as { access_token: string; expires_in: number };
  // Refreshed a minute early so a token never expires mid-request.
  token = { value: body.access_token, expiresAt: Date.now() + (body.expires_in - 60) * 1000 };
  return token.value;
}

async function call(path: string, body: unknown): Promise<unknown> {
  const account = config();
  if (!account) throw new Error("calendar not configured");

  const response = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await accessToken(account)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`${path} ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
  return response.json();
}

let busyCache: { ranges: Range[]; fetchedAt: number } | null = null;

/** Busy time across the whole bookable window, or `null` if it can't be read. */
async function busyRanges(fresh: boolean): Promise<Range[] | null> {
  const account = config();
  if (!account) return null;
  if (!fresh && busyCache && Date.now() - busyCache.fetchedAt < BUSY_CACHE_MS) {
    return busyCache.ranges;
  }

  const slots = upcomingSlots();
  try {
    const result = (await call("/freeBusy", {
      timeMin: slots[0],
      timeMax: new Date(new Date(slots[slots.length - 1]).getTime() + SLOT_MS).toISOString(),
      items: [{ id: account.calendarId }],
    })) as {
      calendars?: Record<string, { busy?: Array<{ start: string; end: string }>; errors?: unknown }>;
    };

    const calendar = result.calendars?.[account.calendarId];
    // Google reports an unshared or mistyped calendar here, with a 200.
    if (!calendar || calendar.errors) {
      throw new Error(`calendar unreadable: ${JSON.stringify(calendar?.errors ?? "missing")}`);
    }

    const ranges = (calendar.busy ?? []).map((range) => ({
      start: new Date(range.start).getTime(),
      end: new Date(range.end).getTime(),
    }));
    busyCache = { ranges, fetchedAt: Date.now() };
    return ranges;
  } catch (error) {
    console.error("[calendar] free/busy lookup failed", error);
    return null;
  }
}

/**
 * A slot is taken if anything on the calendar overlaps the half hour from its
 * start — the longest booking — whichever type is being booked.
 */
function isFree(slot: string, busy: Range[]): boolean {
  const start = new Date(slot).getTime();
  return !busy.some((range) => range.start < start + SLOT_MS && range.end > start);
}

/** Upcoming slots with the taken ones removed; all of them if Google is unreachable. */
export async function availableSlots(): Promise<string[]> {
  const slots = upcomingSlots();
  const busy = await busyRanges(false);
  return busy ? slots.filter((slot) => isFree(slot, busy)) : slots;
}

/** Checked against Google directly, not the cache, at the moment of booking. */
export async function slotTaken(slot: string): Promise<boolean> {
  const busy = await busyRanges(true);
  return busy ? !isFree(slot, busy) : false;
}

/** Puts the booking on the team calendar, which is also what marks the slot taken. */
export async function addToCalendar(booking: Booking): Promise<boolean> {
  const account = config();
  if (!account) return false;

  const kind = bookingTypes[booking.type];
  const start = new Date(booking.startsAt);

  try {
    await call(`/calendars/${encodeURIComponent(account.calendarId)}/events`, {
      summary: `${kind.label}: ${booking.business} (${booking.name})`,
      description: [
        `Call ${booking.name} on ${booking.phone}`,
        booking.email,
        booking.location,
        `Their time: ${formatSlot(booking.startsAt, booking.timezone)}`,
        booking.message ? `\n${booking.message}` : "",
        `\nBooked on ${site.domain}`,
      ]
        .filter(Boolean)
        .join("\n"),
      start: { dateTime: start.toISOString() },
      end: { dateTime: new Date(start.getTime() + kind.minutes * 60_000).toISOString() },
    });
    busyCache = null;
    return true;
  } catch (error) {
    console.error("[calendar] could not add the booking", error);
    return false;
  }
}

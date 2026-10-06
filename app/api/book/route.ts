import { NextResponse } from "next/server";
import { validateBooking, type Booking, type BookingResponse } from "@/lib/booking";
import { sendBookingEmail, sendConfirmationEmail } from "@/lib/booking-email";
import { addToCalendar, slotTaken } from "@/lib/google-calendar";
import { buildPayload } from "@/lib/lead-webhook";
import { site } from "@/lib/site";

/**
 * Booking endpoint.
 *
 * A booking goes to up to three places: the team calendar (Google Calendar,
 * which is also what marks the slot as taken), an email to the team inbox
 * (`site.email`, via Resend), and a webhook if `LEAD_WEBHOOK_URL` is set —
 * `lib/lead-webhook.ts` shapes that body for Slack, Discord or anything else.
 * The visitor is then emailed a confirmation with a calendar file.
 *
 * The rule here is that this route never tells a visitor their call is booked
 * unless the booking actually went somewhere. The form sends them to
 * `/confirmed` on success, and that page is what analytics counts as a lead —
 * so a false success is both a lost enquiry and a wrong number in the report.
 * If no sink accepts it, the visitor is told to phone instead, and the
 * booking is written to the function log so it can still be recovered.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const WEBHOOK_TIMEOUT_MS = 8000;

// Per-instance and reset on cold start: a speed bump against casual abuse, not
// a defence. Swap for a shared store (Vercel KV) if it is ever actually needed.
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

async function deliverWebhook(booking: Booking): Promise<boolean> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(url, booking)),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error("[book] webhook rejected the booking", {
        status: response.status,
        body: (await response.text().catch(() => "")).slice(0, 300),
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("[book] webhook delivery failed", error);
    return false;
  }
}

export async function POST(request: Request): Promise<NextResponse<BookingResponse>> {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Try again in a minute." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const parsed = validateBooking(payload);

  if (!parsed.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Some details need another look.",
        fieldErrors: parsed.fieldErrors,
      },
      { status: 400 },
    );
  }

  // Honeypot tripped: accept silently so a bot learns nothing from the reply.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const { company: _honeypot, ...booking } = parsed.data;

  // Always logged, so a booking is recoverable even when delivery fails.
  console.info("[book] booking", { ...booking, receivedAt: new Date().toISOString() });

  // Someone else may have taken the slot since this visitor's form loaded.
  if (await slotTaken(booking.startsAt)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Some details need another look.",
        fieldErrors: { startsAt: "That time has just been taken. Please pick another." },
      },
      { status: 409 },
    );
  }

  // Calendar first and on its own: it is what closes the slot to the next
  // visitor, so the gap between checking and claiming should be as short as
  // it can be.
  const onCalendar = await addToCalendar(booking);

  const [emailed, hooked] = await Promise.all([
    sendBookingEmail(booking),
    deliverWebhook(booking),
  ]);

  if (!onCalendar && !emailed && !hooked) {
    return NextResponse.json(
      {
        ok: false,
        error: `We couldn't book that just now. Please call ${site.phone} and we'll pick it up straight away.`,
      },
      { status: 502 },
    );
  }

  if (!emailed) {
    console.error(`[book] booking was captured but did NOT reach ${site.email}`);
  }

  // Only once the booking is safely captured; never promised unless it sent.
  const confirmationSent = await sendConfirmationEmail(booking);

  return NextResponse.json({ ok: true, confirmationSent });
}

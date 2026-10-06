import { bookingRules, bookingTypes, formatSlot, type Booking } from "./booking";
import { site } from "./site";

/**
 * The two emails a booking produces: a notification to the team inbox
 * (`site.email`), and a confirmation to the visitor with the call attached as
 * a calendar file.
 *
 * Delivered through Resend's HTTP API with a plain `fetch`, so there is no
 * mail dependency to bundle. Building each message is separate from sending it
 * so the wording can be checked without an API key.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const SEND_TIMEOUT_MS = 8000;

/** Must be an address on a domain verified in Resend. */
const DEFAULT_FROM = `${site.name} Bookings <bookings@${site.domain}>`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Subjects are a single line; a pasted newline must not split one. */
function oneLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function buildBookingEmail(booking: Booking) {
  const kind = bookingTypes[booking.type];
  const theirTime = formatSlot(booking.startsAt, booking.timezone);
  const ourTime = formatSlot(booking.startsAt, bookingRules.timeZone);

  const rows: Array<[string, string]> = [
    ["Booking", `${kind.label} (${kind.minutes} min)`],
    ["Their time", `${theirTime} (${booking.timezone})`],
    ["Our time", ourTime],
    ["Name", booking.name],
    ["Laundromat", booking.business],
    ["Location", booking.location],
    ["Phone", booking.phone],
    ["Email", booking.email],
  ];
  if (booking.message) rows.push(["Notes", booking.message]);

  const subject = oneLine(
    `${kind.label} booked: ${booking.business}, ${formatSlot(booking.startsAt, bookingRules.timeZone)}`,
  );

  const text = [
    `New ${kind.label.toLowerCase()} booked on ${site.domain}`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Reply to this email to reach them directly.",
  ].join("\n");

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.5;color:#18181b">
<h2 style="margin:0 0 4px;font-size:18px">New ${escapeHtml(kind.label.toLowerCase())} booked</h2>
<p style="margin:0 0 20px;color:#52525b">${escapeHtml(booking.business)} · ${escapeHtml(ourTime)}</p>
<table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
${rows
  .map(
    ([label, value]) =>
      `<tr><td style="padding:6px 20px 6px 0;color:#71717a;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
  )
  .join("\n")}
</table>
<p style="margin:20px 0 0;color:#52525b">Reply to this email to reach them directly.</p>
</div>`;

  return { subject, text, html };
}

/** iCalendar text escaping (RFC 5545 §3.3.11). */
function icsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/([,;])/g, "\\$1")
    .replace(/\r?\n/g, "\\n");
}

/** "2026-10-07T13:30:00.000Z" → "20261007T133000Z" */
function icsDate(date: Date): string {
  return date.toISOString().replace(/[-:]|\.\d{3}/g, "");
}

/** The call as a calendar file the visitor can add with one tap. */
export function buildInvite(booking: Booking): string {
  const kind = bookingTypes[booking.type];
  const start = new Date(booking.startsAt);
  const end = new Date(start.getTime() + kind.minutes * 60_000);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${site.name}//Booking//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@${site.domain}`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsText(`${kind.label} with ${site.name}`)}`,
    `DESCRIPTION:${icsText(`We'll call you on ${booking.phone}. Need to move it? Email ${site.email} or call ${site.phone}.`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export function buildConfirmationEmail(booking: Booking) {
  const kind = bookingTypes[booking.type];
  const label = kind.label.toLowerCase();
  const when = formatSlot(booking.startsAt, booking.timezone);
  // First word only, clamped: this goes to an address a stranger typed in, so
  // the form must not be usable to mail someone an arbitrary message.
  const firstName = booking.name.split(/\s+/)[0].slice(0, 30);

  const lines = [
    `Hi ${firstName},`,
    `Your ${label} with ${site.name} is confirmed for ${when}. It takes about ${kind.minutes} minutes.`,
    `We'll call you at that time on the number you gave us. The attached file adds it to your calendar.`,
    `Need to move it? Reply to this email or call ${site.phone}.`,
    `${site.name}`,
  ];

  return {
    subject: `Your ${label} with ${site.name} is confirmed`,
    text: lines.join("\n\n"),
    html: `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6;color:#18181b">
${lines.map((line) => `<p style="margin:0 0 14px">${escapeHtml(line)}</p>`).join("\n")}
</div>`,
    attachments: [
      {
        filename: "laundrogrid-call.ics",
        content: Buffer.from(buildInvite(booking)).toString("base64"),
        content_type: "text/calendar",
      },
    ],
  };
}

async function send(message: Record<string, unknown>): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: process.env.BOOKING_EMAIL_FROM || DEFAULT_FROM, ...message }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error("[book] email provider rejected a message", {
        to: message.to,
        status: response.status,
        body: (await response.text().catch(() => "")).slice(0, 300),
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("[book] email delivery failed", error);
    return false;
  }
}

/** To the team. Hitting reply in the inbox answers the person who booked. */
export function sendBookingEmail(booking: Booking): Promise<boolean> {
  return send({ to: [site.email], reply_to: booking.email, ...buildBookingEmail(booking) });
}

/** To the visitor, with the calendar file. Replies come back to the team. */
export function sendConfirmationEmail(booking: Booking): Promise<boolean> {
  return send({ to: [booking.email], reply_to: site.email, ...buildConfirmationEmail(booking) });
}

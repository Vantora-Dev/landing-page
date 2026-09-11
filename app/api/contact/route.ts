import { NextResponse } from "next/server";
import { validateContact, type ContactResponse } from "@/lib/contact-schema";

/**
 * Stubbed contact endpoint.
 *
 * It validates, rejects obvious bots, and returns the shape the form expects —
 * but it does not yet deliver anywhere. Wiring it up is four steps:
 *
 *  TODO(1): send a notification. Resend is the least friction on Vercel:
 *           `RESEND_API_KEY` in env, then post to /emails with a plain-text
 *           body built from `data`.
 *  TODO(2): write the lead somewhere durable so nothing is lost if email
 *           bounces — the CRM this business actually uses, or a Vercel
 *           Postgres/KV table keyed by submitted_at.
 *  TODO(3): replace the in-memory rate limit below with a shared store
 *           (Vercel KV / Upstash). The current one resets on every cold start
 *           and is per-instance, so it is a speed bump, not a defence.
 *  TODO(4): add a CAPTCHA (Cloudflare Turnstile) only if the honeypot proves
 *           insufficient in production. Don't add friction before it's needed.
 *
 * Deliberately no third-party call today: nothing here can leak a lead to a
 * service that hasn't been chosen yet.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
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

export async function POST(request: Request): Promise<NextResponse<ContactResponse>> {
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
    return NextResponse.json(
      { ok: false, error: "Malformed request." },
      { status: 400 },
    );
  }

  const parsed = validateContact(payload);

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

  // Honeypot tripped: accept silently so a bot learns nothing from the response.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const { company: _honeypot, ...data } = parsed.data;

  // Until TODO(1) and TODO(2) are done, this log IS the delivery mechanism.
  // It shows up in the Vercel function logs. Do not ship to production
  // without wiring at least the notification.
  console.info("[contact] new enquiry", {
    ...data,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}

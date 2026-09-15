import { NextResponse } from "next/server";
import { validateContact, type ContactResponse } from "@/lib/contact-schema";
import { buildPayload, type Lead } from "@/lib/lead-webhook";
import { site } from "@/lib/site";

/**
 * Contact endpoint.
 *
 * Leads are delivered to a single webhook (`LEAD_WEBHOOK_URL`) — Slack,
 * Discord, Zapier and Make all accept an incoming POST, so one payload shape
 * covers every one of them: Slack reads `text`, Discord reads `content`, and
 * anything structured (Zapier, Make, a custom endpoint) reads `lead`. Each
 * ignores the keys it doesn't recognise.
 *
 * The rule here is that this route never tells a visitor their details were
 * received unless they actually went somewhere. If the webhook is missing or
 * fails, the visitor is told to phone instead, and the lead is written to the
 * function log so it can still be recovered. Silently swallowing an enquiry is
 * the one failure mode that costs real money.
 *
 * TODO(optional): add a second sink (email, or a database) if one webhook ever
 * feels like too few places for a lead to live.
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

async function deliver(lead: Lead): Promise<boolean> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(url, lead)),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error("[contact] webhook rejected the lead", {
        status: response.status,
        body: (await response.text().catch(() => "")).slice(0, 300),
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("[contact] webhook delivery failed", error);
    return false;
  }
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
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
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

  // Honeypot tripped: accept silently so a bot learns nothing from the reply.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const { company: _honeypot, ...lead } = parsed.data;

  // Always logged, so a lead is recoverable even when delivery fails.
  console.info("[contact] enquiry", { ...lead, receivedAt: new Date().toISOString() });

  const delivered = await deliver(lead);

  if (!delivered) {
    return NextResponse.json(
      {
        ok: false,
        error: `We couldn't submit that just now. Please call ${site.phone} and we'll pick it up straight away.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

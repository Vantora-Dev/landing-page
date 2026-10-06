# LaundroGrid — marketing site

The marketing site for [laundrogrid.com](https://laundrogrid.com). A single page
that sells one idea: a laundromat's customers are anonymous, and LaundroGrid
turns anonymous walk-ins into known customers who pay every month.

**This is a standalone repo on purpose.** It shares no types, no database and no
deploy cadence with the platform. It has no backend beyond the booking endpoints.

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), TypeScript strict |
| Styling | Tailwind v4, tokens defined in `app/globals.css` |
| Motion | Framer Motion, loaded lazily via `LazyMotion` |
| 3D | React Three Fiber + three, **hero only**, lazy + capability-gated |
| Fonts | Geist Sans + Geist Mono, self-hosted |
| Deploy | Vercel |

Package manager is **pnpm**.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm start        # serve the production build
pnpm typecheck    # tsc --noEmit
```

---

## Where to edit things

Copy lives in `lib/`, not in components, so wording can change without touching
JSX.

| File | What's in it |
|---|---|
| `lib/content.ts` | Every section's headings and body copy |
| `lib/faq.ts` | Objections — **the single source for both the accordion and the FAQ schema** |
| `lib/site.ts` | Name, URL, email, phone, LinkedIn, GA ID, nav |
| `lib/booking.ts` | Bookable hours, call types, booking validation |
| `lib/schema.ts` | JSON-LD, built from the files above |
| `app/globals.css` | Colour tokens, type scale, motion easing |

### Rules for anything written into those files

These are deliverability constraints, not style preferences. They exist because
the audience has been oversold by three web designers already.

- **No machine-level analytics.** Never "revenue per machine" or similar — that
  needs hardware most stores don't have.
- **Never "you don't need staff."** Wash-and-fold and delivery need people. The
  copy says so out loud, in several places. Keep it that way.
- **No specific customer numbers, revenue figures, percentages or multiples.**
  The `Counter` component is only ever used to count things we actually
  provide (revenue streams, parts of the system).
- **No published prices.** The site deliberately quotes on a call instead. If
  prices are ever put back on the page, the `Offer` / `OfferCatalog` markup
  must go back into `lib/schema.ts` at the same time — schema that advertises
  prices the page doesn't show is the mismatch Google penalises.
- **No testimonials, client logos or case studies** until real, consented ones
  exist. Where social proof would go, there are marked placeholders. Do not
  invent them.

---

## The hero

One 3D moment, and it carries the argument: a floor of machines seen in plan,
cold and unconnected, with a wavefront crossing it that warms each machine to
amber and links it to its known neighbours.

It is built in three layers:

1. **`HeroPoster`** — a server-rendered SVG of the same grid, frozen at
   `POSTER_PROGRESS`. It paints with the HTML, is the LCP element, and is a
   complete hero on its own.
2. **`useCapabilityGate`** — decides, at idle, whether this device gets WebGL at
   all. It rejects `prefers-reduced-motion`, Save-Data, 2G, low reported memory
   or core count, a missing WebGL2 context, **and software renderers by name**
   (SwiftShader / llvmpipe / etc.), because `failIfMajorPerformanceCaveat`
   doesn't reliably catch those and software WebGL costs seconds of script
   evaluation for a worse picture.
3. **`HeroScene`** — R3F. Three meshes total (plate outlines, drums,
   connections), no lights, no shadows, no postprocessing. DPR capped at 1.5.
   The loop stops when the hero scrolls out of view or the tab is hidden.

`components/hero/hero.config.ts` holds the grid and the projection. The WebGL
camera is **derived from the poster's projection** via `setViewOffset`, so the
poster and the canvas render the same image and the 600ms crossfade continues
the picture rather than replacing it. Change the projection in one place and
both follow.

### QA flags

| URL | Effect |
|---|---|
| `?gl=force` | Render the WebGL hero regardless of the capability gate |
| `?gl=off` | Force the static poster, as a low-power device would see it |

---

## SEO

The technical side is done and verifiable in the served HTML: a unique title
and description, a canonical URL, Open Graph and Twitter cards with a
build-generated image, `robots.txt`, `sitemap.xml`, semantic headings with a
single `h1`, and JSON-LD for Organization + WebSite + Service + FAQPage. The
FAQ markup is the one most likely to earn a rich result, and it is generated
from `lib/faq.ts`, so the page and the markup cannot disagree.

Two details that are easy to get wrong and are handled deliberately:

- **`lastmod` is a constant**, `site.contentUpdatedAt`, not `new Date()`. A
  lastmod that moves on every deploy tells Google the page changed when it
  didn't, and a crawler that learns your lastmod is meaningless stops using it.
  Bump it when the copy actually changes.
- **No `Offer` markup**, because no prices are published. Schema advertising
  prices the page doesn't show is a mismatch Google penalises.

**None of that gets you indexed on its own.** A new domain has to be told to
Google:

1. Add the property in [Google Search Console](https://search.google.com/search-console).
   The DNS TXT route verifies the whole domain and survives redeploys — prefer
   it. If you'd rather use the HTML tag, set `GOOGLE_SITE_VERIFICATION` in
   Vercel and **redeploy**: `metadata` is evaluated at build time, so setting
   the variable without a rebuild does nothing.
2. Submit `https://laundrogrid.com/sitemap.xml` under Sitemaps.
3. Use URL Inspection on `https://laundrogrid.com/` and Request Indexing.

Expect the brand name to rank within days of indexing, because nothing else
competes for it. Competitive terms ("laundromat marketing", "wash and fold
website") are a different problem that pages alone don't solve — they need
content and links over months.

## Booking and the confirmation page

`components/sections/BookingForm.tsx` posts to `app/api/book/route.ts`, and on
success sends the visitor to **`/confirmed`** (`app/confirmed/page.tsx`).
`lib/booking.ts` holds the slot rules and a dependency-free validator used by
**both** sides, so client and server rules can't drift.

**Slots.** `bookingRules` in `lib/booking.ts` sets them: UK office hours
(`Europe/London`), weekdays, 9:00 AM to 5:30 PM in half-hour steps, the next 15
weekdays starting tomorrow. Each slot is shown converted to the **visitor's**
time zone; the route re-checks the chosen instant against the same rules in UK
time.

**Availability.** The form loads its slots from `app/api/slots/route.ts`, which
removes anything busy on the team's Google Calendar (`lib/google-calendar.ts`)
— earlier bookings and the team's own meetings alike. On submit the route
checks the slot again, refuses it if it has just gone, and otherwise adds the
booking to the calendar, which is what closes the slot for the next visitor.
If the calendar isn't configured or Google is unreachable, every slot is
offered and booking carries on by email: a calendar outage must never be why a
lead can't book.

**Delivery.** Each booking is emailed to `site.email` through
[Resend](https://resend.com) (`lib/booking-email.ts`, plain `fetch`, no mail
dependency). The email shows the slot in the visitor's zone and in UK time,
and its reply-to is the visitor. The visitor gets their own confirmation email
with the call attached as a calendar (`.ics`) file. Both need `RESEND_API_KEY`
and the sending domain verified in Resend. If `LEAD_WEBHOOK_URL` is also set, a
copy goes there too; `lib/lead-webhook.ts` shapes the body for Discord, Slack,
or anything else.

The rule the route follows: **it never reports success unless the booking
actually went somewhere** — the calendar, the inbox or the webhook. If none
accepts it, the visitor is told to phone instead and the booking is written to
the function log so it can still be recovered.

### Connecting Google Calendar

1. In [Google Cloud Console](https://console.cloud.google.com/), create a
   project (any name) and enable the **Google Calendar API** for it.
2. Under **IAM & Admin → Service Accounts**, create a service account. It needs
   no roles. Open it, go to **Keys → Add key → Create new key → JSON**, and
   keep the downloaded file private.
3. In Google Calendar, signed in as `hello@laundrogrid.com`, open the
   calendar's **Settings and sharing → Share with specific people**, add the
   service account's email address (`…@….iam.gserviceaccount.com`) and give it
   **Make changes to events**.
4. In Vercel set `GOOGLE_SERVICE_ACCOUNT_EMAIL` to the file's `client_email`
   and `GOOGLE_SERVICE_ACCOUNT_KEY` to its `private_key`, then redeploy. Set
   `GOOGLE_CALENDAR_ID` only if the calendar isn't `hello@laundrogrid.com`'s
   main one.

If step 3 only offers "See only free/busy", the Workspace admin has limited
external sharing: in the Admin console under **Apps → Google Workspace →
Calendar → Sharing settings**, allow external sharing of all information.

To check it works, open `/api/slots` on the deployed site, put a test meeting
on the calendar inside office hours, and reload: that slot should be gone.
Failures are logged with a `[calendar]` prefix in the Vercel function log.

To block out time (holidays, a busy afternoon), just put an event on the
calendar and leave it marked **Busy**.

### Tracking bookings in Google Analytics

Set `NEXT_PUBLIC_GA_ID` to the GA4 measurement ID and redeploy; with it empty
no analytics script loads. A booking then shows up two ways:

- **`generate_lead` event** (recommended). Sent by the confirmation page once
  per booking, with a `booking_type` of `call` or `demo`. Mark it as a key
  event in GA4 under **Admin → Events**. A refresh, a bookmark or a typed URL
  does not send it again.
- **Page view of `/confirmed`**. Works with no setup, but counts every view of
  the page, reloads included.

`/confirmed` is `noindex` and absent from the sitemap. No name, email or time
is put in its URL — the booking summary travels in `sessionStorage`
(`lib/booking-receipt.ts`) — because GA records URLs and forbids personal data
in them.

---

## Measured results

Lighthouse, mobile preset, against `pnpm build && pnpm start`:

| | |
|---|---|
| Performance | **94–97** |
| Accessibility | **100** |
| Best Practices | **100** |
| SEO | **100** |

FCP 1.4s · TBT 90ms · CLS 0. LCP swings between 2.4s and 3.0s on identical
builds, which is what moves performance between 94 and 97 — the LCP element is
the `h1`, so the measurement lands on either the fallback-font paint or the
swapped-font paint depending on when the font arrives. Treat 90 as the floor,
not 97 as a guarantee, and don't chase a single low run.

`three` and `@react-three/fiber` are absent from the initial route JS and load
only after the capability gate passes. Re-check these after any dependency
change.

---

## Deploying to Vercel

1. Push the repo to GitHub and import it in Vercel. Framework preset is detected
   as Next.js; no build settings to change.
2. Set environment variables (Production **and** Preview):

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://laundrogrid.com` |
   | `RESEND_API_KEY` | Resend API key — **bookings are not emailed without it** |
   | `BOOKING_EMAIL_FROM` | Sender on the Resend-verified domain (optional) |
   | `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account for Google Calendar — **slots can double-book without it** |
   | `GOOGLE_SERVICE_ACCOUNT_KEY` | That account's private key |
   | `GOOGLE_CALENDAR_ID` | Calendar to use, if not `hello@laundrogrid.com` (optional) |
   | `LEAD_WEBHOOK_URL` | Slack/Discord/Zapier webhook for a second copy (optional) |
   | `NEXT_PUBLIC_GA_ID` | GA4 measurement ID, e.g. `G-XXXXXXXXXX` (optional) |

   `NEXT_PUBLIC_SITE_URL` feeds canonical URLs, Open Graph, the sitemap and
   JSON-LD — a wrong value here quietly damages SEO. `NEXT_PUBLIC_GA_ID` is
   read at build time, so redeploy after setting it.

### Pointing the domain — keeping Google Workspace email intact

The domain is registered at Namecheap and Google Workspace email is running on
Namecheap's DNS. **You do not need to move nameservers to Vercel**, and you
shouldn't. Keep Namecheap's BasicDNS and add records for the website only —
email is controlled by `MX` and `TXT` records, which you will not touch.

In Vercel: **Project → Settings → Domains → Add** `laundrogrid.com`. Vercel then
shows the exact records it wants. Use the values *on that screen* — they are
occasionally updated — and add them in Namecheap under **Domain List → Manage →
Advanced DNS**:

| Type | Host | Value | Notes |
|---|---|---|---|
| `ALIAS` | `@` | `cname.vercel-dns.com` | Preferred for the apex. Namecheap supports ALIAS on BasicDNS, and it follows Vercel's IP changes automatically. |
| `A` | `@` | the IP Vercel shows | Use only if ALIAS isn't available. Historically `76.76.21.21`; newer projects are given `216.198.79.1`. Copy whatever the dashboard shows. |
| `CNAME` | `www` | `cname.vercel-dns.com` | |

Then, in Namecheap:

- **Delete the parking records first.** A fresh Namecheap domain ships with an
  `A` record on `@` and a `CNAME` on `www` pointing at `parkingpage.namecheap.com`.
  Both must go, or they will fight the new records.
- **Turn off Namecheap's "URL Redirect"** on `@` or `www` if it is set.
- **Leave every `MX` record alone.** Google Workspace mail flows through those.
- **Leave the Google TXT records alone** — SPF (`v=spf1 include:_spf.google.com ~all`),
  the `google-site-verification` record, any DKIM record on
  `google._domainkey`, and DMARC on `_dmarc`.

Set both `laundrogrid.com` and `www.laundrogrid.com` in Vercel and mark one as
the redirect target — apex as primary is the conventional choice.

Propagation is usually minutes on Namecheap, but allow up to a few hours before
worrying. Verify with:

```bash
dig laundrogrid.com A +short
dig www.laundrogrid.com CNAME +short
dig laundrogrid.com MX +short      # must still list Google's servers
```

Send yourself a test email after the site goes live. If mail ever does break,
the cause will be a deleted or overwritten `MX`/`TXT` record, not the `A`/`CNAME`
records above.

---

## Before launch

- [ ] Confirm the phone number in `lib/site.ts` (`phone` **and** `phoneHref` — same number, human and E.164 formats)
- [ ] Confirm `hello@laundrogrid.com` in `lib/site.ts` is a real, monitored inbox
- [ ] Set `RESEND_API_KEY`, verify the domain in Resend, and book once end to end to confirm the email arrives
- [ ] Connect Google Calendar (see above) and confirm a test meeting removes its slot from `/api/slots`
- [ ] Confirm the booking hours in `lib/booking.ts`
- [ ] Set `NEXT_PUBLIC_GA_ID` and mark `generate_lead` as a key event in GA4
- [ ] Write the privacy policy and terms pages; the footer currently says
      "coming before launch" rather than linking to a 404
- [ ] Re-run Lighthouse mobile on the deployed URL
- [ ] Verify the domain in Google Search Console, submit the sitemap, and Request Indexing on the homepage
- [ ] Replace the social-proof placeholders **only** with real, consented
      testimonials

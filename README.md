# LaundroGrid — marketing site

The marketing site for [laundrogrid.com](https://laundrogrid.com). A single page
that sells one idea: a laundromat's customers are anonymous, and LaundroGrid
turns anonymous walk-ins into known customers who pay every month.

**This is a standalone repo on purpose.** It shares no types, no database and no
deploy cadence with the platform. It has no backend beyond one stubbed contact
endpoint.

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
| `lib/site.ts` | Name, URL, email, phone, LinkedIn, Cal.com handle, nav |
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

## Contact form

`components/sections/ContactForm.tsx` posts to `app/api/contact/route.ts`.
`lib/contact-schema.ts` holds a dependency-free validator used by **both**
sides, so client and server rules can't drift.

**Leads are delivered to `LEAD_WEBHOOK_URL`.** That can be a Discord webhook, a
Slack incoming webhook, a Zapier/Make catch hook, or any endpoint accepting a
POST. `lib/lead-webhook.ts` shapes the body to match the destination, detected
from the URL — Discord gets a rich embed built to its own contract (it rejects
payloads containing keys it doesn't recognise, and caps embed field values at
1024 characters), Slack gets `{ text }`, and anything else gets the structured
`lead` object. That shaping is separated from the route precisely so it can be
verified without standing up a server; a rejected delivery is a lost enquiry.

The rule the route follows: **it never reports success unless the lead actually
went somewhere.** If the webhook is unset, times out, or returns a non-2xx, the
visitor is told to phone instead and the enquiry is written to the function log
so it can still be recovered. Silently swallowing an enquiry is the one failure
mode that costs real money, so it is the one thing the route will not do.

Set `LEAD_WEBHOOK_URL` in Vercel (Production and Preview) before pointing any
traffic at the form.

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
   | `LEAD_WEBHOOK_URL` | Slack/Discord/Zapier webhook — **the form cannot capture leads without it** |
   | `NEXT_PUBLIC_CAL_LINK` | e.g. `laundrogrid/15min` (optional) |

   `NEXT_PUBLIC_SITE_URL` feeds canonical URLs, Open Graph, the sitemap and
   JSON-LD — a wrong value here quietly damages SEO. `NEXT_PUBLIC_CAL_LINK` is
   safe to leave empty; the booking area renders a marked placeholder and the
   contact form still works.

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
- [ ] Set `NEXT_PUBLIC_CAL_LINK` to the real Cal.com handle
- [ ] Confirm `hello@laundrogrid.com` in `lib/site.ts` is a real, monitored inbox
- [ ] Set `LEAD_WEBHOOK_URL` and submit the form once end to end to confirm a lead arrives
- [ ] Write the privacy policy and terms pages; the footer currently says
      "coming before launch" rather than linking to a 404
- [ ] Re-run Lighthouse mobile on the deployed URL
- [ ] Submit the sitemap in Google Search Console
- [ ] Replace the social-proof placeholders **only** with real, consented
      testimonials

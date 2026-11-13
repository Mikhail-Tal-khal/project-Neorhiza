# Online contributions (Stripe Checkout)

One-time contributions are taken through **Stripe-hosted Checkout**. Card
details are only ever entered on Stripe's page; this site never sees them.
**Stripe is the payment system of record** — the site keeps no database of
contributions (see [Persistence](#persistence-and-receipts)).

## How it works

```
/funding#contribute ──POST {amount, currency}──▶ /api/donations/checkout
   (DonationForm)                                  origin check · 1 KB body cap · rate limit
                                                   server-side amount validation → cents
                                                   stripe.checkout.sessions.create(...)
        ◀────────────── { ok, url } ───────────────┘
   window.location → checkout.stripe.com (email + payment collected by Stripe)
        ├─ paid      → /funding/success?session_id={CHECKOUT_SESSION_ID}
        │               server retrieves the session; "paid" only if Stripe says so
        └─ cancelled → /funding/cancelled

Stripe ──signed event──▶ /api/stripe/webhook
                          raw body · signature check · idempotent per event ID
                          → DonationRecorder (default: one safe structured log line)
```

| Piece | File |
|---|---|
| Amount rules (shared client/server) | `src/lib/donations/amount.ts` |
| Env settings, key presence | `src/lib/donations/config.ts` |
| Stripe client (fetch-based, mockable) | `src/lib/donations/stripe.ts` |
| Session creation + verification | `src/lib/donations/checkout.ts` |
| Webhook idempotency (Redis or memory) | `src/lib/donations/event-store.ts` |
| Persistence/receipt boundary | `src/lib/donations/records.ts` |
| Checkout endpoint | `src/app/api/donations/checkout/route.ts` |
| Webhook endpoint | `src/app/api/stripe/webhook/route.ts` |
| Form (client) / section (server) | `src/components/ui/donation-form.tsx`, `src/components/sections/donation-section.tsx` |
| Pages | `src/app/funding/page.tsx`, `src/app/funding/success/page.tsx`, `src/app/funding/cancelled/page.tsx` |

### Rules enforced on the server

- Amount: plain decimal with ≤ 2 decimals (no signs, exponents, hex,
  separators, leading zeros), converted to cents by string arithmetic, then
  checked against `DONATION_MIN_AMOUNT`…`DONATION_MAX_AMOUNT` (default 5–50,000).
- Currency: only `DONATION_CURRENCY` is accepted (default `usd`).
- Session parameters are built entirely on the server: `mode: "payment"`,
  `submit_type: "donate"`, one `price_data` line item, success/cancel URLs from
  `NEXT_PUBLIC_SITE_URL`, metadata `{ project: "neorhiza", purpose: "research-support" }`.
  Any other fields in the request body are ignored.
- Same origin-check as the contact form; 10 attempts per IP per 10 minutes on
  the shared Redis limiter (key `donation-checkout:<ip>`, separate from the
  contact form); invalid attempts count too.
- Errors are generic ("No payment was taken…"). Logs contain only the Stripe
  error type/code/status — never keys, Checkout URLs, emails or card data.

### Without Stripe credentials

With no valid `STRIPE_SECRET_KEY` the Funding page renders the form disabled
with **"Secure donations are being prepared"**, the endpoint returns 503 and
the rest of the site is unaffected. `/funding` is rendered per request so
adding or removing the key takes effect on the next deployment without code
changes.

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `STRIPE_SECRET_KEY` | to enable | `sk_test_…` / `sk_live_…`, or a restricted `rk_…` key with **Checkout Sessions: Write** (and read). Server-only, mark **Sensitive** in Vercel. |
| `STRIPE_WEBHOOK_SECRET` | with the key | `whsec_…` signing secret of the webhook endpoint. Server-only, **Sensitive**. |
| `DONATION_CURRENCY` | no | `usd` (default), `eur`, `gbp`, `cad`, `aud`, `chf` or `kes`. |
| `DONATION_MIN_AMOUNT` | no | Whole units, default `5`. |
| `DONATION_MAX_AMOUNT` | no | Whole units, default `50000`. |
| `NEXT_PUBLIC_SITE_URL` | yes (existing) | Builds the success/cancel URLs. Must be the exact public origin, e.g. `https://www.neorhiza.space`. |

No publishable key and no Stripe.js are used. `npm run check:config` validates
all of the above without printing values.

## Stripe Dashboard setup

1. **Webhook endpoint** (Developers → Webhooks → Add endpoint):
   - URL: `https://www.neorhiza.space/api/stripe/webhook` (the `www` host
     exactly — Stripe does not follow redirects).
   - Events: `checkout.session.completed`,
     `checkout.session.async_payment_succeeded`,
     `checkout.session.async_payment_failed`.
   - Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
   - Create the endpoint separately in **test mode** and **live mode**; each has its own secret.
2. **Public details** (Settings → Business → Public details): the registered
   company's legal name, support email and a statement descriptor such as
   `NEORHIZA`.
3. **Receipts** (Settings → Customer emails): enable *Successful payments* so
   Stripe emails the contributor a receipt.
4. **Checkout branding** (Settings → Branding): logo/icon and colors
   (`#0F4C5C` teal, `#E36F5C` coral) so the hosted page matches the site.
5. **Payment methods** (Settings → Payment methods): Checkout uses the methods
   enabled here. Delayed methods (bank debits) produce
   `checkout.session.async_payment_*` events and a "being processed" success page.
6. Optionally add a Vercel Firewall rate-limit rule on `/api/donations/checkout`
   (e.g. 10 requests / 600 s per IP → 429), mirroring the app limiter.

## Local testing with Stripe test mode

Prerequisites: a Stripe account in **test mode** and the [Stripe CLI](https://docs.stripe.com/stripe-cli).

```bash
# 1. Test keys — never live keys — in .env.local (git-ignored)
cat >> .env.local <<'ENV'
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...        # Dashboard (test mode) → Developers → API keys
STRIPE_WEBHOOK_SECRET=whsec_...      # printed by `stripe listen` in step 2
ENV

# 2. Forward test webhooks to the local endpoint (keep it running)
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook \
  --events checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.async_payment_failed

# 3. Run the site (restart after editing .env.local)
npm run dev
```

4. Open <http://localhost:3000/funding#contribute>, choose an amount and click
   **Donate securely with Stripe**.
5. On Stripe's test page use any email and card `4242 4242 4242 4242`, any
   future expiry, any CVC and postal code. Other cards: `4000 0000 0000 0002`
   (declined), `4000 0025 0000 3155` (3-D Secure).
6. Expect `/funding/success?session_id=cs_test_…` showing the amount and a
   `pi_…` reference; the `stripe listen` terminal shows `200` for
   `checkout.session.completed`, and the dev server logs one
   `{"msg":"stripe.donation",…,"outcome":"confirmed"}` line.
7. Cancel from Stripe's page (← back link) → `/funding/cancelled`.
8. Idempotency: `stripe events resend <evt_id>` → the endpoint answers
   `{"received":true,"duplicate":true}` and logs nothing new.
9. Failure paths: `/funding/success?session_id=cs_test_invalid123` shows "We
   couldn't find this contribution"; removing `STRIPE_SECRET_KEY` and
   restarting shows "Secure donations are being prepared".

`stripe trigger checkout.session.completed` sends a session without the
`project: neorhiza` metadata; the webhook acknowledges it as ignored (200), which
is expected. Use a real test checkout to exercise recording.

## Automated tests

Stripe is mocked completely; no test creates a Checkout Session or payment.

- `tests/donations-api.spec.ts` — in-process: amount rules, settings, the
  checkout endpoint (validation, methods, config, Stripe failures, origin, rate
  limit, shared store), success-page verification and the webhook (signatures,
  idempotency, retries, outcomes). Stripe's fetch client is served by a stubbed
  `globalThis.fetch`.
- `tests/donations.spec.ts` — browser, against `next start`: form states,
  keyboard use, client validation, mocked redirect, loading/error states, axe,
  unconfigured server, success/cancel pages, CTAs. Checkout requests are
  intercepted with `page.route()`; the :3000 server holds only a placeholder key.
- `tests/donations-secrets.spec.ts` — no Stripe secret or secret variable
  name in `.next/static`, no client component imports server Stripe modules,
  `.env.example` holds empty values. CI also builds with canary keys and greps
  the bundles for them.
- `tests/production-config.spec.ts` — `check:config` Stripe checks print no values.

## Persistence and receipts

There is **no contribution database**. `src/lib/donations/records.ts` defines
the `DonationRecorder` boundary; the default writes one structured log line
per verified event with only: event ID and type, session ID, amount, currency,
payment status, outcome, livemode. To add a ledger, implement the interface
(upsert on event/session ID, throw on failure so Stripe retries) and register
it with `setDonationRecorder`. Custom receipts belong in a recorder after
persistence succeeds; fetch the email from Stripe at send time rather than
storing or logging it.

Webhook idempotency uses the shared Redis store (`SET NX`, 7-day TTL) when
configured, with an in-memory fallback. A failed recording releases the claim
and returns 500 so Stripe redelivers.

## Content rules

- Never promise medical outcomes, treatments, tax benefits, returns or results.
- The required statement lives in `disclaimers.contributions` (`src/lib/site.ts`) — do not reword it.
- Analytics events (`donation_*`) carry fixed labels only — never amounts,
  currencies, names, emails or Stripe IDs. Page-view URLs are reported
  without query strings so `session_id` never reaches analytics.

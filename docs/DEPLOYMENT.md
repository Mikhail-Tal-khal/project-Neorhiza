# Deployment

Target: **Vercel** (first-class Next.js support). The site also runs anywhere Node.js 22 runs (`npm ci && npm run build && npm run start`).

No `vercel.json` is needed. Security headers are set in `next.config.ts`, and all routes are either static or Node.js route handlers.

---

## 1. Before you deploy

You need:

| Item | Why | Notes |
|---|---|---|
| The final domain | Canonical URLs, sitemap, OG images, structured data | Set as `NEXT_PUBLIC_SITE_URL` |
| A form delivery destination | Otherwise the contact form returns "temporarily unavailable" | Resend account with a verified sending domain, **or** a webhook URL |
| A rate-limit store (recommended) | The in-memory limiter is per serverless instance | Upstash Redis via the Vercel Marketplace (free tier is enough) |

## 2. Import the GitHub repository into Vercel

1. Push the repository to GitHub (see the commands in the final report or the README).
2. Go to <https://vercel.com/new>, choose **Import Git Repository** and select `project-Neorhiza`.
3. Framework preset: **Next.js** (auto-detected). Leave Build Command, Output Directory and Install Command at their defaults.
4. Node.js version: Vercel reads `engines.node` (`>=22`). If asked, choose **22.x** in Project Settings → General → Node.js Version.
5. Don't deploy yet. Set the environment variables first (step 3).

## 3. Environment variables

Project Settings → Environment Variables. Add for **Production** (and for Preview if you want working forms on preview deployments):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.org` (no trailing slash) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | *(optional)* a real, monitored address |
| `RESEND_API_KEY` | Resend API key *(email delivery)* |
| `CONTACT_TO_EMAIL` | inbox that receives inquiries |
| `CONTACT_FROM_EMAIL` | e.g. `Neorhiza Website <noreply@your-domain.org>`, using a domain verified in Resend |
| `CONTACT_WEBHOOK_URL` / `CONTACT_WEBHOOK_TOKEN` | *(alternative or additional)* webhook delivery |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Rate-limit store. If you add Upstash through **Storage → Marketplace**, Vercel injects `KV_REST_API_URL` / `KV_REST_API_TOKEN` instead; both naming schemes work. |

`NEXT_PUBLIC_*` values are inlined at build time, so **redeploy after changing them**.

### Rate limiting design

`src/lib/rate-limit.ts` exposes one `rateLimit()` function backed by a `RateLimiter` interface:

- **Upstash Redis (REST)** when credentials are present: a fixed-window counter (`INCR` + `PEXPIRE NX`) shared by all serverless instances.
- **In-memory sliding window** otherwise: for local development and single-instance Node servers. If Redis is unreachable, the in-memory limiter is used for that request, so the form keeps working.

The client IP comes from `x-forwarded-for`, which Vercel sets itself. On other hosts, make sure your reverse proxy overwrites (not appends to) `X-Forwarded-For`, or clients could rotate it to bypass the limit.

## 4. Deploy

Click **Deploy**. The build runs `next build`. Lint, typecheck, the contrast check and the e2e suite run in GitHub Actions (`.github/workflows/ci.yml`) on every push and pull request.

## 5. Connect the custom domain and HTTPS

1. Project Settings → **Domains** → Add `your-domain.org` (and `www.your-domain.org`; set one to redirect to the other).
2. At your DNS provider, create the records Vercel shows: usually an `A` record for the apex (`76.76.21.21`) and a `CNAME` for `www` (`cname.vercel-dns.com`), or switch nameservers to Vercel.
3. Vercel issues and renews TLS certificates automatically once DNS resolves. HTTPS is enforced; HTTP redirects to HTTPS.
4. The site sends `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`. Submit to the HSTS preload list (<https://hstspreload.org>) **only** once every subdomain serves HTTPS.
5. Confirm `NEXT_PUBLIC_SITE_URL` matches the primary domain exactly, then redeploy.

## 6. Running elsewhere (any Node host)

```bash
npm ci
NEXT_PUBLIC_SITE_URL=https://your-domain.org npm run build
PORT=3000 npm run start
```

Put it behind a TLS-terminating reverse proxy (Caddy, nginx) that sets `X-Forwarded-For`. A single long-running instance can use the in-memory rate limiter. For multiple instances, configure Upstash.

## 7. Post-deploy smoke test

Run these against the production URL (`SITE=https://your-domain.org`):

- [ ] **Home loads**: `curl -sI $SITE | head -1` → `200`
- [ ] **Theme works**: toggle light / dark / system in the header; reload keeps the choice; no flash of the wrong theme.
- [ ] **All pages load**: `BASE_URL=$SITE npm run check:links` → zero broken links or anchors; the custom 404 renders.
- [ ] **Form sends**: submit a real test inquiry on `/contact` → "Inquiry received", and the message arrives in `CONTACT_TO_EMAIL` or at the webhook.
- [ ] **Form fails honestly** (optional, on a preview without delivery variables): the form shows "temporarily unavailable".
- [ ] **Sitemap and robots**: `curl -s $SITE/sitemap.xml` lists every page on the real domain; `curl -s $SITE/robots.txt` shows `Sitemap: $SITE/sitemap.xml`.
- [ ] **OG image renders**: open `$SITE/opengraph-image` and an article's `/opengraph-image`; validate with <https://www.opengraph.xyz> or the LinkedIn Post Inspector.
- [ ] **Security headers**: `curl -sI $SITE` shows `content-security-policy`, `strict-transport-security`, `x-content-type-options: nosniff`, `x-frame-options: DENY`, `referrer-policy`, `permissions-policy`, and no `x-powered-by`. Or check <https://securityheaders.com>.
- [ ] **Structured data**: test a page and an article at <https://validator.schema.org>.
- [ ] **Lighthouse**: `BASE_URL=$SITE npm run lighthouse` (mobile) → Performance ≥ 90, Accessibility / Best Practices / SEO ≥ 95.

# Production launch checklist

External steps that cannot (or must not) be done from code. **No secret
values belong in this file** — only variable names and where to set them.

Production site: `https://www.neorhiza.space` · Inquiry mailbox: `inquiries@neorhiza.space`

Mark each item when done. Re-run the [verification](#9-verify-after-each-production-deploy) section after every production deployment.

---

## 1. Shared rate limiting (required)

The contact form's in-memory limiter only counts per serverless instance.
Production needs a shared store.

- [ ] Vercel → **Storage → Marketplace → Upstash (Redis)** → create a database in the region closest to the Vercel functions, and connect it to this project for **Production** (Preview optional).
  - This injects `KV_REST_API_URL` and `KV_REST_API_TOKEN`. Alternatively, add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from the Upstash console yourself. Either pair works.
- [ ] Confirm both variables are marked **Sensitive** in Vercel → Settings → Environment Variables.
- [ ] After the next production build, the Vercel build log must **not** show `⚠ Production has no shared rate-limit store`.
- [ ] Optional: run the config check locally against pulled production values (delete the file afterwards):
  ```bash
  vercel env pull .env.production.local --environment=production
  node --env-file=.env.production.local scripts/check-production-config.mjs
  rm .env.production.local
  ```
  It prints PASS/FAIL per setting and never prints values.

## 2. Secrets and environment scopes

- [ ] `RESEND_API_KEY` remains a **Sensitive** variable, scoped to Production (and Preview only if previews should send real email).
- [ ] No variable containing a key, token, secret or password is prefixed `NEXT_PUBLIC_` (those are bundled into the browser).
- [ ] Review scopes for every variable: Production / Preview / Development. Preview should not share production Redis or send email to the real inbox unless intended.
- [ ] `NEXT_PUBLIC_SITE_URL=https://www.neorhiza.space` is set for **Production only** (previews then fall back to the same default; that is fine).
- [ ] `.env*` files and `.vercel/` stay out of Git (`.gitignore` covers both — check with `git status` before committing).

## 3. Email delivery

- [ ] Resend shows `mail.neorhiza.space` as **Verified**.
- [ ] Send a real test inquiry from `/contact` after deployment: the notification reaches `inquiries@neorhiza.space` (reply goes to the visitor) and the visitor receives "We received your inquiry — Project Neorhiza".
- [ ] The inquiry mailbox is **monitored**, with a named person responsible and a target of replying within ten working days (the site promises this).

## 4. Vercel protection

- [ ] **Web Analytics**: Vercel → project → Analytics → Enable. (The site only loads the script on Vercel builds; it is first-party and cookieless.)
- [ ] **Speed Insights**: Vercel → project → Speed Insights → Enable.
- [ ] Custom analytics events (see [analytics-events.md](analytics-events.md)) require a plan that supports custom events; page views work on all plans.
- [ ] **Bot Protection**: Vercel → Firewall → Bot Management → enable *Bot Protection* (challenge mode) if available on the plan.
- [ ] **Firewall rate-limit rule** for the API, in addition to the app limiter:
  - Condition: Request Path *equals* `/api/contact` **and** Method *equals* `POST`
  - Action: Rate limit — e.g. 10 requests per 60 s per IP → **Deny** (or Challenge)
- [ ] Deployment Protection for Preview deployments (Vercel Authentication) so previews are not publicly indexed.

## 5. GitHub repository

- [ ] **Branch protection** on `main`: require a pull request, require the `CI / verify` and `CodeQL / analyze` checks to pass, block force-pushes and deletions.
- [ ] **Secret scanning** and **push protection**: Settings → Code security → enable both.
- [ ] **Dependabot alerts** and **Dependabot security updates** enabled (version updates are configured in `.github/dependabot.yml`).
- [ ] **Private vulnerability reporting** enabled (Settings → Code security), matching `SECURITY.md` and `/.well-known/security.txt`.

## 6. Search engines

Prefer **DNS verification** (no code change, survives redesigns). Use the meta-tag
method only if DNS is impractical — then set the optional variables below.

### Google Search Console
- [ ] Add property → **Domain** `neorhiza.space` → add the TXT record Google shows at Namecheap → Verify.
  - Meta-tag alternative: choose a URL-prefix property `https://www.neorhiza.space/`, copy only the `content` value into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, redeploy, then Verify.
- [ ] Sitemaps → submit `https://www.neorhiza.space/sitemap.xml`.

### Bing Webmaster Tools
- [ ] Add site → import from Google Search Console (fastest), **or** verify via DNS CNAME, **or** set `NEXT_PUBLIC_BING_SITE_VERIFICATION` (the `msvalidate.01` content value) and redeploy.
- [ ] Sitemaps → submit `https://www.neorhiza.space/sitemap.xml`.

### Request initial indexing (URL Inspection → *Request indexing*)
- [ ] `https://www.neorhiza.space/`
- [ ] `/why-neorhiza`
- [ ] `/our-science`
- [ ] `/collaboration`
- [ ] `/funding`
- [ ] `/updates`
- [ ] `/contact`
- [ ] Check *Pages → Indexing* a week later; fix anything listed under "Not indexed" other than `/api/*`.

## 7. Email authentication (DMARC)

The root domain currently publishes `v=DMARC1; p=none;` (monitoring only).

- [ ] Add a reporting address: `v=DMARC1; p=none; rua=mailto:<a monitored address>` and review aggregate reports for 2–4 weeks.
- [ ] Confirm every legitimate sender passes SPF or DKIM with alignment: Namecheap Private Email (mailbox) and Resend (`mail.neorhiza.space`).
- [ ] Move to `p=quarantine` (optionally with `pct=25`, then 100).
- [ ] Only after reports stay clean, move to `p=reject`.

## 8. Legal and privacy review

> **TODO — professional review required.** Before running paid advertising,
> fundraising or international campaigns, have the Privacy Policy and Terms
> reviewed by a Kenyan data-protection practitioner / advocate. This project's
> policies are plain-language drafts, not legal advice.

- [ ] Confirm the data-controller identity statement and whether registration with the Office of the Data Protection Commissioner (ODPC) is required.
- [ ] Confirm the retention periods (12 months / 24 months) are achievable in practice, and set a calendar reminder to purge the mailbox.
- [ ] Confirm the cross-border transfer wording for Vercel, Resend, Namecheap and Upstash, and keep their data-processing terms on file.
- [ ] Confirm the governing-law and liability clauses in the Terms.
- [ ] Confirm no fundraising language implies charitable or tax-exempt status before any funding conversation becomes a campaign.

## 9. Verify after each production deploy

```bash
SITE=https://www.neorhiza.space
curl -sI $SITE | grep -iE "^(strict-transport|content-security|cross-origin|x-permitted|origin-agent)"
curl -s  $SITE/.well-known/security.txt
curl -sI $SITE/updates/feed.xml | grep -i content-type
BASE_URL=$SITE npm run check:links
```

- [ ] All of the above succeed; then submit one real test inquiry (section 3).
- [ ] Renew `/.well-known/security.txt` `Expires` before **2027-11-09** (a test fails 30 days before).

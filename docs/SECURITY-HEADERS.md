# Security headers and CSP

Headers are set for every route in `next.config.ts`.

| Header | Value | Notes |
|---|---|---|
| `Content-Security-Policy` | see below | |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | |
| `X-Content-Type-Options` | `nosniff` | |
| `X-Frame-Options` | `DENY` | plus `frame-ancestors 'none'` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | |
| `Permissions-Policy` | camera, microphone, geolocation, payment, usb, topics disabled | |
| `Cross-Origin-Opener-Policy` | `same-origin` | |
| `Cross-Origin-Resource-Policy` | `same-origin` | `cross-origin` for share images (`/opengraph-image`, `/twitter-image`, article OG images), `/images/logo/*`, `/icon.svg`, `/apple-icon.png`, so link previews and other sites can still embed them |
| `X-Permitted-Cross-Domain-Policies` | `none` | |
| `Origin-Agent-Cluster` | `?1` | |
| `Cache-Control` (`/api/*`) | `no-store` | |

The contact API additionally rejects browser requests whose `Sec-Fetch-Site`
is `cross-site` or whose `Origin` is not this site (`src/lib/request-origin.ts`).

## Content-Security-Policy

```
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-src 'none';
frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';
manifest-src 'self'; upgrade-insecure-requests
```

Vercel Web Analytics and Speed Insights load from `/_vercel/*` on this domain,
so `'self'` covers them in production. Development adds `'unsafe-eval'` (React
Refresh) and `https://va.vercel-scripts.com` (analytics debug script).

### Why `script-src` still contains `'unsafe-inline'`

Evaluated, and not removed — deliberately:

1. **Nonces require dynamic rendering.** A nonce must be unique per response.
   Next.js applies nonces by reading a per-request header in Proxy (middleware),
   which forces every page to render dynamically. Every public page here is
   statically generated; a nonce would make them all server-rendered per request
   (slower, costlier, no CDN caching of HTML).
2. **Hashes are not practical with App Router.** Statically generated pages
   embed inline `<script>self.__next_f.push(...)</script>` chunks carrying the
   RSC payload. Their content differs per page and per build, so there is no
   stable hash list to put in a header, and Next.js does not emit one.
3. **next-themes** injects an inline script that must run before paint to
   prevent a flash of the wrong theme.
4. **Experimental SRI** (`experimental.sri`) keeps pages static but only adds
   `integrity` attributes to external script files. It does not cover the
   inline RSC payload or the theme script, so `'unsafe-inline'` would still be
   required — and the feature is experimental. Not adopted.

A CSP that looked strict but blocked hydration or the theme script would break
production, which is worse than the residual risk below.

### Residual risk and mitigations

- `'unsafe-inline'` means an HTML-injection bug could execute script. The site
  renders no user-supplied HTML: inquiry content is never rendered on the
  site, and is HTML-escaped in emails; MDX content is authored in the repo.
- All other sources are `'self'` only — no third-party script, style, font,
  frame or connect origin is allowed, `object-src 'none'`, `base-uri 'self'`,
  `form-action 'self'` and `frame-ancestors 'none'` limit what injected script
  or markup could do and where data could be sent.

Revisit if Next.js gains build-time hash support for static pages, or if the
site moves to dynamic rendering for other reasons (then use the documented
nonce-in-Proxy pattern).

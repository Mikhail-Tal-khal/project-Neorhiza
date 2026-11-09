import { site } from "@/lib/site";

/**
 * Cross-site request check for browser POSTs (CSRF defense-in-depth).
 *
 * Browsers attach `Sec-Fetch-Site` and `Origin` to cross-origin POSTs and
 * scripts cannot forge them, so:
 *  - `Sec-Fetch-Site: cross-site` is always rejected;
 *  - an `Origin` header must match the request's own origin, the configured
 *    site origin (and its www/apex twin), or a local development origin.
 * Requests without these headers (server-to-server tools, uptime checks)
 * are not browser requests and pass this layer; validation, the honeypot
 * and rate limiting still apply to them.
 */

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

function originOf(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

/** The configured site origin plus its www/apex counterpart. */
function siteOrigins(): Set<string> {
  const origins = new Set<string>();
  const url = originOf(site.url);
  if (url) {
    origins.add(url.origin);
    const twin = new URL(url.origin);
    twin.hostname = url.hostname.startsWith("www.") ? url.hostname.slice(4) : `www.${url.hostname}`;
    origins.add(twin.origin);
  }
  return origins;
}

export function isAllowedOrigin(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") return false;

  const origin = request.headers.get("origin");
  if (origin === null) return true;

  const url = originOf(origin);
  if (!url) return false; // includes the opaque "null" origin

  // Same origin as the request itself (production, previews, local servers).
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? new URL(request.url).host;
  if (url.host === host) return true;

  if (siteOrigins().has(url.origin)) return true;

  return process.env.NODE_ENV !== "production" && LOCAL_HOSTS.has(url.hostname);
}

import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy. The site loads no third-party scripts, styles,
 * fonts or images; Vercel Web Analytics and Speed Insights are served
 * same-origin from /_vercel/* in production. `'unsafe-inline'` for scripts
 * is required by the inline theme-flash-prevention script (next-themes) and
 * the inline Next.js bootstrap/RSC data on statically generated pages — see
 * docs/SECURITY-HEADERS.md for why nonces/hashes are not used. In
 * development, `'unsafe-eval'` (React Refresh) and Vercel's debug analytics
 * script host are added.
 */
const devScriptHosts = isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : "";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${devScriptHosts}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "manifest-src 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

// Surface a missing shared rate-limit store in the Vercel production build
// log. Names only — values are never printed.
if (process.env.VERCEL_ENV === "production") {
  const hasStore =
    Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
    Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
  if (!hasStore) {
    console.error(
      "⚠ Production has no shared rate-limit store (UPSTASH_REDIS_REST_URL/TOKEN or KV_REST_API_URL/TOKEN). " +
        "The contact form will fall back to per-instance in-memory limiting, which is not adequate production protection."
    );
  }
}

/** Public, embeddable assets: link previews and other sites may load these cross-origin. */
const shareableAssets = [
  "/opengraph-image",
  "/twitter-image",
  "/updates/:slug/opengraph-image",
  "/images/logo/:file*",
  "/icon.svg",
  "/apple-icon.png",
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    // All images are local; no remote patterns are allowed.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          { key: "Origin-Agent-Cluster", value: "?1" },
        ],
      },
      ...shareableAssets.map((source) => ({
        source,
        headers: [{ key: "Cross-Origin-Resource-Policy", value: "cross-origin" }],
      })),
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;

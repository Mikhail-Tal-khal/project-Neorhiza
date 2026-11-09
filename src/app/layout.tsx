import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { site } from "@/lib/site";
import { brand } from "@/lib/brand-colors";
import { JsonLd } from "@/components/json-ld";
import { AnalyticsClickTracker } from "@/components/analytics-click-tracker";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { feedAlternates } from "@/lib/metadata";
import "@/styles/globals.css";

/**
 * Manrope — the typeface specified in the logo files — loaded locally with
 * `display: swap` and no layout shift. It is the only typeface on the site.
 */
const manrope = localFont({
  src: "../assets/fonts/manrope-latin-var.woff2",
  weight: "200 800",
  display: "swap",
  variable: "--font-manrope",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

/**
 * Search-console ownership tokens, emitted only when configured. They are
 * public by design (they appear in page source), never secrets.
 */
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();
const verification: Metadata["verification"] =
  googleVerification || bingVerification
    ? {
        ...(googleVerification ? { google: googleVerification } : {}),
        ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
      }
    : undefined;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  alternates: feedAlternates,
  ...(verification ? { verification } : {}),
  title: {
    default: `${site.name} — ${site.descriptor}`,
    template: `%s — ${site.shortName}`,
  },
  description: `${site.tagline}. ${site.name} is an early-stage regenerative-medicine research initiative advancing patient-specific tissue engineering through responsible, partnership-driven science.`,
  applicationName: site.name,
  keywords: [
    "tissue engineering",
    "regenerative medicine",
    "patient-specific tissue",
    "organ engineering research",
    "stem-cell research",
    "scientific collaboration",
  ],
  authors: [{ name: `${site.name} — Founder: Rereu Lemein` }],
  creator: site.name,
  publisher: site.name,
  formatDetection: { telephone: false, email: false },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  referrer: "origin-when-cross-origin",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: brand.pearl },
    { media: "(prefers-color-scheme: dark)", color: brand.slateTeal },
  ],
};

/** Organization + WebSite structured data (never claims clinical status). */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ResearchOrganization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      alternateName: "Neorhiza",
      description: `${site.descriptor}. ${site.tagline}.`,
      url: site.url,
      email: site.contactEmail,
      logo: `${site.url}/images/logo/neorhiza-icon.svg`,
      image: `${site.url}/images/logo/neorhiza-stacked.svg`,
      foundingDate: "2026",
      founder: {
        "@type": "Person",
        name: "Rereu Lemein",
        url: "https://lemein.vercel.app",
        sameAs: ["https://github.com/Mikhail-Tal-khal"],
      },
      knowsAbout: [
        "Tissue engineering",
        "Regenerative medicine research",
        "Vascular biology",
        "Biomaterials",
        "Bioreactor engineering",
        "Research ethics",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.descriptor,
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variable must live on <html>: Tailwind resolves --font-sans on :root.
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <ThemeProvider>
          {/* Skip to content */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-teal-700 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
          >
            Skip to content
          </a>

          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main id="main-content" className="flex-1 pt-[4.5rem] md:pt-[5.25rem]">
              {children}
            </main>
            <SiteFooter />
          </div>
        </ThemeProvider>

        <JsonLd data={structuredData} />
        {/* First-party, cookieless aggregate analytics and Core Web Vitals,
            served same-origin from /_vercel/*; no advertising trackers.
            Only builds made on Vercel include them — elsewhere /_vercel/*
            does not exist and the scripts would 404. */}
        <AnalyticsClickTracker />
        {process.env.VERCEL && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}

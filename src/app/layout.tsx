import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { site } from "@/lib/site";
import { brand } from "@/lib/brand-colors";
import { JsonLd } from "@/components/json-ld";
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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
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
  authors: [{ name: `${site.name} — Founder: REREU` }],
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
    { media: "(prefers-color-scheme: light)", color: brand.sage50 },
    { media: "(prefers-color-scheme: dark)", color: brand.teal950 },
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
      ...(site.email ? { email: site.email } : {}),
      logo: `${site.url}/images/logo/neorhiza-icon.svg`,
      image: `${site.url}/images/logo/neorhiza-stacked.svg`,
      foundingDate: "2026",
      founder: {
        "@type": "Person",
        name: "REREU",
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
      </body>
    </html>
  );
}

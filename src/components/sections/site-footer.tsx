import Link from "next/link";
import { BrandMark } from "@/components/ui/brand-mark";
import { disclaimers, navItems, site } from "@/lib/site";

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/research-disclaimer", label: "Research Disclaimer" },
];

/**
 * Site footer — solid deep-teal surface carrying the reversed horizontal
 * logo, identity block, navigation and the required verbatim disclaimer.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-deep mt-auto">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-8 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          {/* Identity */}
          <div>
            <BrandMark variant="horizontal" height={48} tone="reversed" />
            <p className="mt-6 text-sm font-medium text-white">
              {site.name}
            </p>
            <p className="mt-1 text-sm text-mist-200">{site.descriptor}</p>
            <p className="mt-1 text-sm text-mist-200">{site.tagline}</p>
          </div>

          {/* Site pages */}
          <nav aria-label="Footer">
            <h2 className="label-caps mb-4 text-mist-200">Explore</h2>
            <ul className="grid gap-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-mist-200 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <div>
            <h2 className="label-caps mb-4 text-mist-200">Policies</h2>
            <ul className="grid gap-2.5">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-mist-200 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-mist-200/80">
              No medical advice, treatment or patient enrollment is provided
              through this website. Inquiries are handled under professional
              and institutional qualification processes.
            </p>
          </div>
        </div>

        {/* Required verbatim disclaimer */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-pretty text-xs leading-relaxed text-mist-200 md:text-sm">
            {disclaimers.footer}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-mist-200/80 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.name}. All rights reserved.</p>
          <p>Early-Stage Research Initiative</p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { BrandMark } from "@/components/ui/brand-mark";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { aboutNav, desktopNav, navItems } from "@/lib/site";
import { cx } from "@/lib/cx";

/**
 * GlassNavigation — floating translucent navigation bar. Becomes more
 * opaque on scroll; expands into an accessible iOS-style glass panel on
 * mobile. The full horizontal lockup sits on glass with at least 85%
 * effective opacity (glass-strong), honoring the brand clear-space rule.
 *
 * The call-to-action buttons are rendered by the (server) root layout and
 * passed in, so GlassButton and its class merging stay out of the browser
 * bundle.
 */
export function SiteHeader({
  cta,
  mobileCta,
}: {
  /** Desktop call to action, shown from the md breakpoint. */
  cta: React.ReactNode;
  /** Call to action inside the mobile menu panel. */
  mobileCta: React.ReactNode;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const aboutRef = useRef<HTMLLIElement>(null);
  const aboutButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // The About disclosure closes on Escape (returning focus), on a click or
  // focus move outside it, and after navigation.
  useEffect(() => {
    if (!aboutOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAboutOpen(false);
        aboutButtonRef.current?.focus();
      }
    };
    const onOutside = (event: Event) => {
      if (!aboutRef.current?.contains(event.target as Node)) setAboutOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("focusin", onOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("focusin", onOutside);
    };
  }, [aboutOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const aboutActive = aboutNav.some((item) => isActive(item.href));

  const desktopLinkClass = (active: boolean) =>
    cx(
      "relative flex min-h-11 items-center whitespace-nowrap rounded-full px-1.5 text-[0.8rem] font-medium transition-colors",
      active
        ? "text-teal-700 dark:text-white"
        : "text-muted hover:text-teal-700 dark:hover:text-white"
    );
  const activeDot = (
    <span
      aria-hidden="true"
      className="absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-coral-500"
    />
  );

  return (
    <header className="fixed inset-x-0 top-0 z-40 pt-3 md:pt-4">
      <div className="mx-auto w-full max-w-7xl px-3 md:px-6">
        <nav
          aria-label="Primary"
          className={cx(
            "glass-strong flex items-center justify-between gap-2 rounded-2xl px-4 py-2.5 transition-shadow duration-300 md:rounded-full",
            scrolled &&
              "shadow-lift"
          )}
        >
          {/* Logo — full lockup; tagline is part of the asset and is not repeated */}
          <Link
            href="/"
            className="flex min-h-11 shrink-0 items-center rounded-xl"
            // Label-in-name (WCAG 2.5.3): starts with the lockup's visible text.
            aria-label="Neorhiza: Patient-Specific Tissue Engineering — home"
          >
            <BrandMark variant="horizontal" height={40} decorative />
          </Link>

          {/* Desktop links — the About group collapses into a disclosure */}
          <ul className="hidden items-center xl:flex">
            {desktopNav.map((item) => (
              <Fragment key={item.href}>
                <li className="relative">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={desktopLinkClass(isActive(item.href))}
                  >
                    {item.label}
                    {isActive(item.href) && activeDot}
                  </Link>
                </li>
                {item.href === "/" && (
                  <li ref={aboutRef} className="relative">
                    <button
                      ref={aboutButtonRef}
                      type="button"
                      aria-expanded={aboutOpen}
                      aria-controls="about-navigation"
                      onClick={() => setAboutOpen((v) => !v)}
                      className={cx(desktopLinkClass(aboutActive), "gap-0.5 pl-2.5")}
                    >
                      About
                      <ChevronDown
                        aria-hidden="true"
                        className={cx("size-3.5 transition-transform", aboutOpen && "rotate-180")}
                      />
                      {aboutActive && activeDot}
                    </button>
                    <ul
                      id="about-navigation"
                      hidden={!aboutOpen}
                      className="glass-strong absolute left-0 top-full z-50 mt-2 grid min-w-60 gap-1 rounded-2xl p-2 shadow-lift"
                    >
                      {aboutNav.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            aria-current={isActive(sub.href) ? "page" : undefined}
                            onClick={() => setAboutOpen(false)}
                            className={cx(
                              "flex min-h-11 items-center whitespace-nowrap rounded-xl px-3 text-sm font-medium transition-colors",
                              isActive(sub.href)
                                ? "bg-teal-700 text-white dark:bg-white/90 dark:text-teal-950"
                                : "text-ink hover:bg-white/60 dark:hover:bg-white/10"
                            )}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
              </Fragment>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <div className="hidden xl:flex">
              <ThemeToggle compact />
            </div>
            {cta}

            {/* Mobile menu button — 44px touch target */}
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? "Close menu" : "Open menu"}
              className="glass flex size-11 items-center justify-center rounded-full text-teal-700 xl:hidden dark:text-mist-200"
            >
              {open ? (
                <X aria-hidden="true" className="size-5" />
              ) : (
                <Menu aria-hidden="true" className="size-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile expanding glass panel */}
        <div
          id="mobile-navigation"
          ref={panelRef}
          hidden={!open}
          className="glass-strong mt-2 max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain rounded-3xl p-3 xl:hidden"
        >
          <ul className="grid gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cx(
                    "flex min-h-11 items-center justify-between rounded-2xl px-4 text-[0.95rem] font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-teal-700 text-white dark:bg-white/90 dark:text-teal-950"
                      : "text-ink hover:bg-white/60 dark:hover:bg-white/10"
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span
                      aria-hidden="true"
                      className="size-1.5 rounded-full bg-coral-500"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border px-2 pt-4">
            <ThemeToggle />
            {mobileCta}
          </div>
        </div>
      </div>
    </header>
  );
}

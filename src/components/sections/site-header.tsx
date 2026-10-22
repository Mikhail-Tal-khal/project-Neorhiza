"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/ui/brand-mark";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GlassButton } from "@/components/ui/glass-button";
import { navItems } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * GlassNavigation — floating translucent navigation bar. Becomes more
 * opaque on scroll; expands into an accessible iOS-style glass panel on
 * mobile. The full horizontal lockup sits on glass with at least 85%
 * effective opacity (glass-strong), honoring the brand clear-space rule.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-40 pt-3 md:pt-4">
      <div className="mx-auto w-full max-w-7xl px-3 md:px-6">
        <nav
          aria-label="Primary"
          className={cn(
            "glass-strong flex items-center justify-between gap-2 rounded-2xl px-4 py-2.5 transition-shadow duration-300 md:rounded-full",
            scrolled &&
              "shadow-[0_18px_48px_-20px_rgb(15_76_92/0.4)] dark:shadow-[0_18px_48px_-18px_rgb(0_0_0/0.6)]"
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

          {/* Desktop links */}
          <ul className="hidden items-center xl:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative flex min-h-11 items-center whitespace-nowrap rounded-full px-1.5 text-[0.8rem] font-medium transition-colors",
                    isActive(item.href)
                      ? "text-teal-700 dark:text-white"
                      : "text-slate-500 hover:text-teal-700 dark:text-mist-200 dark:hover:text-white"
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-coral-500"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <ThemeToggle compact className="hidden xl:inline-flex" />
            <GlassButton
              href="/collaboration"
              size="md"
              className="hidden whitespace-nowrap md:inline-flex"
            >
              Collaborate With Neorhiza
            </GlassButton>

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
          className="glass-strong mt-2 overflow-hidden rounded-3xl p-3 xl:hidden"
        >
          <ul className="grid gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex min-h-11 items-center justify-between rounded-2xl px-4 text-[0.95rem] font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-teal-700 text-white dark:bg-white/90 dark:text-teal-950"
                      : "text-ink hover:bg-white/60 dark:text-teal-50 dark:hover:bg-white/10"
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
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-teal-100/70 px-2 pt-4 dark:border-white/10">
            <ThemeToggle />
            <GlassButton href="/collaboration" size="md" className="flex-1 md:hidden">
              Collaborate
            </GlassButton>
          </div>
        </div>
      </div>
    </header>
  );
}

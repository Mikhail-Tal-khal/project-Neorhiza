"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light theme", Icon: Sun },
  { value: "dark", label: "Dark theme", Icon: Moon },
  { value: "system", label: "Follow system theme", Icon: Monitor },
] as const;

type ThemeValue = (typeof OPTIONS)[number]["value"];

const emptySubscribe = () => () => {};

/**
 * Manual theme control (light / dark / system). System preference is the
 * default, set by the ThemeProvider in the root layout.
 *
 * - Default: a group of three toggle buttons (aria-pressed).
 * - `compact`: a single 44px button that cycles light → dark → system,
 *   used in the desktop navigation pill where space is limited.
 */
export function ThemeToggle({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { theme, setTheme } = useTheme();
  // True only after hydration — avoids SSR/CSR mismatch without effects.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (compact) {
    const index = OPTIONS.findIndex((o) => o.value === theme);
    const current = OPTIONS[index === -1 ? 2 : index];
    const next = OPTIONS[(OPTIONS.indexOf(current) + 1) % OPTIONS.length];
    const Icon = mounted ? current.Icon : Monitor;
    return (
      <button
        type="button"
        data-testid="theme-cycle"
        onClick={() => setTheme(next.value as ThemeValue)}
        aria-label={
          mounted
            ? `Color theme: ${current.label}. Switch to ${next.label.toLowerCase()}`
            : "Color theme"
        }
        title={mounted ? `${current.label} — click for ${next.label.toLowerCase()}` : "Color theme"}
        className={cn(
          "glass inline-flex size-11 items-center justify-center rounded-full text-teal-700 transition-colors hover:text-teal-900 dark:text-mist-200 dark:hover:text-white",
          className
        )}
      >
        <Icon aria-hidden="true" className="size-5" />
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Color theme"
      className={cn(
        "glass inline-flex items-center gap-0.5 rounded-full p-1",
        className
      )}
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              "flex size-11 items-center justify-center rounded-full transition-colors duration-200",
              active
                ? "bg-teal-700 text-white dark:bg-white/90 dark:text-teal-950"
                : "text-muted hover:text-teal-700 dark:hover:text-white"
            )}
          >
            <Icon aria-hidden="true" className="size-4" />
          </button>
        );
      })}
    </div>
  );
}

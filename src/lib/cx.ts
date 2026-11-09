import { clsx, type ClassValue } from "clsx";

/**
 * Class joiner for client components. Unlike `cn` it does not resolve
 * conflicting Tailwind classes, which keeps tailwind-merge (~28 KB) out of
 * the browser bundle. Only pass classes that do not override each other;
 * server components keep using `cn` from `@/lib/utils`.
 */
export function cx(...inputs: ClassValue[]) {
  return clsx(inputs);
}

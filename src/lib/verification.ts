import type { Metadata } from "next";

/**
 * Search-console ownership tokens for the root layout's metadata, emitted
 * only when configured. Values are trimmed; blank values emit nothing, so
 * no empty verification tag is ever rendered. They are public by design
 * (they appear in page source), never secrets, and are never logged.
 */
export function siteVerification(
  google: string | undefined,
  bing: string | undefined
): Metadata["verification"] {
  const googleToken = google?.trim();
  const bingToken = bing?.trim();
  if (!googleToken && !bingToken) return undefined;
  return {
    ...(googleToken ? { google: googleToken } : {}),
    ...(bingToken ? { other: { "msvalidate.01": bingToken } } : {}),
  };
}

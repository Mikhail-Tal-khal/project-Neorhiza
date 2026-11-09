/**
 * Reads a server env value, trimmed, dropping one pair of surrounding
 * quotes. Dashboards such as Vercel's keep quotes typed into the value field
 * literally, which would turn `"Name <a@b.c>"` into an invalid sender.
 */
export function envValue(name: string): string {
  const value = (process.env[name] ?? "").trim();
  const match = /^(["'])(.*)\1$/s.exec(value);
  return (match ? match[2] : value).trim();
}

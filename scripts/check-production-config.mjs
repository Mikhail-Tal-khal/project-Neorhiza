/**
 * Production configuration check. Reports which settings are present —
 * never their values — and exits non-zero when production would run in a
 * degraded or broken state.
 *
 * Usage (values come from the environment, e.g. a pulled Vercel env file):
 *   vercel env pull .env.production.local --environment=production
 *   node --env-file=.env.production.local scripts/check-production-config.mjs
 *   rm .env.production.local
 *
 * Or simply: npm run check:config (checks the current shell environment).
 */

const env = process.env;
const has = (name) => typeof env[name] === "string" && env[name].trim() !== "";
const unquote = (v = "") => v.trim().replace(/^(["'])(.*)\1$/s, "$2").trim();

const results = [];
const check = (level, label, ok, hint) => results.push({ level, label, ok, hint });

// Site identity
check("required", "NEXT_PUBLIC_SITE_URL is set", has("NEXT_PUBLIC_SITE_URL"), "canonical URLs fall back to the built-in default");
if (has("NEXT_PUBLIC_SITE_URL")) {
  const url = unquote(env.NEXT_PUBLIC_SITE_URL);
  check("required", "NEXT_PUBLIC_SITE_URL is https without a trailing slash", /^https:\/\/[^/]+$/.test(url), "e.g. https://www.example.org");
}

// Contact delivery
const resend = ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"];
const resendCount = resend.filter(has).length;
check("required", "A contact delivery destination is configured (Resend or webhook)", resendCount === 3 || has("CONTACT_WEBHOOK_URL"), "without one the form returns 503");
if (resendCount > 0 && resendCount < 3) {
  check("required", "All three Resend variables are set together", false, `missing: ${resend.filter((n) => !has(n)).join(", ")}`);
}
if (has("CONTACT_FROM_EMAIL")) {
  check("required", "CONTACT_FROM_EMAIL looks like an address or \"Name <address>\"", /^([^<>]+<[^<>\s@]+@[^<>\s@]+>|[^<>\s@]+@[^<>\s@]+)$/.test(unquote(env.CONTACT_FROM_EMAIL)), "e.g. Project Neorhiza <website@mail.example.org>");
}
if (has("RESEND_API_KEY")) {
  check("recommended", "RESEND_API_KEY has the expected re_ prefix", unquote(env.RESEND_API_KEY).startsWith("re_"), "check the key was pasted correctly");
}

// Rate limiting
const upstash = has("UPSTASH_REDIS_REST_URL") && has("UPSTASH_REDIS_REST_TOKEN");
const kv = has("KV_REST_API_URL") && has("KV_REST_API_TOKEN");
check("required", "Shared rate-limit store is configured (Upstash or Vercel KV)", upstash || kv, "the in-memory fallback is per-instance and not adequate in production");

// Secrets must never be public
const leaked = Object.keys(env).filter((n) => n.startsWith("NEXT_PUBLIC_") && /KEY|TOKEN|SECRET|PASSWORD|PRIVATE/i.test(n));
check("required", "No secret-looking variable uses the NEXT_PUBLIC_ prefix", leaked.length === 0, leaked.length ? `rename: ${leaked.join(", ")}` : "");

// Optional
check("optional", "NEXT_PUBLIC_CONTACT_EMAIL is set", has("NEXT_PUBLIC_CONTACT_EMAIL"), "defaults to inquiries@neorhiza.space");
check("optional", "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION is set", has("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION"), "only needed for the meta-tag verification method");
check("optional", "NEXT_PUBLIC_BING_SITE_VERIFICATION is set", has("NEXT_PUBLIC_BING_SITE_VERIFICATION"), "only needed for the meta-tag verification method");

let failed = 0;
for (const r of results) {
  const mark = r.ok ? "PASS" : r.level === "required" ? "FAIL" : r.level === "recommended" ? "WARN" : "INFO";
  if (!r.ok && r.level === "required") failed++;
  console.log(`${mark.padEnd(4)}  ${r.label}${!r.ok && r.hint ? ` — ${r.hint}` : ""}`);
}
console.log(failed ? `\n${failed} required check(s) failed.` : "\nAll required production checks passed.");
process.exit(failed ? 1 : 0);

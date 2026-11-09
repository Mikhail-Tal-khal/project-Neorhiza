/**
 * RFC 9116 security contact, served as plain text at
 * /.well-known/security.txt. Renew `Expires` before it passes (at most a
 * year ahead); a test fails when fewer than 30 days remain.
 */
export const dynamic = "force-static";

const SECURITY_TXT = [
  "Contact: mailto:inquiries@neorhiza.space",
  "Canonical: https://www.neorhiza.space/.well-known/security.txt",
  "Policy: https://github.com/Mikhail-Tal-khal/project-Neorhiza/security/policy",
  "Preferred-Languages: en",
  "Expires: 2027-11-09T00:00:00.000Z",
  "",
].join("\n");

export function GET() {
  return new Response(SECURITY_TXT, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

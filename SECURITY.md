# Security Policy

## Reporting a vulnerability

Please report security issues privately. **Do not open a public GitHub issue.**

Email **inquiries@neorhiza.space** with `SECURITY:` at the start of the
subject line, or use GitHub's private vulnerability reporting on this
repository. The same contact is published at
<https://www.neorhiza.space/.well-known/security.txt>. Include:

- a description of the issue and its potential impact,
- steps to reproduce or a proof of concept,
- any relevant URLs, request details or screenshots.

We aim to acknowledge reports within 5 working days and will keep you
informed while we investigate. Please give us reasonable time to fix the
issue before any public disclosure.

## Scope

- The website source in this repository and its deployment.
- The contact form API (`/api/contact`).

Out of scope: denial-of-service testing, social engineering, and findings
in third-party services we do not control.

## Our commitments

- No secrets are committed to this repository; configuration lives in
  environment variables (see `.env.example`).
- The site loads no third-party scripts or advertising trackers. Its only
  measurement is Vercel Web Analytics and Speed Insights, served first-party
  from the site's own domain. It sends strict security headers (CSP, HSTS,
  frame and cross-origin protections); see `docs/SECURITY-HEADERS.md`.
- The contact API refuses cross-site browser requests, validates and
  size-limits input, rate-limits per IP and never logs inquiry content.

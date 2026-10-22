# Security Policy

## Reporting a vulnerability

Please report security issues privately. **Do not open a public GitHub issue.**

Use the website's contact form at **`/contact`** on the live site
(select "General inquiry" and start the message with `SECURITY:`). Include:

- a description of the issue and its potential impact,
- steps to reproduce or a proof of concept,
- any relevant URLs, request details or screenshots.

<!-- Placeholder: add a dedicated security mailbox here once one exists,
     e.g. security@<your-domain>. -->

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
- The site loads no third-party scripts or trackers and sends strict
  security headers (CSP, HSTS, frame protection and others).

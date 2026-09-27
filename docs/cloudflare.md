# Cloudflare deployment

The `michaelzick-com` Worker serves the current coaching site from `main`. Keep the NGU redirect branch separate. Use Node 24 and npm.

## Build and deploy

Run `npm ci`, `npm run check`, `npm run test:e2e`, then `npm run build:cloudflare`. Exercise `npm run preview:cloudflare` before deploying with `npm run deploy:cloudflare`. Bindings are generated with `npm run cf:typegen`. Pages use a read-only static-asset incremental cache because content changes at build time; API routes stay dynamic. Images use the IMAGES binding.

Workers Builds: repository `michaelzick/michaelzick.com`, production branch `main`, root `/`, build `npm ci && npm run build:cloudflare`, deploy `npm run deploy:cloudflare`. Set `NODE_VERSION=24`, `SKIP_DEPENDENCY_INSTALL=1`, and the public `NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V2` in build configuration. Do not provision production credentials for untrusted previews.

## Credentials

Use local `.env*` files as the source and encrypted Worker secrets as the destination. Transfer values through process memory/stdin, never command arguments, logs, documentation, or committed files. Required names: `OPENAI_API_KEY`, `BREVO_SMTP_PASSWORD`, `BREVO_USER`, `BREVO_TO`, `BREVO_FROM`, `RECAPTCHA_SECRET_KEY_V2`, `HUBSPOT_SERVICE_KEY`, `HUBSPOT_CONTACT_OWNER_ID`. Use the preferred HubSpot key rather than copying legacy fallbacks. Only the reCAPTCHA site key is public client configuration. Never copy these credentials to the static subdomain Workers.

`CLIENT_IP_HEADER=CF-Connecting-IP` selects the trusted edge IP for existing best-effort per-isolate limits; local development keeps the forwarding-header fallback.

## DNS and rollback

Registration stays at GoDaddy. Cloudflare becomes authoritative for the complete zone, including Google MX, Brevo DKIM/DMARC, and verification TXT records. Keep mail records DNS-only. Attach `michaelzick.com` and `www.michaelzick.com` to this Worker; each subdomain has its own Worker.

Deploy and validate before cutover. Disable all three DigitalOcean autodeploys after preview checks and before merging migration changes to main, so migration commits cannot trigger old-provider builds. Keep the old app for 48 hours, then recheck and archive it. For rollback, restore the saved DigitalOcean web records; keep Cloudflare authoritative. Do not delete the old DNS zone.

## Acceptance

Validate pages, canonical redirects, images, consent, malformed API submissions, captcha rejection, rate limits, and SMTP connectivity without sending mail. Live email/AI/CRM submissions require user-assisted checks. Check Worker CPU limits and errors before cutover and retirement. Confirm the exact production Git SHA in Workers Builds and no new DigitalOcean build.

## SMTP on the production edge

All email routes use `lib/server/mail.ts`, which connects to Brevo by hostname on port 587 and requires STARTTLS. Nodemailer's default IP-resolved socket fails TLS on the Cloudflare production edge even when local workerd verification succeeds. Keep the custom socket provider, certificate verification, and `requireTLS` enabled. Validate authentication with `transporter.verify()` on a Cloudflare version preview (no email sent), then use user-assisted Contact, Questionnaire, and coupon submissions to confirm delivery. Log only allowlisted error codes, SMTP commands, and numeric response codes; never provider response text, credentials, or submissions.

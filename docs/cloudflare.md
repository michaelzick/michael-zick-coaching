# Cloudflare deployment

The `michael-zick-coaching` Worker serves the coaching site from `main`, at `https://michael-zick-coaching.zickonezero.workers.dev` only. Every response carries `X-Robots-Tag: noindex`. Use Node 24 and npm.

This Worker was `michaelzick-com` and served `michaelzick.com` and `www.michaelzick.com` until Michael's landing page (GitHub `michaelzick/michaelzick.com`, Worker `michaelzick-com`) took both domains. That repo's redirects send the old coaching URLs to Nice Guy University. A domain belongs to one Worker, so never add those domains to this Worker's `routes`.

## Build and deploy

Run `npm ci`, `npm run check`, `npm run test:e2e`, then `npm run build:cloudflare`. Exercise `npm run preview:cloudflare` before deploying with `npm run deploy:cloudflare`. Bindings are generated with `npm run cf:typegen`. Pages use a read-only static-asset incremental cache because content changes at build time; API routes stay dynamic. Images use the IMAGES binding.

Workers Builds: repository `michaelzick/michael-zick-coaching`, production branch `main`, root `/`, build `npm ci && npm run build:cloudflare`, deploy `npm run deploy:cloudflare`. Set `NODE_VERSION=24`, `SKIP_DEPENDENCY_INSTALL=1`, and the public `NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V2` in build configuration. Do not provision production credentials for untrusted previews.

## Branch previews

Workers Builds has builds for Preview branches enabled. Preview URLs are `<branch>-michael-zick-coaching.zickonezero.workers.dev`, so keep branch names under about 40 characters (a DNS label holds 63). Previews use the same build command and public build variables as production, with `npm run deploy:preview` as the Preview command. The script runs `opennextjs-cloudflare populateCache local` to copy the prerendered page cache into the asset bundle, then `wrangler preview` to publish it. Calling Wrangler directly skips that OpenNext cache preparation. This publishes a branch preview without deploying the production routes. For a manual preview, run `npm run build:cloudflare` followed by `npm run deploy:preview` on the feature branch.

The `previews` block in `wrangler.jsonc` explicitly declares `CLIENT_IP_HEADER=CF-Connecting-IP` and the `IMAGES` binding. Preview variables and API bindings do not inherit production values; assets and compatibility settings stay at the top level. Keep this block on `main` so future branches inherit it through Git. See [Cloudflare preview configuration](https://developers.cloudflare.com/workers/previews/configuration/).

Preview secrets are managed separately through Cloudflare's **Previews Base** runtime settings. Existing Base secrets are copied into newly created previews; later Base secret changes do not update existing previews. Use preview-safe credentials and resources. A working page preview does not prove live email, AI, CRM, or reCAPTCHA submissions work; reCAPTCHA must also allow the preview hostname, and the site key's domains must include `michael-zick-coaching.zickonezero.workers.dev`.

## Credentials

Use local `.env*` files as the source and encrypted Worker secrets as the destination. Transfer values through process memory/stdin, never command arguments, logs, documentation, or committed files. Required names: `OPENAI_API_KEY`, `BREVO_SMTP_PASSWORD`, `BREVO_USER`, `BREVO_TO`, `BREVO_FROM`, `RECAPTCHA_SECRET_KEY_V2`, `HUBSPOT_SERVICE_KEY`, `HUBSPOT_CONTACT_OWNER_ID`. Use the preferred HubSpot key rather than copying legacy fallbacks. Only the reCAPTCHA site key is public client configuration. Never copy these credentials to the static subdomain Workers.

`CLIENT_IP_HEADER=CF-Connecting-IP` selects the trusted edge IP for existing best-effort per-isolate limits; local development keeps the forwarding-header fallback.

## DNS and rollback

`michaelzick.com` is registered at GoDaddy with Cloudflare's nameservers, and Cloudflare is authoritative for the whole zone, including Google MX, Brevo DKIM/DMARC, and verification TXT records. Keep mail records DNS-only. Brevo still sends from the michaelzick.com domain, which the move left alone, and `findyourflowstate` and `whosincharge` keep their own Workers on their subdomains.

To roll back the domain move, take `michaelzick.com` and `www.michaelzick.com` off the landing page's `michaelzick-com` Worker, attach them to this Worker under **Domains & Routes**, and revert `siteConfig.url` and the `noindex` header.

## Acceptance

Validate pages, the `noindex` header and canonical URLs, images, consent, malformed API submissions, captcha rejection, rate limits, and SMTP connectivity without sending mail. Live email/AI/CRM submissions require user-assisted checks. Check Worker CPU limits and errors before cutover and retirement. Confirm the exact production Git SHA in Workers Builds and no new DigitalOcean build.

## SMTP on the production edge

All email routes use `lib/server/mail.ts`, which connects to Brevo by hostname on port 587 and requires STARTTLS. Nodemailer's default IP-resolved socket fails TLS on the Cloudflare production edge even when local workerd verification succeeds. Keep the custom socket provider, certificate verification, and `requireTLS` enabled. Validate authentication with `transporter.verify()` on a Cloudflare version preview (no email sent), then use user-assisted Contact, Questionnaire, and coupon submissions to confirm delivery. Log only allowlisted error codes, SMTP commands, and numeric response codes; never provider response text, credentials, or submissions.

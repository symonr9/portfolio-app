This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contentful Configuration

This app reads portfolio content from Contentful GraphQL in server components.
Create a local `.env.local` from `.env.example` and set:

- `NEXT_PUBLIC_SITE_URL` (production canonical URL, for metadata, robots, and sitemap)
- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_ENVIRONMENT` (optional; defaults to `master`)
- `CONTENTFUL_ACCESS_TOKEN`
- `CONTENTFUL_PREVIEW_ACCESS_TOKEN` (optional, for preview mode)
- `CONTENTFUL_PREVIEW_SECRET` (shared secret for Contentful draft preview URLs)
- `CONTENTFUL_REVALIDATE_SECONDS` (defaults to `300`; use `false` to disable revalidation)
- `CONTENTFUL_REVALIDATE_SECRET` (shared secret for the Contentful webhook)
- `RESEND_API_KEY` (server-only API key for forwarding contact form submissions)
- `CONTACT_TO_EMAIL` (server-only destination for contact form submissions)
- `CONTACT_FROM_EMAIL` (verified Resend sender address used for outbound form mail, for example `Portfolio <contact@verified-domain.com>`)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (optional public Cloudflare Turnstile site key)
- `TURNSTILE_SECRET_KEY` (optional server-only Cloudflare Turnstile secret)

## Deploy on Netlify

Netlify settings live in `netlify.toml`:

- Build command: `npm run build`
- Publish directory: `.next`
- Node version: `22`
- Skew protection: `NETLIFY_NEXT_SKEW_PROTECTION=true`

Set the Contentful variables above in Netlify project environment variables. Set `NEXT_PUBLIC_SITE_URL` to the production site URL so canonical links, `/robots.txt`, `/sitemap.xml`, and social metadata use the final domain.
If your Contentful environment is `master`, you can leave `CONTENTFUL_ENVIRONMENT` unset because the app uses that default.
Do not mark `NEXT_PUBLIC_SITE_URL`, `CONTENTFUL_SPACE_ID`, or `CONTENTFUL_ENVIRONMENT` as secret values; `netlify.toml` also omits those public configuration keys from Netlify secret scanning because they are expected in generated pages and server chunks.

## Contact Form Delivery

The `/contact` page posts to a server-side route at `/api/contact`, which forwards submissions with Resend. The recipient email is never rendered in the browser; configure it only through `CONTACT_TO_EMAIL` in local and Netlify environment variables.

Resend requires `CONTACT_FROM_EMAIL` to use a verified sender domain. For account testing with Resend's shared sender, the recipient must match the Resend account's own email; for normal portfolio inquiries, verify a domain in Resend and use an address on that domain.

The contact route accepts one optional attachment and only forwards PDF or DOCX files up to 8 MB. It also includes a hidden honeypot field, rejects unrealistically fast submissions, applies basic in-memory per-IP rate limiting, and can verify Cloudflare Turnstile when `TURNSTILE_SECRET_KEY` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` are configured.

## Contentful Revalidation Webhook

For on-demand revalidation on Netlify, create a Contentful webhook that sends a `POST` request to:

```text
https://<your-netlify-site>/api/revalidate/contentful
```

Set `CONTENTFUL_REVALIDATE_SECRET` in Netlify and send the same value from Contentful with one of:

- `Authorization: Bearer <secret>`
- `x-contentful-webhook-secret: <secret>`
- `?secret=<secret>` on the webhook URL

The route immediately expires the shared `contentful` cache tag used by Contentful GraphQL fetches, so the next request reads fresh content.

## Contentful Draft Preview

Set `CONTENTFUL_PREVIEW_ACCESS_TOKEN` and `CONTENTFUL_PREVIEW_SECRET`, then configure Contentful preview URLs to open:

```text
https://<your-site>/api/draft/contentful?secret=<preview-secret>&slug=<path>
```

Use `/work/<slug>` for work sample entries, `/blog/<slug>` for blog post entries, or one of the static portfolio paths such as `/`, `/about`, `/resume`, `/work`, `/blog`, or `/contact`. The route validates the secret and target path, enables Next.js Draft Mode for the current browser session, and redirects to the requested page using Contentful preview content. Use the preview banner to exit Draft Mode.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Next.js Deployment Notes

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contentful Model Importing
`npm install -g contentful-cli`
`contentful login`
`contentful space import --space-id <space-id> --content-file docs/contentful-import-content-models.json --content-model-only`

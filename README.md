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

- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_ENVIRONMENT` (defaults to `master`)
- `CONTENTFUL_ACCESS_TOKEN`
- `CONTENTFUL_PREVIEW_ACCESS_TOKEN` (optional, for preview mode)
- `CONTENTFUL_REVALIDATE_SECONDS` (defaults to `300`; use `false` to disable revalidation)
- `CONTENTFUL_REVALIDATE_SECRET` (shared secret for the Contentful webhook)

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

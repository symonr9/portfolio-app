---
name: portfolio-netlify-release-audit
description: Audit and improve portfolio-app release readiness for Netlify, including Next.js adapter configuration, environment variables, secret scanning, build output, Contentful webhooks and revalidation, metadata, sitemap, robots, Open Graph output, and production-build behavior. Use for deployment failures, pre-release checks, Netlify configuration, SEO delivery, or secret-scanner incidents.
---

# Portfolio Netlify Release Audit

1. Read project guidance, `netlify.toml`, package scripts, Next.js config, environment examples, metadata routes, and deployment code.
2. Read installed Next.js deployment, caching, metadata, and image guides before changing framework behavior.
3. Reproduce the production build and separate application failures from sandbox or network failures.
4. Audit environment variables by name and exposure class only. Verify server secrets do not use public prefixes or enter client bundles.
5. For secret-scanner failures, locate the source or generated artifact without printing the secret. Fix the leak or scope narrowly; do not broadly disable scanning first.
6. Check build command, publish behavior, Next integration, ignored output, and Contentful webhook/revalidation paths.
7. Verify sitemap, robots, canonicals, Open Graph output, and representative production pages when in scope.
8. Do not change dashboard settings or remote environment values without explicit authorization. Use `$portfolio-finish-change` after repairs.

Separate repository changes from user-performed dashboard actions. Report build results, security findings without values, SEO artifacts checked, and remaining risks.

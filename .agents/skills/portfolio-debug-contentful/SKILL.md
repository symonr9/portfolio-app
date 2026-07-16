---
name: portfolio-debug-contentful
description: Diagnose portfolio-app Contentful failures such as GraphQL 400 responses, invalid order enums, stale or missing content, preview versus delivery discrepancies, required-field errors, wrong space or environment configuration, schema propagation, publication, caching, and revalidation problems. Use when Contentful-backed development, builds, previews, or deployed pages return unexpected data or errors.
---

# Portfolio Contentful Debugging

1. Read project guidance and inspect the exact error, request path, query, types, mapper, environment-variable names, and recent changes.
2. Reproduce with the smallest safe request. Never print headers, tokens, or full environment values.
3. Classify the failure as configuration, GraphQL contract, publication, data shape, preview/delivery mode, or freshness and revalidation.
4. Compare Management API state, GraphQL schema visibility, and entry data only as needed to isolate the layer.
5. State the confirmed root cause before fixing unless diagnosis and repair are both authorized.
6. Read local Next.js docs before changing caching, revalidation, or fetching. Make the narrowest durable correction; do not weaken types merely to suppress errors.
7. Use `$portfolio-contentful-model-change` if the schema must change. Verify the original request, affected page, delivery mode, and build as appropriate.

Never reveal secrets, rotate credentials, alter remote content, or relax security without authorization. Do not call data stale until publication, environment, endpoint, cache, and schema state are distinguished. Report root cause, evidence, fix, checks, and remaining remote action.

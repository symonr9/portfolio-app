---
name: portfolio-contentful-model-change
description: Change portfolio-app Contentful content models end to end, including model JSON and documentation, TypeScript types, GraphQL queries, mappers, Contentful CLI import or migration, content-type publication, and application verification. Use when adding, removing, renaming, or changing fields or validations on profile, work sample, blog post, experience, expertise tag, testimonial, site settings, or other portfolio content types.
---

# Portfolio Contentful Model Change

1. Read root `AGENTS.md`, root `CLAUDE.md`, and any nearer guidance for edited files.
2. Inspect `docs/content-models.md`, `docs/contentful-import-content-models.json`, and current Contentful types, queries, fragments, and mappers.
3. Keep models and labels career-agnostic. Use Contentful as the source of truth for editable content.
4. Trace the field through model docs, import definition, raw and domain types, GraphQL selections, mapping/default logic, and UI consumers.
5. Preserve compatibility for optional fields and older content unless a required migration is explicit.
6. Before changing Next.js data fetching, caching, metadata, routing, or revalidation, read the relevant guide under `node_modules/next/dist/docs/`.
7. Use the Contentful CLI only when requested or required. Load credentials without printing them.
8. After import, confirm the type is published and GraphQL exposes the change. If Management API updates but GraphQL does not, use a minimal migration to activate it and remove temporary artifacts.
9. Verify focused behavior, TypeScript, lint, and a production build. Use `$portfolio-finish-change` when finalizing.

Never print or commit tokens or `.env` values. Do not silently change live entries when only a model change was requested. Keep import JSON, docs, and code synchronized. Preserve unrelated changes. Report fields, code paths, remote import/publication status, checks, and editor-side work remaining.

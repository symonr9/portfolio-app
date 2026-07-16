---
name: portfolio-implement-ui-feature
description: Implement portfolio-app UI features that integrate with existing Next.js structure, Contentful data, shared styling, responsive behavior, and accessibility. Use for new or revised pages, sections, navigation, filters, sorting, tabs, cards, calls to action, resume or social controls, and other presentation features that are not primarily content-model migrations.
---

# Portfolio UI Feature

1. Read root and nearest project guidance, inspect affected routes and shared components, and review working-tree changes.
2. Read relevant local docs in `node_modules/next/dist/docs/` before changing routing, data fetching, caching, metadata, images, or deployment behavior.
3. Identify the existing data source and component pattern. Prefer Contentful-backed editable content and shared presentation primitives.
4. Keep labels, types, and docs reusable for any individual portfolio; do not encode profession, industry, audience, or ownership assumptions.
5. Implement the smallest coherent feature, including missing, empty, long-content, and invalid-route behavior where relevant.
6. Make interactions keyboard-operable and responsive from the start. Preserve reduced-motion behavior.
7. Verify the real workflow in the browser at mobile and desktop sizes, including console and network checks.
8. Run focused tests and use `$portfolio-finish-change` for full checks or commit handling.

Compose with `$portfolio-contentful-model-change` for CMS schemas, `$portfolio-media-presentation` for rich media, `$portfolio-polish-responsive-accessibility` for standards, and `$portfolio-audit-ux` for whole-site testing. Report outcome, integrations, browser coverage, checks, and Contentful content still needed.

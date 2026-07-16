---
name: portfolio-audit-ux
description: Audit portfolio-app user experience end to end in a real browser across routes, responsive sizes, interactions, CMS states, console errors, and network failures. Use when asked to walk every page, find UX bugs, regression-test workflows, produce a usability report, or fix confirmed cross-site issues. Supports report-only and fix modes.
---

# Portfolio UX Audit

1. Read project guidance and inspect routes, navigation, dynamic routes, and shared components.
2. Determine mode: report-only makes no changes; fix mode repairs confirmed in-scope findings and re-tests them.
3. Start or reuse the local app and use the in-app browser.
4. Visit every public route plus representative work and blog details. Exercise navigation, tabs, filters, sorting, search, forms, links, downloads, galleries, media, and empty states.
5. Test narrow mobile and desktop viewports, plus intermediate widths when warranted.
6. Check keyboard operation, focus, active state, link purpose, headings, landmarks, labels, errors, contrast, and reduced motion.
7. Inspect console and failed network requests. Probe missing optional CMS fields, long text, empty collections, invalid slugs, unsupported media, and failed embeds where practical.
8. Distinguish reproducible defects from subjective enhancements.
9. In fix mode, read relevant local Next.js docs, prefer shared root-cause fixes, preserve career-agnostic content, and re-run the failing interaction plus adjacent smoke tests.

Use `$portfolio-polish-responsive-accessibility` for a deep standards pass and `$portfolio-finish-change` for finalization. Reports rank findings by severity with route, reproduction, impact, and resolution. Fix handoffs list repairs, browser coverage, checks, and limitations.

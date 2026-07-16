---
name: portfolio-polish-responsive-accessibility
description: Review and improve portfolio-app responsive behavior and accessibility, including keyboard use, focus, semantics, contrast, motion, long CMS content, media, touch targets, and narrow-screen layout. Use for accessibility passes, responsive polish, mobile overflow, clipped content, interaction consistency, or validation of newly built interfaces.
---

# Portfolio Responsive Accessibility

1. Read project guidance and inspect existing shared styles and components.
2. Establish current behavior in a browser before editing.
3. Check keyboard navigation, focus order and visibility, skip and active navigation, semantic controls, labels, errors, headings, landmarks, link purpose, and decorative images.
4. Check every meaningful foreground/background pairing, including hover, focus, disabled, overlay, and image-backed states.
5. Test long CMS titles, tags, URLs, metadata, and rich text at mobile, desktop, and failing intermediate widths.
6. Verify media containment, grid shrink behavior, wrapping, touch targets, and sticky elements.
7. Honor `prefers-reduced-motion`; animation must not be required to understand or operate the UI.
8. Prefer shared fixes without broad redesign. Do not rewrite content to hide layout failures or remove visual personality when an accessible equivalent preserves it.
9. Re-test affected interactions and run focused checks. Use `$portfolio-finish-change` when finalizing.

Report improvements by user impact, viewport and input coverage, checks, and anything needing manual assistive-technology testing.

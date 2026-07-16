---
name: portfolio-media-presentation
description: Implement or review portfolio-app media presentation for Contentful images, videos, embeds, galleries, downloadable files, resumes, hero imagery, and decorative backgrounds. Use when media must render accessibly and responsively, support mixed asset types, preserve layout, provide fallbacks, or include animation and reduced-motion behavior.
---

# Portfolio Media Presentation

1. Read project guidance and inspect current media types, mapper, renderer, image config, and affected layout.
2. Read installed Next.js image and security docs before changing image handling, remote patterns, or optimization.
3. Classify assets as meaningful content, download, embed, or decoration.
4. Give meaningful images useful CMS-backed alt text and stable dimensions; hide decorative assets from assistive technology.
5. Use existing patterns for video and embeds; provide a clear external link or download fallback when inline rendering fails.
6. For files, expose file type and action, preserve safe links, and never imply unsupported preview.
7. Make galleries responsive, keyboard-operable, and resilient to aspect ratios, missing assets, long labels, empty collections, and unsupported MIME types.
8. Keep decorative backgrounds out of layout flow only when intended; prevent overflow and protect contrast and interaction layers.
9. Honor reduced motion and avoid unbounded loading. Verify media at mobile and desktop sizes with console and network checks.

Use `$portfolio-finish-change` when finalizing. Report supported cases, fallbacks, accessibility decisions, coverage, and Contentful metadata still needed.

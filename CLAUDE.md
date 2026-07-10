Portfolio App
=============

This project is a portfolio and resume website built with Next.js and intended for deployment on Netlify. Content is managed through Contentful so the portfolio owner can update profile details, work samples, long-form writing, media, experience, expertise tags, and related resume-style content without changing application code.

The application should remain career-agnostic. Avoid hard-coding assumptions about the portfolio owner's profession, industry, services, audience, or relationship to the repository owner. Content models, routes, labels, and documentation should support a flexible personal portfolio that can adapt to different career paths.

Implementation Notes
--------------------

- Use Contentful as the source of truth for editable portfolio content.
- Keep styling, layout, and presentation concerns in the Next.js app.
- Prefer reusable model names such as profile, work sample, blog post, experience, expertise tag, testimonial, and site settings.
- Read the relevant local Next.js documentation in `node_modules/next/dist/docs/` before changing Next.js routing, data fetching, caching, metadata, or deployment behavior.
- Preserve the guidance in `AGENTS.md` for agent workflows and Next.js version-specific rules.

---
name: portfolio-finish-change
description: Review, verify, and finalize changes in portfolio-app, including diff hygiene, career-agnostic language, relevant browser checks, lint, typecheck, production build, secret and generated-file checks, staging, and optional commit. Use after implementation or fixes, especially when the user says finish, verify, run checks, clean up, or commit the work.
---

# Portfolio Finish Change

1. Read project guidance and inspect `git status`, the relevant diff, and untracked files.
2. Preserve user changes. Never stage unrelated caches, environment files, build outputs, or secrets.
3. Confirm the outcome without profession-specific assumptions in reusable content, types, labels, or docs.
4. Check for debugging output, temporary files, placeholders, duplication, stale comments, unsafe fallbacks, and secret exposure.
5. Re-run affected browser workflows for user-facing changes, including mobile and desktop when layout is involved.
6. Run repository lint, typecheck when available, production build for framework/CMS/config/shared changes, and `git diff --check`.
7. If network restrictions block required verification, rerun the same check with approval instead of changing behavior to bypass it.

Commit only when explicitly requested. Stage only task files, use a concise imperative message, confirm the commit hash and subject, and never push unless requested. Lead the handoff with outcome, material changes, exact checks and browser scenarios, commit details, and genuine caveats.

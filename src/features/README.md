# Frontend Feature Modules

Each product domain owns its UI, hooks, schemas, service contracts, and types
inside an isolated feature. Current modules are `auth`, `users`, `academics`,
`questions`, `exams`, `attempts`, `results`, `audit`, `monitoring`, `materials`,
`assignments`, `analytics`, and `governance`.

Feature boundaries:

- Keep page files in `src/app` focused on route composition and role-facing
  layout.
- Keep server-state queries, mutations, cache keys, and API DTO handling in
  the owning feature.
- Export only intended cross-feature capabilities through a feature's
  `index.ts`; do not import another feature's private file.
- Put reusable, business-agnostic UI and hooks in `src/components` and
  `src/hooks`. Shared layers must not import a feature.
- Route all HTTP calls through the centralized API client and typed service
  layer. The API remains authoritative for permissions and ownership.

Grading screens are composed within exam/result features; score calculation
and result policy remain API-owned. Read the [frontend architecture](../../docs/ARCHITECTURE.md)
and [design system](../../docs/DESIGN.md) before changing feature boundaries or
shared UI.

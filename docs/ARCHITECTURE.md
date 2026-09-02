# Citra Negara LMS Web Architecture

Citra Negara LMS Web uses Next.js App Router with feature-first domain modules.
The foundation targets one school and deliberately does not introduce
multi-tenant or SaaS abstractions.

```text
src/
├── app/          # Next.js routes, layouts, metadata, error boundaries, global CSS
├── assets/       # imported static assets
├── components/   # reusable business-agnostic UI
├── config/       # runtime-safe public configuration
├── features/     # isolated business domains
├── hooks/        # reusable business-agnostic hooks
├── lib/          # pure utilities and helpers
├── providers/    # client-side application providers
├── services/     # API client and integrations
├── types/        # shared transport and primitive types
└── ...
```

## Dependency rules

- `app` owns route segments and route-level composition only.
- A feature owns its domain components, hooks, schemas, services, and types.
- Features must not import another feature directly.
- Shared components and hooks remain business-agnostic.
- API calls go through `services/api`; pages do not call Axios directly.
- Runtime configuration is read through `config` and uses `NEXT_PUBLIC_` only
  for values that are safe to expose to browsers.
- Server Components are the default. Add `"use client"` only for browser APIs,
  event handlers, React Query, or a client-only dependency.

## Naming

Use kebab-case for file names, PascalCase for React components, camelCase for
functions and variables, and `use`-prefixed names for hooks. Keep API DTO types
separate from UI view models when their responsibilities diverge.

## Quality gates

Run `npm run lint` for the Next.js Core Web Vitals and TypeScript rules,
`npm run lint:fast` for a fast local pass, `npm run typecheck` for TypeScript,
and `npm run build` before handing off a significant frontend change.

## Implemented feature shape

```text
app/(protected)/   # route composition and role-facing pages
features/<domain>/ # React Query hooks and cache ownership
services/          # typed HTTP contracts per API domain
types/             # shared transport contracts
components/        # business-agnostic shell and access presentation
```

Only add folders when the domain needs them. Avoid empty abstractions.

## Authentication boundary

The browser keeps the access token in memory. The API refresh token stays in an
HttpOnly cookie and is used to restore a session after refresh. Axios performs a
single shared refresh request after a 401 and retries the original request.
Frontend role boundaries are presentation safeguards only; every sensitive
decision remains enforced by the API.

## Exam workspace

The active attempt route uses a focused layout. Countdown display is anchored
to `server_time` and `deadline_at`, answer mutations carry unique idempotency
keys, and saved answers are rehydrated from the API. Correct-answer data is not
part of any student-facing type.

## LMS and operations workspaces

Materials, assignments, monitoring, analytics, and audit follow the same data
flow as the examination modules: route composition calls a feature-owned React
Query hook, which calls a typed service contract. Student routes only request
enrolled/published resources; the API remains responsible for every ownership
and role decision.

Shared loading, empty, error, and metric presentation live in
`src/components/`. Domain-specific forms, polling, mutations, and cache keys
stay in `src/features/<domain>/`. This keeps page files focused on role-facing
composition while avoiding a generic feature framework.

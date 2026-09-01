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

## Future feature shape

```text
features/<domain>/
├── components/
├── hooks/
├── pages/
├── schemas/
├── services/
├── types.ts
└── index.ts
```

Only add folders when the domain needs them. Avoid empty abstractions.

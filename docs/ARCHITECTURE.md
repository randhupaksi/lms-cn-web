# Ranvex Web Architecture

Ranvex Web uses a feature-first React architecture with a small application
foundation. It is ready for business features without coupling the scaffold to
a specific school or workflow.

```text
src/
├── app/          # bootstrap, providers, router, layouts, runtime config
├── assets/       # imported static assets
├── components/   # reusable business-agnostic UI
├── features/     # isolated business domains
├── hooks/        # reusable business-agnostic hooks
├── lib/          # pure utilities and helpers
├── services/     # API client and integrations
├── types/        # shared transport and primitive types
└── main.tsx      # application entrypoint
```

## Dependency rules

- `app` composes shared layers and feature entrypoints.
- A feature owns its domain components, hooks, schemas, services, and types.
- Features must not import another feature directly.
- Shared components and hooks remain business-agnostic.
- API calls go through `services/api`; pages do not call Axios directly.
- Runtime configuration is read through `app/config`.

## Naming

Use kebab-case for file names, PascalCase for React components, camelCase for
functions and variables, and `use`-prefixed names for hooks. Keep API DTO types
separate from UI view models when their responsibilities diverge.

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

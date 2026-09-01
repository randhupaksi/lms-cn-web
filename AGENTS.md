<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Citra Negara LMS Web — Agent Guide

> This file is the source of truth for AI-assisted work in this repository.
> Workspace-wide rules are in `../AGENTS.md`. Read this file after the Next.js
> block and before changing frontend code.

## 1. Product scope

This is the Citra Negara LMS frontend, initially for the school's graduation
examination workflow. The project is currently a foundation; do not invent
login, dashboard, exam, CRUD, or other business features unless the task asks
for them.

Do not add multi-tenant, SaaS, white-label, client-selector, or platform
superadmin abstractions. Keep product copy and visible branding aligned with
Citra Negara LMS.

## 2. Stack and commands

| Area | Standard |
|---|---|
| Framework | Next.js 16 App Router |
| UI runtime | React 19 + TypeScript |
| Styling | Tailwind CSS v4 + CSS design tokens |
| Server state | TanStack Query when client-side server state is needed |
| HTTP | Axios through `src/services/api/` |
| Validation | Zod and React Hook Form where forms require them |
| Icons | `lucide-react` or the repository-approved icon library |
| Formatting/utilities | Existing `src/lib/` and shared components |

```bash
npm run dev
npm run lint
npm run lint:fast
npm run typecheck
npm run build
```

Run `npm run typegen` after route-structure changes when Next.js requires route
type generation. Do not add a second package manager or lockfile.

## 3. Architecture and boundaries

```text
src/app/          routes, layouts, metadata, error boundaries, global CSS
src/features/     business domains; each feature owns its domain UI and logic
src/components/   reusable UI, design-system primitives, shared layout
src/providers/    client-side application providers
src/services/     API clients and external integrations
src/config/       safe runtime configuration and static app configuration
src/hooks/        reusable hooks that are not owned by one feature
src/lib/          pure utilities and cross-cutting helpers
src/types/        shared transport and domain types
src/assets/       imported static assets
```

Rules:

- `src/app` is a routing/composition boundary, not a dumping ground for
  domain logic or generic components.
- Server Components are the default. Add `"use client"` only for state,
  browser APIs, event handlers, client context, or client-only libraries.
- A feature may import shared layers, but shared layers must not import a
  feature. Features should not import another feature's private files.
- Pages compose hooks/services/components; they should not contain large API
  clients or business rules.
- Components render and coordinate UI. API calls belong in services, and
  server-state behavior belongs in hooks/providers.
- `NEXT_PUBLIC_*` values are browser-visible. Secrets must never use them.
- Keep API response and error normalization centralized; do not create one-off
  interceptors or fetch wrappers inside components.

## 4. Routing and data flow

Use Next App Router conventions: `page.tsx`, `layout.tsx`, `loading.tsx`,
`error.tsx`, `not-found.tsx`, route groups, and dynamic segments where useful.
Prefer server-side data loading for public/non-interactive data. Use a service
and TanStack Query for interactive client state, caching, mutations, or
invalidation.

```text
route/page → feature component → feature hook → service/API client → lms-cn-api
```

Components must not call Axios, `fetch`, or external services directly unless
the repository guide explicitly documents the exception.

## 5. Design system and UX

Before changing UI, read `docs/DESIGN.md`. The required direction is calm,
minimal, structured, enterprise, premium, and academically trustworthy.

- Use design tokens for color, typography, spacing, radius, elevation, and
  motion. No hardcoded hex/RGB colors or arbitrary visual values in product
  components.
- Use shared primitives for buttons, fields, dialogs, badges, tables, tabs,
  alerts, skeletons, and empty states. Extend a primitive only when the new
  behavior is reusable and documented.
- Avoid decorative gradients, glow, glassmorphism, oversized cards, excessive
  shadows, emoji icons, noisy animation, and generic SaaS decoration.
- Use a consistent 4-based spacing scale and no more than four typography
  levels per screen.
- Every relevant view considers loading, empty, actionable error, success,
  disabled, and permission states.
- Forms need visible labels, keyboard focus, validation feedback, and clear
  submitting behavior. Meet WCAG AA contrast and prevent horizontal overflow.

## 6. Security and sensitive data

Student identity, exam content, answers, scores, and results are sensitive.
Do not log them, put them in URLs, expose them to public metadata, or persist
them in browser storage without an explicit security decision. Frontend guards
are UX only; the API must enforce authentication and authorization.

## 7. Naming and code conventions

- Components and component files: `PascalCase` when they export a component.
- Hooks: `useSomething.ts`.
- Services: `<domain>.service.ts`; API client code stays centralized.
- Utilities/config/types: `camelCase` or descriptive lowercase names.
- Types and interfaces: descriptive `PascalCase`; avoid `any`.
- Prefer named exports for reusable modules. Keep barrel exports intentional.
- Keep functions focused and avoid hidden side effects in pure utilities.
- Use Indonesian user-facing messages unless product copy explicitly requires
  another language; keep code identifiers and technical docs in English.

## 8. Do not touch without explicit need

- Do not remove the generated Next.js instruction block at the top of this file.
- Do not add a Pages Router route or revive Vite/React Router configuration.
- Do not bypass the centralized API client, design tokens, or shared UI layer.
- Do not add business features to the foundation scaffold as a side effect.
- Do not commit or push.

## 9. Frontend handoff checklist

- [ ] Relevant architecture/design docs were read.
- [ ] Server/Client Component boundary is intentional.
- [ ] Data access uses the service/API layer.
- [ ] Shared components and design tokens are reused.
- [ ] Loading, empty, error, success, disabled, and permission states exist where relevant.
- [ ] Accessibility and responsive behavior were checked.
- [ ] `npm run lint` is clean.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] No commit or push was performed.

# Citra Negara LMS Web

The complete frontend guidance is in [AGENTS.md](./AGENTS.md).

@AGENTS.md

Important references:

- Workspace rules: [../AGENTS.md](../AGENTS.md)
- Architecture: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- UI/UX rules: [docs/DESIGN.md](./docs/DESIGN.md)
- Workflow: [../docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md)

Summary:

- Next.js 16 App Router + React 19 + TypeScript.
- Server Components by default; client components only when required.
- Feature-based modules with centralized services and shared design primitives.
- Citra Negara LMS scope only; no speculative SaaS or superadmin platform.
- Do not hardcode design values or call APIs directly from components.
- Before handoff: lint, typecheck, build. Never commit or push.

# Citra Negara LMS Web

Frontend application for Citra Negara LMS, built with Next.js App Router.

The application implements role-aware authentication and workflows for
academic administration, examinations, grading and results, monitoring,
materials, assignments, and role dashboards. Next routes and route-level
boundaries live under `src/app`; product UI and state are organized by domain
under `src/features`.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for dependency rules,
server/client component boundaries, and the implemented feature structure.
See [../docs/IMPLEMENTATION_STATUS.md](../docs/IMPLEMENTATION_STATUS.md) for
scope status and the external gates that still block production certification.

## Verification

Install dependencies with `npm ci`, then run `npm run lint`,
`npm run typecheck`, and `npm run build`. Install Chromium once with
`npm run test:e2e:install` before running the browser suite.

On Windows, keep `npm run dev` running in one terminal and run
`npm run test:e2e` in another. On CI and other local platforms, Playwright
starts the appropriate Next.js server automatically. E2E tests use synthetic
API responses and do not access student or production data.

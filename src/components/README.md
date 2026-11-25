# Shared components

Reusable, business-agnostic UI components belong here. Components that serve
only one domain belong inside that domain's `features/<domain>/components`.
Use client components only when their behavior requires browser APIs or events.

The protected application shell and role-aware navigation also live here.
Shell-level role checks only control navigation and presentation; they never
replace API authorization. Shared colors, typography, spacing, focus, and
responsive rules are owned by [`docs/DESIGN.md`](../../docs/DESIGN.md).

Shared patterns:

- `PageHeader`: one page heading, concise context, and a primary action.
- `FilterBar`: responsive visible labels and controls; filters and queries stay
  feature-owned.
- `FormDialog`: Base UI modal for add/edit forms, with a context icon, a pinned
  action footer, contained body scrolling, keyboard dismissal, and an explicit
  close control. The owning feature retains draft state and decides when to
  close after save.
- `ConfirmationDialog`: Base UI dialog for consequential actions, with cancel
  focus and pending behavior. Use `AsyncFeedback` for mutation errors so they
  share the accessible `ErrorDialog` presentation.
- `ErrorDialog`: shared modal presentation for action failures. It uses the
  confirmation dialog surface and semantic danger colors.
- `MetricGrid`: grid and horizontal strip presentations of real metrics.
- `ActionButton` / `ActionLink`: compact row controls with a required accessible
  label, Lucide icon, focus/hover tooltip, and button pending state. Action
  buttons support semantic neutral, info, success, and danger tones. Tooltips
  share the Base UI provider in `AppProviders`.
- `ui/skeleton` and `ui/skeleton-patterns`: accessible loading regions, table
  placeholders, and repeated content layouts. Prefer a feature-specific
  composition that preserves the loaded section's geometry over a generic
  loading list. A single shimmer runs per region and is disabled for reduced
  motion.

Prefer the smallest shared primitive that represents a real repeated pattern.
Keep domain filters, business actions, API calls, permissions, and route
decisions in their owning feature.

Do not put API calls, role decisions, grading rules, or task routing in these
shared patterns. Keep those responsibilities in their owning features.

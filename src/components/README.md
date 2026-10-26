# Shared components

Reusable, business-agnostic UI components belong here. Components that serve
only one domain belong inside that domain's `features/<domain>/components`.
Use client components only when their behavior requires browser APIs or events.

Shared patterns:

- `PageHeader`: one page heading, concise context, and a primary action.
- `FilterBar`: responsive visible labels and controls; filters and queries stay
  feature-owned.
- `EditorPanel`: an inline surface for authoring, with focus entry/restoration.
  The owning feature retains draft state and decides when to close after save.
  Use `${id}-trigger` on its opener so focus can return after a disabled opener
  is re-enabled on close.
- `ConfirmationDialog`: Base UI dialog for consequential actions, with cancel
  focus, pending behavior, and a slot for inline failure feedback.
- `MetricGrid`: grid and horizontal strip presentations of real metrics.
- `ActionButton` / `ActionLink`: compact row controls with a required accessible
  label, Lucide icon, focus/hover tooltip, and button pending state. Tooltips
  share the Base UI provider in `AppProviders`.
- `LoadingState`: content-shaped loading rows, with reduced-motion support.

Do not put API calls, role decisions, grading rules, or task routing in these
shared patterns. Keep those responsibilities in their owning features.

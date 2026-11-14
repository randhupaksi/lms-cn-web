# Shared Hooks

Only reusable, business-agnostic React hooks belong here. Examples include
browser capability, generic focus/keyboard behavior, or reusable presentation
state when more than one feature needs the same contract.

Hooks that query or mutate a domain stay inside that feature so cache keys,
service contracts, request parameters, and invalidation behavior have one owner.
Do not make a shared hook depend on a feature or turn it into a generic API
wrapper. See the [frontend architecture](../../docs/ARCHITECTURE.md).

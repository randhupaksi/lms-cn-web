# Design System — Citra Negara LMS Web

This is the source of truth for the LMS visual language. Read it before
designing or changing a component, page, layout, or interaction.

## 1. Design direction

Citra Negara LMS should feel calm, minimal, structured, premium, and
academically trustworthy. Premium quality comes from hierarchy, alignment,
typography, spacing, consistency, accessibility, and reliable feedback—not from
decoration.

Reference qualities: Linear and Vercel for clarity, Stripe Dashboard for
information hierarchy, Notion for calm density, and serious academic portals
for trust and focus.

The interface is a work tool for students, teachers, and administrators. It
must reduce cognitive load during preparation and examination, not compete for
attention.

## 2. Design tokens are mandatory

All product UI values must come from the shared token layer in
`src/app/globals.css` or an approved component token abstraction.

Token families:

- brand and interactive primary;
- neutral canvas, surfaces, and borders;
- text hierarchy and inverse text;
- semantic success, warning, danger, and information;
- typography and line heights;
- spacing based on 4/8/12/16/24/32/48;
- radius and elevation;
- focus, motion, and breakpoint values.

If a value is missing, add a named token first and document why. Never place
raw hex, RGB, arbitrary colors, random spacing, or one-off shadows in product
components or page JSX.

## 3. Visual rules

- Use a restrained palette: one primary brand color, neutral surfaces, and
  semantic colors only for meaning.
- Use borders and surface contrast for hierarchy; keep shadows subtle and
  limited to a small approved scale.
- Keep content aligned to a clear grid. Do not center everything.
- Cards group related content or actions; do not wrap every small element in a
  card.
- Keep one clear primary action per context. Secondary actions should not
  visually compete with it.
- Use no more than four typography levels on one screen. Prefer semibold over
  excessive bold and avoid display typography inside dense workflows.
- Icons come from the approved icon library and always have an accessible
  label when the action is icon-only. Never use emoji as interface icons.
- Motion is short and functional: color, opacity, border, or small transforms;
  respect `prefers-reduced-motion`.

## 4. Product areas

### Student examination flow

Prioritize focus, readability, timer visibility, progress, keyboard usability,
and prevention of accidental loss. Keep the question area dominant and remove
non-essential decoration. Confirmation is required for destructive or final
submission actions.

### Teacher/admin workspaces

Use calm, information-dense layouts with clear filters, tables, forms, and
status indicators. Keep actions near the data they affect. Use sticky headers,
consistent pagination, truncation with accessible detail, and right-aligned
quantitative values.

### Authentication and public entry points

Use clear hierarchy, concise copy, visible errors, and a single obvious next
action. Do not make security-critical messages ambiguous or overly decorative.

## 5. Required states

Every data-driven view must design the states relevant to its context:

- loading: skeleton that matches the eventual content shape;
- empty: explanation plus useful next action, not a blank table/card;
- error: friendly Indonesian message and retry/recovery action;
- success: clear content and confirmation after mutations;
- disabled/submitting: preserve context and explain what is happening;
- permission/locked: explain why content/action is unavailable without leaking
  sensitive details.

Do not use a centered spinner as the only loading design for a full page.

## 6. Accessibility and responsive behavior

- Meet WCAG AA contrast.
- Every input has a visible label or an equivalent accessible name.
- Focus states are visible and consistent.
- Keyboard users can complete important flows, including examination actions.
- Status is communicated with text or icon plus color, never color alone.
- Touch targets are comfortable on mobile.
- Test at approximately 360px, tablet, laptop, and wide desktop widths.
- The page body must not create horizontal scrolling.
- Use semantic landmarks and a logical heading order.

## 7. Component discipline

Shared primitives belong in `src/components/`. Feature-specific compositions
belong in `src/features/<feature>/`. Do not duplicate buttons, fields, dialogs,
badges, tables, pagination, toasts, skeletons, or empty states.

Before adding a component, answer:

1. Is it truly reusable across two or more contexts?
2. Does an existing primitive already solve it?
3. Which token and states does it use?
4. How will it remain accessible?

## 8. Visual review checklist

- [ ] Values come from tokens; no raw visual values in JSX.
- [ ] No decorative gradient, glow, glassmorphism, or excessive shadow.
- [ ] Layout has clear hierarchy and alignment.
- [ ] Primary action is obvious and not duplicated.
- [ ] Typography is restrained and readable.
- [ ] Existing shared primitives are reused.
- [ ] Relevant loading, empty, error, success, disabled, and permission states exist.
- [ ] Keyboard focus, labels, contrast, and responsive layout are acceptable.

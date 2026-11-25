# Design System — Citra Negara LMS Web

See the [frontend documentation index](INDEX.md) for architecture and source
ownership links. This document is the canonical owner of visual and
interaction decisions.

This is the source of truth for the LMS visual language. Read it before
designing or changing a component, page, layout, or interaction.

## 1. Design direction

The LMS combines a dependable enterprise workspace with an expressive academic
identity. Warm paper surfaces and evergreen structure carry the everyday work;
editorial labels, fine rules, deliberate spacing, and restrained role accents
give each area character without obscuring tasks or status. Reserve dark green
surfaces for the dashboard welcome and high-level governance orientation.

The LMS has its own academic identity within the Citra Negara product family.
Keep the school name and role language visible while letting learning,
assessment, and school operations shape the page composition. Reference
qualities: academic registers and editorial publications for hierarchy and
spacing, Linear for clear work hierarchy, and serious academic portals for
trust and focus. Adapt their principles without copying their brands or layouts.

### Role and task compositions

Role compositions share evergreen, paper, and leaf-green token roles. Each
workspace may use one restrained supporting accent for orientation: teal for
curriculum and school leadership, blue for teaching, leaf for student learning,
and violet for school-wide administration. Status and chart colors keep their
own semantic meaning. Variation also comes from each role's work order, useful
density, and emphasis.

Every dashboard opens with the role-specific welcome, then shows KPI cards,
role-specific charts and analysis, and finally its action, notification, or
quick-action sections. The welcome uses a compact deep evergreen surface, a
lime identity accent, role-specific context, and a direct workspace action.
Refresh is a compact secondary icon action. KPI groups have their own heading
and a neutral bordered register; keep values tabular and use the role accent
only for small orientation cues. Support panels use paper and white surfaces
with clear rules rather than a stack of floating cards.

- Admin: KPI register, 14-day collection chart and exam lifecycle distribution,
  then operational priorities and quick actions.
- School superadmin: compact command header and accented KPI register,
  followed by school-wide exam-cycle segments, decision/quality priorities,
  upcoming exams, published exam schedules, and role ledger. Dedicated
  workspaces use an index/detail decision comparison, numbered quality groups,
  read-only month calendar and exam list, aggregate report table, settings form
  with live preview/history, and
  account/session inspector.
  Reuse shared tokens and controls while varying composition by responsibility.
  All role decisions remain authoritative in the API. Result publication stays
  visible to teachers only. The school profile provider displays the saved
  school name and login support information; metadata retains Citra Negara.
- Teacher: compact teaching KPIs and course-scoped activity/exam lifecycle
  charts, then assessment queue beside quick-action rows.
  Authoring starts from the collection; long forms open in a Base UI form dialog
  with a focused title, contained scrolling, and an explicit close control.
- Student: compact learning KPIs, personal activity, material completion,
  assignment status, and published result bars, then next actions beside
  learning shortcuts. A zero-material denominator shows a dash, not an invented
  rate.
- Materials: a selectable index and one reading surface, with inline previews
  for attached images and protected downloads for supported documents. On
  narrower screens, the index precedes the reader; selecting a material focuses
  its heading.
- Operational comparisons: tables for exams and results; continuous record
  lists for questions, materials, and assignments. Data tables retain common
  density while emphasizing the scan task: identities and selected records for
  access, numeric alignment for grades, time and action for audit, and warning
  context for exam readiness. Omit table-section title/filter toolbars; keep
  independent task-level filters, column headings, and accessible captions.
- Examination: a dedicated shell, sticky time/progress toolbar, readable
  question area, and question navigation. Starting and final submission use
  the shared confirmation dialog; the server remains authoritative for time,
  saves, and finalization.

Do not add simulated trends, percentages, or aggregated statistics from one
page of results. Dashboard metrics come from the summary and insights contracts.
The chart endpoint aggregates complete server-side data in WIB. A separate
failure state prevents missing chart data from becoming fabricated zero values.
Day columns expose keyboard/hover tooltips and an expandable data table;
donut charts retain labeled category counts. Chart geometry may use numeric
inline values derived from API data; colors and dimensions remain token-based.
Selection counts in exam configuration describe the current local selection.
An unavailable collection count is shown as a dash until data arrives.

The interface is a work tool for students, teachers, and administrators. It
must reduce cognitive load during preparation and examination, not compete for
attention.

## 2. Design tokens are mandatory

All product UI values must come from the shared token layer in
`src/app/globals.css` or an approved component token abstraction.

Token families:

- evergreen navigation and interactive primary;
- restrained leaf-green school-identity accent;
- neutral canvas, surfaces, and borders;
- text hierarchy and inverse text;
- semantic success, warning, danger, and information;
- typography and line heights;
- spacing based on 4/8/12/16/24/32/48;
- radius and elevation;
- focus, motion, and breakpoint values.

The current light palette uses a warm near-white canvas
`--background: 48 38% 97%`, forest ink `--foreground: 160 28% 13%`, vivid
evergreen action `--primary: 153 62% 27%`, soft sage `--primary-soft: 145 45% 91%`,
lime identity detail `--brand-accent: 82 75% 52%`, and deep forest
navigation `--sidebar-end: 158 58% 11%`. Supporting role accents use the named
`--accent-teal`, `--accent-blue`, `--accent-leaf`, and `--accent-violet` token
families. Their soft variants are for low-emphasis surfaces and icon tiles.
Role accents stay within small role-orientation cues and role-specific
analytics. Shared form states, generic hover/focus feedback, page-heading
eyebrows and icons, and brand marks use evergreen or identity tokens across
roles. Semantic success, warning, danger, information, and chart roles remain
separate from identity and role accents.

Typography uses the system `--font-sans` stack (`Segoe UI Variable`, `Segoe UI`,
Inter, and standard platform fallbacks). `--font-display` aliases the same
stack, so welcome headings, page titles, metrics, navigation, and body copy
share a legible enterprise sans-serif. Do not add a separate decorative serif
face or a remote font dependency for dashboard headings.

Composition tokens also define sidebar/content widths, control height,
reading width, confirmation and form dialog widths, and examination
toolbar/rail dimensions. Ordinary
controls use the small radius; larger radii are reserved for workspaces.
Shadows are reserved mainly for overlays. Semantic warning, information, and
secondary text colors must remain readable on their matching soft surfaces.

If a value is missing, add a named token first and document why. Never place
raw hex, RGB, arbitrary colors, random spacing, or one-off shadows in product
components or page JSX.

## 3. Visual rules

- Use evergreen for primary actions, navigation, shared interaction feedback,
  and page-heading accents. Use paper and white surfaces over the warm canvas
  for work areas, and apply role accents only to small role-orientation cues
  and role-specific analytics. Keep status and chart colors semantic.
- Keep scrollbars clearly visible: use a strong evergreen thumb on a sage track
  and the leaf accent at full opacity within the dark sidebar.
- Keep routine surfaces flat with clear borders and surface contrast. Shadows
  are mainly for overlays. Avoid gradients and decorative glow in workspaces;
  use the dashboard welcome and governance command header for concentrated
  evergreen color.
- Keep content aligned to a clear grid. Do not center everything.
- Page headers do not add a divider; the content section below owns its
  boundary, avoiding two closely spaced rules.
- Cards group related content or actions; do not wrap every small element in a
  card.
- Keep one clear primary action per context. Secondary actions should not
  visually compete with it.
- Use no more than four typography levels on one screen. Prefer semibold over
  excessive bold and avoid display typography inside dense workflows.
- Use the shared sans-serif family for headings, metrics, navigation, and body
  text. Distinguish hierarchy with size, weight, and spacing.
- Icons come from the approved icon library and always have an accessible
  label when the action is icon-only. Never use emoji as interface icons.
- Repeated row actions use compact `ActionButton`/`ActionLink` controls with
  relevant icons, stable accessible names, and Base UI tooltips on focus/hover.
  Keep primary form and page actions explicit. Pending row actions are disabled
  and show progress without changing their accessible purpose.
- Motion is short and functional: color, opacity, border, or small transforms.
  Form controls use a gentle 260ms focus/hover transition. All motion respects
  `prefers-reduced-motion`.

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

Use the evergreen academic panel to orient users to the actual material, task,
and evaluation journey. Keep the sign-in form on a warm paper surface, with
clear hierarchy, concise copy, visible errors, and one obvious next action. Do
not make security-critical messages ambiguous or overly decorative.

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
- The navigation toggle opens and closes the sidebar on mobile and collapses
  or expands it on desktop. A closed mobile sidebar is hidden from keyboard
  navigation. Opening it traps focus; closing it restores focus. Resizing to
  desktop releases the focus trap.
- Confirmation dialogs use Base UI's focus trap and restoration, put initial
  focus on cancel, and stay open while their mutation is pending.
- Status is communicated with text or icon plus color, never color alone.
- Touch targets are comfortable on mobile.
- Test at approximately 360px, tablet, laptop, and wide desktop widths.
- The page body must not create horizontal scrolling.
- Use semantic landmarks and a logical heading order.
- Give each workspace a descriptive Next.js route title so browser tabs and
  route announcements identify the current task.
- Use the shared `DataTable` with a descriptive caption. Its viewport enters
  the tab order and shows a scroll hint only when its columns overflow.
- Use a soft blue-gray control border on fields. Keep the keyboard focus ring
  separate and high contrast, and associate field errors with their inputs.
- Exam navigation uses a check mark and an accessible name for answered
  questions. The timer announces the five-minute and one-minute thresholds
  and expiry without announcing every second.

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
- [ ] Routine work surfaces stay flat; expressive color is concentrated in the
      dashboard welcome or governance command header.
- [ ] Layout has clear hierarchy and alignment.
- [ ] Primary action is obvious and not duplicated.
- [ ] Typography is restrained and readable.
- [ ] Existing shared primitives are reused.
- [ ] Relevant loading, empty, error, success, disabled, and permission states exist.
- [ ] Keyboard focus, labels, contrast, and responsive layout are acceptable.

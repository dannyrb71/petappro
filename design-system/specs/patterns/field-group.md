# Field Group

> Layer: `patterns`
> Status: `in-review`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny

## Objective
A responsive group of Field atoms with consistent spacing and a shared section label — the building block of every form.

## Requirements
Reference **semantic tokens**; compose the Field atom + Section Header.

- **Anatomy:** optional Section Header · one or more Fields laid out in a responsive grid · optional group-level hint/error.
- **Grid:** `auto-fit, minmax(280px, 1fr)` (280px governed exception), gap `spacing.primitive.4`; single column below `breakpoint.sm` (640).
- **Full-width members:** a Field may span all columns (e.g. textarea).
- **Spacing:** vertical rhythm between groups `spacing.semantic.section-gap`.
- **RN compatibility:** props `title?`, `columns` (auto|1|2), `children` (Fields), `hint?`, `error?`.

## Acceptance Criteria
- [ ] Tokens only; spacing from scale (no arbitrary gaps).
- [ ] Collapses to one column below `sm`.
- [ ] Group error/hint distinct from per-field error.

## Documentation
- **Purpose:** compose fields into coherent form sections.
- **Usage:** onboarding, booking, profile, pricing editor.
- **When NOT to use:** a single field (use Field directly).
- **Accessibility:** group has an accessible name via the Section Header; error announced.
- **Dev notes:** pure layout wrapper around Field; no new visual tokens.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |

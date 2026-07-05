# Section Header

> Layer: `patterns`
> Status: `in-review`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny

## Objective
The single header for every card/section: an ALL-CAPS label, an optional count, and an optional right-aligned action slot. Replaces all ad-hoc section titles.

## Requirements
Reference **semantic tokens**; compose atoms.

- **Anatomy:** `title` (label) · optional `count` badge (immediately after the title) · optional `action` slot (right-aligned — any atom: Button, Status Badge, toggle).
- **Title:** `typography.semantic.label` (mono, uppercase, 0.14em), `color.semantic.text.default`.
- **Count:** small pill, `color.semantic.action.primary.container` bg / `color.semantic.action.primary.on-container` text; sits right after the title, not far-right.
- **Layout:** flex row, space-between, `spacing.primitive.3` gap, wrap; bottom margin `spacing.primitive.3`.
- **Heading level:** `as` = h2 | h3 (default) | h4.
- **RN compatibility:** props `title`, `count?`, `action?` (slot), `as`.

## Acceptance Criteria
- [ ] Tokens only; label uses the label type token.
- [ ] Count renders adjacent to the title; action right-aligned and vertically centered.
- [ ] Action slot accepts any atom without style overrides.

## Documentation
- **Purpose:** consistent titling for cards/sections.
- **Usage:** top of every card/section; use count for collections; action for a primary section control.
- **When NOT to use:** page titles (use the page header template).
- **Accessibility:** real heading element; count included in the accessible name where meaningful.
- **Dev notes:** replaces the app's `SectionHeader`; action is `children`/slot.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |

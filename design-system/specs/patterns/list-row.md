# List Row / Tile

> Layer: `patterns`
> Status: `in-review`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny

## Objective
A horizontal row: leading media, a title/subtitle block, and a trailing slot. The base for service lists, bookings lists, and settings rows.

## Requirements
Reference **semantic tokens**; compose atoms.

- **Anatomy:** `leading` (Icon in a tinted square, or Avatar) · `body` (title + optional subtitle) · `trailing` slot (Status Badge, Money, chevron Icon, Switch…).
- **Colors:** container `color.semantic.surface.bright`; title `color.semantic.text.default` (body type, semibold); subtitle `typography.semantic.body-sm`, `color.semantic.text.variant`.
- **Leading square:** 40×40 (governed exception), `radius.semantic.input`, bg `color.semantic.action.secondary.container`, Icon `color.semantic.text.accent`.
- **Layout:** flex row, `spacing.primitive.3` gap, padding `spacing.primitive.4`; dividers `color.semantic.border.variant` between stacked rows.
- **Clickable variant:** hover bg `color.semantic.surface.container`; pressed scale `motion.semantic.press-scale`; focus ring `color.semantic.focus-ring`.
- **Shape (as tile):** radius `radius.semantic.tile` when standalone.
- **RN compatibility:** props `leading` (icon|avatar), `title`, `subtitle?`, `trailing?` (slot), `clickable`, `onPress`.

## Acceptance Criteria
- [ ] Tokens only; ≥ `size.min-touch-target` (44) row height; clickable rows expose pressed/focus state.
- [ ] Trailing slot accepts any atom without overrides.
- [ ] Divider vs standalone-tile treatments both supported.

## Documentation
- **Purpose:** scannable horizontal record.
- **Usage:** service lists, bookings, settings, household members.
- **When NOT to use:** rich multi-field records (use a domain card).
- **Accessibility:** clickable rows are buttons/links with an accessible name; trailing controls independently focusable.
- **Dev notes:** RN `Pressable` row; leading/trailing are slots.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |

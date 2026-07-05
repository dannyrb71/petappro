# Date Navigator

> Layer: `patterns`
> Status: `approved`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny

## Objective
Prev/next + date field with a conditional "Today" pill. Identical on the staff dashboard and daily schedule.

## Requirements
Reference **semantic tokens**; compose atoms.

- **Anatomy:** `‹` prev button · date input (Field, type=date) · `›` next button; below, a long-form date label with a conditional Today pill.
- **Nav buttons:** 38×38 (governed exception — compact nav glyph; padding meets the 44 touch target), circular (`radius.semantic.button`), `color.semantic.surface.bright` + `color.semantic.border.default`, glyph `color.semantic.text.default`. ≥ `size.min-touch-target` (44) effective via padding.
- **Long date:** `typography.semantic.title`, `color.semantic.text.default`.
- **Today pill:** shows ONLY when the selected date == today; `color.semantic.action.primary.container` bg / `color.semantic.action.primary.on-container` text; radius `radius.semantic.chip`.
- **Layout:** column, center-aligned; row gap `spacing.primitive.2`.
- **RN compatibility:** props `date`, `todayStr`, `onChange`, `onPrev`, `onNext`.

## Acceptance Criteria
- [ ] No undeclared literal values (exceptions named); nav targets ≥ `size.min-touch-target` (44) effective.
- [ ] Today pill appears only on the actual today.
- [ ] Prev/next adjust by one day; date field editable directly.

## Documentation
- **Purpose:** move a day-scoped view forward/back.
- **Usage:** dashboard + daily schedule headers.
- **When NOT to use:** ranges/date-range pickers (separate control).
- **Accessibility:** nav buttons have aria-labels ("Previous day"/"Next day"); date input labeled.
- **Dev notes:** replaces the app's `DateNavigator`; date math is local-time safe.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |

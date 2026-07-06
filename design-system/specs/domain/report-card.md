# Report Card (Metric Tile)

> Layer: `domain`
> Status: `approved`
> Version: `0.1.1`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny
> Concept: a single dashboard/report metric with value, context, and optional drill-in.

## Objective
Present one KPI consistently — value, label, optional delta vs a prior period, and an optional click-through.

## Requirements
Reference **semantic + domain tokens**.

- **Anatomy:** label (Section Header label style) · big value · optional delta (▲/▼ + %) · optional sublabel/period · optional trailing Icon.
- **Value:** `typography.semantic.display` or `typography.semantic.headline`, `color.semantic.text.default`.
- **Delta:** up = `color.semantic.domain.notification.success.on`, down = `color.semantic.domain.notification.urgent.on`; direction shown by arrow + sign, not color alone.
- **Container:** `color.semantic.surface.bright`, radius `radius.semantic.card`, `elevation.semantic.card`, padding `spacing.semantic.card-padding`.
- **Clickable variant:** pressed bg `color.semantic.surface.container` + `elevation.semantic.raised` + `motion.semantic.press-scale`; focus ring.
- **RN compatibility:** props `label`, `value`, `delta?` (`{value, direction}`), `period?`, `icon?`, `onPress?`.

## Acceptance Criteria
- [ ] Tokens only; delta direction shown by arrow/sign + color (not color alone).
- [ ] Clickable tile meets `size.min-touch-target` (44) + focus/press states.
- [ ] Value uses a type token; no ad-hoc sizes.

## Documentation
- **Purpose:** one metric, consistently.
- **Usage:** staff dashboard, reports.
- **When NOT to use:** multi-series data (use a chart); non-metric content.
- **Accessibility:** value + label + delta in a single accessible name ("Revenue $2,340, up 12%"); clickable tile is a button.
- **Dev notes:** values/deltas from the reporting layer; component only presents.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |
| 0.1.1   | 2026-07-05 | Replace hover state language with pressed-only mobile interaction model. |

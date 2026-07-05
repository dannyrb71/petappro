# Booking Timeline

> Layer: `domain`
> Status: `approved`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny
> Concept: a stay's milestones — arrival → in-progress → departure.

## Objective
Show a booking's progression through its milestones with the current point clearly marked.

## Requirements
Reference **domain + semantic tokens**.

- **Milestones:** Meet & Greet (if required) → Arrival → Stay (in-progress) → Departure. Each = node + label + time.
- **Node states:** complete `color.semantic.domain.booking.completed.base`; current `color.semantic.domain.booking.in-progress.base` (filled + ring); upcoming `color.semantic.border.strong`.
- **Connectors:** line between nodes; completed segment `color.semantic.domain.booking.in-progress.base`, upcoming `color.semantic.border.variant`.
- **Labels:** `typography.semantic.body-sm`; times `color.semantic.text.variant`.
- **Orientation:** horizontal (wide) / vertical (narrow, stacks below `sm`).
- **RN compatibility:** props `milestones` (array of `{label, time, state}`), `orientation`.

## Acceptance Criteria
- [ ] Node/connector colors from `color.semantic.domain.booking.*` + `color.semantic.*`.
- [ ] Current milestone unambiguous beyond color (filled + ring).
- [ ] Responsive orientation switch.

## Documentation
- **Purpose:** communicate where a stay is in its lifecycle.
- **Usage:** booking detail, current-stay panel.
- **When NOT to use:** simple status (Status Badge).
- **Accessibility:** each milestone announces label + state ("Arrival, complete, 9:00 AM").
- **Dev notes:** states derived from the booking record + clock, not set by the view.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |

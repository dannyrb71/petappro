# Capacity Meter

> Layer: `domain`
> Status: `in-review`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny
> Concept: occupancy against a limit for a given day/service.

## Objective
Show how full a day/service is, with threshold-driven color so overbooking risk is obvious.

## Requirements
Reference **domain tokens** (theme-independent thresholds).

- **Anatomy:** label · bar (fill vs track) · count "used / limit" (e.g. "6 / 8").
- **Thresholds:** available (< ~70%) `color.semantic.domain.capacity.available.base`; limited (~70–99%) `color.semantic.domain.capacity.limited.base`; full (100%+) `color.semantic.domain.capacity.full.base`. Track `color.semantic.surface.container-high`.
- **Count text:** `typography.semantic.body-sm`, color matches the active threshold's base for emphasis.
- **Shape:** bar radius `radius.semantic.chip`.
- **RN compatibility:** props `used`, `limit`, `label?`.

## Acceptance Criteria
- [ ] Colors only from `color.semantic.domain.capacity.*`.
- [ ] Threshold state matches the used/limit ratio; also shown as numeric count (not color alone).
- [ ] Full/over-limit clearly distinct.

## Documentation
- **Purpose:** convey occupancy + overbooking risk.
- **Usage:** dashboard, calendar day, schedule header.
- **When NOT to use:** non-capacity progress (use a generic progress bar).
- **Accessibility:** count text is authoritative; bar is supplementary; state announced.
- **Dev notes:** threshold breakpoints in domain config; component just maps ratio→threshold.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |

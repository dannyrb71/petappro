# Medication Chip

> Layer: `domain`
> Status: `in-review`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny
> Concept: a medication a dog needs during its stay — drug, dose, schedule.

## Objective
Compactly convey a medication instruction so staff administer it correctly.

## Requirements
Reference **semantic tokens**.

- **Anatomy:** icon `pill` · med name · dose · schedule (e.g. "Apoquel · 16mg · 2×/day w/ food").
- **Skin:** `color.semantic.surface.container` bg, `color.semantic.text.body` text, `color.semantic.text.accent` icon; radius `radius.semantic.chip` (or `tile` when multi-line).
- **Emphasis:** med name semibold; dose/schedule `color.semantic.text.variant`.
- **Optional "critical" flag:** for time-sensitive meds → `color.semantic.domain.notification.urgent.base` accent + `triangle-alert`.
- **RN compatibility:** props `name`, `dose`, `schedule`, `withFood?`, `critical?`.

## Acceptance Criteria
- [ ] Tokens only; critical uses domain urgent, not a one-off color.
- [ ] Dose + schedule always shown together; never truncated to ambiguity.
- [ ] Critical conveyed by icon + text.

## Documentation
- **Purpose:** carry a medication instruction.
- **Usage:** pet profile, current-stay panel, staff schedule.
- **When NOT to use:** general care notes (free text) or vaccinations (Vaccination Badge).
- **Accessibility:** full instruction in the accessible name; critical stated in text.
- **Dev notes:** never abbreviate dose; schedule format from domain config.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |

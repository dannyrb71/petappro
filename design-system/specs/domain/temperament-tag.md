# Temperament Tag

> Layer: `domain`
> Status: `approved`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny
> Concept: a behavioral trait label for a dog.

## Objective
Tag a dog's temperament (e.g. friendly, shy, energetic, reactive) so staff scan care needs quickly, flagging caution traits without alarm.

## Requirements
Reference **semantic + domain tokens**.

- **Default traits:** neutral chip — `color.semantic.surface.container` bg, `color.semantic.text.body` text.
- **Caution traits** (e.g. reactive, resource-guarding): `color.semantic.domain.notification.warning.{container,on}` + icon `triangle-alert`.
- **Shape:** radius `radius.semantic.chip`; `typography.semantic.body-sm`.
- **Optional icon:** small leading Icon per trait (optional).
- **RN compatibility:** props `trait`, `tone` (`neutral|caution`), `icon?`.

## Acceptance Criteria
- [ ] Tokens only; caution uses domain warning, not a one-off color.
- [ ] Caution conveyed by icon + text, not color alone.
- [ ] One component; trait/tone are properties.

## Documentation
- **Purpose:** quick behavioral context.
- **Usage:** pet profile, care notes, staff handoff.
- **When NOT to use:** medical/vaccination info (Vaccination Badge / Medication Chip).
- **Accessibility:** trait name is the accessible label; caution tone reinforced in text.
- **Dev notes:** trait→tone mapping lives in domain config so caution traits are consistent.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |

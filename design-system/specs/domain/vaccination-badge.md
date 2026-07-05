# Vaccination Badge

> Layer: `domain`
> Status: `in-review`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny
> Concept: a dog's vaccination standing, with date-driven meaning.

## Objective
Communicate whether a required vaccination is current, expiring soon, or missing/expired — at a glance and truthfully.

## Requirements
Reference **domain tokens** (theme-independent).

- **States (date-driven):**
  - `current` — `color.semantic.domain.notification.success.{container,on}`, icon `shield-check`.
  - `expiring` — within a threshold window → `color.semantic.domain.notification.warning.{container,on}`, icon `clock`.
  - `missing` / `expired` — `color.semantic.domain.notification.urgent.{container,on}`, icon `triangle-alert`.
- **Content:** vaccine name + optional date (e.g. "Rabies · exp 08/26"); label `typography.semantic.label`.
- **Shape:** radius `radius.semantic.badge`; icon leading.
- **RN compatibility:** props `vaccine`, `status` (`current|expiring|missing`), `date?`.

## Acceptance Criteria
- [ ] Colors only from `color.semantic.domain.notification.*`; theme-independent.
- [ ] State derives from date logic, not set arbitrarily; never color alone (icon + text).
- [ ] Text ≥4.5:1 on container.

## Documentation
- **Purpose:** surface vaccination compliance.
- **Usage:** pet profile, booking eligibility, staff review.
- **When NOT to use:** general booking status (Status Badge).
- **Accessibility:** status in text ("expiring"), icon reinforces; date announced.
- **Dev notes:** thresholds (e.g. 30-day expiring window) defined in domain logic, not the component.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |

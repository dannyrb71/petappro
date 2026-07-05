# Client Risk Indicator

> Layer: `domain`
> Status: `in-review`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny
> Concept: a client's standing — outstanding balance, incomplete requirements, or blocks.

## Objective
Give staff an at-a-glance signal of client risk, with the reason available, never just a color.

## Requirements
Reference **domain tokens** (theme-independent).

- **Levels:** `none` (good standing) `color.semantic.domain.risk.none`; `watch` (incomplete M&G / minor flag) `color.semantic.domain.risk.watch`; `high` (outstanding balance / blocked) `color.semantic.domain.risk.high`.
- **Forms:** compact dot (in lists) and full chip (dot + reason text) for detail; chip bg uses the matching container tint.
- **Reason:** short text (e.g. "Balance $84", "M&G incomplete"); `typography.semantic.body-sm`.
- **Icon:** `watch`→`clock`, `high`→`triangle-alert`.
- **RN compatibility:** props `level` (`none|watch|high`), `reason?`, `form` (`dot|chip`).

## Acceptance Criteria
- [ ] Colors only from `color.semantic.domain.risk.*`.
- [ ] Level always accompanied by a reason (chip) or accessible label (dot) — never color alone.
- [ ] `none` is unobtrusive; `high` is prominent.

## Documentation
- **Purpose:** flag client risk for staff.
- **Usage:** clients list, household card, booking review.
- **When NOT to use:** payment status of a single booking (Status Badge `kind=payment`).
- **Accessibility:** dot has an accessible label with level + reason; not conveyed by color alone.
- **Dev notes:** level computed from balance + requirement flags in domain logic.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |

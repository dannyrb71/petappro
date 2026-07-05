# Status Badge

> Layer: `atoms`
> Status: `approved`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny

## Objective
The single source for lifecycle + payment status pills. Encodes state meaning through theme-independent domain tokens, never ad-hoc color.

## Requirements
Reference **semantic tokens only** (domain layer is theme-independent by design).

- **Kinds & statuses:**
  - `booking`: Upcoming, In Progress, Completed, Cancelled → `color.semantic.domain.booking.<status>.{container,on}`.
  - `payment`: Paid, Unpaid, Partial, Overridden → `color.semantic.domain.payment.<status>.{container,on}`.
- **Skin:** soft `.container` background + `.on` label (AA ≥4.5:1). Cancelled may add a subtle outline in `booking.cancelled.on`.
- **Never color alone:** each carries a text label (+ optional leading Icon/dot).
- **Shape:** radius `radius.semantic.badge` (fully rounded). Label `typography.semantic.label` at bold weight (size from the token). Padding `spacing.primitive.1`/`2`.
- **RN compatibility:** props `kind` (`booking|payment`), `status`, `label?` (defaults from status), `icon?`.

## Acceptance Criteria
- [ ] Colors only from `color.semantic.domain.booking.*` / `color.semantic.domain.payment.*`; theme-independent.
- [ ] Label always present; text ≥4.5:1 on its container.
- [ ] One component; status is a property (no per-status forks).

## Documentation
- **Purpose:** communicate a record's lifecycle/payment state at a glance.
- **Usage:** on booking cards, list rows, detail headers.
- **When NOT to use:** service/activity type (use Service Pill); free-form labels.
- **Accessibility:** meaning in the label text, not color; icon optional/decorative.
- **Dev notes:** replaces the app's inline `StatusBadge`; status→token map is the contract.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |

# Component Specs — index

Contracts for every component. Format: `Objective → Requirements → Acceptance Criteria → Documentation → Version history` (`_TEMPLATE.md`). Requirements reference **semantic/domain tokens only**. Status flows `draft → in-review → approved → built`; Codex reviews, Danny approves, Claude Code builds.

## Atoms (`atoms/`)
- `button` · `input-field` · `avatar` · `icon` · `money` · `status-badge` · `service-pill` · `switch`

## Patterns (`patterns/`)
- `section-header` · `date-navigator` · `field-group` · `list-row` · `pricing-row`

## Domain (`domain/`) — pet-care first-class citizens
- `booking-card` · `pet-avatar` · `multi-pet-avatar-stack` · `vaccination-badge` · `temperament-tag` · `medication-chip` · `booking-timeline` · `capacity-meter` · `client-risk-indicator` · `report-card`
- *(Payment Badge = Status Badge `kind=payment`; Service Pill = atom — not duplicated here.)*

## Notes for build
- **Token additions (resolved 2026-07-05 per Codex review):** `color.semantic.status.success-solid` (= `color.primitive.green.700`, AA-safe booking-green Button) and `color.semantic.text.on-solid` (= `color.primitive.white`, labels on solid fills) added to semantic; component dimensions now come from a `size.*` scale (control/icon/avatar/min-touch-target) + `breakpoint.*`, with genuine one-offs marked as governed exceptions. `risk.*` expanded to `.base/.container/.on`. No `comp.*` layer needed yet.
- Templates (`templates/`) come after these are approved: Dashboard · Booking · Profile · Schedule · Reports.

_All 23 specs: status `approved`, v0.1.0._

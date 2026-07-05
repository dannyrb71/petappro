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
- **Token additions flagged in specs** (author with the component layer): `color.semantic.success-solid` (= `green.700`, for the AA-safe booking-green Button); `comp.*` hooks (button height/label, etc.).
- Templates (`templates/`) come after these are approved: Dashboard · Booking · Profile · Schedule · Reports.

_All 23 specs: status `in-review`, v0.1.0._

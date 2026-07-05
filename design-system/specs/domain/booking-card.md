# Booking Card

> Layer: `domain`
> Status: `approved`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny
> Concept: a single reservation — its service, dates, pets, price, and lifecycle state.

## Objective
The canonical summary of one booking, used in lists and detail contexts. Encapsulates booking semantics so reservations look and read identically everywhere.

## Requirements
Reference **semantic + domain tokens**; compose atoms/patterns.

- **Anatomy:** header row (Service Pill(s) + Status Badge) · dates line (arrival → departure, nights/day count) · pets (Multi-pet Avatar Stack) · footer (Money total + optional action Button/chevron).
- **Container:** `color.semantic.surface.bright`, radius `radius.semantic.card`, `elevation.semantic.card`, padding `spacing.semantic.card-padding`, `size.stroke.hairline` `color.semantic.border.variant` border.
- **Status:** Status Badge (`kind=booking`) — theme-independent domain color.
- **Service:** Service Pill(s) for the booked service + add-ons.
- **Dates:** `typography.semantic.body-sm`, `color.semantic.text.variant`; icon `calendar-days`.
- **Price:** Money (`emphasis=strong`); struck when cancelled.
- **Clickable variant:** hover `elevation.semantic.raised`; pressed `motion.semantic.press-scale`; focus ring.
- **RN compatibility:** props `services` (array), `status`, `startDate`, `endDate`, `pets` (array), `total`, `cancelled?`, `action?`, `onPress?`.

## Acceptance Criteria
- [ ] All status/service colors from `color.semantic.domain.*` (theme-independent); brand chrome from `color.semantic.*`.
- [ ] Money always via the Money atom; cancelled strikes the amount.
- [ ] Composes Status Badge, Service Pill, Multi-pet Stack, Money — no re-implemented sub-parts.
- [ ] Clickable variant meets `size.min-touch-target` (44) + focus/press states.

## Documentation
- **Purpose:** represent one reservation.
- **Usage:** bookings lists, dashboard, profile, schedule.
- **When NOT to use:** a single service label (Service Pill) or bare status (Status Badge).
- **Accessibility:** the card is one labelled group; interactive card is a button/link; status/price in reading order.
- **Dev notes:** pure composition; dates/price come from the booking record + pricing engine.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |

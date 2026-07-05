# Service Pill

> Layer: `atoms`
> Status: `in-review`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny

## Objective
The single source for every service/activity tag, with a selectable variant for booking flows.

## Requirements
Reference **semantic tokens only** (service colors are theme-independent domain tokens).

- **Services:** Boarding, Daycare, Walk, In-home Sitting, Grooming, Training, Pickup/Dropoff, Meet & Greet → `color.semantic.domain.service.<name>`.
- **Skin (display):** solid fill = `service.<name>.base`, white label + leading Icon — EXCEPT **Meet & Greet**, the only OUTLINED pill (white/`surface.bright` bg, `service.meet-greet.base` stroke + text).
- **Selectable variant (booking flows):** `unselected` = outline `color.semantic.border.default` + `color.semantic.text.body`; `selected` = fill `color.semantic.action.primary.default` + `color.semantic.action.primary.on`.
- **Shape:** radius `radius.semantic.chip` (fully rounded). Height 22–28; icon = Icon atom.
- **RN compatibility:** props `service`, `label?`, `selectable` (bool), `selected` (bool), `icon`.

## Acceptance Criteria
- [ ] Colors only from `color.semantic.domain.service.*` (display) / `color.semantic.*` (selectable).
- [ ] Solid + outlined pills align on the same baseline/height.
- [ ] Meet & Greet is the sole outlined display case.
- [ ] One component; service is a property.

## Documentation
- **Purpose:** label/select a service or activity.
- **Usage:** display on cards/schedules; selectable in the booking form.
- **When NOT to use:** lifecycle/payment state (Status Badge); generic filters unrelated to services.
- **Accessibility:** selectable pills expose pressed/selected state to SR; solid-fill contrast AA for white label.
- **Dev notes:** replaces the app's inline `ServicePill`; service→token/icon map is the contract.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |

# Icon

> Layer: `atoms`
> Status: `in-review`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny

## Objective
One icon primitive and one curated set, so glyphs are consistent in weight, grid, and meaning across the platform.

## Requirements
- **Library:** Lucide. Stroke 1.9, round caps/joins, 24px design grid (governed exceptions — Lucide constants).
- **Sizes:** from `size.icon.{xs,sm,md,lg,xl}` (16/18/20/24/28); `lg` (24) default. Stroke stays optically consistent across sizes.
- **Color:** inherits `currentColor` by default; may be set to any `color.semantic.*` or `color.semantic.domain.*` role.
- **Curated set (semantic → glyph):**
  - navigation: home→`house`, bookings→`calendar-days`, pet→`dog`, menu→`menu`, search→`search`, alerts→`bell`, profile→`user-round`, settings→`settings`
  - services: boarding→`moon`, daycare→`sun`, walk→`footprints`, sitting→`house-plus`, grooming→`scissors`, training→`graduation-cap`, pickup→`car-front`, add-on→`bone`
  - status: verified→`shield-check`, confirmed→`circle-check-big`, locked→`lock`, pending→`clock`, meet-greet→`handshake`, booked→`calendar-check`, rules→`clipboard-list`, payment→`credit-card`
  - care: vaccination→`syringe`, vet→`stethoscope`, medication→`pill`, diet→`utensils`, photo→`camera`, location→`map-pin`, emergency→`triangle-alert`, notes→`notebook-pen`
  - actions: add→`plus`, next→`chevron-right`, edit→`pencil`, close→`x`, check→`check`, message→`message-circle`, rating→`star`, share→`share`

## Acceptance Criteria
- [ ] Single Icon component with `name` + `size` properties; no pasted ad-hoc SVGs elsewhere.
- [ ] Consistent stroke + grid; color via token, never literal.

## Documentation
- **Purpose:** the only way to render an icon.
- **Usage:** pick by semantic meaning from the map; keep to one weight.
- **When NOT to use:** as a standalone control without a label/aria-label.
- **Accessibility:** decorative icons `aria-hidden`; meaningful icons need an accessible name.
- **Dev notes:** RN via `lucide-react-native`; ship the curated subset as the app icon set.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |

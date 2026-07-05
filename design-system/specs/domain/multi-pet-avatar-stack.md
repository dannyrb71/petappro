# Multi-pet Avatar Stack

> Layer: `domain`
> Status: `in-review`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny
> Concept: a household's dogs shown compactly as overlapping avatars.

## Objective
Show multiple Pet Avatars in a small footprint with a clear overflow count.

## Requirements
Reference **semantic tokens**; compose the Pet Avatar.

- **Anatomy:** N overlapping Pet Avatars (left-to-right, later ones behind) + an optional `+N` overflow chip when count exceeds `max`.
- **Overlap:** each avatar offset ~40% of its size (intentional relative value; candidate for a dedicated overlap size token later); 2px `color.semantic.surface.bright` ring separates them (2px governed exception).
- **Overflow chip:** circular, `color.semantic.surface.container-high` bg / `color.semantic.text.variant` text, same diameter as the avatars.
- **Sizes:** inherit Avatar sizes; default `sm`/`md` in lists.
- **RN compatibility:** props `pets` (array), `size`, `max` (default 3).

## Acceptance Criteria
- [ ] Separator ring + overflow colors from tokens.
- [ ] `+N` accurately reflects hidden count; order stable.
- [ ] Composes Pet Avatar — no bespoke avatar drawing.

## Documentation
- **Purpose:** represent a multi-dog household compactly.
- **Usage:** booking cards, household rows, schedule entries.
- **When NOT to use:** a single dog (use Pet Avatar); full roster (use a list).
- **Accessibility:** accessible name lists all pets (e.g. "Biscuit, Momo, +2"); not conveyed by overlap alone.
- **Dev notes:** overlap via negative margin; ring = border in surface color.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |

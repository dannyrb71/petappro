# Pet Avatar

> Layer: `domain`
> Status: `approved`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny
> Concept: a dog's identity marker — photo, gender tint, puppy status.

## Objective
The Avatar atom, specialized for pets: gender-tinted ring, dog fallback glyph, and an optional puppy badge. Same behavior on client and staff surfaces.

## Requirements
Reference **domain + semantic tokens**; compose the Avatar atom.

- **Base:** Avatar with `ring=gender` (→ `color.semantic.domain.gender.male|female|unknown`), fallback glyph `dog`.
- **Puppy badge:** optional corner badge (paw), shown when age < 12mo; `color.semantic.action.secondary.container` bg / `color.semantic.action.secondary.on-container` text.
- **Name (optional, when labeled):** rendered in **`color.semantic.text.default` (neutral) — NOT the gender color.** Gender is carried by the ring/outline only (Danny 2026-07-11: name tint was too much).
- **Sizes:** inherit Avatar (`sm`–`xl`); `lg`/`xl` for profile, `sm`/`md` in stacks.
- **RN compatibility:** props `src`, `name`, `gender`, `isPuppy`, `size`, `showName?`.

## Acceptance Criteria
- [ ] Gender ring/outline from `color.semantic.domain.gender.*` only; **name text stays neutral (`text/default`)**.
- [ ] Puppy badge appears solely for age < 12mo.
- [ ] Extends Avatar via props — no forked component.

## Documentation
- **Purpose:** identify a dog consistently.
- **Usage:** profile, booking cards, stacks, schedule.
- **When NOT to use:** people (use Avatar).
- **Accessibility:** pet name/gender conveyed in text, not color alone; alt text on photo.
- **Dev notes:** thin wrapper over Avatar; gender→token map is the contract.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |

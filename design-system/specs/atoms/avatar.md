# Avatar

> Layer: `atoms`
> Status: `in-review`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny

## Objective
A circular identity token for people and (as a base) pets. The Pet Avatar and Multi-pet Stack domain components compose this — they do not fork it.

## Requirements
Reference **semantic tokens only**.

- **Content:** image; or fallback = monogram initials or a Lucide glyph (e.g. `dog`).
- **Sizes:** `xs` 24 · `sm` 32 · `md` 40 · `lg` 64 · `xl` 96. Fixed 1:1 ratio at every size.
- **Ring (optional):** `none` (default) · `brand` (`color.semantic.action.primary.default`) · `gender` (`color.semantic.domain.pet.male` / `color.semantic.domain.pet.female` / `color.semantic.domain.pet.unknown`). Ring 2px.
- **Fallback:** bg `color.semantic.surface.container-high`; monogram `color.semantic.text.variant`, `typography.semantic.body` weight bold.
- **Optional add-ons (off by default):** status dot (bottom-right) and a corner badge slot (e.g. puppy) — expose as boolean/slot.
- **Auto Layout / constraints:** image fills the circle; badge/dot pinned bottom-right.
- **RN compatibility:** props `src`, `name`, `size` (`xs|sm|md|lg|xl`), `ring` (`none|brand|gender`), `gender`, `statusDot`, `badge`.

## Acceptance Criteria
- [ ] No literal values (gender ring uses `color.semantic.domain.pet.*`).
- [ ] Fallback legible (AA) at every size; perfect circle, no distortion.
- [ ] Base atom stays generic — pet styling comes from `ring`/`badge` props, not a fork.

## Documentation
- **Purpose:** compact identity marker.
- **Usage:** lists, headers, stacks; pick size by density.
- **When NOT to use:** decorative imagery (use an image slot); logos (use the brand lockup).
- **Accessibility:** meaningful `alt`/`name`; ring/dot meaning conveyed by adjacent text, not color alone.
- **Dev notes:** RN `Image` + fallback view; ring via border; badge as absolutely-positioned child.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |

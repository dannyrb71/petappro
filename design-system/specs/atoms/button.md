# Button

> Layer: `atoms`
> Status: `in-review`
> Version: `0.1.0`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny

## Objective
The single interactive command control. One component covers every push action in the platform; the variant communicates intent, never ad-hoc color.

## Requirements
Reference **semantic tokens only**.

- **Variants:**
  - `primary` — fill `color.semantic.action.primary.default`, label `color.semantic.action.primary.on`; hover `…primary.hover`, pressed `…primary.pressed`.
  - `secondary` — fill `color.semantic.surface.bright`, 1px `color.semantic.border.default`, label `color.semantic.action.primary.default`; hover fill `color.semantic.surface.container`.
  - `tertiary` (ghost) — transparent fill, label `color.semantic.action.primary.default`; hover fill `color.semantic.action.primary.container`.
  - `destructive` — fill `color.semantic.domain.notification.urgent.base`, white label; use only for irreversible/removal actions.
  - `success` — booking-CREATION actions only (New/Create/Request Booking). Fill needs AA white text → **Tokens to add:** `color.semantic.success-solid` = `{color.primitive.green.700}` (green.500 fails white-text contrast). Label white.
- **Sizes (height):** `lg` 52 · `md` 44 (default) · `sm` 36 · `xs` 28. `md` is the standard tap target. **Tokens to add (with comp layer):** `comp.button.height.{lg,md,sm,xs}`.
- **Icon slots:** optional `leading` + `trailing` (Icon atom, Lucide). Icon sizes to the label; gap `spacing.primitive.2`.
- **States:** default, hover, pressed (scale `motion.semantic.press-scale`), focus-visible (3px ring from `color.semantic.focus-ring`, ≥3:1), disabled (`color.semantic.surface.container-high` fill / `color.semantic.text.faint` label), loading (spinner replaces label; width locked; control disabled).
- **Shape:** radius `radius.semantic.button` (fully rounded). Padding-x from `spacing.primitive.5` (`md`).
- **Type:** `typography.semantic.body` weight bumped to bold for the label. **Tokens to add:** `comp.button.label` (bold body) at build.
- **Motion:** hover/press transitions `motion.semantic.duration-fast` + `easing-standard`; honor reduced-motion.
- **Auto Layout:** horizontal, hug contents, center; padding from space tokens.
- **RN compatibility:** props `variant` (`primary|secondary|tertiary|destructive|success`), `size` (`lg|md|sm|xs`), `leadingIcon`, `trailingIcon`, `state` (`default|loading|disabled`), `label`.

## Acceptance Criteria
- [ ] No literal values; colors/radii/spacing/type from tokens (with the noted additions).
- [ ] No detached instances; all variants share tokens.
- [ ] WCAG 2.1 AA — every variant's label ≥4.5:1 on its fill; focus ring ≥3:1; `md` = 44px target.
- [ ] Loading state preserves button width (no layout shift).
- [ ] Properties minimal and RN-mapped; one reusable component (no per-variant copies).

## Documentation
- **Purpose:** the platform's push-action control.
- **Usage:** one primary per view/section; secondary/tertiary for lower-emphasis; success ONLY for booking creation; destructive ONLY for irreversible actions.
- **When NOT to use:** navigation between screens (use a link/tab); toggling state (use Switch); selecting from a set (use Service Pill / chip).
- **Variant descriptions:** see Requirements — intent-mapped.
- **Accessibility:** label always present (icon-only needs aria-label); visible focus ring; disabled is not focusable but announced.
- **Dev notes:** map 1:1 to an RN `Pressable` wrapper; `success-solid` + `comp.button.*` tokens land with the component layer.

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |

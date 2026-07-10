# Button

> Layer: `atoms`
> Status: `approved`
> Version: `0.1.2`  ·  Author: Claude Design  ·  Reviewer: Codex  ·  Approver: Danny

## Objective
The single interactive command control. One component covers every push action in the platform; the variant communicates intent, never ad-hoc color.

## Requirements
Reference **semantic tokens only**.

- **Variants:**
  - `primary` — fill `color.semantic.action.primary.default`, label `color.semantic.action.primary.on`; pressed `…primary.pressed`.
  - `secondary` — fill `color.semantic.surface.bright`, `size.stroke.hairline` `color.semantic.border.default` border, label `color.semantic.action.primary.default`; pressed fill `color.semantic.surface.container`.
  - `tertiary` (ghost) — transparent fill, label `color.semantic.action.primary.default`; pressed fill `color.semantic.action.primary.container`.
  - `destructive` — fill `color.semantic.domain.notification.urgent.base`, label `color.semantic.text.on-solid`; use only for irreversible/removal actions.
  - `success` — booking-CREATION actions only (New/Create/Request Booking). Fill `color.semantic.status.success-solid` (AA-safe solid green; the lighter success tint fails white-text contrast), label `color.semantic.text.on-solid`.
- **Sizes (height):** from `size.control.{lg,md,sm,xs}` (52/44/36/28). `md` (44) is the standard tap target.
- **Icon slots:** optional `leading` + `trailing` (Icon atom, Lucide). Icon sizes to the label; gap `spacing.primitive.2`.
- **States:** default, pressed (fill shifts to the pressed tone — `color.semantic.action.primary.pressed` (primary) · `color.semantic.action.primary.container` (tertiary) · `color.semantic.surface.container` (secondary) — **and raises with `elevation.semantic.raised`**, the shared press elevation also used by tappable List Row / Booking Card / Report Card; transition `motion.semantic.press-scale` + `motion.semantic.duration-fast`), focus-visible (`size.stroke.focus` ring from `color.semantic.focus-ring`, ≥3:1), disabled (`color.semantic.surface.container-high` fill / `color.semantic.text.faint` label), loading (spinner replaces label; width locked; control disabled).
- **Shape:** radius `radius.semantic.button` (fully rounded). Padding-x from `spacing.primitive.5` (`md`).
- **Type:** label = `typography.semantic.body` at bold weight.
- **Motion:** press transitions `motion.semantic.duration-fast` + `motion.semantic.easing-standard`; honor reduced-motion.
- **Auto Layout:** horizontal, hug contents, center; padding from space tokens.
- **RN compatibility:** props `variant` (`primary|secondary|tertiary|destructive|success`), `size` (`lg|md|sm|xs`), `leadingIcon`, `trailingIcon`, `state` (`default|loading|disabled`), `label`.

## Acceptance Criteria
- [ ] No literal values; colors/radii/spacing/type from tokens (with the noted additions).
- [ ] No detached instances; all variants share tokens.
- [ ] WCAG 2.1 AA — every variant's label ≥4.5:1 on its fill; focus ring ≥3:1; `md` = `size.min-touch-target` (44) target.
- [ ] Loading state preserves button width (no layout shift).
- [ ] Properties minimal and RN-mapped; one reusable component (no per-variant copies).

## Documentation
- **Purpose:** the platform's push-action control.
- **Usage:** one primary per view/section; secondary/tertiary for lower-emphasis; success ONLY for booking creation; destructive ONLY for irreversible actions.
- **When NOT to use:** navigation between screens (use a link/tab); toggling state (use Switch); selecting from a set (use Service Pill / chip).
- **Variant descriptions:** see Requirements — intent-mapped.
- **Accessibility:** label always present (icon-only needs aria-label); visible focus ring; disabled is not focusable but announced.
- **Dev notes:** map 1:1 to an RN `Pressable` wrapper; uses `status.success-solid` + `size.control.*` (no per-component tokens needed).

## Version history
| Version | Date | Change |
|---------|------|--------|
| 0.1.0   | 2026-07-05 | Initial spec. |
| 0.1.1   | 2026-07-05 | Replace hover state language with pressed-only mobile interaction model. |
| 0.1.2   | 2026-07-09 | Pressed state adds the shared `elevation.semantic.raised` treatment (soft raise) alongside the pressed fill — aligns Button press with tappable List Row / Booking Card / Report Card. Mobile press = subtle fill shift + raise; no hover. |

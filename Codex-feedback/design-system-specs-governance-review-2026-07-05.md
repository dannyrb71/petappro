# Design System Specs Governance Review

Date: 2026-07-05
Reviewer: Codex
Scope: `design-system/specs/`
Verdict: CHANGES-NEEDED

Note: This is a review-only governance handoff for Claude. Codex did not edit `design-system/` specs or tokens.

## Token Linter Output

Command run:

```sh
node design-system/tools/lint-tokens.mjs
```

Output:

```text
✓ tokens clean — 455 tokens across 12 file(s), 0 violations
  elevation.tokens.json
  motion.tokens.json
  color.tokens.json
  radius.tokens.json
  color.tokens.json
  spacing.tokens.json
  berry.tokens.json
  dusk.tokens.json
  harbor.tokens.json
  sage-sand.tokens.json
  terracotta.tokens.json
  typography.tokens.json

⚠ 5 governed exception(s):
    [R1] berry.tokens.json :: color.brand.focus-ring
      literal allowed by governed exception — reason: translucent focus ring; alpha overlay, no solid primitive equivalent
    [R1] dusk.tokens.json :: color.brand.focus-ring
      literal allowed by governed exception — reason: translucent focus ring; alpha overlay, no solid primitive equivalent
    [R1] harbor.tokens.json :: color.brand.focus-ring
      literal allowed by governed exception — reason: translucent focus ring; alpha overlay, no solid primitive equivalent
    [R1] sage-sand.tokens.json :: color.brand.focus-ring
      literal allowed by governed exception — reason: translucent focus ring; alpha overlay, no solid primitive equivalent
    [R1] terracotta.tokens.json :: color.brand.focus-ring
      literal allowed by governed exception — reason: translucent focus ring; alpha overlay, no solid primitive equivalent
```

## Blocker

- `design-system/specs/atoms/button.md:17`, `design-system/specs/atoms/button.md:18`, `design-system/specs/atoms/service-pill.md:14`: specs still use `white label` / `Label white`, which violates semantic-token-only requirements. Concrete fix: replace with existing semantic `*.on` roles or add approved semantic/domain `on-*` tokens before approval.

- `design-system/specs/domain/capacity-meter.md:15`: references `color.semantic.domain.capacity.available|limited|full`, but those are token groups, not leaf tokens. Concrete fix: specify `.base` for fill/count and `.container` for any tint.

- `design-system/specs/domain/client-risk-indicator.md:15`: calls for "matching container tint," but `color.semantic.domain.risk.*` only has scalar `none/watch/high` tokens, no `container` or `on` tokens. Concrete fix: add `risk.{none,watch,high}.{base,container,on}` tokens or restate the chip skin using existing semantic notification tokens.

- `design-system/specs/domain/medication-chip.md:17`: references `color.semantic.domain.notification.urgent` as a leaf, but only `.base/.container/.on` exist. Concrete fix: choose exact leaves for icon/text/background.

- Multiple specs embed fixed dimensions while acceptance says "No literal values": examples include `design-system/specs/atoms/avatar.md:14`, `design-system/specs/atoms/switch.md:17`, `design-system/specs/atoms/icon.md:11`, `design-system/specs/patterns/date-navigator.md:14`, `design-system/specs/patterns/field-group.md:14`, `design-system/specs/patterns/list-row.md:15`, `design-system/specs/domain/multi-pet-avatar-stack.md:15`. Concrete fix: introduce component/semantic size tokens, or explicitly mark rare non-token measurements as governed exceptions.

## Should-fix

- `design-system/specs/atoms/button.md:18`: `color.semantic.success-solid` is proposed outside the existing `color.semantic.domain.notification.success.*` and `color.semantic.status.*` structures. This adds naming complexity. Concrete fix: either add it under an existing semantic family with a clear rationale or use `domain.notification.success.base/on`.

- `design-system/specs/atoms/button.md:24`, `design-system/specs/atoms/switch.md:16`, `design-system/specs/atoms/input-field.md:22`: `easing-standard` is referenced without the full token path. Concrete fix: use `motion.semantic.easing-standard`.

- `design-system/specs/patterns/field-group.md:14`: breakpoint `sm (640)` is not backed by a breakpoint token, and breakpoints are called out in the charter's foundations. Concrete fix: add/use `breakpoint.semantic.sm`.

## Nit

- `design-system/specs/domain/report-card.md:15`: `or headline` should be the explicit token `typography.semantic.headline`.

## Standing Review

- Visually consistent: Mostly yes, once literal color and size issues are corrected.
- Accessible: Generally yes; the specs consistently avoid color-only meaning and call out labels/focus/touch targets. The fixed-size token gaps need cleanup before build.
- Avoids unnecessary complexity: Mostly yes, but `color.semantic.success-solid` and partial risk/capacity token structures add naming friction.
- Glad in six months: Yes if the token references are made exact before approval. The contracts are otherwise strong and compositional.

## Summary

The specs are in the right contract shape: Objective -> Requirements -> Acceptance Criteria -> Documentation -> Version history. Component composition is mostly clear, and domain components generally avoid one-off subparts.

Approval should wait until the blocker items are corrected.

Final verdict: CHANGES-NEEDED

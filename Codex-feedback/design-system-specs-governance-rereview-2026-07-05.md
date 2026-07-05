# Design System Specs Governance Re-review

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
✓ tokens clean — 481 tokens across 14 file(s), 0 violations
  breakpoint.tokens.json
  elevation.tokens.json
  motion.tokens.json
  color.tokens.json
  radius.tokens.json
  color.tokens.json
  size.tokens.json
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

None.

The prior token-path blockers are addressed: `size.*`, `breakpoint.*`, `color.semantic.text.on-solid`, `color.semantic.status.success-solid`, and `color.semantic.domain.risk.*.{base,container,on}` now exist and lint cleanly.

## Should-fix

- `design-system/specs/atoms/avatar.md:22`, `design-system/specs/atoms/input-field.md:26`, `design-system/specs/patterns/date-navigator.md:21`, `design-system/specs/patterns/field-group.md:20`, `design-system/specs/patterns/list-row.md:22`, `design-system/specs/atoms/switch.md:21`: acceptance criteria still say "No literal values" / "Tokens only" while the requirements now include governed literal exceptions. Concrete fix: change those criteria to "No undeclared literal values; all exceptions are named and reasoned."

- `design-system/specs/atoms/service-pill.md:14`: still says `white/ surface.bright bg`. Concrete fix: remove "white/" and reference only `color.semantic.surface.bright`.

- `design-system/specs/README.md:16`: notes use raw shorthand `green.700` and `white`. Concrete fix: use full token references or mark this as explanatory changelog text, not build guidance.

## Nit

- `design-system/specs/atoms/icon.md:11`: Lucide constants are fine as a governed exception, but the acceptance criteria should explicitly allow external-library constants.

- `design-system/specs/domain/multi-pet-avatar-stack.md:15`: `~40%` overlap is reasonable, but should say whether this is an intentional relative exception or a future `size.avatar-overlap` candidate.

## Standing Review

- Visually consistent: Yes, once the exception language is reconciled.
- Accessible: Yes. The specs consistently avoid color-only meaning and call out labels, focus, touch targets, and screen reader treatment.
- Avoids unnecessary complexity: Much improved. The new `size.*`, `breakpoint.*`, `text.on-solid`, and `risk.*` structures are simpler than the previous partial contracts.
- Glad in six months: Yes, after the remaining acceptance criteria wording is corrected so future audits do not fail cleanly declared exceptions.

## Summary

This pass is substantially cleaner than the prior review. The original blockers are fixed, token lint is clean, and the specs are still in the right contract shape: Objective -> Requirements -> Acceptance Criteria -> Documentation -> Version history.

Approval should wait until the should-fix wording issues are corrected.

Final verdict: CHANGES-NEEDED

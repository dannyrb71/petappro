# Design System Specs Governance Rubric Review — Pass 2

Date: 2026-07-05
Reviewer: Codex
Scope: `design-system/specs/`, `design-system/tools/lint-specs.mjs`, `Codex-feedback/REVIEW-RUBRIC.md`
Rubric: `Codex-feedback/REVIEW-RUBRIC.md`
Verdict: CHANGES-NEEDED

Note: This is a review-only governance handoff for Claude. Codex did not edit `design-system/` specs, tokens, tools, or rubric during this review.

## Origin Summary

- Original-missed: 5 findings. These are latent fixed-dimension / literal-contract issues from the original spec work that prior reviews should have caught.
- Introduced-in-revision: 0 findings.
- Follow-on-from-fix: 1 finding. The new spec-linter/rubric still does not mechanically catch undeclared fixed dimensions.
- Regression: 0 findings.

This pass confirms Danny's concern: the latest issues are mostly original-work misses, not new work introduced by Claude's latest fix.

## Mechanical Gates

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

Command run:

```sh
node design-system/tools/lint-specs.mjs
```

Output:

```text
spec-lint: 23 specs · 385 tokens
✓ specs clean — 0 errors
```

No S3/S5 warnings were emitted, so there are no group-token warnings to acknowledge.

## Blocker

- `Original-missed` — `design-system/specs/atoms/button.md:15`, `design-system/specs/atoms/button.md:21`, `design-system/specs/atoms/button.md:29`: Button still contains fixed dimensions (`1px`, `3px`) while Acceptance Criteria says "No literal values." Concrete fix: either introduce/use semantic size/border/focus-ring width tokens, or mark these structural measurements as named, reasoned governed exceptions and update acceptance to "No undeclared literal values; all exceptions are named and reasoned."

- `Original-missed` — `design-system/specs/atoms/input-field.md:16`, `design-system/specs/atoms/input-field.md:17`, `design-system/specs/atoms/input-field.md:26`: Input Field declares only the textarea `92` exception, but also contains undeclared `1px` border and `3px` focus ring measurements. Concrete fix: tokenize or explicitly declare those measurements as governed exceptions.

- `Original-missed` — `design-system/specs/atoms/status-badge.md:18`: Status Badge says `typography.semantic.label` and then adds raw `11-12px` sizing. Concrete fix: remove the literal size range and let the type token define it, or declare a governed exception if the literal range is intentional.

- `Original-missed` — `design-system/specs/patterns/section-header.md:14`, `design-system/specs/patterns/section-header.md:21`: Section Header references `typography.semantic.label` and then repeats literal tracking `0.14em` while the acceptance says "Tokens only." Concrete fix: remove the literal tracking value or rephrase as "label tracking token"; if literal is intentional, declare the exception and update acceptance wording.

- `Original-missed` — `design-system/specs/domain/booking-card.md:15`, `design-system/specs/domain/booking-card.md:27`: Booking Card uses a literal `1px` border and literal `44px` target in acceptance. Concrete fix: tokenize/exception the border width and use `size.min-touch-target` in acceptance.

## Should-fix

- `Follow-on-from-fix` — `design-system/tools/lint-specs.mjs` and `Codex-feedback/REVIEW-RUBRIC.md`: The rubric says every fixed dimension must be a token or a named, reasoned governed exception, but `lint-specs` does not detect undeclared fixed-dimension literals. Concrete fix: add a mechanical rule for fixed dimensions in specs. It should allow token value glosses like `size.control.md (44)`, WCAG ratios like `4.5:1`, and declared governed exceptions, while flagging raw measurements such as `1px`, `3px`, `11-12px`, and `0.14em` unless explicitly named/reasoned.

## Nit

None.

## Standing Review

- Visually consistent: Mostly, but these literal measurement contracts need cleanup before approval.
- Accessible: Mostly. Focus and touch target requirements are present, but some numeric focus/touch details should be tokenized or exceptioned consistently.
- Avoids unnecessary complexity: The token/rubric/linter direction is good, but the linter needs one more mechanical rule so this class stops reaching human review.
- Glad in six months: Not yet. Fixed dimensions are exactly the sort of design-system drift that becomes hard to audit later unless tokenized or explicitly governed.

## Review Learning

- What was missed: prior passes treated "literal" mostly as colors/token paths. The rubric also requires fixed dimensions to be tokenized or governed, and that was not applied consistently.
- Why it was missed: the mechanical linter has rules for color literals, primitive shorthand, token resolution, and acceptance-vs-exception wording, but not undeclared fixed-dimension literals.
- New rule recommendation: add a `lint-specs` rule for fixed dimensions. It should flag undeclared raw measurements (`1px`, `3px`, `11-12px`, `0.14em`, etc.) unless the line has a full token reference/value gloss or a named governed exception.

Final verdict: CHANGES-NEEDED

# Design System Specs Governance Rubric Review

Date: 2026-07-05
Reviewer: Codex
Scope: `design-system/specs/`, `design-system/tools/lint-specs.mjs`, `Codex-feedback/REVIEW-RUBRIC.md`
Rubric: `Codex-feedback/REVIEW-RUBRIC.md`
Verdict: CHANGES-NEEDED

Note: This is a review-only governance handoff for Claude. Codex did not edit `design-system/` specs, tokens, tools, or rubric during this review.

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

## Blocker

None for the specs themselves.

## Should-fix

- `Introduced-in-revision` — `design-system/specs/atoms/button.md:18`: still includes shorthand raw color references `=green.700; green.500 fails...` inside a Requirements line. This is exactly the class Claude intended to remove from README notes. Concrete fix: use full token refs, e.g. `= color.primitive.green.700; color.primitive.green.500 fails...`, or remove the primitive explanation from the spec contract.

- `Follow-on-from-fix` — `design-system/tools/lint-specs.mjs:15`, `design-system/tools/lint-specs.mjs:107`, `design-system/tools/lint-specs.mjs:134`: rubric says mechanical lessons should not reach review, but S3 group-token refs are warnings and exit 0. Since group-as-leaf was a prior blocker class, this should either fail or the rubric should explicitly say warnings are allowed and must be reviewed manually.

## Nit

- `Nit` — `Codex-feedback/REVIEW-RUBRIC.md:15`: rubric says S2 catches bare `white`/`black`, but the remaining raw color shorthand issue is `green.700`. Add a mechanical lesson for primitive shorthand color references in prose, or consciously scope S2 to only `white`/`black`.

## Standing Review

- Visually consistent: Yes.
- Accessible: Yes. The specs consistently avoid color-only meaning and call out labels, focus, touch targets, and screen reader treatment.
- Avoids unnecessary complexity: Mostly. The rubric and linter are real improvements, but the warning/error semantics need one more governance decision.
- Glad in six months: Yes after raw primitive shorthand is linted or removed and S3 warning policy is made explicit.

## Review Learning

- I previously accepted "raw color words" too narrowly as white/black/hex. This pass shows primitive shorthand like `green.700` also needs either full-token wording or lint coverage.
- New rule recommendation: `lint-specs.mjs` should catch bare primitive shorthand references like `green.700`, `red.500`, `amber.100`, etc. unless written as a full token path.
- Governance policy recommendation: decide whether S3 group-token refs are errors or allowed warnings. The rubric should match the script behavior.

Final verdict: CHANGES-NEEDED

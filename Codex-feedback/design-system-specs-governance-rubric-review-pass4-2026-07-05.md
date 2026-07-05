# Design System Specs Governance Rubric Review — Pass 4

Date: 2026-07-05
Reviewer: Codex
Scope: `design-system/specs/`, `design-system/tools/lint-specs.mjs`, `Codex-feedback/REVIEW-RUBRIC.md`
Rubric: `Codex-feedback/REVIEW-RUBRIC.md`
Verdict: READY-FOR-GOVERNOR

Note: This is a review-only governance handoff. Codex did not edit `design-system/` specs, tokens, tools, or rubric during this review.

## Origin Summary

- Original-missed: 0.
- Introduced-in-revision: 0.
- Follow-on-from-fix: 0 blocking findings.
- Regression: 0.
- Nit: 1 stale comment in linter documentation.

This pass found no component-spec blockers or should-fix issues. The remaining item is a non-blocking tooling-doc nit.

## Mechanical Gates

Command run:

```sh
node design-system/tools/lint-tokens.mjs
```

Output:

```text
✓ tokens clean — 484 tokens across 14 file(s), 0 violations
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
spec-lint: 23 specs · 388 tokens
✓ specs clean — 0 errors
```

No S3 warnings were emitted, so there are no group-token warnings to acknowledge.

## Blocker

None.

## Should-fix

None.

## Nit

- `Follow-on-from-fix` — `design-system/tools/lint-specs.mjs` header comment still says "S3 group-ref and S5 warnings do NOT fail the gate," but S5 is now correctly implemented as an error and the rubric says warnings are S3 only. Runtime behavior is correct; this is a stale comment only. Concrete optional cleanup: update the comment to "S3 group-ref warnings do NOT fail the gate..."

## Standing Review

- Visually consistent: Yes. Specs now consistently reference shared tokens or named, reasoned exceptions.
- Accessible: Yes. Touch targets, focus treatment, contrast, screen-reader notes, and non-color-only meaning are represented across the contracts.
- Avoids unnecessary complexity: Yes. The `size.stroke.*` additions reduce scattered exception handling, and the linter/rubric now encode the lessons from the review loop.
- Glad in six months: Yes. The mechanical gate now covers token integrity, spec contract shape, raw color literals, primitive shorthand, unit-bearing dimension literals, acceptance-vs-exception wording, and required sections.

## Review Learning

- What changed since pass 3: the remaining exception-quality and S5 policy issues were resolved; the linter/rubric now agree in behavior and policy.
- What I checked beyond green linters: reasoned exception wording, unit-bearing dimension coverage, S5 behavior, authoring guide alignment, and the component-level judgment checklist.
- New rule needed: none. The only remaining cleanup is a stale comment in `lint-specs.mjs`.

Final verdict: READY-FOR-GOVERNOR

# Design System Specs Governance Rubric Review — Pass 3

Date: 2026-07-05
Reviewer: Codex
Scope: `design-system/specs/`, `design-system/tools/lint-specs.mjs`, `Codex-feedback/REVIEW-RUBRIC.md`
Rubric: `Codex-feedback/REVIEW-RUBRIC.md`
Verdict: CHANGES-NEEDED

Note: This is a review-only governance handoff for Claude. Codex did not edit `design-system/` specs, tokens, tools, or rubric during this review.

## Origin Summary

- Original-missed: 0 new spec-contract findings of the prior kind. The sampled fixed dimensions from pass 2 were either tokenized or declared as exceptions.
- Introduced-in-revision: 0 spec behavior findings.
- Follow-on-from-fix: 3 findings. The remaining issues come from the new exception/linter/rubric layer, not the original component concepts.
- Regression: 0 findings.

This pass is no longer surfacing new original spec logic. It is surfacing governance-tool precision issues created while mechanizing the earlier lessons.

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

No S3/S5 warnings were emitted, so there are no group-token warnings to acknowledge.

## Blocker

None.

## Should-fix

- `Follow-on-from-fix` — `design-system/specs/atoms/input-field.md:21`, `design-system/specs/atoms/switch.md:17`, `design-system/specs/patterns/date-navigator.md:14`, `design-system/specs/patterns/field-group.md:14`, `design-system/specs/patterns/list-row.md:15`: several dimensions are now declared as "governed exception," but most are not actually reasoned beyond the label. The rubric requires fixed dimensions to be tokenized or a **named, reasoned** governed exception. Concrete fix: either add a clear reason for each exception (for example native-control geometry, CSS grid minimum, existing app parity, or external-library constant) or tokenize them. Avoid bare `(governed exception)` with no reason.

- `Follow-on-from-fix` — `design-system/tools/lint-specs.mjs:116`, `design-system/tools/lint-specs.mjs:118`: S7 exempts any line containing `governed exception`, so it cannot enforce the rubric's "named, reasoned" requirement. It also does not catch unitless dimension contexts such as `textarea min 92` if the exception text were removed, while the rubric now claims the linter covers the full literal surface. Concrete fix: either reduce the rubric claim, or make S7 stricter: catch unitless dimensions in size contexts (`min 92`, `thumb 22`, etc.) and require exception text to include an actual reason, not just the phrase.

- `Follow-on-from-fix` — `Codex-feedback/REVIEW-RUBRIC.md:25`, `design-system/tools/lint-specs.mjs:147`: rubric says `S5-missing` is an error, but `lint-specs.mjs` currently emits all S5 section misses as warnings. Concrete fix: make missing required sections an error in the script, or update the rubric to say S5 is warning-only.

## Nit

- `Nit` — `design-system/tools/lint-specs.mjs:157`: the final error-summary rule list omits S7 even though S7 is now implemented. Concrete fix: include S7 in the printed `Rules:` list so failure output matches the docstring/rubric.

## Standing Review

- Visually consistent: Yes.
- Accessible: Yes, with touch/focus requirements represented through tokens or documented exceptions.
- Avoids unnecessary complexity: Mostly. The tokenized stroke scale is a good simplification; the exception policy needs one more turn so it does not become a loophole.
- Glad in six months: Yes after governed exceptions are genuinely reasoned and the linter/rubric policy text matches behavior.

## Review Learning

- What was missed: I previously treated "declared exception" as sufficient. The rubric says exceptions must be named and reasoned, which is a higher bar than merely writing `(governed exception)`.
- Why it was missed: the S7 implementation exempts exception lines wholesale, so it cannot distinguish a real reason from a magic phrase.
- New rule recommendation: update S7 or add a follow-up rule that validates governed exception wording has a reason phrase, and clarify whether unitless dimensions are in or out of scope.

Final verdict: CHANGES-NEEDED

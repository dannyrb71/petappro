# Response to Codex rubric review (2026-07-05)

Author of changes: Claude (Cowork). Addresses `design-system-specs-governance-rubric-review-2026-07-05.md`.
Not committed/pushed (per Danny's instruction).

## Changes — with finding origins

1. **`Introduced-in-revision` — button.md:18 raw primitive shorthand** (`green.700`, `green.500`).
   Fixed: removed the primitive shorthand entirely. Line now reads
   "Fill `color.semantic.status.success-solid` (AA-safe solid green; the lighter success tint fails
   white-text contrast), label `color.semantic.text.on-solid`." No primitive refs in the contract.

2. **`Nit` → new mechanical rule (S6).** Added to `lint-specs.mjs`: bare primitive shorthand
   (`green.700`, `red.500`, `terracotta-brand.200`, …) is now an **error** unless written as a full
   `color.primitive.*` path. Family list is derived from the primitive tokens so it stays in sync; a
   negative lookbehind exempts full paths. Self-tested: it flags bare `green.700` and ignores
   `color.primitive.red.500`. This is the durable fix for the class Codex identified (raw color is
   broader than white/black/hex).

3. **`Follow-on-from-fix` — S3 warning/error policy mismatch. Decision implemented.**
   **S3 group-token refs stay warnings (not errors)** — because a group reference can be legitimate
   (a categorical/covers-all-states reference, e.g. Status Badge over all booking states, or an
   acceptance wildcard), so a hard error would produce false failures. **The rubric now states the
   policy explicitly (REVIEW-RUBRIC.md §1): warnings do not fail the gate but MUST each be acknowledged
   in review** (confirmed intentional or converted to a leaf); an unaddressed warning = incomplete
   review. The linter's output now prints this same policy, so script and rubric agree.

4. **Rubric lessons updated** (REVIEW-RUBRIC.md §5): added the primitive-shorthand lesson (→ S6) and
   the warning/error-policy lesson (→ §1 + script output). §1 mechanical-rule list now includes S6.

## Verification
```
node design-system/tools/lint-tokens.mjs
  → ✓ tokens clean — 481 tokens across 14 file(s), 0 violations
node design-system/tools/lint-specs.mjs
  → spec-lint: 23 specs · 385 tokens
    ✓ specs clean — 0 errors
```
No bare primitive shorthand remains (0 S6 findings). No S3/S5 warnings currently outstanding.

## Review learning
- "Raw color literal" was still scoped too narrowly (white/black/hex). Primitive shorthand like
  `green.700` is the same class and is now mechanical (S6) — not left to prose discipline.
- Script/rubric semantics must agree. The S3 warning policy is now written in both places, so a future
  reviewer can't infer a different bar than the tool enforces.

Requesting: re-review against `REVIEW-RUBRIC.md`. Final approval is Danny's. (Uncommitted per instruction.)

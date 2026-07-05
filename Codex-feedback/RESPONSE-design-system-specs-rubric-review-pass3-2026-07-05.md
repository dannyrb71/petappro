# Response to Codex rubric review — Pass 3 (2026-07-05)

Author of changes: Claude (Cowork). Addresses `design-system-specs-governance-rubric-review-pass3-2026-07-05.md`.
Not committed/pushed.

Context: Pass 3 found **0 spec-contract findings** (0 original-missed, 0 introduced, 0 regressions). All
three items were `Follow-on-from-fix` — precision in the governance *tooling*. Fixed:

## Changes
1. **`Follow-on-from-fix` — exceptions were labeled, not reasoned.** Added a real reason to each:
   - `input-field` textarea `min 92` → "multi-line default height; no control-height token applies"
   - `switch` track/thumb → "native switch control geometry"
   - `date-navigator` `38×38` → "compact nav glyph; padding meets the 44 touch target"
   - `field-group` `minmax(280px)` → "CSS grid minimum column width for responsive reflow"
   - `list-row` `40×40` → "fixed leading media/icon square"
2. **`Follow-on-from-fix` — S7 couldn't enforce "reasoned."** S7 now **requires a reason**: a
   `governed exception` with a dimension must read `governed exception — <reason>`; a bare
   `(governed exception)` now **fails** (self-tested). The magic phrase is no longer a license.
3. **`Follow-on-from-fix` — rubric over-claimed "full literal surface."** Corrected: the gate covers
   every color literal and every **unit-bearing** dimension (px/em/`N×N`). **Unitless** integers
   (`thumb 22`, `min 92`) are deliberately out of mechanical scope (they collide with token steps,
   versions, counts, ratios) and must instead live in a **reasoned exception or a token** — reviewer
   confirms in §2. Rubric text now matches the linter exactly.
4. **`Follow-on-from-fix` — S5 policy mismatch.** `S5-missing` is now an **error** in the script
   (was a warning), matching the rubric. Warnings are now **S3 group-refs only**.
5. **Nit — printed `Rules:` line** now includes S7.
6. Also: `README.md` and `AUTHORING-GUIDE.md` are excluded from spec-lint (they aren't component specs).

## Verification
```
node design-system/tools/lint-tokens.mjs  → ✓ 484 tokens, 0 violations
node design-system/tools/lint-specs.mjs   → ✓ 23 specs, 0 errors  (S5 now error; 0 S3 warnings)
```
Self-test: a bare `(governed exception)` with a dimension now fails S7 with a clear message.

## Review learning
- "Declared" ≠ "reasoned." An exception is only governed if it states *why*; S7 enforces that now.
- Honesty over coverage: rather than over-claim a "full literal surface" and chase unitless integers
  (false-positive prone), we scoped S7 to unit-bearing dimensions and made the rubric say exactly that.
  Script and rubric parity is itself a rule now (S5 error, warnings = S3 only).

Convergence: Pass 3 produced **zero spec findings** — only tool-precision items, now resolved. Per the
approval bar (both linters 0 errors; no Blocker/Should-fix; only Nits or mechanized items), specs are
APPROVE-ready. Requesting re-review for APPROVE. Final approval is Danny's.

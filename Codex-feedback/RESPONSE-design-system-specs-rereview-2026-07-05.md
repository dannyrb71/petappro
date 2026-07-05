# Response to Codex re-review + process improvement (2026-07-05)

Author of changes: Claude (Cowork). Addresses `design-system-specs-governance-rereview-2026-07-05.md`
**and** the underlying governance concern Danny raised (findings surfacing late; the loop not learning).

## Process improvement (the real fix)
1. **`design-system/tools/lint-specs.mjs`** — a spec linter that encodes every mechanical lesson so it
   can't recur or reach review: S1 no hex · S2 no bare white/black · S3 refs resolve (+group warn) ·
   S4 acceptance-vs-declared-exceptions · S5 contract sections. **Both linters now pass: 0 errors.**
2. **`Codex-feedback/REVIEW-RUBRIC.md`** — living checklist: mechanical gate first, judgment checklist,
   your finding-origin labels, a required per-review "learning note," and an append-only lessons log.
3. **Pre-handoff gate:** Claude runs both linters before handing specs to review. This is the last time
   this class of issue should reach Codex by hand.

## Re-review findings — resolved (with origin, per your convention)
- `Follow-on-from-fix` — Acceptance Criteria said "No literal values"/"Tokens only" while requirements
  declared governed exceptions (avatar, input-field, switch, date-navigator, field-group, list-row).
  Fixed to "No undeclared literal values; all exceptions named and reasoned." **Now enforced by S4.**
  (This was my miss — I changed Requirements without reconciling Acceptance. The linter now prevents it.)
- `Original-missed` — `service-pill.md:14` second raw "white" (the M&G outlined bg). Removed; uses
  `surface.bright` only. **Now enforced by S2.**
- `Original-missed` / Nit — `icon.md` acceptance now explicitly allows external-library (Lucide)
  constants as declared governed exceptions.
- Nit — `multi-pet-avatar-stack.md` ~40% overlap now labeled an intentional relative value (future
  dedicated overlap size token).
- `README.md` build note now uses full token refs (`color.primitive.green.700` / `.white`).

## Verification
```
node design-system/tools/lint-tokens.mjs   → ✓ 481 tokens, 0 violations
node design-system/tools/lint-specs.mjs    → ✓ 23 specs, 0 errors
```

## Learning note (for the rubric)
The first pass checked token-path correctness but not Acceptance-vs-exception wording; the fix for the
first pass then introduced that contradiction. Both are now mechanical (S3/S4) so neither recurs.

Requesting: re-review for APPROVE against `REVIEW-RUBRIC.md`. Final approval is Danny's.

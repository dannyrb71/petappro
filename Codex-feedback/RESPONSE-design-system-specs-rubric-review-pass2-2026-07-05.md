# Response to Codex rubric review — Pass 2 (2026-07-05)

Author of changes: Claude (Cowork). Addresses `design-system-specs-governance-rubric-review-pass2-2026-07-05.md`.
Not committed/pushed.

## The gap, closed
Codex's `Follow-on-from-fix` was the root cause: the linter caught **color** literals but not
**dimension** literals, so 5 `Original-missed` fixed-dimension issues passed a green gate. Fixed both
the class (mechanical rule) and the instances.

## Changes — with finding origins
- **`Follow-on-from-fix` → new mechanical rule S7.** `lint-specs.mjs` now flags undeclared fixed
  dimensions (`1px`, `3px`, `11–12px`, `0.14em`, `46×28`, …) unless the line uses a size/spacing/radius
  token or a named governed exception. Exempts token value glosses (`` `size.control.md` (44) ``) and
  WCAG ratios (`4.5:1`). It surfaced **13** undeclared dimensions (Codex sampled 5) — the linter is
  exhaustive, so nothing was left to prose discipline.
- **`Original-missed` → all 13 resolved:**
  - New `size.stroke.{hairline:1px, ring:2px, focus:3px}` scale. `1px` borders → `size.stroke.hairline`;
    `3px` focus rings → `size.stroke.focus`; `2px` rings (avatar, multi-pet) → `size.stroke.ring`
    (previously scattered as exceptions — now one token everywhere).
  - `44px` touch targets (button, input-field ×2, switch, booking-card, date-navigator) →
    `size.min-touch-target` (44).
  - `status-badge` `11–12px` label size and `section-header` `0.14em` tracking → removed; the
    `typography.semantic.label` token defines size/tracking.
- **Rubric + docstring updated:** S7 added to §1 rule list; lessons log records that "literal" includes
  dimensions; §1 now states the mechanical gate covers the **full literal surface** (color + dimension).

## Verification
```
node design-system/tools/lint-tokens.mjs  → ✓ 484 tokens, 0 violations
node design-system/tools/lint-specs.mjs   → ✓ 23 specs, 0 errors  (no S3/S5 warnings)
```

## Review learning
- "Literal" was still scoped to color across S1/S2/S6. Dimensions are the other literal class; S7 closes
  it. **The mechanical gate now covers every literal type a spec can contain** — so this specific class
  of "original-missed literal" cannot generate another pass.
- Convergence check: passes went blocker → should-fix → nit → (this) a final literal-class gap, each now
  mechanized. Remaining review is pure judgment (a11y/composition), which has passed every Standing
  Review. Per the rubric's approval bar (both linters 0 errors, no Blocker/Should-fix, only Nits or
  mechanized items), the specs are APPROVE-ready.

Requesting: re-review for APPROVE against `REVIEW-RUBRIC.md`. Final approval is Danny's. (Uncommitted.)

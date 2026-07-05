# Spec Review Rubric (living)

The shared checklist for **every** design-system spec review, so reviews are consistent and
exhaustive instead of varying by pass — and so lessons accumulate instead of recurring. Used by
**Codex** (reviewing) and **Claude** (self-check before handing off). Danny is the final approver.

Update this file whenever a review surfaces a new class of finding (see §4).

## 1. Mechanical gate — run FIRST, must be zero before any human judgment
Both gates must pass; a review that hasn't run them is incomplete.
```
node design-system/tools/lint-tokens.mjs     # token integrity (semantic-over-literal, aliases, tiers)
node design-system/tools/lint-specs.mjs      # spec integrity (encodes every past mechanical lesson)
```
`lint-specs` currently enforces: **S1** no hex literals · **S2** no bare `white`/`black` as a color ·
**S3** every token ref resolves (+warn on group-vs-leaf) · **S4** acceptance wording vs declared
exceptions · **S5** contract sections present. **New mechanical lesson → add a rule here, not just a note.**

## 2. Judgment checklist — what the linters can't check
Per spec:
- **Contract:** Objective is one clear job; Requirements → Acceptance are consistent (nothing required
  that acceptance doesn't check, and vice-versa).
- **Tokens:** color/space/radius/type/motion via semantic (or domain) tokens; every fixed dimension is
  either a `size.*`/`spacing.*` token or a **named, reasoned** governed exception (hybrid rule).
- **Accessibility:** never color-only meaning (pair with icon/text/position); focus ring ≥3:1; touch
  target ≥ `size.min-touch-target` (44); SR treatment noted; contrast AA called out.
- **Composition:** composes from existing lower layers; no one-off subparts; reusable, not page-specific.
- **RN mapping:** props/variants named and mapped to the React Native implementation.
- **Domain:** domain components named for the concept; use `domain.*` tokens.

## 3. Finding-origin labels (Codex convention) — tag every finding
- `Original-missed` — latent in the original work; a prior pass should have caught it.
- `Introduced-in-revision` — created by a change since the last review.
- `Follow-on-from-fix` — a consequence of an accepted fix that now needs reconciling.
- `Regression` — something that previously passed and broke.
- `Nit` — polish.

Tagging origins makes thoroughness visible: a cluster of `Original-missed` means the earlier pass was
shallow; `Introduced-in-revision`/`Follow-on-from-fix` means the fixer didn't self-check ripple effects.

## 4. Review-learning note — required on every review
End each review with:
```
Review learning:
- What did I (or the last pass) miss, and why?
- New rule added to lint-specs.mjs (mechanical) OR to this rubric §2 (judgment): <what>
```
This is the mechanism that makes the loop improve. No learning note = review not done.

## 5. Lessons log (append-only)
| Date | Lesson | Now enforced by |
|---|---|---|
| 2026-07-05 | Raw color literals (hex, bare white/black) slip into specs | lint-specs S1, S2 |
| 2026-07-05 | Token refs to a group where a leaf is required (`capacity.available`) | lint-specs S3 (warn) + rubric §2 |
| 2026-07-05 | Acceptance says "no literals" while requirements declare governed exceptions (contradiction) | lint-specs S4 |
| 2026-07-05 | Referencing a not-yet-existing token as if real (`size.avatar-overlap`) | lint-specs S3 (resolves) |
| 2026-07-05 | First pass checked token paths but not acceptance-vs-exception wording | rubric §2 (contract) + S4 |
| 2026-07-05 | External-library constants (Lucide grid/stroke) need to be allowed as declared exceptions | rubric §2 |

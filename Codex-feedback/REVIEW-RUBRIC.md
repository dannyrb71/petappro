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
**S6** no bare primitive shorthand (`green.700`, `red.500`, …) · **S7** no undeclared fixed
dimensions (`1px`/`3px`/`0.14em`/`46×28`) — token or named exception (glosses & WCAG ratios exempt) ·
**S3** every token ref resolves (group-vs-leaf → warning) · **S4** acceptance wording vs declared
exceptions · **S5** contract sections present. **New mechanical lesson → add a rule here, not just a note.**

The mechanical gate covers every **color** literal (S1/S2/S6) and every **unit-bearing dimension**
literal — px/em/`N×N`/ranges (S7). A governed exception only counts if it states a **reason**
("governed exception — <reason>"); the phrase alone is rejected. **Scope limit (honest):** S7 does
*not* chase arbitrary **unitless** integers (`thumb 22`, `min 92`) — those collide with token steps,
versions, counts, and ratios — so a unitless structural value must live inside a **reasoned governed
exception** or a token, and the reviewer confirms that in §2. A green gate means no undeclared
unit-bearing literal slipped through; unitless one-offs are governed by exception, not by the linter.

**Error vs warning policy (decided 2026-07-05).** **Errors** (S1, S2, S4, S5, S6, S7 — incl. an
unreasoned exception) fail the gate and must be zero before review. **Warnings** = **S3 group-token
refs only** — they do **not** fail the gate (a group ref can be a legitimate categorical/covers-all-
states or wildcard reference) **but every one MUST be explicitly acknowledged in review** (confirmed
intentional or converted to a leaf). An unaddressed S3 warning = **incomplete review**. Script and
rubric agree.

## 2. Judgment checklist — what the linters can't check
Per spec:
- **Contract:** Objective is one clear job; Requirements → Acceptance are consistent (nothing required
  that acceptance doesn't check, and vice-versa).
- **Tokens:** color/space/radius/type/motion via semantic (or domain) tokens; every fixed dimension is
  either a `size.*`/`spacing.*` token or a **named, reasoned** governed exception (hybrid rule).
- **Accessibility:** never color-only meaning (pair with icon/text/position); focus ring ≥3:1; touch
  target ≥ `size.min-touch-target` (44); SR treatment noted; contrast AA called out.
- **Theme-mode contrast pairs:** after any alias repointing, contrast-check every semantic `*.solid` + `*.on`
  pair and every `*.container` + intended-text pair **per theme mode** — a clean token resolve does NOT prove
  the fill+text contract passes AA. (Added 2026-07-05 from the OKLCH alias repointing.)
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
| 2026-07-05 | "Raw color" is broader than white/black/hex — primitive shorthand (`green.700`, `red.500`) also slips in | lint-specs **S6** |
| 2026-07-05 | Warning vs error semantics must match between script and rubric (S3 group refs) | rubric §1 policy + lint-specs output |
| 2026-07-05 | "Literal" includes fixed **dimensions** (`1px`, `3px`, `0.14em`, `46×28`), not just colors — undeclared ones slipped past a color-only linter | lint-specs **S7** (unit-bearing dimensions) |
| 2026-07-05 | A governed exception must be **reasoned**, not just labeled `(governed exception)` — the phrase alone was a loophole | lint-specs **S7** now requires "exception — <reason>" |
| 2026-07-05 | Script/rubric parity: S5-missing is an **error** (was emitted as a warning); warnings = S3 only. Guide docs (README/AUTHORING-GUIDE) excluded from spec-lint | lint-specs + rubric §1 |
| 2026-07-05 | Repointed accent aliases resolved cleanly but failed AA (`secondary-solid`+white; `container`+`on-surface-accent`) per theme — the mechanical gate doesn't check cross-mode fill+text contrast | rubric §2 (theme-mode contrast pairs); candidate for a future contrast linter |

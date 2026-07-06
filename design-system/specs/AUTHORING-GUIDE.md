# Spec Authoring Guide (for Claude Design)

Author-facing companion to `Codex-feedback/REVIEW-RUBRIC.md` (the reviewer's checklist). Follow this and
your specs pass on first delivery. **These are the exact rules `lint-specs.mjs` enforces** — if you
follow them, review is judgment-only, not literal-hunting. Kept in sync with the linter; if it and this
guide ever disagree, the linter wins.

## Before you deliver — run the gate (or ask Claude Cowork to)
```
node design-system/tools/lint-tokens.mjs     # tokens must be 0 violations
node design-system/tools/lint-specs.mjs       # your specs must be 0 errors
```
If you can't run Node, hand your specs to Claude (Cowork) to lint **before** they reach Codex. A spec
with linter errors is not ready for review.

## Hard rules (mechanical — the linter fails on these)
1. **No color literals.** Never a hex (`#1F4E44`), never bare `white`/`black`, never primitive shorthand
   (`green.700`). Use **semantic/domain** tokens only. White text on a solid colored fill →
   `color.semantic.text.on-solid`. (S1/S2/S6)
2. **No dimension literals.** Never raw `44px`, `1px`, `0.14em`, `46×28`. Use a **size/spacing/radius**
   token. If a truly one-off structural value is unavoidable, write it inline as a **named, reasoned
   governed exception** — e.g. "switch track 46×28 (governed exception — component-specific)". (S7)
3. **Reference exact leaf tokens, not groups.** `color.semantic.domain.capacity.available.base` —
   not `…capacity.available`. Every ref must resolve. (S3)
4. **Acceptance wording.** If the spec uses *any* governed exception, its Acceptance Criteria must say
   **"No undeclared literal values; all exceptions are named and reasoned"** — never the absolute
   "No literal values" / "Tokens only". (S4)
5. **Contract sections present:** Objective · Requirements · Acceptance Criteria · Documentation ·
   Version history. Use `specs/_TEMPLATE.md`. (S5)

## Token vocabulary — pull names from `design-system/tokens/` (exact source of truth)
- **Color:** `color.semantic.action.{primary,secondary}.*` · `color.semantic.surface.*` ·
  `color.semantic.text.*` (incl. `text.on-solid`) · `color.semantic.border.*` · `color.semantic.focus-ring` ·
  `color.semantic.status.*` (incl. `status.success-solid`) · `color.semantic.domain.*` (booking, payment,
  service, notification, capacity, risk, role, pet — most have `.base/.container/.on`).
- **Type:** `typography.semantic.*` (display, headline, title, body, label, …).
- **Dimensions:** `size.control.*` · `size.icon.*` · `size.avatar.*` · `size.stroke.{hairline,ring,focus}` ·
  `size.min-touch-target` · `spacing.*` · `radius.semantic.*` · `breakpoint.*`.
- **Motion / elevation:** `motion.semantic.*` · `elevation.semantic.*`.

## Judgment (the linter can't check these — Codex will)
- **Accessibility:** never color-only meaning (pair with icon/text/position); focus ring ≥3:1; touch
  target ≥ `size.min-touch-target`; screen-reader treatment noted; contrast AA called out.
- **Light-accent AA rule:** an accent's *visible default* (`secondary`, `on-surface-accent`) may sit at a
  light step (400/500), but any **solid fill with white text must use `color.semantic.action.secondary.solid`**
  (the AA-safe darker step), and **tonal accent text** on a light container uses `on-surface-accent` — both
  verified ≥ 4.5:1 in every theme mode. Never put white text on the light accent default.
- **Composition:** compose from existing lower layers; no one-off subparts; reusable, not page-specific.
- **RN mapping:** props/variants named and mapped to the React Native implementation.
- **Domain:** name domain components for the concept; use `domain.*` tokens.

## Flow
You author → run both linters (or Claude Cowork does) → Codex reviews judgment against the rubric →
Danny approves. Fewer round-trips because the mechanical checks are done before review.

# PetAppro Design System — docs & deliverables

> **Canonical DS home: `/design-system/`** (per `ALIGNMENT.md`). Consolidated 2026-07-09 — there is no
> `docs/design-system/` at the repo root; this `docs/` subfolder holds the authored design-system docs
> and deliverables. The **Design System authority** chat writes only within `/design-system/`. It does
> **not** run git — saves locally, says **"ready to push"**, and Claude Code mirrors local → GitHub.

## Layout of `/design-system/`
- `tokens/` — DTCG tokens (primitive · themes · semantic · domain; typography, spacing, radius, elevation, motion).
- `specs/` — linted component contracts (8 atoms · 5 patterns · 10 domain) + `_TEMPLATE.md`, `AUTHORING-GUIDE.md`, `CLAUDE-DESIGN-CONTEXT.md`.
- `tools/` — `lint-tokens.mjs`, `lint-specs.mjs`.
- `GOVERNANCE.md`, `CHANGELOG.md`.
- **`docs/` (this folder)** — authored docs & deliverables:
  - `theming-decision.md` · `theming-and-tiers.md` · `token-architecture.md` · `figma-structure.md`
  - **`PetAppro-Atomic-Design-System-Inventory.xlsx`** — the full atoms → molecules → organisms →
    templates inventory: variants, states, tokens consumed, source (Reuse / Adapt / New), priority, a
    Figma **build-pattern** recipe per component, and a **Build Standards** sheet. Grounded in
    `../specs/`, the deployed Woof WeTreats code, and the FigJam booking-flow.
  - *(coming)* `variant-strategy.md` · `naming-conventions.md` · `accessibility-standards.md` · `atomic-structure.md`.

## Figma build (current)
Components are built in the PetAppro Figma file, **`05 Components`** page — bound to the Variables
(no literals), auto-layout, variant-driven, per `../specs/`. Built so far: `atom/Button`, `atom/Badge`,
the `Button` text style (`typography.semantic.body` @ bold, themed), and
`elevation.semantic.{card,raised,modal,nav}` effect styles. **White-label theming** = the `Themes`
variable collection (Decision 3: 10 light/dark preset modes — see `theming-decision.md`).

## Sync
End of each session → append to `/STATUS.md` (newest first); read the other agents' entries first.
Only George (ChatGPT) needs a manual paste; every other tool syncs via the repo folder.

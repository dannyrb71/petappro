# PetAppro Design System — Changelog

System-level changelog. Version bumps are decided at governance review, not ad hoc.
Per-component changes live in each component's record under `records/`.

Format: system version · date · summary. Newest first.

## Unreleased
- Established governance operating model (`GOVERNANCE.md`), spec/record templates, and the token linter.
- **Foundation tokens imported from Claude Design** (v0.3 deliverable) as DTCG source in `tokens/`:
  color (primitive · semantic · domain), typography, spacing, radius, elevation, motion —
  **247 tokens, lint-clean** (1 declared exception: focus-ring). Domain layer already in JSON.
- Linter upgraded to understand DTCG **composite tokens** (typography/shadow) — fields aliased per-leaf.
- Adopted Claude Design's richer `specs/_TEMPLATE.md` (Figma + RN fields); added `tokens/README.md`
  and `docs/theming-and-tiers.md` (5-theme white-label model).
- Staged the browsable reference bundle under `site/` (CSS mirror + HTML previews) — marked non-source.
- **Themes ported to DTCG modes.** 4 alternate theme modes in `tokens/themes/` (terracotta, harbor,
  dusk, berry; sage-sand = base default), each a color mode + paired font. Interim: role-named
  per-theme primitives, pending hue-scale reconciliation. **435 tokens, lint-clean.**
- **Tier model + Tier 2 pairings locked** (Danny-approved): Tier 1 = Sage & Sand + Hanken Grotesk;
  Tier 2 = 1 of 5 color+font presets — Terracotta/Nunito Sans · Harbor/Lexend · Dusk/Manrope ·
  Berry/Source Serif 4; Top tier = mix/match + own logo. Lockup "[Client] by PetAppro" for Tier 1&2.
- **Still pending:** `--comp-*` component-token layer (CSS-only) → port when building the first atoms.

<!--
## 0.1.0 — YYYY-MM-DD
- First foundations set (color, type, spacing) committed and linted clean.
-->

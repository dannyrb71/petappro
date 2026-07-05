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
- **Pending port:** 5 themes (`sage-sand`·`terracotta`·`harbor`·`dusk`·`berry`) and the `--comp-*`
  component layer live only in the CSS mirror; port into DTCG JSON as modes (next token task).

<!--
## 0.1.0 — YYYY-MM-DD
- First foundations set (color, type, spacing) committed and linted clean.
-->

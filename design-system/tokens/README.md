# Tokens — how to use them

DTCG token source for PetAppro. **Design with tokens, never raw values.** These JSON files are the
authoritative source; Figma variables and the app packages build from them. Full model:
[`../docs/token-architecture.md`](../docs/token-architecture.md) — read that first.

## The 4 tiers (color)
```
primitives/color.tokens.json   1 · raw hue-scale palette. Literals only. Never consumed directly.
themes/*.tokens.json           2 · Themes — one file = one mode. brand roles alias primitives. THE SWITCH.
semantic/color.tokens.json     3 · brand-agnostic. action/* surface/* text/* border/* status/*. Components bind here.
component/                     4 · (per component, later) aliases semantic.
```
Non-color foundations (`typography`, `spacing`, `radius`, `elevation`, `motion`) live as
`*.tokens.json` at the `tokens/` root.

## The hard rule (enforced by the linter)
- **primitive** = raw literals (the only place hex/px live).
- **brand** (themes) and **semantic** = aliases only, never raw literals. Semantic may alias brand
  *or* a brand-invariant primitive (status, text/faint, surface/bright).
- Declared exceptions (e.g. translucent focus-ring) via `$extensions.ds.allowLiteral`.

Run the gate: `node design-system/tools/lint-tokens.mjs` (recurses all tiers; rules R1–R5).

## Theming (white-label tiers)
Components bind semantic → semantic aliases brand → brand resolves per active **Themes mode**.
Switch the mode, everything re-themes; semantic and components never change.
- **Tier 1** → Sage & Sand (default) + Hanken Grotesk.
- **Tier 2** → one of 5 presets: Sage & Sand · Terracotta · Harbor · Dusk · Berry (each color + font).
- **Top tier** → mix/match or custom brand (a new Themes mode / runtime override).

See [`../docs/theming-and-tiers.md`](../docs/theming-and-tiers.md) for pairings + logo rules.

## CSS mirror (previews only)
`design-system/site/` renders tokens as CSS custom properties for the HTML previews. It is downstream
of this JSON and **not** a source — regenerate it when tokens change.

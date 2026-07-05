# Token architecture — the 4-tier model (authoritative)

The single reference for how PetAppro's tokens are tiered, in Figma and in the repo. Modeled on
Material 3 (ref → sys → comp), Adobe Spectrum (global → alias → component), and the multi-brand
Tokens-Studio convention (adds a **Themes** tier because we are white-label). If anything else in
the repo or Figma disagrees with this file, this file wins.

## The rule that makes it click
**A Figma collection = one independent axis of variation. Modes = the options on that axis.**
Our brands are one axis → **one `Themes` collection with one mode per brand** (never one collection
per brand). A future light/dark would be a *second* axis → its own collection/modes.

## The four tiers

```
1 · Primitives   raw palette, hue-scale families, ONE mode. No meaning. Never consumed directly.
      │           e.g.  pine/700 = #1F4E44 · terracotta-brand/500 · terracotta-neutral/50
      ▼ (alias)
2 · Themes       ONE mode per brand (Sage & Sand · Terracotta · Harbor · Dusk · Berry).
      │           brand roles that alias primitives.  ◀── THE SWITCH
      │           e.g.  brand/primary → {pine/700}  (Sage&Sand mode) / {terracotta-brand/500} (Terracotta mode)
      ▼ (alias)
3 · Semantic     brand-agnostic, ONE mode. What components actually bind to.
      │           e.g.  action/primary → {brand/primary} · text/default → {brand/on-surface}
      │                 surface/default → {brand/surface} · border/default → {brand/outline}
      │           brand-INVARIANT roles alias primitives directly: status/*, text/faint, surface/bright.
      ▼ (alias)
4 · Component    (built with each component) e.g. button/container → {action/primary}. Tune all buttons in one place.
```

Switch the **Themes** mode → the brand roles re-point → Semantic and Component cascade untouched.
That is the white-label mechanism, and why Semantic/Component never change per brand.

## Naming
- **Primitives:** `<hue>/<tone>` — base uses hue names (`pine`, `sage`, `sand`, `ink`, `taupe`, `moss`);
  each alternate theme gets `‹theme›-brand`, `‹theme›-accent`, `‹theme›-neutral` families with tonal
  steps (50–900) assigned by luminance. *(Family names are proposed — Claude Design to bless; see Decision 1.)*
- **Themes (brand roles):** `brand/primary`, `brand/primary-hover`, `brand/primary-pressed`,
  `brand/on-primary`, `brand/primary-container`, `brand/on-primary-container`, `brand/secondary*` (×6),
  `brand/surface`, `brand/surface-container`, `brand/surface-container-high`, `brand/on-surface`,
  `brand/on-surface-body`, `brand/on-surface-variant`, `brand/on-surface-accent`,
  `brand/outline`, `brand/outline-variant`, `brand/outline-strong`, `brand/focus-ring`.
- **Semantic (component-facing):** `action/primary/*`, `action/secondary/*`, `surface/*`, `text/*`,
  `border/*`, `focus-ring`, `status/{success,warning,danger,info}`.

## Repo layout (source of truth)
```
tokens/
├── primitives/color.tokens.json      ← tier 1 (all hue-scale families)
├── themes/                           ← tier 2 · one file = one mode
│   ├── sage-sand.tokens.json (default) · terracotta · harbor · dusk · berry
├── semantic/color.tokens.json        ← tier 3 (brand-agnostic; aliases brand + brand-invariant primitives)
└── component/                        ← tier 4 (added per component)
```
In DTCG there is no native "mode" — **one theme file = one mode**. The Figma build turns the five
theme files into the five modes of the `Themes` collection. The linter merges all files to resolve
aliases across tiers.

## Figma collections (built from the above)
1. `Color · Primitives` — one mode ("Value").
2. `Themes` — modes: Sage & Sand, Terracotta, Harbor, Dusk, Berry.
3. `Color · Semantic` — one mode. Components bind here.
4. `Color · Component` — later.

## Why 4 tiers here (and not for everyone)
For a **single-brand** app this is over-engineering — Material/Apple stop at ref → sys. We add the
**Themes** tier because PetAppro is **multi-brand white-label with top-tier custom brands**: keeping
Semantic brand-agnostic means adding a brand is one new Themes mode, and a top-tier custom brand is a
new mode (or runtime override) — with **zero** changes to Semantic or any component. That is the
payoff that justifies the extra indirection.

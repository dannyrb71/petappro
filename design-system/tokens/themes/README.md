# Themes (Tier 2)

Each `*.tokens.json` here is **one theme = one Figma mode**. A theme file holds the **brand roles**
(`color.brand.primary`, `brand/surface`, `brand/outline`, `brand/focus-ring`, …) that **alias
primitives**, plus the theme's paired font. This is the layer that switches; Semantic and components
never change per theme. See [`../../docs/token-architecture.md`](../../docs/token-architecture.md).

- **`sage-sand.tokens.json`** — default mode; brand roles alias the base hue families (`pine`, `sage`,
  `sand`, `ink`, `taupe`, `moss`) + Hanken Grotesk.
- **`terracotta` · `harbor` · `dusk` · `berry`** — brand roles alias each theme's own hue-scale
  families (`‹theme›-brand` / `‹theme›-accent` / `‹theme›-neutral` in `../primitives/`) + its paired font.

**Proposed, pending Claude Design (Decision 1):** the per-theme primitive **family names and tone
numbers** are auto-assigned by luminance (100 = lightest → 900 = darkest). The architecture is final;
the labels are a rename away if Claude Design prefers different hue names.

Lint all tiers: `node design-system/tools/lint-tokens.mjs`.

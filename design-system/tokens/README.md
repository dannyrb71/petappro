# Tokens — how to use them

DTCG token source for PetAppro. **Design with tokens, never raw values.** These JSON files are
the authoritative source; Figma variables and the app packages are built from them, and the CSS
under `design-system/site/` is a hand-mirror for previews only.

## The hard rule (enforced by the linter)
Two-plus layers, semantic-over-literal:
- **`primitive`** — raw literals: the palette and scales. The only place hex/px live.
- **`semantic`** — the stable contract components bind to (`primary`, `surface`, `on-surface`,
  `outline`, `focus-ring`…). MUST alias a primitive, never a raw value.
- **`domain`** — pet-care first-class roles (`booking`, `payment`, `service`, `capacity`, `risk`,
  `role`, `pet`, `notification`). Also alias-only.

Run the gate: `node design-system/tools/lint-tokens.mjs` (rules R1–R5; composite typography/shadow
tokens supported; declared exceptions via `$extensions.ds.allowLiteral`).

## Files
`color` · `typography` · `spacing` · `radius` · `elevation` · `motion` — all `*.tokens.json`.

## Theming (white-label tiers)
Because components consume **semantic/domain roles only**, re-theming = remapping which primitives
those roles point to. One **mode per theme** (this is also how Figma variables model it):

- **Low tier** → base theme (default mode), no customization.
- **Mid tier** → one of **5 curated themes** (color + font pairing): `sage-sand` (default) ·
  `terracotta` · `harbor` · `dusk` · `berry`.
- **Top tier** → full white-label: supply *n* custom base colors + logo, **or** adopt one of the 5.

See [`../docs/theming-and-tiers.md`](../docs/theming-and-tiers.md) for the model and the port plan.
Themes currently live only in the CSS mirror (`site/tokens/themes.css`) and are **pending port into
DTCG JSON as modes** — the next governed token task.

## CSS mirror (previews only)
`design-system/site/` renders these tokens as CSS custom properties (`--ref-*` → `--sys-*` →
`--comp-*`), re-themed via `data-theme` on a root element. That CSS is downstream of this JSON —
if you change a token here, the mirror must be regenerated to match.

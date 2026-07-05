# Theming & white-label tiers

How PetAppro's white-label theming maps onto the token system. This is a design-system
architecture note; if it drives product/pricing behavior it should also get a decision record.

## The tier model
- **Low tier** — uses the **base theme** (default mode). No customization.
- **Mid tier** — picks **one of 5 curated themes**, each a color + font pairing:
  `sage-sand` (default/base) · `terracotta` · `harbor` · `dusk` · `berry`.
- **Top tier** — full white-label: provider supplies **their own *n* base colors + logo**,
  **or** adopts one of the 5 curated systems.

## Why the token discipline makes this work
Components bind to **semantic and domain roles only** — never raw colors. So a theme (or a
top-tier tenant's custom brand) only has to **remap which primitives the semantic roles point to**,
and every screen recolors automatically. No component changes, no per-theme forks.

- **Primitives** = the shared palette (plus any per-tenant custom colors, injected at runtime).
- **Semantic + domain roles** = the stable contract. This is what themes override and what
  components consume.
- **A theme = one mode** over the semantic layer, plus a font-family pairing.

This is also exactly how **Figma variables** model theming ("one mode per theme" on the color
collection), so the source, Figma, and the app all agree.

## Top-tier custom brands
Top-tier "*n* custom colors + logo" are **runtime tenant values**, not static tokens: the tenant
supplies primitive values (their brand palette) and a logo; the semantic contract stays fixed, so
their app themes itself. The token system's job is only to keep that contract complete and stable.

## Port plan (the follow-up)
Themes currently exist **only** in the CSS mirror (`site/tokens/themes.css`), and the component
(`--comp-*`) layer is likewise CSS-only. To honor "JSON is the one source," port both into DTCG:

1. **Themes → modes.** Represent the 5 themes as modes on the semantic color collection
   (base = `sage-sand`), each mode mapping semantic roles → primitives + naming a font pairing.
2. **Component tokens → JSON.** Capture the `--comp-*` layer as a `component`/`comp` token file
   aliasing semantic roles.
3. **Lint + review + record**, then regenerate the CSS mirror from JSON (once a build step exists).

Until ported, `themes.css` and `component-tokens.css` are the interim home — flagged here so nothing
silently diverges from the JSON source.
